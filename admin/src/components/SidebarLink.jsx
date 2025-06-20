import { Button } from "@heroui/react";
import { useNavigate } from "react-router";

export default function SidebarLink({ to, setSelected, selected, children }) {
    const navigate = useNavigate();

    return (
        <Button
            variant={selected ? "flat" : "light"}
            onPress={() =>
                selected
                    ? (setSelected(""), navigate("/"))
                    : (setSelected(to.split("/")[1]), navigate(to))
            }
            radius="full"
            color={selected ? "primary" : "default"}
        >
            {children}
        </Button>
    );
}
