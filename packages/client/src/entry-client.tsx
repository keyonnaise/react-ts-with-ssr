import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root")!;
const children = <App />;

if (root.childElementCount === 0) {
  createRoot(root).render(<StrictMode>{children}</StrictMode>);
} else {
  hydrateRoot(root, children);
}
