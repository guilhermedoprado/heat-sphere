import { useParams, Link } from "react-router-dom";
import styles from "./ModuleHub.module.css";

import imgIntroConvection from "../assets/introduction-to-convection.jpg";
import imgExternalFlow from "../assets/external-flow.jpg";
import imgInternalFlow from "../assets/internal-flow.jpg";
import imgFreeConvection from "../assets/free-convection.jpg";
import imgEvaporation from "../assets/evaporation.jpg";
import imgCondensation from "../assets/condensation.jpg";
import imgHeatExchangers from "../assets/heat-exchangers.jpg";

const MODULE_IMAGES: Record<string, string> = {
  "introduction-to-convection": imgIntroConvection,
  "external-flow": imgExternalFlow,
  "internal-flow": imgInternalFlow,
  "free-convection": imgFreeConvection,
  "boiling": imgEvaporation,
  "condensation": imgCondensation,
  "heat-exchangers": imgHeatExchangers,
};

type ModuleInfo = {
  label: string;
  module: number;
  icon: string;
  briefing: string;
  objectives: string[];
};

const MODULE_DATA: Record<string, ModuleInfo> = {
  "introduction-to-convection": {
    label: "Introduction to Convection",
    module: 1,
    icon: "🌡️",
    briefing:
      "This module covers the physical mechanisms of convective heat transfer, including the development of velocity and thermal boundary layers, local and average convection coefficients, and the key dimensionless parameters (Re, Pr, Nu) that govern convective transport.",
    objectives: [
      "Understand the difference between forced and natural convection.",
      "Derive and interpret the convection rate equation q = hA(Ts − T∞).",
      "Identify laminar vs. turbulent boundary layer regimes.",
      "Apply dimensional analysis to obtain Nusselt number correlations.",
    ],
  },
  "external-flow": {
    label: "External Flow",
    module: 2,
    icon: "💨",
    briefing:
      "Analyzes convective heat transfer for flow over flat plates, cylinders, spheres, and tube banks. Covers empirical correlations for average Nusselt numbers in both laminar and turbulent regimes.",
    objectives: [
      "Apply the Churchill-Bernstein and Hilpert correlations for cylinders.",
      "Calculate heat transfer from flat plates using integral methods.",
      "Determine heat transfer in cross-flow over tube banks.",
    ],
  },
  "internal-flow": {
    label: "Internal Flow",
    module: 3,
    icon: "🔧",
    briefing:
      "Covers convection in pipe flow, including hydrodynamic and thermal entry lengths, fully developed conditions, constant wall temperature and constant heat flux boundary conditions.",
    objectives: [
      "Distinguish developing vs. fully developed flow.",
      "Apply Dittus-Boelter and Sieder-Tate correlations.",
      "Calculate pressure drop and pumping power.",
    ],
  },
  "free-convection": {
    label: "Free Convection",
    module: 4,
    icon: "🔥",
    briefing:
      "Explores buoyancy-driven convection on vertical and horizontal surfaces, inclined plates, and within enclosures. Covers the Rayleigh number and empirical correlations for natural convection.",
    objectives: [
      "Understand the role of the Grashof and Rayleigh numbers.",
      "Apply Churchill-Chu correlation for vertical plates.",
      "Analyze natural convection in enclosed spaces.",
    ],
  },
  "boiling": {
    label: "Boiling",
    module: 5,
    icon: "♨️",
    briefing:
      "Covers the pool boiling curve, nucleate boiling, critical heat flux (CHF), film boiling, and flow boiling in tubes. Includes Rohsenow and Zuber correlations.",
    objectives: [
      "Identify the regimes of the boiling curve.",
      "Calculate nucleate boiling heat flux using Rohsenow correlation.",
      "Determine critical heat flux conditions.",
    ],
  },
  "condensation": {
    label: "Condensation",
    module: 6,
    icon: "💧",
    briefing:
      "Analyzes film condensation on vertical and horizontal surfaces using Nusselt's classical theory, as well as dropwise condensation mechanisms and enhancement techniques.",
    objectives: [
      "Derive the Nusselt film condensation solution.",
      "Compare film vs. dropwise condensation rates.",
      "Apply correlations for condensation on tube banks.",
    ],
  },
  "heat-exchangers": {
    label: "Heat Exchangers",
    module: 7,
    icon: "⚙️",
    briefing:
      "Covers design and analysis of heat exchangers using LMTD and ε-NTU methods. Includes shell-and-tube, cross-flow, and compact heat exchangers with correction factor charts.",
    objectives: [
      "Apply the LMTD method for sizing heat exchangers.",
      "Use the ε-NTU method for performance rating.",
      "Understand fouling factors and their impact on UA.",
    ],
  },
};

const RESOURCES = [
  { key: "notes",        label: "Notes",        path: "notes",        isLocal: true  },
  { key: "formularies",  label: "Formularies",  path: "formularies",  isLocal: false },
  { key: "solvers",      label: "Solvers",      path: "solvers",      isLocal: false },
  { key: "calculations", label: "Calculations", path: "calculations", isLocal: false },
  { key: "case-studies", label: "Case Studies", path: "case-studies", isLocal: false },
];


export default function ModuleHub() {
  const { slug } = useParams<{ slug: string }>();
  const mod = MODULE_DATA[slug ?? ""];

  if (!mod) {
    return (
      <div className={styles.container}>
        <p>Module not found.</p>
        <Link to="/modules">← Back to Modules</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Banner image */}
      {MODULE_IMAGES[slug ?? ""] && (
        <div className={styles.banner}>
          <img
            src={MODULE_IMAGES[slug ?? ""]}
            alt=""
            className={styles.bannerImage}
          />
          <div className={styles.bannerOverlay} />
        </div>
      )}

      <div className={styles.content}>
        <header className={styles.header}>
          <Link to="/modules" className={styles.back}>← Modules</Link>
          <div>
            <span className={styles.chapter}>Module {mod.module}</span>
            <h1>{mod.label}</h1>
          </div>
        </header>

        <nav className={styles.resourceNav}>
          {RESOURCES.map(r => (
              <Link
                  key={r.key}
                  to={r.isLocal
                      ? `/modules/${slug}/${r.key}`          // notes: ainda local
                      : `/${r.key}?module=${slug}`            // resto: Hub filtrado
                  }
                  className={styles.resourceCard}
              >
                {r.label}
              </Link>
          ))}
        </nav>

        <section className={styles.briefing}>
        <h2>Module Overview</h2>
        <p>{mod.briefing}</p>

        <h3>Learning Objectives</h3>
        <ul>
          {mod.objectives.map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>
        </section>
      </div>
    </div>
  );
}
