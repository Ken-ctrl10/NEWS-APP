export default function Footer() {
  return (
    <footer className="py-4 mt-auto">
      <div className="container small opacity-75 d-flex flex-wrap justify-content-between gap-2">
        <span>© {new Date().getFullYear()} News App</span>
        <span className="text-warning">Powered by NewsAPI</span>
      </div>
    </footer>
  );
}