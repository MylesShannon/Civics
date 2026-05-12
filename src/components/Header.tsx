import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Flag, Home, BookOpen, ClipboardCheck, Repeat, BarChart3 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const navLinkBase =
  'inline-flex items-center justify-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-full font-semibold text-sm no-underline transition-colors duration-150';
const navLinkInactive = 'text-white/85 hover:text-white hover:bg-white/10';
const navLinkActive = 'bg-white text-navy';

type NavItem = {
  to: string;
  label: string;
  Icon: LucideIcon;
  end?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', Icon: Home, end: true },
  { to: '/study', label: 'Study', Icon: BookOpen },
  { to: '/quiz', label: 'Quiz', Icon: ClipboardCheck },
  { to: '/missed', label: 'Missed', Icon: Repeat },
  { to: '/stats', label: 'Stats', Icon: BarChart3 },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-navy text-white shadow-sm">
      <div className="max-w-[880px] mx-auto flex items-center justify-between gap-3 px-4 py-3 min-h-[60px]">
        <NavLink
          to="/"
          aria-label="USCIS 2025 Civics Trainer home"
          className="inline-flex items-center gap-2.5 text-white no-underline font-bold text-base hover:text-gold focus-visible:text-gold"
        >
          <Flag aria-hidden="true" size={22} />
          <span className="hidden sm:inline">USCIS 2025 Civics Trainer</span>
        </NavLink>
        <nav aria-label="Primary" className="flex items-center gap-1.5">
          {NAV_ITEMS.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              aria-label={label}
              title={label}
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
              }
            >
              <Icon size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
