import { onCleanup, onMount } from "solid-js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LanguageCard from "./LanguageCard";
import { GsapForCards } from "../../pages/Gsap";

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

interface Language {
  language: string;
  tagline: string;
  description: string;
  logoSrc: string;
  gradientColors: string;
  accentColor:
    | "blue"
    | "green"
    | "purple"
    | "red"
    | "orange"
    | "indigo"
    | "yellow"
    | "pink"
    | "teal";
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export default function LanguagesSection() {
  // Language data configuration
  const languages: Language[] = [
    {
      language: "JavaScript",
      tagline: "The Language of the Web",
      description:
        "JavaScript is a high-level, interpreted language used for creating interactive and dynamic content on websites and applications.",
      logoSrc: "src/assets/Home_new/js-logo.png",
      gradientColors: "from-yellow-400 via-orange-400 to-red-400",
      accentColor: "blue",
      features: [
        {
          icon: "✅",
          title: "Client-Side Interactivity",
          description: "Enables dynamic UI, animations, and DOM manipulation.",
        },
        {
          icon: "🌐",
          title: "Browser-Based",
          description: "Runs directly in all modern browsers.",
        },
        {
          icon: "⚙️",
          title: "Event-Driven",
          description: "Handles user actions asynchronously.",
        },
        {
          icon: "🔁",
          title: "Asynchronous",
          description: "Supports Promises, async/await, and callbacks.",
        },
        {
          icon: "🧩",
          title: "Versatile",
          description: "Used in both frontend and backend with Node.js.",
        },
        {
          icon: "📦",
          title: "Rich Ecosystem",
          description: "Access to massive libraries and frameworks.",
        },
      ],
    },
    {
      language: "Python",
      tagline: "Simple, Powerful, Versatile",
      description:
        "Python is a high-level language known for its easy syntax. Widely used in AI, data science, web development, and automation.",
      logoSrc: "src/assets/Home_new/python-logo.png",
      gradientColors: "from-blue-400 via-blue-500 to-yellow-400",
      accentColor: "green",
      features: [
        {
          icon: "🐍",
          title: "Simple Syntax",
          description: "Easy to write and understand.",
        },
        {
          icon: "🔬",
          title: "Data Science",
          description: "Popular in data analytics and machine learning.",
        },
        {
          icon: "🤖",
          title: "AI & ML",
          description: "Strong ecosystem with TensorFlow, PyTorch.",
        },
        {
          icon: "🌐",
          title: "Web Dev",
          description: "Frameworks like Django, Flask.",
        },
        {
          icon: "⚡",
          title: "Automation",
          description: "Used in scripting and task automation.",
        },
        {
          icon: "📚",
          title: "Extensive Libraries",
          description: "Supports nearly every use case.",
        },
      ],
    },
    {
      language: "TypeScript",
      tagline: "JavaScript with Type Safety",
      description:
        "TypeScript is a strongly typed superset of JavaScript that compiles to clean JavaScript, improving maintainability and scalability.",
      logoSrc: "src/assets/Home_new/ts-logo.png",
      gradientColors: "from-blue-500 via-blue-600 to-indigo-500",
      accentColor: "blue",
      features: [
        {
          icon: "🔡",
          title: "Static Typing",
          description: "Prevents many bugs at compile time.",
        },
        {
          icon: "💻",
          title: "IDE Support",
          description: "Better IntelliSense and autocomplete.",
        },
        {
          icon: "🔁",
          title: "Backwards Compatible",
          description: "Compiles down to JavaScript.",
        },
        {
          icon: "📈",
          title: "Scalable",
          description: "Ideal for large codebases.",
        },
        {
          icon: "🛠",
          title: "Tooling",
          description: "Enhanced developer experience with tsconfig.",
        },
        {
          icon: "🌍",
          title: "Popular",
          description: "Used in major frameworks like Angular.",
        },
      ],
    },
    {
      language: "C++",
      tagline: "The Power of Performance",
      description:
        "C++ is a high-performance programming language known for system-level programming, game engines, and real-time simulations.",
      logoSrc: "src/assets/Home_new/cpp-logo.png",
      gradientColors: "from-gray-500 via-blue-500 to-indigo-700",
      accentColor: "indigo",
      features: [
        {
          icon: "🚀",
          title: "High Performance",
          description: "Close to hardware with fast execution.",
        },
        {
          icon: "🧱",
          title: "OOP",
          description: "Supports object-oriented programming.",
        },
        {
          icon: "🔧",
          title: "Control",
          description: "Manual memory management.",
        },
        {
          icon: "🎮",
          title: "Game Dev",
          description: "Backbone of game engines like Unreal.",
        },
        {
          icon: "💼",
          title: "Enterprise Use",
          description: "Used in finance, aerospace, automotive.",
        },
        {
          icon: "📚",
          title: "Standard Library",
          description: "STL offers containers, algorithms.",
        },
      ],
    },
    {
      language: "Ruby",
      tagline: "Optimized for Developer Happiness",
      description:
        "Ruby is an elegant language focused on simplicity and productivity. It is best known for its web framework, Ruby on Rails.",
      logoSrc: "src/assets/Home_new/ruby-logo.png",
      gradientColors: "from-red-400 via-pink-500 to-purple-600",
      accentColor: "red",
      features: [
        {
          icon: "💎",
          title: "Elegant Syntax",
          description: "Code that's easy to read and write.",
        },
        {
          icon: "🌐",
          title: "Rails Framework",
          description: "Quickly build web apps with Rails.",
        },
        {
          icon: "⚙️",
          title: "Convention Over Configuration",
          description: "Fewer decisions, faster development.",
        },
        {
          icon: "📚",
          title: "Gems",
          description: "Thousands of reusable Ruby libraries.",
        },
        {
          icon: "🧪",
          title: "Testing",
          description: "Strong built-in testing support.",
        },
        {
          icon: "🧠",
          title: "Community",
          description: "Helpful, mature open-source ecosystem.",
        },
      ],
    },
    {
      language: "COBOL",
      tagline: "The Legacy Workhorse",
      description:
        "COBOL is a business-oriented language designed for finance, administration, and legacy systems in government and banking.",
      logoSrc: "src/assets/Home_new/cobol-logo.png",
      gradientColors: "from-yellow-300 via-gray-300 to-blue-300",
      accentColor: "blue",
      features: [
        {
          icon: "🏦",
          title: "Business Logic",
          description: "Tailored for business data processing.",
        },
        {
          icon: "📜",
          title: "Readable Syntax",
          description: "English-like for non-technical staff.",
        },
        {
          icon: "🧓",
          title: "Legacy Systems",
          description: "Still runs in major institutions.",
        },
        {
          icon: "🔁",
          title: "Batch Processing",
          description: "Great for large data operations.",
        },
        {
          icon: "📉",
          title: "Declining Usage",
          description: "Niche, but still essential in banks.",
        },
        {
          icon: "🛠",
          title: "Stable",
          description: "Decades of proven reliability.",
        },
      ],
    },
    {
      language: "Golang",
      tagline: "The Cloud Native Language",
      description:
        "Go (Golang) is a statically typed, compiled language developed by Google. Known for simplicity, concurrency, and performance.",
      logoSrc: "src/assets/Home_new/go-logo.png",
      gradientColors: "from-blue-400 via-cyan-400 to-teal-400",
      accentColor: "teal",
      features: [
        {
          icon: "🧵",
          title: "Concurrency",
          description: "Goroutines for lightweight parallelism.",
        },
        {
          icon: "⚡",
          title: "Fast Compilation",
          description: "Instant build times and execution.",
        },
        {
          icon: "📦",
          title: "Minimalist",
          description: "Simple syntax and fast tooling.",
        },
        {
          icon: "☁️",
          title: "Cloud Native",
          description: "Great for APIs, servers, and CLI tools.",
        },
        {
          icon: "🐳",
          title: "Docker & Kubernetes",
          description: "Built into container ecosystem.",
        },
        {
          icon: "📁",
          title: "Standard Library",
          description: "Powerful and concise standard packages.",
        },
      ],
    },
    {
      language: "C",
      tagline: "The Foundation of Programming",
      description:
        "C is a low-level, procedural language that serves as the basis for many modern languages. Known for speed and control.",
      logoSrc: "src/assets/Home_new/c-logo.png",
      gradientColors: "from-blue-600 via-gray-700 to-black",
      accentColor: "blue",
      features: [
        {
          icon: "🔧",
          title: "Low-Level Access",
          description: "Direct memory manipulation.",
        },
        {
          icon: "⚙️",
          title: "System Programming",
          description: "Used in OS kernels, drivers.",
        },
        {
          icon: "🚀",
          title: "High Performance",
          description: "Fast execution, low overhead.",
        },
        {
          icon: "📦",
          title: "Portable",
          description: "Runs on virtually any system.",
        },
        {
          icon: "📜",
          title: "Legacy Code",
          description: "Still powers critical infrastructure.",
        },
        {
          icon: "🧠",
          title: "Foundation Language",
          description: "Parent of C++, Java, Python.",
        },
      ],
    },
    {
      language: "Bash",
      tagline: "Shell Scripting for Automation",
      description:
        "Bash is a command-line language used for automating tasks in Unix/Linux systems. It's essential for DevOps and system administration.",
      logoSrc: "src/assets/Home_new/bash-logo.png",
      gradientColors: "from-gray-600 via-gray-700 to-black",
      accentColor: "blue",
      features: [
        {
          icon: "💻",
          title: "Command Line",
          description: "Direct interaction with the OS.",
        },
        {
          icon: "📜",
          title: "Scriptable",
          description: "Automate system tasks and pipelines.",
        },
        {
          icon: "⚡",
          title: "Fast",
          description: "Quick execution for everyday tasks.",
        },
        {
          icon: "🔗",
          title: "Unix/Linux",
          description: "Deep integration with UNIX environments.",
        },
        {
          icon: "🛠",
          title: "DevOps Essential",
          description: "CI/CD, Docker, cron jobs.",
        },
        {
          icon: "📁",
          title: "Filesystem Friendly",
          description: "Handles files, directories, and permissions.",
        },
      ],
    },
  ];

  const handleGetStarted = (language: string) => {
    console.log(`Get started with ${language}`);
    // Add your navigation logic here
  };

  const handleLearnMore = (language: string) => {
    console.log(`Learn more about ${language}`);
    // Add your navigation logic here
  };

  let parentRef: HTMLDivElement | undefined;

  // onMount(() => {
  //   if (!parentRef) return;

  //   // Cleanup
  //   onCleanup(() => {
  //     ScrollTrigger.getAll().forEach((instance) => instance.kill());
  //   });
  // });
  onMount(() => {
    GsapForCards(parentRef);
  });
  return (
    <section
      id='supported_languages_section'
      class='py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative'>
      {/* Horizontal scroll container */}
      <div
        ref={parentRef}
        class='parent relative h-[90vh]'
        style={{ width: `${languages.length * 80}vw` }}>
        {languages.map((lang, i) => (
          <LanguageCard
            data-key={lang.language}
            language={lang.language}
            tagline={lang.tagline}
            description={lang.description}
            features={lang.features}
            logoSrc={lang.logoSrc}
            gradientColors={lang.gradientColors}
            accentColor={lang.accentColor}
            onGetStarted={() => handleGetStarted(lang.language)}
            onLearnMore={() => handleLearnMore(lang.language)}
          />
        ))}
      </div>
    </section>
  );
}
