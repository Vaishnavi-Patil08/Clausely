export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <div className="flex items-center gap-4 mb-4">
        <span className="animate-spin h-10 w-10 border-4 border-white/20 border-t-white rounded-full" />
        <p className="text-xl">Gemini is cooking…</p>
      </div>
      <p className="opacity-80">Scanning document → finding red flags → drafting insights</p>
    </div>
  );
}
