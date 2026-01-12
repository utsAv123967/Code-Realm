import type { Component } from "solid-js";
import { For } from "solid-js";
import {
  FiCompass,
  FiLayers,
  FiUsers,
  FiZap,
  FiMonitor,
  FiCloud,
  FiSettings,
} from "solid-icons/fi";

const workflow = [
  {
    title: "Kickoff the vision",
    description: "Align on the problem, target the teams we serve, and map the outcomes we expect.",
  },
  {
    title: "Design the flow",
    description: "Prototype the dashboard, coding room, and handoffs until the experience feels effortless.",
  },
  {
    title: "Ship the loop",
    description: "Connect realtime rooms, Monaco editing, and execution so collaboration stays in one place.",
  },
];

const features = [
  {
    title: "Rooms that stay in sync",
    description: "Realtime presence, role-aware controls, and focused editor panels keep momentum high.",
    icon: FiUsers,
    accent: "from-blue-500 via-indigo-500 to-blue-700",
  },
  {
    title: "Execution built in",
    description: "Run code, capture output, and iterate without juggling tabs or breaking your flow.",
    icon: FiZap,
    accent: "from-emerald-500 via-teal-500 to-emerald-600",
  },
  {
    title: "Guided workspace",
    description: "Adaptive layout, quick actions, and glassmorphism details mirror the dashboard's premium feel.",
    icon: FiLayers,
    accent: "from-purple-500 via-fuchsia-500 to-purple-600",
  },
];

const stack = [
  {
    title: "Experience layer",
    description: "SolidJS + TypeScript powered by Vite for instant feedback loops.",
    notes: [
      "Signals drive room, auth, and Monaco state",
      "Utility-first styling with custom gradients",
      "Protected routes for smoother onboarding",
    ],
    icon: FiMonitor,
  },
  {
    title: "Realtime core",
    description: "Firebase Auth and Firestore keep rooms, chat, and files current.",
    notes: [
      "Live member presence and invites",
      "Room applications with instant status",
      "Serverless hooks for execution tasks",
    ],
    icon: FiCloud,
  },
  {
    title: "Developer workflow",
    description: "Linting, testing, and deployment scripts keep releases predictable.",
    notes: [
      "ESLint + Prettier automation",
      "Component sandbox for rapid checks",
      "CI scripts tuned for the monorepo",
    ],
    icon: FiSettings,
  },
];

const futureFocus = [
  {
    title: "Analytics overlays",
    detail: "Surface participation and velocity insights above the editor without noise.",
  },
  {
    title: "AI-guided pairing",
    detail: "Bring smart suggestions and code reviews into the room timeline.",
  },
  {
    title: "Deeper history",
    detail: "Version snapshots and playback keep past sessions a click away.",
  },
];

const AboutUsPage: Component = () => (
  <main class='relative mt-14 bg-slate-50 pb-24 text-slate-900'>
    <div class='mx-auto max-w-6xl space-y-16 px-6 pt-16'>
      <section class='relative overflow-hidden rounded-[44px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-10 text-white shadow-[0_40px_120px_-60px_rgba(8,15,45,0.8)]'>
        <div class='pointer-events-none absolute inset-0'>
          <div class='absolute -left-20 top-0 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl'></div>
          <div class='absolute right-[-10%] bottom-[-20%] h-72 w-72 rounded-full bg-purple-500/25 blur-3xl'></div>
          <div class='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]'></div>
          <div class='absolute inset-0 bg-[linear-gradient(120deg,_rgba(255,255,255,0.06)_0%,_rgba(255,255,255,0)_40%,_rgba(255,255,255,0.12)_100%)] opacity-60'></div>
        </div>

        <div class='relative grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center'>
          <div class='space-y-6'>
            <div class='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.45em] text-white/70'>
              <FiCompass class='text-base' />
              <span>About CodeRealm</span>
            </div>
            <div class='space-y-4'>
              <h1 class='text-4xl font-bold tracking-tight sm:text-5xl'>A premium room for builders</h1>
              <p class='max-w-2xl text-sm text-white/80 sm:text-base'>CodeRealm brings designers, mentors, and engineers together in a focused workspace that matches the energy of our dashboard. Everything we ship keeps collaboration clear, quick, and calm.</p>
            </div>
            <div class='flex flex-wrap items-center gap-3'>
              <a
                href='/dashboard'
                class='inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-white/20 transition hover:bg-slate-100'>
                Explore the dashboard
              </a>
              <a
                href='/room'
                class='inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10'>
                Jump into a room
              </a>
            </div>
          </div>

          <div class='relative rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-2xl'>
            <div class='grid gap-4 text-sm text-white/80'>
              <div>
                <p class='text-xs uppercase tracking-[0.4em] text-white/50'>Teams served</p>
                <p class='text-lg font-semibold text-white'>Builders · Mentors · Students</p>
              </div>
              <div>
                <p class='text-xs uppercase tracking-[0.4em] text-white/50'>Core promise</p>
                <p class='text-lg font-semibold text-white'>Clarity, momentum, shared wins</p>
              </div>
              <div>
                <p class='text-xs uppercase tracking-[0.4em] text-white/50'>Current focus</p>
                <p class='text-lg font-semibold text-white'>Realtime collaboration at scale</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class='rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur'>
        <header class='flex flex-col gap-2'>
          <p class='text-xs font-semibold uppercase tracking-[0.4em] text-blue-600'>Workflow</p>
          <h2 class='text-3xl font-bold'>How we build</h2>
          <p class='max-w-2xl text-sm text-slate-600'>Every release follows the same rhythm so the dashboard, rooms, and support tooling stay aligned.</p>
        </header>
        <div class='mt-6 grid gap-4 md:grid-cols-3'>
          <For each={workflow}>
            {(step) => (
              <article class='flex h-full flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-6 shadow-inner'>
                <h3 class='text-base font-semibold text-slate-900'>{step.title}</h3>
                <p class='text-sm text-slate-600'>{step.description}</p>
              </article>
            )}
          </For>
        </div>
      </section>

      <section class='grid gap-6 md:grid-cols-3'>
        <For each={features}>
          {(feature) => (
            <article class='group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur transition hover:shadow-2xl'>
              <div class={`absolute -top-20 right-0 h-40 w-40 opacity-40 blur-3xl bg-gradient-to-r ${feature.accent}`}></div>
              <div class='relative flex h-full flex-col gap-4'>
                <div class='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-slate-900 shadow'>
                  <feature.icon class='text-lg' />
                </div>
                <h3 class='text-lg font-semibold text-slate-900'>{feature.title}</h3>
                <p class='text-sm text-slate-600'>{feature.description}</p>
              </div>
            </article>
          )}
        </For>
      </section>

      <section class='space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur'>
        <header class='flex flex-col gap-2'>
          <p class='text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600'>Stack</p>
          <h2 class='text-3xl font-bold'>What powers the experience</h2>
          <p class='max-w-2xl text-sm text-slate-600'>We fine-tune a small toolkit so the dashboard and rooms stay fast, stable, and easy to extend.</p>
        </header>
        <div class='grid gap-6 md:grid-cols-3'>
          <For each={stack}>
            {(layer) => (
              <article class='flex h-full flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-6'>
                <div class='inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow'>
                  <layer.icon class='text-xl' />
                </div>
                <div>
                  <h3 class='text-lg font-semibold text-slate-900'>{layer.title}</h3>
                  <p class='mt-2 text-sm text-slate-600'>{layer.description}</p>
                </div>
                <ul class='space-y-2 text-sm text-slate-600'>
                  <For each={layer.notes}>
                    {(note) => (
                      <li class='flex gap-2 rounded-2xl bg-white/70 px-3 py-2'>
                        <span class='mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500'></span>
                        <span>{note}</span>
                      </li>
                    )}
                  </For>
                </ul>
              </article>
            )}
          </For>
        </div>
      </section>

      <section class='rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-10 text-white shadow-2xl shadow-slate-900/30'>
        <div class='grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center'>
          <div class='space-y-4'>
            <h2 class='text-3xl font-bold tracking-tight'>Future vision</h2>
            <p class='max-w-xl text-sm leading-6 text-white/80'>We keep the roadmap focused on ideas that amplify teamwork and mirror the polish of the dashboard experience.</p>
          </div>
          <div class='grid gap-3'>
            <For each={futureFocus}>
              {(item) => (
                <div class='rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/85 backdrop-blur'>
                  <p class='font-semibold text-white'>{item.title}</p>
                  <p class='text-white/70'>{item.detail}</p>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>
    </div>
  </main>
);

export default AboutUsPage;
