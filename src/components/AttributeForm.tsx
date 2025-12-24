"use client";

import { Category, Field } from "@/lib/schema";

type Props = {
  category: Category;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
};

function FieldControl({ field, value, onChange }: { field: Field; value: any; onChange: (v: any) => void }) {
  if (field.type === "select") {
    return (
      <select className="input" value={value ?? field.defaultValue ?? ""} onChange={(e) => onChange(e.target.value)}>
        {(field.options ?? []).map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  if (field.type === "slider") {
    const v = typeof value === "number" ? value : (field.defaultValue ?? field.min ?? 0);
    return (
      <div>
        <input
          className="input"
          type="range"
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          value={v}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <div className="small">Value: {v}</div>
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <input
        className="input"
        type="number"
        min={field.min}
        max={field.max}
        step={field.step ?? 1}
        value={value ?? field.defaultValue ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      />
    );
  }

  if (field.type === "toggle") {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={Boolean(value ?? field.defaultValue)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="small">toggle</span>
      </div>
    );
  }

  return (
    <input
      className="input"
      type="text"
      placeholder={field.placeholder ?? ""}
      value={value ?? field.defaultValue ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default function AttributeForm({ category, values, onChange }: Props) {
  return (
    <div className="card">
      <div className="h1">{category.title}</div>
      {category.description ? <div className="small">{category.description}</div> : null}

      <div style={{ marginTop: 10 }}>
        {category.fields.map((f) => (
          <div key={f.key}>
            <label>{f.label}</label>
            <FieldControl field={f} value={values[f.key]} onChange={(v) => onChange(f.key, v)} />
          </div>
        ))}
      </div>
    </div>
  );
}
