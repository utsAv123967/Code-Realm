import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { GsapPage } from "./Gsap.ts";
import LanguagesSection from "../components/Landing_Page/LanguagesSection.tsx";

export default function Home_new() {
  const navigate = useNavigate();

  onMount(() => {
    GsapPage();
  });

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <>
      <div
        id='cursor'
        class='h-[40px] w-[40px] rounded-full z-[100] fixed top-0 left-0 pointer-events-none'>
        <img
          src='src\assets\Home_new\chase.png'
          alt=''
          class='h-full w-full object-cover'
        />
      </div>

      {/* Hero Section */}
      <section class='w-full px-8 py-20 relative min-h-screen flex items-center'>
        <div class='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div class='space-y-8 z-10 relative'>
            <div class='space-y-6'>
              <h1 class='text-6xl font-bold text-gray-900 font-inter leading-tight'>
                Code Together,
                <span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600'>
                  {" "}
                  Build Better
                </span>
              </h1>
              <p class='text-xl text-gray-600 font-normal font-inter leading-relaxed max-w-lg'>
                Join a collaborative coding platform where developers unite to
                create, learn, and innovate together in real-time.
              </p>
            </div>

            <div class='flex flex-col sm:flex-row gap-4'>
              <button
                onClick={handleGetStarted}
                class='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'>
                Get Started Free
              </button>
              <button class='border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300'>
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div class='flex gap-8 pt-8'>
              <div class='text-center'>
                <div class='text-3xl font-bold text-gray-900'>10K+</div>
                <div class='text-sm text-gray-600'>Active Developers</div>
              </div>
              <div class='text-center'>
                <div class='text-3xl font-bold text-gray-900'>50K+</div>
                <div class='text-sm text-gray-600'>Projects Created</div>
              </div>
              <div class='text-center'>
                <div class='text-3xl font-bold text-gray-900'>99%</div>
                <div class='text-sm text-gray-600'>Uptime</div>
              </div>
            </div>
          </div>

          <div class='relative'>
            <div class='absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl opacity-20 blur-3xl'></div>
            <img
              id='pic1'
              src='src\assets\Home_new\hello-illustration.png'
              alt='Coding illustration'
              class='relative z-10 w-full max-w-lg mx-auto drop-shadow-2xl'
            />
          </div>
        </div>

        {/* Background Text */}
        <div class='absolute inset-0 flex items-center justify-center pt-20 pointer-events-none overflow-hidden'>
          <h1
            id='split'
            class='text-blue-100 text-[120px] lg:text-[188px] font-bold font-inter opacity-30 flex gap-2'>
            {"CODE-REALM".split("").map((char, i) => (
              <span class='inline-block' id={`char-${i}`}>
                {char}
              </span>
            ))}
          </h1>
        </div>
      </section>

      {/* Features Section */}
      <section class='w-full px-8 py-20 bg-gray-50'>
        <div class='max-w-7xl mx-auto'>
          <div class='text-center space-y-6 mb-16'>
            <h2 class='text-4xl font-bold text-gray-800 font-inter'>
              Why Choose Code Realm?
            </h2>
            <p class='text-xl text-gray-600 max-w-3xl mx-auto'>
              Experience the future of collaborative coding with our powerful
              features
            </p>
          </div>

          <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Feature 1 */}
            <div class='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
              <div class='w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6'>
                <img
                  src='src\assets\Home_new\003-enterprise.png'
                  alt='Teams'
                  class='w-8 h-8'
                />
              </div>
              <h3 class='text-xl font-bold text-gray-800 mb-4'>
                Real-time Collaboration
              </h3>
              <p class='text-gray-600 leading-relaxed'>
                Work together with your team in real-time. See changes
                instantly, share ideas, and build together seamlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div class='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
              <div class='w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6'>
                <img
                  src='src\assets\Home_new\004-diagram.png'
                  alt='Projects'
                  class='w-8 h-8'
                />
              </div>
              <h3 class='text-xl font-bold text-gray-800 mb-4'>
                Project Management
              </h3>
              <p class='text-gray-600 leading-relaxed'>
                Organize your projects efficiently with built-in tools for
                version control, file management, and progress tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div class='bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
              <div class='w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6'>
                <img
                  src='src\assets\Home_new\team.png'
                  alt='Community'
                  class='w-8 h-8'
                />
              </div>
              <h3 class='text-xl font-bold text-gray-800 mb-4'>
                AI-Powered Assistance
              </h3>
              <p class='text-gray-600 leading-relaxed'>
                Get intelligent code suggestions, debugging help, and learn from
                AI that understands your coding context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Languages Section */}
      <LanguagesSection />

      {/* Call to Action Section */}
      <section class='w-full px-8 py-20 bg-gradient-to-br from-blue-500 to-purple-600'>
        <div class='max-w-4xl mx-auto text-center'>
          <h2 class='text-5xl font-bold text-white mb-6 font-inter'>
            Ready to Transform Your Coding Experience?
          </h2>
          <p class='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
            Join thousands of developers who are already building amazing
            projects together on Code Realm.
          </p>
          <div class='flex flex-col sm:flex-row gap-4 justify-center'>
            <button
              onClick={handleGetStarted}
              class='bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg'>
              Start Coding Now
            </button>
            <button class='border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300'>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class='w-full px-8 py-16 bg-gray-900 text-white'>
        <div class='max-w-6xl mx-auto'>
          <div class='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div class='space-y-4'>
              <h3 class='text-2xl font-bold'>Code Realm</h3>
              <p class='text-gray-400'>
                The collaborative coding platform that brings developers
                together to create amazing projects.
              </p>
            </div>
            <div class='space-y-4'>
              <h4 class='text-lg font-semibold'>Product</h4>
              <ul class='space-y-2 text-gray-400'>
                <li>
                  <a href='#' class='hover:text-white transition-colors'>
                    Features
                  </a>
                </li>
                <li>
                  <a href='#' class='hover:text-white transition-colors'>
                    Pricing
                  </a>
                </li>
                <li>
                  <a href='#' class='hover:text-white transition-colors'>
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div class='space-y-4'>
              <h4 class='text-lg font-semibold'>Company</h4>
              <ul class='space-y-2 text-gray-400'>
                <li>
                  <a href='#' class='hover:text-white transition-colors'>
                    About
                  </a>
                </li>
                <li>
                  <a href='#' class='hover:text-white transition-colors'>
                    Blog
                  </a>
                </li>
                <li>
                  <a href='#' class='hover:text-white transition-colors'>
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div class='space-y-4'>
              <h4 class='text-lg font-semibold'>Support</h4>
              <ul class='space-y-2 text-gray-400'>
                <li>
                  <a href='#' class='hover:text-white transition-colors'>
                    Help Center
                  </a>
                </li>
                <li>
                  <a href='#' class='hover:text-white transition-colors'>
                    Contact
                  </a>
                </li>
                <li>
                  <a href='#' class='hover:text-white transition-colors'>
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class='border-t border-gray-800 mt-12 pt-8 text-center text-gray-400'>
            <p>&copy; 2025 Code Realm. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
