import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder to avoid server-client mismatch and layout shift
    return <div style={{ width: "4em", height: "2.2em" }} />;
  }

  const isLightMode = theme === "light";

  const toggleTheme = () => {
    setTheme(isLightMode ? "dark" : "light");
  };

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={isLightMode}
        onChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <span className="slider">
        <div className="star star_1"></div>
        <div className="star star_2"></div>
        <div className="star star_3"></div>
        <svg
          className="cloud"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 100 100"
        >
          <path
            d="M 95.67,54.3 C 95.2,49.33 92.73,44.83 88.8,41.9 C 84.87,38.97 79.9,38.1 75.2,39.43 C 74.93,32.2 71.33,25.53 65.6,21.2 C 59.87,16.87 52.6,15.47 45.5,17.37 C 36.83,14.9 27.3,16.87 20.13,22.63 C 12.97,28.4 9.3,37.2 10.1,46.27 C 4.37,48.13 0,53.8 0,60.23 C 0,68.83 7.17,76 15.77,76 L 79.2,76 C 88.33,76 95.97,68.4 95.67,59.3 Z"
            fill="#fff"
          ></path>
        </svg>
      </span>
    </label>
  );
};