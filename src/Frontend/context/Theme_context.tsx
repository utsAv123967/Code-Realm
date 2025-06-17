import { createContext, createSignal, useContext } from "solid-js";
import { type Setter } from "solid-js";

// Define proper type for the context value
// type ThemeContextType = [() => boolean, Setter<boolean>];

// Create context with proper type
const ThemeContext = createContext<[() => boolean, Setter<boolean>]>();

export const ThemeProvider = (props: { children: any }) => {
  const [darkMode, setDarkMode] = createSignal(true);

  return (
    <ThemeContext.Provider value={[darkMode, setDarkMode]}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
