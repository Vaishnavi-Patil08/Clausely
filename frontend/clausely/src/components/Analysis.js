import { useState } from "react";

export default function Analysis({ data, onReset }) {
   const [open, setOpen]   = useState(null);
   const [show, setShow]   = useState(false);
  if (!data?.analysis) {
    return (
      <section className="flex items-center justify-center py-24">
        <p className="text-lg text-slate-600">Loading analysis…</p>
      </section>
    );
  } 
 
 

  const { analysis, counter_proposal, educational_tips } = data;

  const pill = r =>
    r === "🚨" ? "bg-red-100 text-red-600"
      : r === "🤔" ? "bg-yellow-100 text-yellow-600"
      : "bg-green-100 text-green-600";

  return (
    <section className="py-12 px-6 text-slate-800 max-w-5xl mx-auto">
      <header className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2">Contract Analysis Report</h2>
        <p className="text-6xl">{analysis.overallRisk}</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* clauses */}
        <div className="lg:col-span-2 space-y-4">
          {analysis.clauses.map((c, i) => (
            <div
              key={i}
              onClick={() => setOpen(open === i ? null : i)}
              className="p-6 rounded-xl border-2 hover:border-cyan-400/50 cursor-pointer bg-white/50 backdrop-blur">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold flex items-center gap-2">{c.emoji} {c.type}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${pill(c.risk)}`}>{c.risk}</span>
              </div>
              <p className="mt-2 text-indigo-600">{c.translation}</p>

              {open === i && (
                <div className="mt-4 text-sm space-y-1">
                  <p><strong>Concern:</strong> {c.concern}</p>
                  <p><strong>Suggestion:</strong> <span className="text-emerald-700">{c.suggestion}</span></p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* sidebar */}
        <aside className="space-y-6">
          <Card title="Major red flags 🚨" color="red" items={analysis.red_flags} />
          <Card title="Our recommendations 💡" color="emerald" items={analysis.recommendations} />
        </aside>
      </div>

      {/* email */}
      <div className="mt-12 p-6 rounded-xl bg-white/50 backdrop-blur space-y-4">
        <h3 className="text-xl font-bold">Counter-proposal email</h3>
        {!show ? (
          <button
            onClick={() => setShow(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-3 rounded-xl">
            Generate email 📧
          </button>
        ) : (
          <>
            <p className="font-medium">Subject: {counter_proposal.subject}</p>
            <pre className="whitespace-pre-wrap bg-white p-4 rounded-lg text-sm">{counter_proposal.body}</pre>
          </>
        )}
      </div>

      {/* tips */}
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        {educational_tips.map((t, i) => (
          <div key={i} className="p-5 rounded-xl bg-white/50 backdrop-blur">
            <h4 className="font-semibold">{t.title}</h4>
            <p className="text-sm">{t.content}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-16 space-x-4">
        <button
          onClick={onReset}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold">
          Analyze another 🔄
        </button>
        <button
          onClick={() => window.print()}
          className="border px-6 py-3 rounded-full font-semibold">
          Save as PDF 💾
        </button>
      </div>
    </section>
  );
}

function Card({ title, items=[], color }) {
  const txt = color === "red" ? "text-red-700" : "text-emerald-700";
  return (
    <div className="p-5 rounded-xl bg-white/50 backdrop-blur">
      <h4 className={`font-semibold mb-2 ${txt}`}>{title}</h4>
      <ul className="list-disc ml-5 space-y-1 text-sm">
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  );
}
