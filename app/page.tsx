import UrlForm from "@/components/UrlForm";
import { HeroSection } from "@/components/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <UrlForm />
      </div>
    </main>
  );
}