export default function Hero({ onStart }) {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-white text-center px-6">
      <span className="text-6xl animate-bounce mb-6">📝</span>
      <h1 className="text-5xl font-bold drop-shadow-lg mb-4">
        Clausely
      </h1>
      <p className="mb-8 opacity-90">
        AI-powered contract analysis that speaks your language
      </p>
      <button
        onClick={onStart}
        className="bg-gradient-to-r from-emerald-400 to-cyan-500 px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition">
        Decode my contract 
      </button>
    </section>
  );
}
