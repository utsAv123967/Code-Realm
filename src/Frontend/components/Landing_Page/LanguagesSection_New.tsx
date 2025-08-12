import { onCleanup, onMount } from "solid-js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

interface Language {
  language: string;
  tagline: string;
  description: string;
  logoSrc: string;
  gradientColors: string;
  accentColor: string;
  officialDocsUrl: string;
  features: string[];
}

export default function LanguagesSection() {
  // Major programming languages with official documentation
  const languages: Language[] = [
    {
      language: "JavaScript",
      tagline: "The Language of the Web",
      description:
        "JavaScript is the programming language of the web. Build interactive websites, web applications, and server-side applications.",
      logoSrc: "src/assets/Home_new/js-logo.png",
      gradientColors: "from-yellow-400 via-orange-400 to-red-400",
      accentColor: "#f7df1e",
      officialDocsUrl:
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      features: [
        "Frontend & Backend",
        "Rich Ecosystem",
        "Event-Driven",
        "Modern ES6+ Features",
      ],
    },
    {
      language: "Python",
      tagline: "Simple, Powerful, Versatile",
      description:
        "Python is known for its simplicity and readability. Perfect for data science, AI, web development, and automation.",
      logoSrc: "src/assets/Home_new/python-logo.png",
      gradientColors: "from-blue-400 via-blue-500 to-yellow-400",
      accentColor: "#3776ab",
      officialDocsUrl: "https://docs.python.org/3/",
      features: [
        "Data Science & AI",
        "Simple Syntax",
        "Extensive Libraries",
        "Cross-Platform",
      ],
    },
    {
      language: "TypeScript",
      tagline: "JavaScript with Types",
      description:
        "TypeScript adds static typing to JavaScript, making it more reliable for large-scale applications and better developer experience.",
      logoSrc: "src/assets/Home_new/ts-logo.png",
      gradientColors: "from-blue-600 via-blue-700 to-blue-800",
      accentColor: "#3178c6",
      officialDocsUrl: "https://www.typescriptlang.org/docs/",
      features: [
        "Static Typing",
        "Better IDE Support",
        "Large-Scale Apps",
        "JavaScript Compatible",
      ],
    },
    {
      language: "Java",
      tagline: "Write Once, Run Anywhere",
      description:
        "Java is a robust, object-oriented language used for enterprise applications, Android development, and backend systems.",
      logoSrc:
        "src/assets/Home_new/png-clipart-c-logo-c-programming-language-icon-letter-c-blue-logo 1.png",
      gradientColors: "from-red-500 via-orange-500 to-yellow-500",
      accentColor: "#ed8b00",
      officialDocsUrl: "https://docs.oracle.com/en/java/",
      features: [
        "Enterprise Applications",
        "Platform Independent",
        "Strong Memory Management",
        "Large Community",
      ],
    },
    {
      language: "C++",
      tagline: "Power and Performance",
      description:
        "C++ is a powerful language for system programming, game development, and high-performance applications.",
      logoSrc:
        "src/assets/Home_new/png-clipart-c-logo-c-programming-language-icon-letter-c-blue-logo 1.png",
      gradientColors: "from-blue-600 via-purple-600 to-pink-600",
      accentColor: "#00599c",
      officialDocsUrl: "https://cppreference.com/",
      features: [
        "High Performance",
        "System Programming",
        "Game Development",
        "Memory Control",
      ],
    },
    {
      language: "Go",
      tagline: "Fast, Simple, Reliable",
      description:
        "Go is designed for building scalable, concurrent applications. Perfect for microservices, cloud computing, and DevOps.",
      logoSrc: "src/assets/Home_new/go-logo.png",
      gradientColors: "from-cyan-400 via-blue-500 to-blue-600",
      accentColor: "#00add8",
      officialDocsUrl: "https://golang.org/doc/",
      features: [
        "Concurrency",
        "Fast Compilation",
        "Cloud Native",
        "Simple Syntax",
      ],
    },
  ];

  const handleLearnMore = (url: string) => {
    window.open(url, "_blank");
  };

  onMount(() => {
    // Animate cards on scroll
    gsap.fromTo(
      ".language-card",
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".languages-container",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  onCleanup(() => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  });

  return (
    <section class='w-full px-8 py-20 bg-gradient-to-br from-gray-50 to-blue-50'>
      <div class='max-w-7xl mx-auto'>
        {/* Section Header */}
        <div class='text-center space-y-6 mb-16'>
          <h2 class='text-5xl font-bold text-gray-800 font-inter'>
            Popular Programming Languages
          </h2>
          <p class='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Explore the most in-demand programming languages. Start coding with
            comprehensive documentation and community support.
          </p>
          <div class='w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full'></div>
        </div>

        {/* Languages Grid */}
        <div class='languages-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {languages.map((lang) => (
            <div class='language-card group'>
              <div class='bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2'>
                {/* Header with gradient */}
                <div
                  class={`bg-gradient-to-r ${lang.gradientColors} p-6 text-white relative overflow-hidden`}>
                  <div class='absolute inset-0 bg-black bg-opacity-10'></div>
                  <div class='relative z-10 flex items-center space-x-4'>
                    <div class='w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm'>
                      <img
                        src={lang.logoSrc}
                        alt={`${lang.language} logo`}
                        class='w-10 h-10 object-contain'
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl font-bold">${lang.language.charAt(
                            0
                          )}</span>`;
                        }}
                      />
                    </div>
                    <div>
                      <h3 class='text-2xl font-bold'>{lang.language}</h3>
                      <p class='text-sm opacity-90'>{lang.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div class='p-6 space-y-6'>
                  <p class='text-gray-600 leading-relaxed'>
                    {lang.description}
                  </p>

                  {/* Features */}
                  <div class='space-y-3'>
                    <h4 class='font-semibold text-gray-800 text-sm uppercase tracking-wide'>
                      Key Features
                    </h4>
                    <div class='grid grid-cols-2 gap-2'>
                      {lang.features.map((feature) => (
                        <div class='flex items-center space-x-2'>
                          <div
                            class='w-2 h-2 rounded-full'
                            style={{
                              "background-color": lang.accentColor,
                            }}></div>
                          <span class='text-sm text-gray-600'>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleLearnMore(lang.officialDocsUrl)}
                    class='w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg'>
                    <span>View Documentation</span>
                    <svg
                      class='w-4 h-4 transition-transform group-hover:translate-x-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        stroke-width='2'
                        d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div class='mt-16 text-center'>
          <div class='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
            <h3 class='text-2xl font-bold text-gray-800 mb-4'>
              Ready to Start Coding?
            </h3>
            <p class='text-gray-600 mb-6 max-w-2xl mx-auto'>
              Join thousands of developers collaborating on Code Realm. Create
              your first project and start building amazing things together.
            </p>
            <button class='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'>
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
