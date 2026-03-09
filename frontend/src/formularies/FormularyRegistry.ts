// src/formularies/FormularyRegistry.ts
import cap6 from "./contents/cap6-introduction-to-convection.md?raw";
import cap7 from "./contents/cap7-external-flow.md?raw";
import cap8 from "./contents/cap8-internal-flow.md?raw";
/*import cap9 from "./contents/cap9-free-convection.md";
import cap10 from "./contents/cap10-boiling.md";
import cap11 from "./contents/cap11-condensation.md";
import cap12 from "./contents/cap12-heat-exchangers.md";*/

interface FormularyMeta {
  title: string;
  subject: string;
  content: string;
}

export const FormularyRegistry: Record<string, FormularyMeta> = {
  "introduction-to-convection": {
    title: "Cap. 6 — Introdução à Convecção",
    subject: "Transferência de Calor",
    content: cap6,
  },
  "external-flow": {
    title: "Cap. 7 — Escoamento Externo",
    subject: "Transferência de Calor",
    content: cap7,
  },
  "internal-flow": {
    title: "Cap. 8 — Escoamento Interno",
    subject: "Transferência de Calor",
    content: cap8,
  },
  /* "cap9": {
    title: "Cap. 9 — Convecção Livre",
    subject: "Transferência de Calor",
    content: cap9,
  },
  "cap10": {
    title: "Cap. 10 — Ebulição",
    subject: "Transferência de Calor",
    content: cap10,
  },
  "cap11": {
    title: "Cap. 11 — Condensação",
    subject: "Transferência de Calor",
    content: cap11,
  },
  "cap12": {
    title: "Cap. 12 — Trocadores de Calor",
    subject: "Transferência de Calor",
    content: cap12,
  },
  */
};
