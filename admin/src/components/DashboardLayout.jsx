import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Outlet, Link } from "react-router";

import { useState } from "react";
import { Topbar } from "./Topbar";
import { Accordion, AccordionItem } from "@heroui/react";
import SidebarLink from "./SidebarLink";

export function DashboardLayout() {
    const [selected, setSelected] = useState();

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
                                    <SidebarLink>Marcas</SidebarLink>
                                    <SidebarLink>Categorías</SidebarLink>
                                </div>
                            </AccordionItem>
                            <AccordionItem
                                key="2"
                                aria-label="Empleados"
                                title="Empleados"
                            >
                                <div className="flex flex-col px-4">
                                    <SidebarLink to="/empleados">
                                        Empleados
                                    </SidebarLink>
                                    <SidebarLink>Sucursales</SidebarLink>
                                    <SidebarLink>aaaaaa</SidebarLink>
                                </div>
                            </AccordionItem>
                            <AccordionItem
                                key="3"
                                aria-label="Accordion 3"
                                title="Accordion 3"
                            >
                                gola
                            </AccordionItem>
                        </Accordion>
                    </Menu>
                </Sidebar>
                <Outlet />
            </div>
        </div>
    );
}
