import { render } from "preact";
import { LocationProvider, Router, Route } from "preact-iso";

import { Header } from "./components/Header.jsx";
import { Tile } from "./components/Tile.jsx";
import { Settings } from "./components/Settings.jsx";
import "./style.css";

export function App() {
  return (
    <LocationProvider>
      <Header />
      <Router>
        <Route path="/settings" component={Settings} />
      </Router>
      <main>
        <div id="tiles">
          <Tile />
        </div>
      </main>
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
