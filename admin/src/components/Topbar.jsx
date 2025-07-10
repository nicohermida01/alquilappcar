import { Link } from "react-router";
import { UserMenu } from "./UserMenu";
import { useAuth } from '../contexts/AuthContext'

export function Topbar() {
    const { user, logout } = useAuth()
    return (
        <header className="flex items-center justify-between py-2 px-10 bg-gray-200 text-white border-b-1 border-gray-300">
            <Link to="/">
                <img
                    src="/alquilappcar_logo.png"
                    alt="AlquilAppCar Logo"
                    width="60"
                    height="60"
                />
            </Link>
            <UserMenu />
        </header>
    );
}
