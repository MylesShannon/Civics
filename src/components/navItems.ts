import type { LucideIcon } from 'lucide-react';
import { Home, BookOpen, ClipboardCheck, Repeat, List, BarChart3 } from 'lucide-react';

type NavItem = {
  to: string;
  label: string;
  Icon: LucideIcon;
  end?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', Icon: Home, end: true },
  { to: '/study', label: 'Study', Icon: BookOpen },
  { to: '/quiz', label: 'Quiz', Icon: ClipboardCheck },
  { to: '/missed', label: 'Missed', Icon: Repeat },
  { to: '/all', label: 'All', Icon: List },
  { to: '/stats', label: 'Stats', Icon: BarChart3 },
];
