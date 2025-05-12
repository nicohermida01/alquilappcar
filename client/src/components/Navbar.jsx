import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar absolute top-0 left-0 right-0 shadow-md p-4 grid grid-cols-3 items-center">
      <Link to="/">
        <img className="h-12 object-scale-down" src="/alquilappcar_logo.png" />
      </Link>
      <div className="flex justify-center">
        <ul className="flex space-x-4">
          <li>
            <a href="#about">Acerca de</a>
          </li>
          <li>
            <a href="#services">Servicios</a>
          </li>
          <li>
            <a href="#contact">Contacto</a>
          </li>
        </ul>
      </div>
      <div className="flex justify-end">
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
