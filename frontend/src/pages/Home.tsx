import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import Hero from "../features/landing-page/components/Hero";
import bgImage from "../assets/wood-stick-burning-high-angle.jpg";

const Home = () => {
    const scrollToContent = () => {
        document.getElementById("content")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className={styles.container}>
            <section className={styles.landing}>
                <img src={bgImage} alt="Burning match stick" className={styles.bgImage} />
                <div className={styles.overlay} />

                <div className={styles.brandCenter}>
                    <h1 className={styles.brandTitle}>HeatSphere</h1>
                    <p className={styles.brandTagline}>Convective Heat Transfer — Demystified</p>

                    <h2 className={styles.homeHeadline}>
                        From equations to intuition, all in one place
                    </h2>
                    <p className={styles.homeSub}>
                        Explore modules, craft your own notes, work through calculations,
                        <br />analyze case studies and build knowledge.
                    </p>

                    <div className={styles.ctaGroup}>
                        <Link to="/modules" className={styles.btnPrimary}>Explore Modules</Link>
                        <Link to="/my-notes" className={styles.btnPrimary}>Craft Notes</Link>
                    </div>
                </div>

                <div
                    className={styles.scrollHint}
                    onClick={scrollToContent}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && scrollToContent()}
                    aria-label="Scroll to learn more"
                >
                    &#8595;
                </div>
            </section>

            <main id="content" className={styles.main}>
                <Hero />
            </main>
        </div>
    );
};

export default Home;
