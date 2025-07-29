import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import {
  FiUser,
  FiLock,
  FiMail,
  FiGithub,
  FiCode,
  FiEye,
  FiEyeOff,
  FiLoader,
} from "solid-icons/fi";
import { auth } from "../../Backend/Database/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile,
} from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();

  // Expose auth globally for debugging (Login page specific)
  if (typeof window !== "undefined") {
    (window as any).loginAuth = auth;
    console.log("🔑 Login: Firebase auth exposed as window.loginAuth");
  }

  const [isLogin, setIsLogin] = createSignal(true);
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin()) {
        await signInWithEmailAndPassword(auth, email(), password());
        console.log("User logged in successfully");
      } else {
        // Create new user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email(),
          password()
        );

        // Update user profile with username
        if (username()) {
          await updateProfile(userCredential.user, {
            displayName: username(),
          });
        }
        console.log("User created successfully");
      }

      // Redirect to dashboard on success
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Authentication error:", error);
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("Google login successful");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("GitHub login successful");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("GitHub login error:", error);
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    return "something went wrong. Please try again.";
  };

  return (
    <div
      class={`min-h-[calc(100vh-64px)] flex items-center justify-center p-4 ${"bg-gray-50 text-gray-900"}`}>
      <div class={`w-full max-w-md p-8 rounded-2xl shadow-lg ${"bg-white"}`}>
        {/* Header */}
        <div class='text-center mb-8'>
          <div class='flex justify-center mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto'>
            <FiCode class='text-blue-600 text-2xl' />
          </div>
          <h1 class='text-3xl font-bold text-gray-900 mb-2'>
            Welcome to CodeRealm
          </h1>
          <p class='text-gray-600'>
            {isLogin()
              ? "Sign in to your account"
              : "Create your coding workspace"}
          </p>
        </div>

        {/* Error Message */}
        {error() && (
          <div class='mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm'>
            {error()}
          </div>
        )}

        {/* Toggle Buttons */}
        <div class='flex mb-6 bg-gray-100 rounded-lg p-1'>
          <button
            type='button'
            class={`flex-1 py-2 px-4 text-center transition-all duration-200 rounded-md font-medium ${
              isLogin()
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}>
            Sign In
          </button>
          <button
            type='button'
            class={`flex-1 py-2 px-4 text-center transition-all duration-200 rounded-md font-medium ${
              !isLogin()
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}>
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin() && (
            <div class='mb-4'>
              <label
                class='block text-sm font-medium mb-2 text-gray-700'
                for='username'>
                Username
              </label>
              <div class='relative'>
                <div class='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FiUser class='text-gray-400' />
                </div>
                <input
                  id='username'
                  type='text'
                  value={username()}
                  onInput={(e) => setUsername(e.target.value)}
                  placeholder='Enter your username'
                  class='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                  required={!isLogin()}
                />
              </div>
            </div>
          )}

          <div class='mb-4'>
            <label
              class='block text-sm font-medium mb-2 text-gray-700'
              for='email'>
              Email Address
            </label>
            <div class='relative'>
              <div class='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FiMail class='text-gray-400' />
              </div>
              <input
                id='email'
                type='email'
                value={email()}
                onInput={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
                class='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                required
              />
            </div>
          </div>

          <div class='mb-6'>
            <label
              class='block text-sm font-medium mb-2 text-gray-700'
              for='password'>
              Password
            </label>
            <div class='relative'>
              <div class='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FiLock class='text-gray-400' />
              </div>
              <input
                id='password'
                type={showPassword() ? "text" : "password"}
                value={password()}
                onInput={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                class='w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                required
              />
              <button
                type='button'
                class='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setShowPassword(!showPassword())}>
                {showPassword() ? (
                  <FiEyeOff class='text-gray-400 hover:text-gray-600' />
                ) : (
                  <FiEye class='text-gray-400 hover:text-gray-600' />
                )}
              </button>
            </div>
            {!isLogin() && (
              <p class='mt-1 text-xs text-gray-500'>
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={isLoading()}
            class={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isLoading()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md"
            } text-white`}>
            {isLoading() && <FiLoader class='animate-spin' />}
            {isLoading()
              ? isLogin()
                ? "Signing in..."
                : "Creating account..."
              : isLogin()
              ? "Sign In"
              : "Create Account"}
          </button>

          <div class='relative my-6'>
            <div class='absolute inset-0 flex items-center'>
              <div class='w-full border-t border-gray-200'></div>
            </div>
            <div class='relative flex justify-center text-sm'>
              <span class='px-4 bg-white text-gray-500'>Or continue with</span>
            </div>
          </div>

          <div class='grid grid-cols-2 gap-3'>
            <button
              type='button'
              disabled={isLoading()}
              onClick={handleGoogleLogin}
              class='flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
              <svg class='w-5 h-5' viewBox='0 0 24 24'>
                <path
                  fill='#4285F4'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='#34A853'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='#FBBC05'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='#EA4335'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              <span class='text-sm font-medium'>Google</span>
            </button>

            <button
              type='button'
              disabled={isLoading()}
              onClick={handleGithubLogin}
              class='flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
              <FiGithub class='text-lg' />
              <span class='text-sm font-medium'>GitHub</span>
            </button>
          </div>

          {isLogin() && (
            <div class='mt-6 text-center'>
              <A
                href='/reset-password'
                class='text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors'>
                Forgot your password?
              </A>
            </div>
          )}

          <div class='mt-6 text-center text-sm text-gray-600'>
            {isLogin()
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type='button'
              onClick={() => {
                setIsLogin(!isLogin());
                setError("");
              }}
              class='text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors'>
              {isLogin() ? "Sign up here" : "Sign in here"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
