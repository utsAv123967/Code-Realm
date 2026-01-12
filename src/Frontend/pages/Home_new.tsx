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
      {/* Hero Section */}
      <section class='relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-24'>
        <div class='pointer-events-none absolute inset-0 z-0'>
          <div class='absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl'></div>
          <div class='absolute right-[-10%] top-32 h-80 w-80 rounded-full bg-fuchsia-400/15 blur-3xl'></div>
          <div class='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_62%)]'></div>
          <div class='absolute inset-0 bg-[linear-gradient(120deg,_rgba(255,255,255,0.08)_0%,_rgba(255,255,255,0)_45%,_rgba(255,255,255,0.15)_100%)] opacity-60'></div>
        </div>

        <div class='relative z-20 mx-auto grid max-w-7xl gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center'>
          <div class='space-y-10 text-white'>
            <div class='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.45em] text-white/70'>
              <span>Premium workspace</span>
            </div>
            <div class='space-y-6'>
              <h1 class='text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl'>Code together, build better</h1>
              <p class='max-w-xl text-sm text-white/75 sm:text-base'>CodeRealm puts collaborative coding on a premium canvas. Launch rooms, explore projects, and keep every teammate in sync without sacrificing focus.</p>
            </div>
            <div class='flex flex-col gap-4 sm:flex-row'>
              <button
                onClick={handleGetStarted}
                class='inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-white/25 transition hover:bg-slate-100'>
                Get started free
              </button>
              <button class='inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10'>
                Watch demo
              </button>
            </div>
            <div class='grid gap-4 sm:grid-cols-3'>
              <div class='rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-left backdrop-blur'>
                <p class='text-2xl font-semibold text-white'>10K+</p>
                <p class='mt-1 text-xs uppercase tracking-[0.35em] text-white/60'>Active builders</p>
              </div>
              <div class='rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-left backdrop-blur'>
                <p class='text-2xl font-semibold text-white'>50K+</p>
                <p class='mt-1 text-xs uppercase tracking-[0.35em] text-white/60'>Projects shipped</p>
              </div>
              <div class='rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-left backdrop-blur'>
                <p class='text-2xl font-semibold text-white'>99%</p>
                <p class='mt-1 text-xs uppercase tracking-[0.35em] text-white/60'>Platform uptime</p>
              </div>
            </div>
          </div>

          <div class='relative flex justify-center'>
            <div class='absolute -inset-10 rounded-[40px] bg-gradient-to-br from-blue-400/20 via-indigo-400/10 to-fuchsia-400/20 blur-3xl'></div>
            <div class='relative w-full max-w-lg overflow-hidden rounded-[36px] border border-white/15 bg-white/12 p-6 shadow-[0_45px_120px_-60px_rgba(15,23,42,0.75)] backdrop-blur-lg'>
              <div class='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_64%)] opacity-70'></div>
              <img
                id='pic1'
                src='src/assets/Home_new/hello-illustration.png'
                alt='Coding collaboration illustration'
                class='relative z-10 w-full drop-shadow-[0_25px_60px_rgba(59,130,246,0.35)]'
              />
            </div>
          </div>
        </div>

        <div class='pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden'>
          <h1
            id='split'
            class='text-[100px] font-black uppercase tracking-[0.3em] text-slate-800/60 sm:text-[140px] lg:text-[180px]'>
            {"CODE-REALM".split("").map((char, i) => (
              <span class='inline-block' id={`char-${i}`}>
                {char}
              </span>
            ))}
          </h1>
        </div>
      </section>

      {/* Features Section */}
      <section class='relative bg-slate-100/60 px-6 py-20'>
        <div class='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_70%)]'></div>
        <div class='relative mx-auto max-w-7xl space-y-12'>
          <div class='text-center space-y-5'>
            <span class='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500'>
              Features
            </span>
            <h2 class='text-4xl font-bold text-slate-900'>Why teams choose CodeRealm</h2>
            <p class='mx-auto max-w-3xl text-base leading-relaxed text-slate-600'>Experience a collaborative stack that mirrors the premium dashboard. Every feature keeps your crew focused, aligned, and ready to ship.</p>
          </div>

          <div class='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            <div class='group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl'>
              <div class='absolute -top-16 right-0 h-40 w-40 bg-gradient-to-r from-blue-500/25 via-indigo-500/10 to-transparent opacity-70 blur-3xl'></div>
              <div class='relative flex h-full flex-col gap-5'>
                <div class='inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 shadow'>
                  <img
                    src='src/assets/Home_new/003-enterprise.png'
                    alt='Realtime collaboration icon'
                    class='h-8 w-8'
                  />
                </div>
                <h3 class='text-xl font-semibold text-slate-900'>Realtime collaboration</h3>
                <p class='text-sm leading-relaxed text-slate-600'>Work in sync with presence indicators, shared cursors, and dependable room controls that stay consistent with the dashboard.</p>
              </div>
            </div>

            <div class='group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl'>
              <div class='absolute -top-16 right-0 h-40 w-40 bg-gradient-to-r from-emerald-500/25 via-teal-500/10 to-transparent opacity-70 blur-3xl'></div>
              <div class='relative flex h-full flex-col gap-5'>
                <div class='inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 shadow'>
                  <img
                    src='src/assets/Home_new/004-diagram.png'
                    alt='Project management icon'
                    class='h-8 w-8'
                  />
                </div>
                <h3 class='text-xl font-semibold text-slate-900'>Project clarity</h3>
                <p class='text-sm leading-relaxed text-slate-600'>Organize files, track progress, and manage applications with the same polished flows your dashboard already uses.</p>
              </div>
            </div>

            <div class='group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl'>
              <div class='absolute -top-16 right-0 h-40 w-40 bg-gradient-to-r from-fuchsia-500/25 via-purple-500/10 to-transparent opacity-70 blur-3xl'></div>
              <div class='relative flex h-full flex-col gap-5'>
                <div class='inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 shadow'>
                  <img
                    src='src/assets/Home_new/team.png'
                    alt='AI assistance icon'
                    class='h-8 w-8'
                  />
                </div>
                <h3 class='text-xl font-semibold text-slate-900'>Guided by intelligence</h3>
                <p class='text-sm leading-relaxed text-slate-600'>Lean on AI prompts, execution feedback, and saved I/O flows to keep iteration quick without leaving the workspace.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Languages Section */}
      <LanguagesSection />

      {/* Call to Action Section */}
      <section class='relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-6 py-20'>
        <div class='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.35),_transparent_65%)]'></div>
        <div class='relative mx-auto max-w-4xl space-y-8 text-center text-white'>
          <h2 class='text-4xl font-bold tracking-tight sm:text-5xl'>Ready to elevate your coding sessions?</h2>
          <p class='mx-auto max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base'>Join thousands of builders already delivering premium experiences with CodeRealm. Launch a room, invite your crew, and keep momentum high from day one.</p>
          <div class='flex flex-col gap-3 sm:flex-row sm:justify-center'>
            <button
              onClick={handleGetStarted}
              class='inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-white/20 transition hover:bg-slate-100'>
              Start coding now
            </button>
            <button class='inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10'>
              Browse the roadmap
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class='w-full bg-slate-950 px-6 py-16 text-white'>
        <div class='mx-auto max-w-7xl space-y-12'>
          <div class='grid grid-cols-1 gap-10 md:grid-cols-4'>
            <div class='space-y-4'>
              <h3 class='text-2xl font-bold tracking-tight text-white'>CodeRealm</h3>
              <p class='max-w-xs text-sm leading-relaxed text-white/60'>The collaborative coding platform that brings developers together to create premium projects without losing flow.</p>
            </div>
            <div class='space-y-4'>
              <h4 class='text-sm font-semibold uppercase tracking-[0.3em] text-white/60'>Product</h4>
              <ul class='space-y-2 text-sm text-white/60'>
                <li>
                  <a href='#' class='transition hover:text-white'>Features</a>
                </li>
                <li>
                  <a href='#' class='transition hover:text-white'>Pricing</a>
                </li>
                <li>
                  <a href='#' class='transition hover:text-white'>Documentation</a>
                </li>
              </ul>
            </div>
            <div class='space-y-4'>
              <h4 class='text-sm font-semibold uppercase tracking-[0.3em] text-white/60'>Company</h4>
              <ul class='space-y-2 text-sm text-white/60'>
                <li>
                  <a href='#' class='transition hover:text-white'>About</a>
                </li>
                <li>
                  <a href='#' class='transition hover:text-white'>Blog</a>
                </li>
                <li>
                  <a href='#' class='transition hover:text-white'>Careers</a>
                </li>
              </ul>
            </div>
            <div class='space-y-4'>
              <h4 class='text-sm font-semibold uppercase tracking-[0.3em] text-white/60'>Support</h4>
              <ul class='space-y-2 text-sm text-white/60'>
                <li>
                  <a href='#' class='transition hover:text-white'>Help center</a>
                </li>
                <li>
                  <a href='#' class='transition hover:text-white'>Contact</a>
                </li>
                <li>
                  <a href='#' class='transition hover:text-white'>Community</a>
                </li>
              </ul>
            </div>
          </div>
          <div class='border-t border-white/10 pt-8 text-center text-xs uppercase tracking-[0.4em] text-white/50'>
            <p>&copy; 2025 CodeRealm. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
