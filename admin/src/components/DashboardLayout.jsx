import { useAuth } from "../contexts/AuthContext";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Outlet, Link } from "react-router";

import { useState } from "react";
import { Topbar } from "./Topbar";
import { Accordion, AccordionItem } from "@heroui/react";
import SidebarLink from "./SidebarLink";

export function DashboardLayout() {
    const { isAuthenticated } = useAuth();
    const [selected, setSelected] = useState();

    if (!isAuthenticated)
        return (
            <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100">
                <p className="text-center text-lg">
                    Parece que no tienes una sesión iniciada. <br />{" "}
                    <Link to="/login" className="underline text-secondary">
                        Primero inicia sesión
                    </Link>
                    !
                </p>
            </section>
        );

    return (
        <div>
            <Topbar />
            <div className="flex h-[calc(100vh-70px)]">
                <Sidebar>
                    <Menu>
                        <Accordion variant="splitted" selectionMode="multiple">
                            <AccordionItem
                                key="1"
                                aria-label="Vehículos"
                                title="Vehículos"
                            >
                                <div className="flex flex-col px-4">
                                    <SidebarLink to="/vehiculos">
                                        Vehículos
                                    </SidebarLink>
                                    <SidebarLink to="/marcas">
                                        Marcas
                                    </SidebarLink>
                                    <SidebarLink to="/categorias">
                                        Categorías
                                    </SidebarLink>
                                    <SidebarLink to="/cancelaciones">
                                        Cancelaciones
                                    </SidebarLink>
                                </div>
                            </AccordionItem>
                            <AccordionItem
                                key="2"
                                aria-label="Usuarios"
                                title="Usuarios"
                            >
                                <div className="flex flex-col px-4">
                                    <SidebarLink to="/empleados">
                                        Empleados
                                    </SidebarLink>
                                    <SidebarLink to="/clientes">
                                        Clientes
                                    </SidebarLink>
                                    <SidebarLink to="/administradores">
                                        Administradores
                                    </SidebarLink>
                                </div>
                            </AccordionItem>
                            <AccordionItem
                                key="3"
                                aria-label="Sucursales"
                                title="Sucursales"
                            >
                                <div className="flex flex-col px-4">
                                    <SidebarLink>Sucursales</SidebarLink>
                                    <SidebarLink>Localidades</SidebarLink>
                                </div>
                            </AccordionItem>
                        </Accordion>
                    </Menu>
                </Sidebar>
                <Outlet />
            </div>
        </div>
    );
}
