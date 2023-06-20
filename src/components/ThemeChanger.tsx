import React, { useEffect, useState } from "react";
import styles from "@/styles/NavStyles.module.css";

import { useTheme } from "next-themes";

export const ThemeChanger: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <a>
      {theme === "dark" ? (
        <button
          className={styles.theme_picker}
          onClick={() => setTheme("light")}
        >
          light
        </button>
      ) : (
        <button
          className={styles.theme_picker}
          onClick={() => setTheme("dark")}
        >
          dark
        </button>
      )}
    </a>
  );
};
