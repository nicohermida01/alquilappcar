import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter, Routes, Route } from "react-router";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import CreateVehiclePage from "./pages/CreateVehiclePage.jsx";
import VehiclesPage from "./pages/VehiclesPage.jsx";
import ListVehiclesPage from "./pages/ListVehiclesPage.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <HeroUIProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/vehiculos" element={<VehiclesPage />} />
                    <Route
                        path="/listar-vehiculos"
                        element={<ListVehiclesPage />}
                    />
                    <Route
                        path="/crear-vehiculo"
                        element={<CreateVehiclePage />}
                    />
                </Routes>
            </BrowserRouter>
        </HeroUIProvider>
    </StrictMode>
);
