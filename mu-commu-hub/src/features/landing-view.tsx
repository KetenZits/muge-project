import WelcomeNavbar from "@/components/welcome/welcome-navbar";
import Hero from "@/components/welcome/hero";
import Benefits from "@/components/welcome/benefits";
import Talents from "@/components/welcome/talents";
import SceneTransitions from "@/components/welcome/scene-transitions";
import "@/components/welcome/welcome.css";

export default function LandingView() {
  return (
    <div className="welcome-page">
      <WelcomeNavbar />
      <main>
        <Hero />
        <Benefits />
        <Talents />
        <section id="welcome-final" className="welcome-final" aria-label="Invitation to join MU Connect">
          <div className="welcome-final-breath" aria-hidden="true"><span>THE NEXT IDEA<br />STARTS WITH A HELLO.</span><i /></div>
        </section>
        <SceneTransitions />
      </main>
    </div>
  );
}
