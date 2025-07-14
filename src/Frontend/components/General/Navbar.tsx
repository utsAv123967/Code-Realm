import { A } from "@solidjs/router";
import { FiCode, FiUser, FiLogIn } from "solid-icons/fi";

const Navbar = () => {
  return (
    <nav class='px-4 py-3 bg-neutral-50 text-gray-900 border-b border-gray-200'>
      <div class='container mx-auto flex justify-between items-center'>
        {/* Logo and Brand */}
        <a href='/' class='flex items-center gap-2 font-bold text-lg'>
          <FiCode />
          <span>CodeRealm</span>
        </a>

        {/* Navigation Links */}
        <div class='flex items-center gap-6'>
          <a href='/features' class='hover:text-blue-500'>
            Features
          </a>
          <a href='/about' class='hover:text-blue-500'>
            About
          </a>
          <a href='/docs' class='hover:text-blue-500'>
            Documentation
          </a>

          {/* Auth Buttons */}
          <a
            href='/login'
            class='flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors'>
            <FiLogIn />
            <span>Login</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
