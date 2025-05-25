import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { BrowserRouter, Routes, Route } from "react-router";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import VehiclesPage from "./pages/VehiclesPage.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <HeroUIProvider>
            <ToastProvider />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/vehiculos" element={<VehiclesPage />} />
                </Routes>
            </BrowserRouter>
        </HeroUIProvider>
    </StrictMode>
);
