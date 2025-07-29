import { FiCode, FiLogIn, FiLogOut } from "solid-icons/fi";
import { getCurrentUser } from "../../../context/Userdetails";
import { signOut } from "firebase/auth";
import { auth } from "../../../Backend/Database/firebase";

const Navbar = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
          {getCurrentUser() ? (
            <button
              onClick={handleSignOut}
              class='flex items-center gap-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors'>
              <FiLogOut />
              <span>Sign Out</span>
            </button>
          ) : (
            <a
              href='/login'
              class='flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors'>
              <FiLogIn />
              <span>Login</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
