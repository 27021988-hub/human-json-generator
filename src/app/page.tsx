"use client";

import { useMemo, useState } from "react";
import AttributeForm from "@/components/AttributeForm";
import { CATEGORIES } from "@/lib/schema";
import { setDeep } from "@/lib/state";

function downloadJson(filename: string, obj: any) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const [active, setActive] = useState(CATEGORIES[0].id);
  const [flatValues, setFlatValues] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    for (const c of CATEGORIES) {
      for (const f of c.fields) init[f.key] = f.defaultValue ?? (f.type === "toggle" ? false : "");
    }
    return init;
  });

  const activeCategory = useMemo(() => CATEGORIES.find(c => c.id === active) ?? CATEGORIES[0], [active]);

  const jsonOut = useMemo(() => {
    let obj: any = {};
    for (const [k, v] of Object.entries(flatValues)) {
      if (v === "" || v == null) continue;
      obj = setDeep(obj, k, v);
    }
    return obj;
  }, [flatValues]);

  const jsonText = useMemo(() => JSON.stringify(jsonOut, null, 2), [jsonOut]);

  async function copy() {
    await navigator.clipboard.writeText(jsonText);
    alert("Copied JSON ✅");
  }

  return (
    <main className="grid">
      <div className="card" style={{ position: "sticky", top: 14, height: "fit-content" }}>
        <div className="h1">Human JSON Generator</div>
        <div className="small">250+ controls. Output updates live.</div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`pill ${c.id === active ? "pillActive" : ""}`}
              onClick={() => setActive(c.id)}
              title={c.description ?? c.title}
            >
              {c.title}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="btn" onClick={copy}>Copy JSON</button>
          <button className="btn" onClick={() => downloadJson("human-prompt.json", jsonOut)}>Download</button>
        </div>

        <div className="small" style={{ marginTop: 10 }}>
          Tip: keep “Micro anatomy” mostly on <b>subtle</b> for realism.
        </div>
      </div>

      <div>
        <AttributeForm
          category={activeCategory}
          values={flatValues}
          onChange={(key, value) => setFlatValues((prev) => ({ ...prev, [key]: value }))}
        />
      </div>

      <div className="card">
        <div className="h1">Output JSON</div>
        <div className="small">This is the object you feed into your prompt pipeline.</div>
        <div style={{ marginTop: 10 }}>
          <pre>{jsonText}</pre>
        </div>
      </div>
    </main>
  );
}
