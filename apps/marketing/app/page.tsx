import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { ShowcaseSection } from "./components/ShowcaseSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ShowcaseSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </>
  );
}
