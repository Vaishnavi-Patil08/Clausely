import { useRef, useState } from "react";

export default function Uploader({ onUpload }) {
  const fileRef = useRef();
  const [drag, setDrag] = useState(false);

  const pick = () => fileRef.current.click();

  const handleFile = e => {
    const f = e.target.files[0];
    if (f) onUpload(f);
  };

  const drop = e => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onUpload(f);
  };

  return (
    <section className="py-20 bg-white/40 backdrop-blur">
      <h2 className="text-center text-3xl font-bold mb-10">
        Upload your PDF contract
      </h2>

      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={drop}
        onClick={pick}
        className={`max-w-lg mx-auto border-4 border-dashed rounded-xl p-12 text-center transition ${
          drag ? "border-emerald-400 bg-emerald-50" : "border-gray-300"
        }`}>
        <p className="text-5xl mb-4">📤</p>
        <p className="font-medium">Drag & drop or click to select</p>
        <p className="text-sm text-gray-500">PDF only · Max 10 MB</p>
        <input
          type="file"
          accept="application/pdf"
          hidden
          ref={fileRef}
          onChange={handleFile}
        />
      </div>

    </section>
  );
}
