import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Logo, Container, LogoutBtn } from "../index.js";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  return (
    <header className="py-3 shadow bg-gray-950 text-white">
      <Container>
        <nav className="flex items-center">
          <div className="mr-4">
            <NavLink>
              <Logo width="70px" />
            </NavLink>
          </div>
          <ul className="flex ml-auto items-center">
            {navItems.map((item) => {
              return item.active ? (
                <li key={item.name}>
                  <NavLink
                    to={item.slug}
                    className={({ isActive }) =>
                      `${
                        isActive ? "text-red-600" : ""
                      } inline-bock px-6 py-2 duration-200 hover:text-green-200 rounded-full`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ) : null;
            })}
            {!!authStatus && <LogoutBtn />}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
