import { createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { FiUser, FiLock, FiMail, FiGithub, FiCode } from "solid-icons/fi";
import { useTheme } from "../context/Theme_context";

const Login = () => {
  const [darkMode, setDarkMode] = useTheme();
  const [isLogin, setIsLogin] = createSignal(true);
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [username, setUsername] = createSignal("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // Handle login/signup logic here
    console.log(isLogin() ? "Logging in..." : "Signing up...", {
      email: email(),
      password: password(),
      ...(isLogin() ? {} : { username: username() }),
    });
  };

  return (
    <div
      class={`min-h-[calc(100vh-64px)] flex items-center justify-center p-4 ${
        darkMode() ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}>
      <div
        class={`w-full max-w-md p-8 rounded-2xl shadow-lg ${
          darkMode() ? "bg-gray-800" : "bg-white"
        }`}>
        {/* Header */}
        <div class='text-center mb-8'>
          <div class='flex justify-center mb-2'>
            <FiCode />
          </div>
          <h1 class='text-2xl font-bold'>Welcome to CodeRealm</h1>
          <p class='text-sm opacity-75 mt-2'>
            Collaborative coding made simple
          </p>
        </div>

        {/* Toggle Buttons */}
        <div class='flex mb-6'>
          <button
            class={`flex-1 py-2 text-center transition-colors ${
              isLogin()
                ? `bg-blue-500 text-white`
                : `${darkMode() ? "bg-gray-700" : "bg-gray-200"}`
            }`}
            onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button
            class={`flex-1 py-2 text-center transition-colors ${
              !isLogin()
                ? `bg-blue-500 text-white`
                : `${darkMode() ? "bg-gray-700" : "bg-gray-200"}`
            }`}
            onClick={() => setIsLogin(false)}>
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin() && (
            <div class='mb-4'>
              <label class='block text-sm font-medium mb-1' for='username'>
                Username
              </label>
              <div
                class={`flex items-center px-3 py-2 rounded-lg ${
                  darkMode() ? "bg-gray-700" : "bg-gray-100"
                }`}>
                <span class='mr-2 text-gray-400'>
                  <FiUser />
                </span>

                <input
                  id='username'
                  type='text'
                  value={username()}
                  onInput={(e) => setUsername(e.target.value)}
                  placeholder='johndoe'
                  class={`w-full bg-transparent focus:outline-none ${
                    darkMode() ? "text-white" : "text-gray-900"
                  }`}
                  required={!isLogin()}
                />
              </div>
            </div>
          )}

          <div class='mb-4'>
            <label class='block text-sm font-medium mb-1' for='email'>
              Email
            </label>
            <div
              class={`flex items-center px-3 py-2 rounded-lg ${
                darkMode() ? "bg-gray-700" : "bg-gray-100"
              }`}>
              <FiMail />
              <input
                id='email'
                type='email'
                value={email()}
                onInput={(e) => setEmail(e.target.value)}
                placeholder='you@example.com'
                class={`w-full bg-transparent focus:outline-none ${
                  darkMode() ? "text-white" : "text-gray-900"
                }`}
                required
              />
            </div>
          </div>

          <div class='mb-6'>
            <label class='block text-sm font-medium mb-1' for='password'>
              Password
            </label>
            <div
              class={`flex items-center px-3 py-2 rounded-lg ${
                darkMode() ? "bg-gray-700" : "bg-gray-100"
              }`}>
              <FiLock />
              <input
                id='password'
                type='password'
                value={password()}
                onInput={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                class={`w-full bg-transparent focus:outline-none ${
                  darkMode() ? "text-white" : "text-gray-900"
                }`}
                required
              />
            </div>
          </div>

          <button
            type='submit'
            class='w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg mb-4'>
            {isLogin() ? "Login" : "Create Account"}
          </button>

          <div class='relative my-6'>
            <div class={`absolute inset-0 flex items-center`}>
              <div
                class={`w-full border-t ${
                  darkMode() ? "border-gray-700" : "border-gray-200"
                }`}></div>
            </div>
            <div class='relative flex justify-center text-xs uppercase'>
              <span class={`px-2 ${darkMode() ? "bg-gray-800" : "bg-white"}`}>
                Or continue with
              </span>
            </div>
          </div>

          <button
            type='button'
            class={`w-full py-2 px-4 rounded-lg flex items-center justify-center ${
              darkMode()
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}>
            <FiGithub />
            <span>GitHub</span>
          </button>

          {isLogin() && (
            <p class='mt-4 text-center text-sm'>
              <A href='/reset-password' class='text-blue-400 hover:underline'>
                Forgot your password?
              </A>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
