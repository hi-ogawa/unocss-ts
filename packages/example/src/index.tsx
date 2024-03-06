import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
import { createRoot } from "react-dom/client";
import { App } from "./app";

function main() {
  const el = document.querySelector("#root");
  createRoot(el!).render(<App />);
}

main();
