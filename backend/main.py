from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
import PyPDF2
import io
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Dict
import json
import prompt

load_dotenv()

app= FastAPI(title="Clausely", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['https://clausely-tan.vercel.app'],  
    allow_methods=['*'],
    allow_headers=['*'],
    allow_credentials=True,       
)

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model=genai.GenerativeModel(model_name="gemini-2.0-flash",
                            generation_config={
                                "temperature":0.7,
                                "top_p":0.95,
                                "top_k":40, 
                                "max_output_tokens":4096
                            }
                            )

class ContractAnalysis(BaseModel):
    overall_risk:str
    contract_type:str
    clauses:List[Dict]
    red_flags:List[str]
    recommendations:List[str]

class CounterProposal(BaseModel):
    subject:str
    body:str


@app.get("/")
async def root():
    return {"message":"Clausey API is live!"}

@app.post("/analyze-contract" , response_model=Dict)
async def analyze_contract(file:UploadFile=File(...)):
    """Analyze uploaded PDF contract using Gemini 2.0"""

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # try:
    pdf_bytes=await file.read()
    pdf_reader=PyPDF2.PdfReader(io.BytesIO(pdf_bytes))

    contract_text=""
    for page in pdf_reader.pages:
        contract_text+=page.extract_text()

    if not contract_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the PDF 😅")
        
    contract_text=contract_text[:8000]

    analysis_prompt=f"""
        {prompt.ANALYSIS_SYSTEM_PROMPT}
        
        Now analyze this contract:
        
        Contract Text:
        {contract_text}
        
        Provide your analysis in the JSON format specified above.
        """

    response=model.generate_content(analysis_prompt)
    analysis_text=response.text


    try:
        if analysis_text.startswith('```json'):
            analysis_text=analysis_text.strip('```json').strip('```').strip()
        elif analysis_text.startswith('```'):
            analysis_text=analysis_text.strip('```').strip()
            
        analysis_text = analysis_text.replace(r"\$", "$")
        analysis_data=json.loads(analysis_text)
    except json.JSONDecodeError as e:
        print(f"JAON Parse Error: {e}")
        print(f"Raw response: {analysis_text}")


    counter_proposal_prompt=f"""
    {prompt.COUNTER_PROPOSAL_SYSTEM_PROMPT}
        
    Based on this contract analysis, write a counter-proposal email:
        
        Analysis Summary:
        - Overall Risk: {analysis_data.get('overall_risk', 'Unknown')}
        - Contract Type: {analysis_data.get('contract_type', 'Unknown')}
        - Main Concerns: {', '.join(analysis_data.get('red_flags', []))}
        - Key Recommendations: {', '.join(analysis_data.get('recommendations', []))}
        
        Write a professional but friendly counter-proposal email that addresses the main concerns.
        """
            
    counter_response=model.generate_content(counter_proposal_prompt)
    counter_proposal_text=counter_response.text.replace(r"\$", "$")


    return {
            "analysis": analysis_data,
            "counter_proposal": {
                "subject": "Contract Discussion - Let's Make This Work! ✨",
                "body": counter_proposal_text
            },
            "educational_tips": [
                {
                    "title": "Red Flag Alert 🚨",
                    "content": "If a contract auto-renews, set calendar reminders NOW to avoid getting trapped!"
                },
                {
                    "title": "Money Math 💰",
                    "content": "Net revenue = they subtract costs first. Gross revenue = the full amount before deductions."
                },
                {
                    "title": "Own Your Work 📸", 
                    "content": "Never give up full ownership of content you create. License it instead!"
                },
                {
                    "title": "Exclusivity = Opportunity Cost 🔒",
                    "content": "Long exclusivity periods can cost you thousands in missed opportunities."
                }
            ]
        }


@app.get("/health")
async def health_check():
    return ({"status":"healthy"})


@app.post("/chat-about-contract")
async def chat_about_contract(
    question: str,
    contract_analysis: dict
):
    """Chat interface for follow-up questions about the contract"""
    
    chat_prompt = f"""
    You're a Gen Z legal expert helping someone understand their contract. 
    
    Contract Analysis: {json.dumps(contract_analysis)}
    
    User Question: {question}
    
    Provide a helpful, accurate answer in Gen Z language with emojis. 
    Keep it concise but informative.
    """
    response = model.generate_content(chat_prompt)
    return {"answer": response.text}
    