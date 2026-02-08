import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Hero } from "./components/hero";

  
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />
      <Hero />
      <Footer />
    </main>
  );
}
