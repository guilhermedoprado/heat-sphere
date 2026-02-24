import styles from "./Hero.module.css";
import ModulesOrbit from "../../modules/ModulesOrbit";

const HomeHero = () => {
  return (
      <section id="modules"className={styles.hero}>
        <ModulesOrbit />
      </section>
  );
};

export default HomeHero;
