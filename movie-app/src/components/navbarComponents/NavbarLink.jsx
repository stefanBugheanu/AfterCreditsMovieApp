import { NavLink } from "react-router-dom";
export default function NavbarLink({ to, children }) {
  return (
    <NavLink to={to} className="text-2xl text-gray-300 hover:text-white">
      {children}
    </NavLink>
  );
}
