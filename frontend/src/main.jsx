import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-xxypqz17owod60e4.us.auth0.com"
      clientId="4cLoiC64O9YL3Uu3jlaFw1CLe1fpO9sp"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "http://localhost:3000/",
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
