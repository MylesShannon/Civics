import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-surface border-t border-line shadow-[0_-1px_8px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex items-stretch justify-around list-none m-0 p-0">
        {NAV_ITEMS.map(({ to, label, Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              aria-label={label}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 min-h-[56px] px-1 py-1.5 no-underline transition-colors duration-150 ${
                  isActive ? 'text-red dark:text-fail-text' : 'text-ink-muted hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} aria-hidden="true" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[0.7rem] font-semibold leading-tight">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
