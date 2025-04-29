export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-b from-muted/50 to-muted/30">
      <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center gap-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Just Let Me Cook
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-[700px]">
          Tired of scrolling through life stories to find recipes? Paste any recipe URL and
          we&apos;ll extract just what you need to start cooking.
        </p>
      </div>
    </section>
  );
}