// LanguageCard.tsx
import { type Component, For } from "solid-js";
import {
  FiCode,
  FiPlay,
  FiMessageSquare,
  FiExternalLink,
} from "solid-icons/fi";

// Define interfaces for type safety
interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface LanguageCardProps {
  language: string;
  tagline: string;
  description: string;
  features: Feature[];
  logoSrc: string;
  backgroundImageSrc?: string; // New prop for background image
  logoStyle?: "square" | "rectangular" | "circular" | "custom" | "integrated";
  logoSize?: "small" | "medium" | "large";
  gradientColors?: string;
  accentColor?:
    | "blue"
    | "green"
    | "purple"
    | "red"
    | "orange"
    | "indigo"
    | "yellow"
    | "pink"
    | "teal";
  onGetStarted?: () => void;
  onLearnMore?: () => void;
  logoIntegrationMode?: "overlay" | "replace" | "blend" | "mask";
}

interface LogoSizeConfig {
  [key: string]: {
    mobile: string;
    desktop: string;
  };
}

interface LogoStyleConfig {
  [key: string]: string;
}

// Define logo size configurations
const logoSizeConfig: LogoSizeConfig = {
  small: {
    mobile: "w-32 h-32 sm:w-40 sm:h-40",
    desktop: "lg:w-48 lg:h-48",
  },
  medium: {
    mobile: "w-40 h-40 sm:w-48 sm:h-48",
    desktop: "lg:w-64 lg:h-64",
  },
  large: {
    mobile: "w-48 h-48 sm:w-56 sm:h-56",
    desktop: "lg:w-80 lg:h-80",
  },
};

// Define logo style configurations
const logoStyleConfig: LogoStyleConfig = {
  square: "rounded-lg",
  rectangular: "rounded-md",
  circular: "rounded-full",
  custom: "",
  integrated: "",
};

const LanguageCard: Component<LanguageCardProps> = (props) => {
  // Use static class names instead of dynamic ones
  const getColorClasses = () => {
    switch (props.accentColor || "blue") {
      case "blue":
        return {
          primary: "bg-blue-600",
          primaryText: "text-blue-600",
          hover: "hover:bg-blue-700",
          light: "bg-blue-50",
          lighter: "bg-blue-100",
          borderHover: "hover:border-blue-600",
          textHover: "hover:text-blue-600",
        };
      case "green":
        return {
          primary: "bg-green-600",
          primaryText: "text-green-600",
          hover: "hover:bg-green-700",
          light: "bg-green-50",
          lighter: "bg-green-100",
          borderHover: "hover:border-green-600",
          textHover: "hover:text-green-600",
        };
      case "purple":
        return {
          primary: "bg-purple-600",
          primaryText: "text-purple-600",
          hover: "hover:bg-purple-700",
          light: "bg-purple-50",
          lighter: "bg-purple-100",
          borderHover: "hover:border-purple-600",
          textHover: "hover:text-purple-600",
        };
      case "red":
        return {
          primary: "bg-red-600",
          primaryText: "text-red-600",
          hover: "hover:bg-red-700",
          light: "bg-red-50",
          lighter: "bg-red-100",
          borderHover: "hover:border-red-600",
          textHover: "hover:text-red-600",
        };
      case "orange":
        return {
          primary: "bg-orange-600",
          primaryText: "text-orange-600",
          hover: "hover:bg-orange-700",
          light: "bg-orange-50",
          lighter: "bg-orange-100",
          borderHover: "hover:border-orange-600",
          textHover: "hover:text-orange-600",
        };
      case "indigo":
        return {
          primary: "bg-indigo-600",
          primaryText: "text-indigo-600",
          hover: "hover:bg-indigo-700",
          light: "bg-indigo-50",
          lighter: "bg-indigo-100",
          borderHover: "hover:border-indigo-600",
          textHover: "hover:text-indigo-600",
        };
      case "yellow":
        return {
          primary: "bg-yellow-600",
          primaryText: "text-yellow-600",
          hover: "hover:bg-yellow-700",
          light: "bg-yellow-50",
          lighter: "bg-yellow-100",
          borderHover: "hover:border-yellow-600",
          textHover: "hover:text-yellow-600",
        };
      case "pink":
        return {
          primary: "bg-pink-600",
          primaryText: "text-pink-600",
          hover: "hover:bg-pink-700",
          light: "bg-pink-50",
          lighter: "bg-pink-100",
          borderHover: "hover:border-pink-600",
          textHover: "hover:text-pink-600",
        };
      case "teal":
        return {
          primary: "bg-teal-600",
          primaryText: "text-teal-600",
          hover: "hover:bg-teal-700",
          light: "bg-teal-50",
          lighter: "bg-teal-100",
          borderHover: "hover:border-teal-600",
          textHover: "hover:text-teal-600",
        };
      default:
        return {
          primary: "bg-blue-600",
          primaryText: "text-blue-600",
          hover: "hover:bg-blue-700",
          light: "bg-blue-50",
          lighter: "bg-blue-100",
          borderHover: "hover:border-blue-600",
          textHover: "hover:text-blue-600",
        };
    }
  };

  const colorClasses = getColorClasses();
  const sizeClasses = logoSizeConfig[props.logoSize || "medium"];
  const styleClasses = logoStyleConfig[props.logoStyle || "square"];
  const gradientColors =
    props.gradientColors || "from-yellow-400 via-orange-400 to-red-400";

  const handleImageError = (e: Event) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
  };

  const getLogoIntegrationStyle = () => {
    const mode = props.logoIntegrationMode || "overlay";

    switch (mode) {
      case "replace":
        return {
          mixBlendMode: "multiply",
          filter: "contrast(1.2) brightness(1.1)",
        };
      case "blend":
        return {
          mixBlendMode: "overlay",
          filter: "contrast(1.3) brightness(0.9)",
        };
      case "mask":
        return {
          mixBlendMode: "screen",
          filter: "invert(1) contrast(1.5)",
        };
      default:
        return {};
    }
  };

  return (
    <div
      class='card absolute w-[80vw] h-[80vh] opacity-100'
      data-language={props.language.toLowerCase()}>
      <div class='bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-500 w-full h-full'>
        <div class='flex flex-col lg:flex-row h-full'>
          {/* Left Image Panel */}
          <div class='w-full lg:w-[55%] relative overflow-hidden'>
            {/* Background Image */}
            <div
              class='absolute inset-0 bg-cover bg-center bg-no-repeat'
              style={`background-image: url('${
                props.backgroundImageSrc ||
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              }')`}>
              {/* Dark overlay for better text readability - adjusted opacity for logo integration */}
              <div
                class={`absolute inset-0 ${
                  props.logoIntegrationMode === "replace" ||
                  props.logoIntegrationMode === "blend"
                    ? "bg-black bg-opacity-20"
                    : "bg-black bg-opacity-40"
                }`}></div>
            </div>

            {/* Logo container with integration support */}
            <div class='logo-container relative z-10 p-4 lg:p-6 h-full flex items-center justify-center'>
              <div class='relative rounded-[40%]'>
                <img
                  class={`${sizeClasses.mobile} ${sizeClasses.desktop} ${styleClasses} drop-shadow-2xl transform hover:scale-110 hover:rotate-3 transition-all duration-500 ease-out object-contain  `}
                  src={props.logoSrc}
                  alt={`${props.language} Logo`}
                  loading='lazy'
                  onError={handleImageError}
                  style={getLogoIntegrationStyle()}
                />

                {/* Enhanced glow effect for integrated logos */}
                {(props.logoIntegrationMode === "replace" ||
                  props.logoIntegrationMode === "blend") && (
                  <div class='absolute inset-0 bg-white bg-opacity-10 blur-2xl -z-10 rounded-full scale-110'></div>
                )}

                {/* Standard glow for regular logos */}
                {(!props.logoIntegrationMode ||
                  props.logoIntegrationMode === "overlay") && (
                  <div class='absolute inset-0 bg-white bg-opacity-20 blur-xl -z-10 rounded-full'></div>
                )}
              </div>
            </div>

            {/* Title overlay with better contrast for integrated logos */}
            <div class='absolute bottom-4 lg:bottom-6 left-4 lg:left-6 text-white z-20'>
              <h3
                class={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 ${
                  props.logoIntegrationMode === "replace" ||
                  props.logoIntegrationMode === "blend"
                    ? "drop-shadow-2xl text-shadow-lg"
                    : "drop-shadow-lg"
                }`}>
                {props.language}
              </h3>
              <p
                class={`text-sm sm:text-base lg:text-lg xl:text-xl opacity-90 ${
                  props.logoIntegrationMode === "replace" ||
                  props.logoIntegrationMode === "blend"
                    ? "drop-shadow-xl"
                    : "drop-shadow-md"
                }`}>
                {props.tagline}
              </p>
            </div>
          </div>

          {/* Right Content Panel */}
          <div class='w-full lg:w-[45%] p-3 sm:p-4 lg:p-6 xl:p-8 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50'>
            <div class='flex-1 space-y-3 lg:space-y-4'>
              {/* Header */}
              <div class='space-y-2'>
                <h4 class='text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 flex items-center gap-2'>
                  <FiCode
                    class={`${colorClasses.primaryText} text-lg lg:text-xl`}
                  />
                  About {props.language}
                </h4>

                <p class='text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed font-medium line-clamp-3'>
                  {props.description}
                </p>
              </div>

              {/* Features section */}
              <div class='space-y-2 lg:space-y-3'>
                <h5 class='text-sm sm:text-base lg:text-lg font-semibold text-gray-800 flex items-center gap-2'>
                  🔑 Key Features:
                </h5>

                <div class='grid gap-2'>
                  <For each={props.features.slice(0, 3)}>
                    {(feature, index) => (
                      <div
                        class={`feature-item flex items-start gap-2 lg:gap-3 p-2 lg:p-3 ${colorClasses.light} rounded-lg ${colorClasses.lighter} transition-all duration-300 hover:scale-105 hover:shadow-sm border border-transparent hover:border-gray-200 cursor-pointer`}>
                        <span
                          class={`${colorClasses.primaryText} font-semibold text-sm lg:text-base flex-shrink-0 w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center`}>
                          {feature.icon}
                        </span>
                        <div class='flex-1 min-w-0'>
                          <strong class='text-gray-800 text-xs sm:text-sm lg:text-base block mb-1'>
                            {feature.title}
                          </strong>
                          <span class='text-gray-600 text-xs lg:text-sm leading-relaxed line-clamp-2'>
                            {feature.description}
                          </span>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </div>

            {/* Bottom section with buttons and stats */}
            <div class='space-y-3'>
              {/* Action buttons */}
              <div class='flex flex-col sm:flex-row gap-2 lg:gap-3'>
                <button
                  class={`flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-3 ${colorClasses.primary} text-white rounded-lg ${colorClasses.hover} transition-all duration-300 font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95`}
                  onClick={props.onGetStarted}>
                  <FiPlay class='text-sm lg:text-base' />
                  Get Started
                </button>
                <button
                  class={`flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-3 border-2 border-gray-300 text-gray-700 rounded-lg ${colorClasses.borderHover} ${colorClasses.textHover} hover:bg-gray-50 transition-all duration-300 font-semibold text-sm lg:text-base transform hover:-translate-y-1 active:scale-95`}
                  onClick={props.onLearnMore}>
                  <FiExternalLink class='text-sm lg:text-base' />
                  Learn More
                </button>
              </div>

              {/* Stats or additional info */}
              <div class='flex justify-between items-center pt-2 border-t border-gray-200'>
                <div class='text-center'>
                  <div
                    class={`text-sm lg:text-base font-bold ${colorClasses.primaryText}`}>
                    Popular
                  </div>
                  <div class='text-xs text-gray-500'>Choice</div>
                </div>
                <div class='text-center'>
                  <div
                    class={`text-sm lg:text-base font-bold ${colorClasses.primaryText}`}>
                    Easy
                  </div>
                  <div class='text-xs text-gray-500'>to Learn</div>
                </div>
                <div class='text-center'>
                  <div
                    class={`text-sm lg:text-base font-bold ${colorClasses.primaryText}`}>
                    Industry
                  </div>
                  <div class='text-xs text-gray-500'>Standard</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageCard;
