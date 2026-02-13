import { Link } from "react-router-dom";
import styles from "./Modules.module.css";
import sphereImg from "../assets/heat-sphere.png";

const modules = [
  { slug: "introduction-to-convection", label: "Intro to Convection", module: 1, icon: "🌡️" },
  { slug: "external-flow", label: "External Flow", module: 2, icon: "💨" },
  { slug: "internal-flow", label: "Internal Flow", module: 3, icon: "🔧" },
  { slug: "free-convection", label: "Free Convection", module: 4, icon: "🔥" },
  { slug: "boiling", label: "Boiling", module: 5, icon: "♨️" },
  { slug: "condensation", label: "Condensation", module: 6, icon: "💧" },
  { slug: "heat-exchangers", label: "Heat Exchangers", module: 7, icon: "⚙️" },
];

export default function Modules() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.back}>← Home</Link>
        <h1>HeatSphere Modules</h1>
      </header>

      <div className={styles.orbitContainer}>
        {/* Núcleo Central (Sol) */}
        <div className={styles.sun}>
            <img src={sphereImg} alt="Core" className={styles.sunImage} />
            <div className={styles.sun}>
  <img src={sphereImg} alt="Core" className={styles.sunImage} />
  
  {/* Novo Texto Sobreposto */}
  <div className={styles.coreText}>
    <h2 className={styles.coreTitle}>HeatSphere</h2>
    <p className={styles.coreSubtitle}>Modules</p>
  </div>
</div>
        </div>

        {/* Módulos em Órbita */}
        <div className={styles.orbitRing}>
          {modules.map((mod, index) => {
            // Calcula posição CSS baseada no índice (7 itens = ~51 graus cada)
            const angle = (360 / modules.length) * index;
            return (
              <div 
                key={mod.slug} 
                className={styles.planetWrapper}
                style={{ "--angle": `${angle}deg` } as any}
              >
                <Link to={`/modules/${mod.slug}`} className={styles.planet}>
                  {/* <div className={styles.planetIcon}>{mod.icon}</div> */} 
                  <div className={styles.planetContent}>
                    <span className={styles.planetModule}>Mod {mod.module}</span>
                    <span className={styles.planetLabel}>{mod.label}</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Fallback para Mobile (Grid normal) - Opcional, ou use media queries para transformar a órbita */}
    </div>
  );
}
