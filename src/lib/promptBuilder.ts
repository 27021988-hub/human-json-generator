type BuildOpts = {
  json: any;
  mode: "sdxl" | "flux" | "midjourney" | "chat";
};

function pick(obj: any, path: string): any {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return cur;
}

function cleanWords(parts: Array<string | undefined | null | false>): string[] {
  return parts
    .flatMap((p) => (typeof p === "string" ? [p] : []))
    .map((s) => s.trim())
    .filter(Boolean);
}

function joinComma(parts: string[]) {
  return parts.join(", ");
}

function joinSentence(parts: string[]) {
  return parts.length ? parts.join(". ") + "." : "";
}

function buildCommonTags(json: any) {
  const subjectType = pick(json, "subject.type") ?? "human";
  const gender = pick(json, "subject.gender");
  const age = pick(json, "subject.age");
  const ethnicity = pick(json, "subject.ethnicity");
  const vibe = pick(json, "subject.vibe");

  const height = pick(json, "body.height_cm");
  const build = pick(json, "body.build");
  const muscle = pick(json, "body.muscle_definition");
  const fat = pick(json, "body.body_fat");

  const skinTone = pick(json, "skin.tone");
  const undertone = pick(json, "skin.undertone");
  const texture = pick(json, "skin.texture");
  const pores = pick(json, "skin.pores");
  const freckles = pick(json, "skin.freckles");
  const moles = pick(json, "skin.moles");
  const scars = pick(json, "skin.scars");
  const redness = pick(json, "skin.redness");

  const hairColor = pick(json, "hair.head.color");
  const hairLength = pick(json, "hair.head.length");
  const hairTexture = pick(json, "hair.head.texture");
  const hairDensity = pick(json, "hair.head.density");
  const hairline = pick(json, "hair.head.hairline");
  const facialHair = pick(json, "hair.facial.type");

  const eyeColor = pick(json, "eyes.color");
  const eyeShape = pick(json, "eyes.shape");
  const eyeSpacing = pick(json, "eyes.spacing");
  const underEye = pick(json, "eyes.under_eye");

  const cameraType = pick(json, "camera.type");
  const lens = pick(json, "camera.lens");
  const aperture = pick(json, "camera.aperture");
  const dof = pick(json, "camera.depth_of_field");

  const lightStyle = pick(json, "lighting.style");
  const lightDir = pick(json, "lighting.direction");
  const lightHard = pick(json, "lighting.hardness");
  const shadows = pick(json, "lighting.shadows");

  const realismSkin = pick(json, "realism.skin_detail");
  const imperfections = pick(json, "realism.imperfections");
  const avoidPlastic = pick(json, "realism.avoid_plastic_skin");
  const avoidGlow = pick(json, "realism.avoid_ai_glow");

  // Micro anatomy: keep it tame — only include non-defaults to avoid prompt bloat
  const microObj = pick(json, "anatomy.micro") ?? {};
  const microPicks: string[] = [];
  if (microObj && typeof microObj === "object") {
    for (const [k, v] of Object.entries(microObj)) {
      if (v && v !== "subtle") microPicks.push(`${k.replaceAll("_", " ")}: ${v}`);
      if (microPicks.length >= 20) break; // cap
    }
  }

  const subjectBits = cleanWords([
    `${subjectType}`,
    gender ? `${gender}` : undefined,
    typeof age === "number" ? `${age}-year-old` : undefined,
    ethnicity && ethnicity !== "unspecified" ? `${ethnicity}` : undefined,
    vibe ? `${vibe}` : undefined,
  ]);

  const bodyBits = cleanWords([
    typeof height === "number" ? `${height}cm` : undefined,
    build ? `${build} build` : undefined,
    muscle ? `${muscle} muscle definition` : undefined,
    fat ? `${fat} body fat` : undefined,
  ]);

  const faceBits = cleanWords([
    eyeColor ? `${eyeColor} eyes` : undefined,
    eyeShape ? `${eyeShape} eye shape` : undefined,
    eyeSpacing ? `${eyeSpacing} eye spacing` : undefined,
    underEye ? `${underEye}` : undefined,
    facialHair && facialHair !== "none" ? `${facialHair}` : undefined,
  ]);

  const skinBits = cleanWords([
    skinTone ? `${skinTone} skin` : undefined,
    undertone ? `${undertone} undertone` : undefined,
    texture ? `${texture}` : undefined,
    pores ? `${pores} pores` : undefined,
    redness && redness !== "none" ? `${redness} redness` : undefined,
    freckles && freckles !== "none" ? `${freckles} freckles` : undefined,
    moles && moles !== "none" ? `${moles} moles` : undefined,
    scars && scars !== "none" ? `${scars} scars` : undefined,
  ]);

  const hairBits = cleanWords([
    hairColor ? `${hairColor} hair` : undefined,
    hairLength ? `${hairLength} hair` : undefined,
    hairTexture ? `${hairTexture} texture` : undefined,
    hairDensity ? `${hairDensity} density` : undefined,
    hairline ? `${hairline} hairline` : undefined,
  ]);

  const cameraBits = cleanWords([
    cameraType ? `${cameraType}` : undefined,
    lens ? `${lens} lens` : undefined,
    aperture ? `${aperture}` : undefined,
    dof ? `${dof} depth of field` : undefined,
  ]);

  const lightBits = cleanWords([
    lightStyle ? `${lightStyle}` : undefined,
    lightDir ? `${lightDir}` : undefined,
    lightHard ? `${lightHard} lighting` : undefined,
    shadows ? `${shadows}` : undefined,
  ]);

  const realismBits = cleanWords([
    realismSkin ? `${realismSkin} skin detail` : undefined,
    imperfections ? `${imperfections} natural imperfections` : undefined,
    avoidPlastic ? `avoid plastic skin` : undefined,
    avoidGlow ? `avoid AI glow` : undefined,
    `imperfect natural symmetry`,
    `photorealistic`,
  ]);

  return {
    subjectBits,
    bodyBits,
    faceBits,
    skinBits,
    hairBits,
    cameraBits,
    lightBits,
    realismBits,
    microPicks,
  };
}

function baseNegative() {
  return [
    "cgi",
    "3d render",
    "cartoon",
    "anime",
    "doll-like skin",
    "plastic skin",
    "oversmoothed skin",
    "airbrushed",
    "uncanny valley",
    "bad anatomy",
    "deformed",
    "extra fingers",
    "missing fingers",
    "bad hands",
    "bad eyes",
    "cross-eye",
    "distorted face",
    "blurry",
    "lowres",
    "jpeg artifacts",
    "watermark",
    "text",
    "logo",
  ];
}

export function buildExport(opts: BuildOpts) {
  const { json, mode } = opts;
  const t = buildCommonTags(json);

  if (mode === "sdxl") {
    const positive = joinComma([
      ...t.subjectBits,
      ...t.bodyBits,
      ...t.faceBits,
      ...t.skinBits,
      ...t.hairBits,
      ...t.cameraBits,
      ...t.lightBits,
      ...t.realismBits,
      ...(t.microPicks.length ? [`micro details: ${t.microPicks.join(", ")}`] : []),
    ]);

    const negative = joinComma(baseNegative());

    return {
      format: "SDXL / Stable Diffusion",
      payload: {
        positive_prompt: positive,
        negative_prompt: negative,
        // optional knobs you can ignore/use
        suggested: {
          sampler: "DPM++ 2M Karras",
          steps: 30,
          cfg_scale: 5.5,
          size: "1024x1024",
        },
      },
    };
  }

  if (mode === "flux") {
    // Flux tends to like a clearer sentence-y prompt
    const prompt = joinSentence([
      joinComma([...t.subjectBits, ...t.bodyBits, ...t.faceBits]),
      joinComma([...t.skinBits, ...t.hairBits]),
      joinComma([...t.cameraBits]),
      joinComma([...t.lightBits]),
      joinComma([...t.realismBits]),
      t.microPicks.length ? `Micro details kept subtle; only deviations: ${t.microPicks.join(", ")}` : "",
    ].filter(Boolean));

    return {
      format: "Flux",
      payload: {
        prompt,
        guidance: "Keep natural imperfections and avoid overly smooth skin. Maintain realistic proportions.",
      },
    };
  }

  if (mode === "midjourney") {
    const core = joinComma([
      ...t.subjectBits,
      ...t.bodyBits,
      ...t.faceBits,
      ...t.skinBits,
      ...t.hairBits,
      ...t.cameraBits,
      ...t.lightBits,
      "ultra photoreal",
      "natural skin texture",
    ]);

    // Common MJ-ish params (user can tweak)
    const params = "--ar 1:1 --style raw --s 150 --chaos 0";
    return {
      format: "Midjourney-ish",
      payload: {
        prompt: `${core} ${params}`.trim(),
        negative_hint: baseNegative().slice(0, 12).join(", "),
      },
    };
  }

  // chat models (ChatGPT / Gemini / Grok): best as instruction + JSON
   // chat models (ChatGPT / Gemini / Grok): best as instruction + JSON
  return {
    format: "Chat models (ChatGPT / Gemini / Grok)",
    payload: {
      instruction:
        "Use the JSON spec to write a single photorealistic image prompt of one adult human. Keep it realistic, include camera + lighting, avoid explicit content, and avoid plastic/CGI look. Output ONLY the final prompt text.",
      json_spec: json,
      avoid: baseNegative(),
    },
  };

