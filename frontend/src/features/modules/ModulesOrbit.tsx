import { Link } from "react-router-dom";
import styles from "./ModulesOrbit.module.css";
import sphereImg from "../../assets/heat-sphere.png";
import { modules } from "../../data/modules";

export default function ModulesOrbit() {
    return (
        <div className={styles.container}>
        <div className={styles.orbitContainer}>
            <div className={styles.sun}>
                <img src={sphereImg} alt="Core" className={styles.sunImage} />
                <div className={styles.coreText}>
                    <h2 className={styles.coreTitle}>HeatSphere</h2>
                    <p className={styles.coreSubtitle}>Modules</p>
                </div>
            </div>
        </div>


            <div className={styles.orbitRing}>
                {modules.map((mod, index) => {
                    const angle = (360 / modules.length) * index;
                    return (
                        <div
                            key={mod.slug}
                            className={styles.planetWrapper}
                            style={{ "--angle": `${angle}deg` } as any}
                        >
                            <Link to={`/modules/${mod.slug}`} className={styles.planet}>
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
    );
}
