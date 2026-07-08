import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { getRouter } from "./router"
import { Capacitor } from "@capacitor/core"
import { vibrateLight } from "./lib/haptic"
import "./styles.css"

// Global haptic feedback for all clickable elements
if (typeof document !== "undefined") {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    // Check if the clicked element or its parent is a button or link
    const clickable = target.closest('button, a, [role="button"], input[type="submit"], input[type="button"]');
    if (clickable) {
      vibrateLight();
    }
  }, { capture: true });
}

// Configure status bar on native platforms (Android/iOS)
if (Capacitor.isNativePlatform()) {
  import("@capacitor/status-bar").then(({ StatusBar, Style }) => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Light });
    StatusBar.setBackgroundColor({ color: "#FFE9D9" });
  });
}


const router = getRouter()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
