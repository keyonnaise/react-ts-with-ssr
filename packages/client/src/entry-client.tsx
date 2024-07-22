import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

const root = document.getElementById("root")!;
const children = (
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);

if (root.childElementCount === 0) {
  createRoot(root).render(<StrictMode>{children}</StrictMode>);
} else {
  hydrateRoot(root, children);
}
