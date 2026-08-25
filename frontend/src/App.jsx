import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import CitizenMode from "./pages/Citizen/CitizenMode";
import ProviderMode from "./pages/Provider/ProviderMode";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/citizen" element={<CitizenMode />} />

        <Route path="/provider" element={<ProviderMode />} />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;