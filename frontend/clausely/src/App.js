import { useState } from "react";
import Hero      from "./components/Hero.js";
import Uploader  from "./components/Uploader.js";
import Loading   from "./components/Loading.js";
import Analysis  from "./components/Analysis.js";

export default function App() {
  const [step, setStep]     = useState("hero");
  const [analysis, setData] = useState(null);

  const handleUpload = async (file, demo=false) => {
    setStep("loading");
    try {
      const fd = new FormData();
      fd.append("file", file); 
      const res = demo
        ? await fetch("http://localhost:8000/demo-analysis")
        : await fetch("http://localhost:8000/analyze-contract", {
            method: "POST",
            body: fd,
          });
      setData(await res.json());
      setStep("analysis");
    } catch (err) {
      alert("Analysis failed, check backend.");
      setStep("upload");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-700 via-fuchsia-500 to-rose-500">
      {step === "hero"     && <Hero     onStart={() => setStep("upload")} />}
      {step === "upload"   && <Uploader onUpload={handleUpload} />}
      {step === "loading"  && <Loading />}
      {step === "analysis" && analysis && (
        <Analysis data={analysis} onReset={() => { setData(null); setStep("upload"); }} />
      )}
    </main>
  );
}
