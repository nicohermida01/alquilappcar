import { Link } from "react-router";
import { useState } from "react";
import { Button } from "@heroui/react";

export default function SidebarLink({ to, children }) {
    return (
        <Button variant="light" radius="full">
            <Link className="w-[100%] " to={to}>
                {children}
            </Link>
        </Button>
    );
}
