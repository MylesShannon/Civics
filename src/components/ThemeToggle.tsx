import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import type { ThemePreference } from '../utils/storage';
import { setThemePreference } from '../utils/storage';

function getInitialTheme(): ThemePreference {
  if (typeof document === 'undefined') return 'light';
  const attr = document.documentElement.dataset.theme;
  return attr === 'dark' ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setThemePreference(theme);
  }, [theme]);

  const isDark = theme === 'dark';
  const next: ThemePreference = isDark ? 'light' : 'dark';
  const label = `Switch to ${next} mode`;
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/25 bg-transparent text-white/85 cursor-pointer transition-colors duration-150 hover:text-white hover:bg-white/10 hover:border-white/45"
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}
