import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./styles/global.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: "var(--font-sans)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-card)",
        },
      }}
    />
  </StrictMode>
);
