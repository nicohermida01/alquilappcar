import { useAuth } from "../contexts/AuthContext";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Outlet, Link, useNavigate } from "react-router";

import { useEffect, useState } from "react";
import { Topbar } from "./Topbar";
import { Accordion, AccordionItem, Button, useDisclosure } from "@heroui/react";
import SidebarLink from "./SidebarLink";
import ListClients from "./ListClients";

export function DashboardLayout() {
    const { isAuthenticated, loadingAuth } = useAuth();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const navigate = useNavigate();

    useEffect(() => {
        if (loadingAuth) return;

        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate, loadingAuth]);

    if (loadingAuth) {
        return (
            <section className="min-h-screen w-full flex items-center justify-center bg-gray-100">
                <p className="text-lg">Cargando...</p>
            </section>
        );
    }

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
            <ListClients isOpen={isOpen} onOpenChange={onOpenChange} />
            <Topbar />
            <div className="flex h-[calc(100vh-70px)]">
                <Sidebar>
                    <Menu>
                        <Accordion variant="light" selectionMode="multiple">
                            <AccordionItem
                                key="1"
                                aria-label="Vehículos"
                                title="Vehículos"
                            >
                                <div className="flex flex-col px-4">
                                    <SidebarLink to="/vehiculos">
                                        Vehículos
                                    </SidebarLink>
                                    {/*
                                    <SidebarLink>Paquetes</SidebarLink>
                                    <SidebarLink>Marcas</SidebarLink>
                                    <SidebarLink>Categorías</SidebarLink>
                                    <SidebarLink>Cancelaciones</SidebarLink>
                                    */}
                                </div>
                            </AccordionItem>
                            <AccordionItem
                                key="2"
                                aria-label="Usuarios"
                                title="Usuarios"
                            >
                                <div className="flex flex-col px-4">
                                    {/*  <SidebarLink to="/empleados">
                                        Empleados
                                    </SidebarLink>*/}
                                    <SidebarLink to="/clientes">
                                        Clientes
                                    </SidebarLink>
                                    {/*<SidebarLink>Administradores</SidebarLink>*/}
                                </div>
                            </AccordionItem>
                            {/*
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
                            */}
                        </Accordion>
                        <div className="flex p-4">
                            <Button color="primary" onPress={onOpen} fullWidth>
                                Registrar alquiler
                            </Button>
                        </div>
                    </Menu>
                </Sidebar>
                <Outlet />
            </div>
        </div>
    );
}
