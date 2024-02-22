import { useLocation } from "preact-iso";

export function Header() {
  const { url } = useLocation();
  return (
    <header>
      <nav>
        <h1 id="scanText">Subnet Scanner</h1>
        <a href="/settings">⚙️</a>
      </nav>
    </header>
  );
}
