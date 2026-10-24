import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { CallProvider } from "./context/CallContext";
import { SafetyProvider } from "./context/SafetyContext";
import AppRoutes from "./routes/AppRoutes";
import "./styles/globals.css";
import "./styles/companion.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <CallProvider>
            <SafetyProvider>
              <AppRoutes />
            </SafetyProvider>
          </CallProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
