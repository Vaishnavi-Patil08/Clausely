import { useState } from "react";
import axios from "axios";

export default function Chat({analysis}){
  const [msg,setMsg]   = useState("");
  const [log,setLog]   = useState([]);

  const send = async()=>{
    if(!msg.trim()) return;
    setLog([...log,{role:"user",text:msg}]);
    setMsg("");
    const {data} = await axios.post("http://localhost:8000/chat-about-contract",{
      question:msg, contract_analysis:analysis
    });
    setLog(l=>[...l,{role:"ai",text:data.answer}]);
  };

  return(
    <div className="fixed bottom-4 right-4 w-80 backdrop-card p-4 space-y-2">
      <div className="h-48 overflow-y-auto space-y-1 text-sm">
        {log.map((l,i)=>(
          <p key={i} className={l.role==="ai"?"text-gemini-blue":""}>{l.text}</p>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={msg} onChange={e=>setMsg(e.target.value)}
               className="flex-1 px-3 py-2 rounded-lg border" placeholder="Ask Gemini…"/>
        <button onClick={send} className="px-4 py-2 bg-gemini-blue text-white rounded-lg">Send</button>
      </div>
    </div>
  );
}
