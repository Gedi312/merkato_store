  import { useState, useEffect, useRef } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { getStoredUser } from "../utils/authService";
import Logo from "../assets/logo.png";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: <FaShoppingCart />, href: "/ShopingCart" },
  { label: "Admin Panel", href: "/admin", adminOnly: true },
];

function ChevronIcon({ className = "" }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 3.5L5.5 7L9 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropdownMenu({ items, open }) {
  return (
    <div
      className={`absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 min-w-40 bg-[#faf9f7] border border-stone-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-1.5 z-50 transition-all duration-200 origin-top
        ${open ? "opacity-100 scale-100 pointer-events-auto translate-y-0" : "opacity-0 scale-95 pointer-events-none -translate-y-1"}`}
      aria-hidden={!open}
    >
      {items.map((item) => (
        <a
          key={item}
          href="#"
          className="block px-3.5 py-2 text-[13px] text-stone-500 rounded-lg hover:text-stone-900 hover:bg-amber-50 transition-colors duration-150 tracking-wide"
        >
          {item}
        </a>
      ))}
    </div>
  );
}

function NavItem({ link }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!link.children) {
    return (
      <Link
        to={link.href}
        className="px-3.5 py-2 text-[13.5px] font-normal tracking-wide text-stone-500 hover:text-stone-900 hover:bg-amber-50 rounded-lg transition-all duration-150"
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-normal tracking-wide text-stone-500 hover:text-stone-900 hover:bg-amber-50 rounded-lg transition-all duration-150 outline-none"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {link.label}
        <ChevronIcon
          className={`opacity-50 transition-transform duration-200 ${open ? "rotate-180 opacity-90" : ""}`}
        />
      </button>
      <DropdownMenu items={link.children} open={open} />
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setUser(getStoredUser());

    const onStorage = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-changed", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-changed", onStorage);
    };
  }, []);

  return (
    <>
      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-17.5 bg-[#faf9f7] border-b border-stone-200/80 transition-all duration-300
          ${scrolled ? "shadow-[0_1px_40px_rgba(0,0,0,0.06)] bg-[#faf9f7]/95 backdrop-blur-md" : ""}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2.5 mr-auto"
            aria-label="Go to homepage"
          >
            <img
              src={Logo}
              alt=""
              className="h-9 w-auto object-contain"
              aria-hidden="true"
            />
            <span
              className="text-[22px] font-semibold tracking-[0.06em] text-stone-900 leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Merkato<span className="text-amber-600">Store</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-1 mx-8"
            aria-label="Main navigation"
          >
            {NAV_LINKS.filter((link) => !link.adminOnly || user?.role === 'admin').map((link) => (
              <NavItem key={link.label} link={link} />
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Profile button always visible (before login/register) */}
            <button
              title={user?.name || "Profile"}
              onClick={() => navigate("/profile")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-900 text-white text-sm font-medium"
            >
              {user && user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </button>

            {/* Auth actions (show when not logged in) */}
            {!user ? (
              <>
                <div className="w-px h-5 bg-stone-200 mx-1" aria-hidden="true" />
                <Link to="/login" className="px-4 py-2 text-[13px] tracking-widest text-stone-500 border border-transparent rounded-lg hover:text-stone-900 hover:border-stone-200 hover:bg-amber-50 transition-all duration-150">
                  Log in
                </Link>
                <div className="w-px h-5 bg-stone-200 mx-1" aria-hidden="true" />
                <Link to="/signup" className="px-5 py-2 text-[11.5px] font-medium tracking-[0.08em] uppercase text-white bg-stone-900 border border-stone-900 rounded-lg hover:bg-amber-700 hover:border-amber-700 active:scale-[0.97] transition-all duration-150">
                  Register
                </Link>
              </>
            ) : null}
          </div>

          {/* Hamburger */}
          <button
            className="relative lg:hidden w-10 h-10"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className={`absolute left-1/2 top-1/2 w-5 h-0.5 bg-stone-600 rounded transition-all duration-300${menuOpen
                ? "-translate-x-1/2 -translate-y-1/2 rotate-45"
                : "-translate-x-1/2 -translate-y-1.5"
                }`}
            />

            <span
              className={`absolute left-1/2 top-1/2 w-5 h-0.5 bg-stone-600 rounded transition-all duration-300${menuOpen ? "-translate-x-1/2 opacity-0" : "-translate-x-1/2"
                }`}
            />

            <span
              className={`absolute left-1/2 top-1/2 w-5 h-0.5 bg-stone-600 rounded transition-all duration-300${menuOpen
                ? "-translate-x-1/2 -translate-y-1/2 -rotate-45"
                : "-translate-x-1/2 translate-y-1.5"
                }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <nav
        id="mobile-menu"
        className={`lg:hidden fixed top-17.5 left-0 right-0 bottom-0 z-40 bg-[#faf9f7] overflow-y-auto transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="pt-2 pb-10">
          {NAV_LINKS.filter((link) => !link.adminOnly || user?.role === 'admin').map((link) => (
            <div key={link.label}>
              {link.children ? (
                <>
                  <button
                    className="w-full flex items-center justify-between px-6 py-3.5 text-[16px] text-stone-900 hover:bg-amber-50 transition-colors duration-150 text-left"
                    aria-expanded={mobileExpanded === link.label}
                    onClick={() =>
                      setMobileExpanded((v) =>
                        v === link.label ? null : link.label,
                      )
                    }
                  >
                    {link.label}
                    <ChevronIcon
                      className={`opacity-40 transition-transform duration-200 ${mobileExpanded === link.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden bg-stone-50/70 transition-all duration-250 ease-in-out
                      ${mobileExpanded === link.label ? "max-h-48" : "max-h-0"}`}
                  >
                    {link.children.map((child) => (
                      <a
                        key={child}
                        href="#"
                        className="block px-6 pl-10 py-2.5 text-[14px] text-stone-500 hover:text-stone-900 transition-colors duration-150"
                      >
                        {child}
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={link.href}
                  className="flex items-center px-6 py-3.5 text-[16px] text-stone-900 hover:bg-amber-50 transition-colors duration-150"
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}

          {/* Divider */}
          <div className="h-px bg-stone-200 mx-6 my-4" />

          {/* Mobile Auth */}
          <div className="px-6 flex flex-col gap-3">
            {/* Profile row shown above auth actions */}
            <div className="flex items-center gap-3 px-2">
              <button
                title={user?.name || "Profile"}
                onClick={() => navigate("/profile")}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-900 text-white text-sm font-medium"
              >
                {user && user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </button>
              {user ? (
                <div className="flex-1">
                  <div className="text-sm font-medium text-stone-900">{user.name || "User"}</div>
                  <div className="text-xs text-stone-500">{user.email || ""}</div>
                </div>
              ) : null}
            </div>

            {!user ? (
              <>
                <Link to="/login" className="w-full inline-flex items-center justify-center py-3.5 text-[14px] tracking-wide text-stone-600 border border-stone-200 rounded-xl hover:bg-amber-50 hover:border-amber-200 transition-all duration-150">
                  Log in
                </Link>
                <Link to="/signup" className="w-full inline-flex items-center justify-center py-3.5 text-[12px] font-medium tracking-[0.08em] uppercase text-white bg-stone-900 border border-stone-900 rounded-xl hover:bg-amber-700 hover:border-amber-700 active:scale-[0.98] transition-all duration-150">
                  Create account
                </Link>
              </>
            ) : (
              <div className="px-2">
                <button onClick={() => navigate("/profile")} className="w-full py-3.5 text-[14px] tracking-wide text-stone-600 border border-stone-200 rounded-xl hover:bg-amber-50 hover:border-amber-200 transition-all duration-150">Manage profile</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
