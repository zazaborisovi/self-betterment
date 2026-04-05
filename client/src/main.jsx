import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import ThemeProvider from './contexts/themeContext'

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://8b27049bb9fa8c9219cbd32b0446af88@o4511157497954304.ingest.us.sentry.io/4511168194543616",
  sendDefaultPii: true
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);