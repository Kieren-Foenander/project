export default function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-8">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Just Let Me Cook. All rights reserved.</p>
        <p className="mt-2">
          Skip the life stories. Get straight to cooking.
        </p>
      </div>
    </footer>
  );
}