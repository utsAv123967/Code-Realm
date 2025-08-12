// Different Chat Modal Backdrop Effects
// Copy any of these backdrop styles to replace the current one

/* 
CURRENT: Subtle Light Blur
class='fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm z-40'
style={{ "backdrop-filter": "blur(4px)" }}
*/

// OPTION 1: Glass Morphism Effect
const GlassMorphismBackdrop = `
class='fixed inset-0 bg-gradient-to-br from-purple-50 to-blue-50 bg-opacity-30 backdrop-blur-md z-40'
style={{ "backdrop-filter": "blur(8px)" }}
`;

// OPTION 2: Minimal Blur (Most Subtle)
const MinimalBlur = `
class='fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm z-40'
style={{ "backdrop-filter": "blur(2px)" }}
`;

// OPTION 3: Medium Dark with Blur
const MediumDarkBlur = `
class='fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm z-40'
style={{ "backdrop-filter": "blur(4px)" }}
`;

// OPTION 4: Professional Frosted Glass
const FrostedGlass = `
class='fixed inset-0 bg-white bg-opacity-40 backdrop-blur-lg z-40'
style={{ "backdrop-filter": "blur(12px) saturate(150%)" }}
`;

// OPTION 5: VS Code Style (Dark and Subtle)
const VSCodeStyle = `
class='fixed inset-0 bg-gray-800 bg-opacity-15 backdrop-blur-sm z-40'
style={{ "backdrop-filter": "blur(3px)" }}
`;

// OPTION 6: Discord Style (Gaming)
const DiscordStyle = `
class='fixed inset-0 bg-indigo-900 bg-opacity-25 backdrop-blur-md z-40'
style={{ "backdrop-filter": "blur(6px)" }}
`;

// OPTION 7: Figma Style (Design Tool)
const FigmaStyle = `
class='fixed inset-0 bg-gray-100 bg-opacity-50 backdrop-blur-sm z-40'
style={{ "backdrop-filter": "blur(8px) brightness(1.1)" }}
`;

// OPTION 8: Notion Style (Clean)
const NotionStyle = `
class='fixed inset-0 bg-gray-50 bg-opacity-60 backdrop-blur-md z-40'
style={{ "backdrop-filter": "blur(10px)" }}
`;

export {
  GlassMorphismBackdrop,
  MinimalBlur,
  MediumDarkBlur,
  FrostedGlass,
  VSCodeStyle,
  DiscordStyle,
  FigmaStyle,
  NotionStyle
};
