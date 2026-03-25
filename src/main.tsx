import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { componentTagger } from "lovable-tagger";
componentTagger();

createRoot(document.getElementById("root")!).render(<App />);
