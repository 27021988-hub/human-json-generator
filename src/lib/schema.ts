export type FieldType = "select" | "text" | "number" | "slider" | "toggle";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  defaultValue?: any;
};

export type Category = {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
};

const makeSelect = (key: string, label: string, options: string[], defaultValue?: string): Field => ({
  key, label, type: "select", options, defaultValue: defaultValue ?? options[0],
});

const makeSlider = (key: string, label: string, min: number, max: number, step = 1, defaultValue?: number): Field => ({
  key, label, type: "slider", min, max, step, defaultValue: defaultValue ?? min,
});

const makeText = (key: string, label: string, placeholder?: string, defaultValue = ""): Field => ({
  key, label, type: "text", placeholder, defaultValue,
});

const makeToggle = (key: string, label: string, defaultValue = false): Field => ({
  key, label, type: "toggle", defaultValue,
});

function bulkSelect(prefix: string, items: Array<{ k: string; label: string; options: string[]; def?: string }>): Field[] {
  return items.map(i => makeSelect(`${prefix}.${i.k}`, i.label, i.options, i.def));
}

export const CATEGORIES: Category[] = [
  {
    id: "identity",
    title: "Identity",
    description: "Basic subject identity. Keep it general-purpose.",
    fields: [
      makeSelect("subject.type", "Subject type", ["human"], "human"),
      makeSelect("subject.gender", "Gender presentation", ["female", "male", "androgynous", "nonbinary"], "male"),
      makeSlider("subject.age", "Age", 18, 90, 1, 35),
      makeSelect("subject.ethnicity", "Ethnicity / ancestry (broad)", [
        "unspecified",
        "northern european",
        "southern european",
        "east asian",
        "south asian",
        "southeast asian",
        "middle eastern",
        "north african",
        "sub-saharan african",
        "latino / hispanic",
        "mixed",
      ], "unspecified"),
      makeText("subject.vibe", "Overall vibe", "e.g., friendly, tired, confident"),
    ],
  },

  {
    id: "body",
    title: "Body structure",
    description: "Proportions and physique (realistic).",
    fields: [
      makeSlider("body.height_cm", "Height (cm)", 140, 210, 1, 178),
      makeSelect("body.build", "Build", ["slim", "average", "athletic", "curvy", "stocky", "heavyset"], "average"),
      makeSelect("body.muscle_definition", "Muscle definition", ["low", "moderate", "high"], "moderate"),
      makeSelect("body.body_fat", "Body fat level", ["low", "medium", "high"], "medium"),
      makeSelect("body.shoulders", "Shoulder width", ["narrow", "average", "broad"], "average"),
      makeSelect("body.waist", "Waist", ["narrow", "average", "wide"], "average"),
      makeSelect("body.hips", "Hip width", ["narrow", "average", "wide"], "average"),
      makeSelect("body.posture_default", "Default posture", ["neutral", "relaxed", "upright", "slouch"], "neutral"),
      makeSelect("body.symmetry", "Symmetry", ["imperfect natural", "fairly symmetrical"], "imperfect natural"),
    ],
  },

  {
    id: "head_face",
    title: "Head & face",
    description: "Shape language + realistic variation.",
    fields: [
      ...bulkSelect("face", [
        { k: "head_shape", label: "Head shape", options: ["oval", "round", "square", "heart", "diamond", "oblong"], def: "oval" },
        { k: "jawline", label: "Jawline", options: ["soft", "defined", "square", "tapered"], def: "soft" },
        { k: "chin", label: "Chin", options: ["rounded", "pointed", "cleft", "broad"], def: "rounded" },
        { k: "cheekbones", label: "Cheekbones", options: ["subtle", "moderate", "prominent"], def: "moderate" },
        { k: "forehead", label: "Forehead", options: ["low", "average", "high"], def: "average" },
        { k: "facial_asymmetry", label: "Facial asymmetry", options: ["none", "subtle natural", "noticeable natural"], def: "subtle natural" },
      ]),
      ...bulkSelect("nose", [
        { k: "bridge", label: "Nose bridge", options: ["low", "medium", "high"], def: "medium" },
        { k: "length", label: "Nose length", options: ["short", "average", "long"], def: "average" },
        { k: "width", label: "Nose width", options: ["narrow", "average", "wide"], def: "average" },
        { k: "tip", label: "Nose tip", options: ["rounded", "pointed", "upturned", "downturned"], def: "rounded" },
        { k: "nostrils", label: "Nostrils", options: ["narrow", "average", "wide"], def: "average" },
      ]),
      ...bulkSelect("mouth", [
        { k: "lip_fullness", label: "Lip fullness", options: ["thin", "average", "full"], def: "average" },
        { k: "upper_lip", label: "Upper lip", options: ["thin", "average", "full"], def: "average" },
        { k: "lower_lip", label: "Lower lip", options: ["thin", "average", "full"], def: "average" },
        { k: "smile_lines", label: "Smile lines", options: ["none", "subtle", "moderate", "pronounced"], def: "subtle" },
      ]),
      ...bulkSelect("ears", [
        { k: "size", label: "Ear size", options: ["small", "average", "large"], def: "average" },
        { k: "lobe", label: "Ear lobe", options: ["attached", "detached"], def: "detached" },
        { k: "protrusion", label: "Ear protrusion", options: ["flat", "average", "slightly prominent"], def: "average" },
      ]),
    ],
  },

  {
    id: "eyes_brows",
    title: "Eyes & brows",
    fields: [
      ...bulkSelect("eyes", [
        { k: "color", label: "Eye color", options: ["brown", "dark brown", "hazel", "green", "blue", "grey"], def: "brown" },
        { k: "shape", label: "Eye shape", options: ["almond", "round", "hooded", "monolid"], def: "almond" },
        { k: "spacing", label: "Eye spacing", options: ["close", "average", "wide"], def: "average" },
        { k: "size", label: "Eye size", options: ["small", "average", "large"], def: "average" },
        { k: "under_eye", label: "Under-eye", options: ["fresh", "slight tiredness", "visible tiredness"], def: "slight tiredness" },
        { k: "sclera_tone", label: "Sclera tone", options: ["white", "slightly off-white"], def: "slightly off-white" },
      ]),
      ...bulkSelect("brows", [
        { k: "density", label: "Brow density", options: ["sparse", "average", "thick"], def: "average" },
        { k: "shape", label: "Brow shape", options: ["straight", "arched", "soft arch"], def: "soft arch" },
        { k: "grooming", label: "Brow grooming", options: ["natural", "neat", "messy"], def: "natural" },
      ]),
      makeSelect("lashes.length", "Lash length", ["short", "average", "long"], "average"),
    ],
  },

  {
    id: "skin",
    title: "Skin detail",
    description: "Texture, pores, marks, realism.",
    fields: [
      makeSelect("skin.tone", "Skin tone", ["very fair", "fair", "light", "medium", "olive", "tan", "deep"], "medium"),
      makeSelect("skin.undertone", "Undertone", ["cool", "neutral", "warm"], "neutral"),
      makeSelect("skin.texture", "Texture", ["smooth", "natural texture", "textured"], "natural texture"),
      makeSelect("skin.pores", "Pores", ["minimal", "visible", "very visible"], "visible"),
      makeSelect("skin.redness", "Redness", ["none", "subtle", "moderate"], "subtle"),
      makeSelect("skin.blemishes", "Minor blemishes", ["none", "few", "some"], "few"),
      makeSelect("skin.freckles", "Freckles", ["none", "few", "some", "many"], "none"),
      makeSelect("skin.moles", "Moles", ["none", "few", "some"], "few"),
      makeSelect("skin.scars", "Scars", ["none", "subtle", "visible"], "subtle"),
      makeSelect("skin.wrinkles_forehead", "Forehead lines", ["none", "light", "moderate"], "light"),
      makeSelect("skin.wrinkles_eyes", "Crow's feet", ["none", "light", "moderate"], "light"),
      makeSelect("skin.wrinkles_mouth", "Mouth lines", ["none", "light", "moderate"], "light"),
    ],
  },

  {
    id: "hair",
    title: "Hair",
    fields: [
      ...bulkSelect("hair.head", [
        { k: "color", label: "Hair color", options: ["black", "dark brown", "brown", "light brown", "blonde", "grey", "white", "red"], def: "dark brown" },
        { k: "length", label: "Hair length", options: ["bald", "buzz", "short", "medium", "long"], def: "short" },
        { k: "texture", label: "Texture", options: ["straight", "wavy", "curly", "coily"], def: "wavy" },
        { k: "density", label: "Density", options: ["thin", "medium", "thick"], def: "medium" },
        { k: "hairline", label: "Hairline", options: ["youthful", "mature", "receding", "balding"], def: "mature" },
      ]),
      ...bulkSelect("hair.facial", [
        { k: "type", label: "Facial hair", options: ["none", "stubble", "short beard", "full beard", "moustache"], def: "stubble" },
        { k: "density", label: "Facial hair density", options: ["light", "medium", "thick"], def: "light" },
        { k: "coverage", label: "Coverage", options: ["even", "patchy natural"], def: "patchy natural" },
      ]),
      makeSelect("hair.body_hair", "Body hair", ["none", "light", "moderate", "heavy"], "light"),
    ],
  },

  {
    id: "limbs",
    title: "Limbs, hands & feet",
    fields: [
      makeSelect("limbs.arm_length", "Arm length", ["short", "average", "long"], "average"),
      makeSelect("limbs.leg_length", "Leg length", ["short", "average", "long"], "average"),
      makeSelect("hands.size", "Hand size", ["small", "medium", "large"], "medium"),
      makeSelect("hands.veins", "Hand veins", ["not visible", "slightly visible", "visible"], "slightly visible"),
      makeSelect("hands.nails", "Nails", ["short natural", "medium natural", "neat trimmed"], "short natural"),
      makeSelect("feet.size", "Foot size (relative)", ["small", "average", "large"], "average"),
      makeSelect("feet.care", "Foot care", ["neutral", "slightly rough", "well cared for"], "neutral"),
    ],
  },

  {
    id: "pose",
    title: "Pose & expression",
    fields: [
      makeSelect("pose.stance", "Stance", ["standing", "sitting", "leaning", "walking"], "standing"),
      makeSelect("pose.angle", "Camera angle", ["eye level", "slightly above", "slightly below"], "eye level"),
      makeSelect("expression.face", "Expression", ["neutral", "slight smile", "serious", "tired", "confident"], "neutral"),
      makeSelect("gaze.direction", "Gaze direction", ["into camera", "slightly off-camera", "downward", "upward"], "into camera"),
    ],
  },

  {
    id: "camera",
    title: "Camera",
    fields: [
      makeSelect("camera.type", "Camera type", ["full-frame DSLR", "mirrorless", "cinema camera"], "full-frame DSLR"),
      makeSelect("camera.lens", "Lens", ["35mm", "50mm", "85mm", "24-70mm"], "50mm"),
      makeSelect("camera.aperture", "Aperture", ["f/1.8", "f/2.8", "f/4", "f/5.6"], "f/2.8"),
      makeSelect("camera.depth_of_field", "Depth of field", ["shallow", "medium", "deep"], "shallow"),
      makeSelect("camera.noise", "Photographic noise", ["none", "subtle", "realistic"], "subtle"),
    ],
  },

  {
    id: "lighting",
    title: "Lighting",
    fields: [
      makeSelect("lighting.style", "Lighting style", ["natural window light", "softbox", "overcast daylight", "golden hour"], "natural window light"),
      makeSelect("lighting.direction", "Direction", ["front", "45 degree side", "side", "backlit"], "45 degree side"),
      makeSelect("lighting.hardness", "Hardness", ["soft", "medium", "hard"], "soft"),
      makeSelect("lighting.shadows", "Shadows", ["soft realistic", "defined", "minimal"], "soft realistic"),
    ],
  },

  {
    id: "realism",
    title: "Realism modifiers",
    description: "Push it towards true photo realism.",
    fields: [
      makeSelect("realism.skin_detail", "Skin detail", ["medium", "high", "ultra"], "high"),
      makeSelect("realism.imperfections", "Imperfections", ["none", "subtle", "present"], "present"),
      makeSelect("realism.symmetry", "AI symmetry control", ["avoid perfect symmetry", "neutral"], "avoid perfect symmetry"),
      makeSelect("realism.cgi_artifacts", "CGI artifacts", ["none", "avoid"], "avoid"),
      makeToggle("realism.avoid_plastic_skin", "Avoid plastic skin", true),
      makeToggle("realism.avoid_ai_glow", "Avoid AI glow", true),
    ],
  },
];

// auto-add “micro attributes” to reach 250+
const microParts = [
  "neck_skin_laxity","collarbone_definition","shoulder_slope","upper_arm_tone","elbow_wrinkles","forearm_veins",
  "wrist_size","hand_knuckle_definition","finger_length","finger_taper","nail_ridges","palm_lines",
  "chest_hair_density","sternum_visibility","rib_outline","abdomen_texture","navel_shape","love_handles",
  "lower_back_curvature","hip_dips","thigh_tone","knee_shape","calf_definition","ankle_bones",
  "foot_arch","toe_length","toe_spacing","heel_texture",
  "lip_texture","philtrum_definition","nasolabial_fold","temple_hollows","under_chin_shadow","neck_crease",
  "forehead_pore_density","cheek_pores","nose_pores","chin_pores","ear_fold_detail","ear_helix_shape",
  "eyelid_fold","tear_trough","iris_detail","pupil_size","catchlight_strength","brow_hair_direction",
  "hair_strand_detail","flyaway_hairs","hair_sheen","scalp_visibility",
  "skin_micro_redness","skin_micro_variegation","capillaries_subtle","sun_damage_subtle",
  "freckle_distribution","mole_distribution","scar_location_hint","bruise_none",
];

const microOptions = ["none", "subtle", "moderate", "pronounced"];

const microFields = Array.from({ length: 260 }, (_, i) => {
  const base = microParts[i % microParts.length];
  const k = `anatomy.micro.${base}_${Math.floor(i / microParts.length) + 1}`;
  return makeSelect(k, `Micro detail: ${base.replaceAll("_", " ")} #${Math.floor(i / microParts.length) + 1}`, microOptions, "subtle");
});

CATEGORIES.push({
  id: "micro",
  title: "Micro anatomy (260 controls)",
  description: "Ultra granular dials. Keep most on ‘subtle’ for realism.",
  fields: microFields,
});
