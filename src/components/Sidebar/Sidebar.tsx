import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  InformationCircleIcon,
  ArchiveBoxIcon,
  CubeIcon,
  StarIcon,
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  MusicalNoteIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/solid";
import logo from "../../assets/logo.svg";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: HomeIcon, match: (p: string) => p === "/" },
  { to: "/archive", label: "Archive", icon: ArchiveBoxIcon, match: (p: string) => p.startsWith("/archive") },
  { to: "/music", label: "Music", icon: MusicalNoteIcon, match: (p: string) => p.startsWith("/music") },
  { to: "/appar", label: "Appar", icon: Squares2X2Icon, match: (p: string) => p.startsWith("/appar") },
  { to: "/store", label: "Store", icon: ShoppingBagIcon, match: (p: string) => p.startsWith("/store") },
  { to: "/about", label: "About", icon: InformationCircleIcon, match: (p: string) => p.startsWith("/about") },
  { to: "/contact", label: "Contact", icon: CubeIcon, match: (p: string) => p.startsWith("/contact") },
  { to: "/reviews", label: "Reviews", icon: StarIcon, match: (p: string) => p.startsWith("/reviews") },
];

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Close with Escape & lock body scroll when open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    document.addEventListener("keydown", onKey);
    if (isSidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const Item: React.FC<{ to: string; label: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; active: boolean }>
    = ({ to, label, Icon, active }) => {
      const base = "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ring-1";
      const activeCls = "bg-cyan-600/20 text-white ring-cyan-400/30";
      const idleCls = "text-cyan-300 hover:text-white hover:bg-cyan-500/10 ring-white/10";
      return (
        <Link to={to} className={`${base} ${active ? activeCls : idleCls}`}>
          <Icon className="h-6 w-6" />
          <span>{label}</span>
        </Link>
      );
    };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 right-4 z-[60] inline-flex items-center justify-center h-10 w-10 rounded-xl bg-cyan-600 text-white ring-1 ring-cyan-400/30 hover:bg-cyan-500 md:hidden"
        onClick={() => setIsSidebarOpen((s) => !s)}
        aria-label="Toggle sidebar"
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-64 p-4 transition-transform duration-300 md:relative md:left-0 md:right-auto md:translate-x-0 md:w-56 md:h-screen
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Primary sidebar"
      >
        {/* Glass/gradient shell */}
        <div className="h-full rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent shadow-2xl">
          <div className="flex h-full flex-col rounded-2xl bg-gradient-to-b from-slate-900 to-black p-4 ring-1 ring-white/10">
            {/* Logo */}
            <div className="mb-6 flex items-center justify-center">
              <img
                src={logo}
                alt="Logo"
                className="h-16 w-auto object-contain drop-shadow-[0_0_10px_#22d3ee] md:drop-shadow-[0_0_16px_#22d3ee]"
              />
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {NAV_ITEMS.map(({ to, label, icon: Icon, match }) => (
                  <li key={to}>
                    <Item to={to} label={label} Icon={Icon} active={match(pathname)} />
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="mt-4 text-center text-[11px] text-gray-400">
              <span className="inline-block rounded-full bg-white/5 px-2 py-1 ring-1 ring-white/10">
                © {new Date().getFullYear()} CodeCraftsMan
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;


