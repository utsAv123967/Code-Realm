// Ultra-Subtle Backdrop Options for Chat Modal
// Replace the backdrop div with any of these for different effects

/* 
CURRENT: Pure Blur (No Background Color)
class='fixed inset-0 backdrop-blur-sm z-40'
style={{ "backdrop-filter": "blur(3px)" }}
*/

// OPTION 1: Minimal Gray Tint (Very Subtle)
const MinimalGrayTint = `
class='fixed inset-0 bg-gray-500 bg-opacity-5 backdrop-blur-sm z-40'
style={{ "backdrop-filter": "blur(2px)" }}
`;

// OPTION 2: Just a Tiny Blur (Almost Invisible)
const TinyBlur = `
class='fixed inset-0 backdrop-blur-sm z-40'
style={{ "backdrop-filter": "blur(1px)" }}
`;

// OPTION 3: Glass Effect (Slightly More Visible)
const GlassEffect = `
class='fixed inset-0 bg-white bg-opacity-5 backdrop-blur-sm z-40'
style={{ "backdrop-filter": "blur(4px) brightness(1.05)" }}
`;

// OPTION 4: Dark Tint (Very Light)
const DarkTint = `
class='fixed inset-0 bg-black bg-opacity-5 backdrop-blur-sm z-40'
style={{ "backdrop-filter": "blur(3px)" }}
`;

// OPTION 5: No Background Color at All (Pure Blur)
const PureBlur = `
class='fixed inset-0 z-40'
style={{ "backdrop-filter": "blur(2px)" }}
`;

export {
  MinimalGrayTint,
  TinyBlur, 
  GlassEffect,
  DarkTint,
  PureBlur
};
