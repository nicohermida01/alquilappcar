import { Link } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";

function Topbar() {
  return (
    <Navbar className="absolute top-0">
      <NavbarBrand>
        <Link to="/">
          <img src="/alquilappcar_logo.png" alt="Logo" style={{ width: 72 }} />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link to="/">Home</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/flota">Flota</Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/sucursales">Sucursales</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button color="primary">Reserve ahora</Button>
        </NavbarItem>
        <NavbarItem>
          <Button color="secondary">Register</Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default Topbar;
