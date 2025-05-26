import { Link } from "react-router";
import { useState } from "react";

export default function SidebarLink({ to, children }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            to={to}
            className={isHovered ? "bg-gray-100 p-2" : "p-2"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </Link>
    );
}
