import { onMount } from "solid-js";

import { GsapPage, GsapForCards } from "./Gsap.ts";
import LanguagesSection from "../components/Landing_Page/LanguagesSection.jsx";
export default function Home_new() {
  let parentRef: HTMLDivElement | undefined;

  onMount(() => {
    GsapPage();
  });
  return (
    <>
      <div
        id='cursor'
        class='h-[40px] w-[40px] rounded-full z-[100] fixed top-0 left-0 pointer-events-none '>
        <img
          src='src\assets\Home_new\chase.png'
          alt=''
          class='h-full w-full object-cover'
        />
      </div>

      <section class='w-full px-8 py-20 relative'>
        <div class='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div class='space-y-6 z-10 relative'>
            <h1
              // ref={boxRef}
              class='text-5xl font-semibold text-neutral-900 font-inter leading-tight'>
              Welcome to a new era of online code editors
            </h1>
            <p class='text-lg text-neutral-700 font-normal font-inter leading-relaxed'>
              Join with colleagues and friend and make something creative.
            </p>
            <div class='w-80 h-1 bg-rose-500'></div>
          </div>
          <img
            id='pic1'
            src='src\assets\Home_new\hello-illustration.png'
            alt=''
          />
        </div>

        {/* Background Text */}
        <div class='absolute inset-0 flex items-center justify-center pt-69 pointer-events-none'>
          <h1
            id='split'
            class='text-orange-500 text-[188px] font-bold font-inter opacity-20 flex gap-2'>
            {"CODE-REALM".split("").map((char, i) => (
              <span class='inline-block' id={`char-${i}`}>
                {char}
              </span>
            ))}
          </h1>
        </div>
      </section>
      {/* Call to Action Section */}
      <section class='w-full px-8 py-16'>
        <div class='max-w-7xl mx-auto'>
          <div class='bg-rose-100 rounded-2xl p-8 flex flex-col lg:flex-row items-center justify-between gap-8'>
            <div class='text-center lg:text-left'>
              <h2 class='text-4xl font-semibold text-orange-400 font-inter mb-4'>
                Become a part of this journey! Join Us
              </h2>
            </div>
            <button class='bg-orange-500 text-white px-8 py-4 rounded-md font-semibold font-montserrat hover:bg-orange-600 transition-colors'>
              Register/Login
            </button>
          </div>
        </div>
      </section>
      {/* Supported Languages Section */}
      <div>
        <LanguagesSection />
      </div>
      {/* How It Works Section */}
      <section class='w-full px-8 py-20 bg-neutral-50'>
        <div class='max-w-6xl mx-auto'>
          <div class='bg-indigo-50 rounded-3xl p-12'>
            {/* Section Header */}
            <div class='text-center space-y-4 mb-16'>
              <h2 class='text-4xl font-bold text-gray-800 font-montserrat tracking-wider'>
                How It Works
              </h2>
              <p class='text-lg text-neutral-700 font-normal font-inter leading-relaxed tracking-wide max-w-3xl mx-auto'>
                You can join friend and colleagues and work together on a
                project, take part in coding contests and have guidance from AI
                agents
              </p>
            </div>

            {/* Steps Grid */}
            <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {/* Step 1 */}
              <div class='text-center space-y-4 col-start-1 row-start-1 row-span-2'>
                <img
                  class='w-40 h-40 bg-white rounded-2xl shadow-lg border-2 border-gray-200 flex items-center justify-center mx-auto'
                  src='src\assets\Home_new\login.png'
                />
                <h3 class='text-lg font-semibold text-neutral-900 font-inter tracking-wide'>
                  Create a Account
                </h3>
              </div>

              {/* Step 2 */}
              <div class='text-center space-y-4 col-start-2 row-start-1 row-span-2'>
                <div class='w-40 h-40 bg-white rounded-2xl shadow-lg border-2 border-gray-200 flex items-center justify-center mx-auto'>
                  <img
                    class='w-22 h-22 rounded-lg'
                    src='src\assets\Home_new\003-enterprise.png'
                  />
                </div>
                <h3 class='text-lg font-bold text-black font-inter tracking-wide'>
                  Make teams and invite others
                </h3>
              </div>

              {/* Step 3 */}
              <div class='text-center space-y-4 col-start-3 row-start-1 row-span-2'>
                <div class='w-40 h-40 bg-white rounded-2xl shadow-lg border-2 border-gray-200 flex items-center justify-center mx-auto'>
                  <img
                    class='w-22 h-22 rounded-lg'
                    src='src\assets\Home_new\team.png'
                  />
                </div>
                <h3 class='text-lg font-bold text-black font-inter tracking-wide'>
                  Save your progress and work later
                </h3>
              </div>

              {/* Step 4 - Centered */}

              {/* Step 5 */}
              <div class='text-center space-y-4 col-start-4 row-start-1 row-span-2'>
                <div class='w-40 h-40 bg-white rounded-2xl shadow-lg border-2 border-gray-200 flex items-center justify-center mx-auto'>
                  <img
                    class='w-22 h-22 rounded-lg'
                    src='src\assets\Home_new\004-diagram.png'
                  />
                </div>
                <h3 class='text-lg font-bold text-black font-inter tracking-wide'>
                  Keep updating and working
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <footer class='w-full px-8 py-16 bg-neutral-50 border-t-4 border-orange-500'>
        <div class='max-w-5xl mx-auto'>
          <div class='bg-red-100 rounded-3xl p-12 text-center space-y-8'>
            <div class='space-y-2'>
              <h2 class='text-6xl font-semibold text-neutral-900 font-inter'>
                TO KNOW MORE ABOUT US !
              </h2>
              <p class='text-3xl font-semibold text-neutral-900 font-inter'>
                FOLLOW THE LINK
              </p>
            </div>
            <p class='text-neutral-600 text-sm font-normal font-inter'>
              Copyright 2021 © code Editors. All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
      {/* </div> */}
    </>
  );
}
