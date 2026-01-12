import { FiCode, FiLogIn, FiLogOut } from "solid-icons/fi";
import { createSignal, onCleanup, onMount } from "solid-js";
import { getCurrentUser } from "../../../context/Userdetails";
import { signOut } from "firebase/auth";
import { auth } from "../../../Backend/Database/firebase";

const Navbar = () => {
  const [currentPath, setCurrentPath] = createSignal("/");
  const [menuOpen, setMenuOpen] = createSignal(false);

  const updatePath = () => setCurrentPath(window.location.pathname);
  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen(!menuOpen());

  onMount(() => {
    updatePath();
    window.addEventListener("popstate", updatePath);
  });

  onCleanup(() => {
    window.removeEventListener("popstate", updatePath);
  });

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      closeMenu();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (href: string) => {
    const pathname = currentPath();
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const menuLinkClass = (href: string) =>
    [
      "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
      isActive(href)
        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    ].join(" ");

  const handleNavClick = (href: string) => {
    setCurrentPath(href);
    closeMenu();
  };

  return (
    <>
      <nav class='sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80'>
        <div class='mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6'>
          <button
            aria-label='Toggle navigation'
            onClick={toggleMenu}
            class='relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:bg-slate-50'>
            <span
              class={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-slate-900 transition-transform duration-300 ${
                menuOpen() ? "translate-y-0 rotate-45" : "-translate-y-2.5"
              }`}></span>
            <span
              class={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900 transition-opacity duration-300 ${
                menuOpen() ? "opacity-0" : "opacity-100"
              }`}></span>
            <span
              class={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-slate-900 transition-transform duration-300 ${
                menuOpen() ? "translate-y-0 -rotate-45" : "translate-y-2"
              }`}></span>
          </button>

          <div class='flex flex-1 items-center justify-start pl-2'>
            <p class='text-[0.58rem] font-semibold uppercase tracking-[0.5em] text-slate-400/70 sm:text-[0.68rem] md:text-xs'>
              Build • Collaborate • Ship
            </p>
          </div>

          <a
            href='/'
            class='group ml-auto inline-flex items-center gap-3 text-right'>
            <span class='relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.65)] transition-transform duration-300 group-hover:scale-105'>
              <FiCode class='text-[17px]' />
              <div class='absolute inset-x-3 bottom-1 h-[2px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-fuchsia-500 opacity-70'></div>
            </span>
            <span class='text-2xl font-black tracking-tight text-transparent transition-colors duration-300 bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500 bg-clip-text group-hover:from-blue-500 group-hover:via-indigo-400 group-hover:to-fuchsia-400'>
              CodeRealm
            </span>
          </a>
        </div>
      </nav>

      <div
        class={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen() ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
      />

      <aside
        class={`fixed inset-y-0 left-0 z-50 w-64 max-w-[75vw] transform border-r border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ${
          menuOpen() ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div class='flex h-full flex-col gap-8 px-6 py-8'>
          <div class='space-y-4'>
            <div>
              <p class='text-xs font-semibold uppercase tracking-[0.5em] text-slate-400'>Navigate</p>
            </div>
            <nav class='space-y-2'>
              <a
                href='/'
                class={menuLinkClass("/")}
                onClick={() => handleNavClick("/")}>Home</a>
              <a
                href='/dashboard'
                class={menuLinkClass("/dashboard")}
                onClick={() => handleNavClick("/dashboard")}>Dashboard</a>
              <a
                href='/about'
                class={menuLinkClass("/about")}
                onClick={() => handleNavClick("/about")}>About us</a>
            </nav>
          </div>

          <div class='mt-auto space-y-3 border-t border-slate-200 pt-6'>
            {getCurrentUser() ? (
              <button
                onClick={handleSignOut}
                class='flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:bg-slate-800'>
                <FiLogOut class='text-base' />
                <span>Sign out</span>
              </button>
            ) : (
              <a
                href='/login'
                onClick={closeMenu}
                class='flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500'>
                <FiLogIn class='text-base' />
                <span>Login</span>
              </a>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
