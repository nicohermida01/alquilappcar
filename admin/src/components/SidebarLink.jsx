import { Link } from "react-router";
import { useState } from "react";
import { Button } from "@heroui/react";

export default function SidebarLink({ to, children }) {
    return (
        <Button variant="light" radius="full">
            <Link to={to}>{children}</Link>
        </Button>
    );
}
