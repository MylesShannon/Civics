function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

const btnBase =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-[18px] py-[10px] rounded-xl font-semibold text-base no-underline shadow-sm hover:shadow-md active:translate-y-px transition-[background-color,border-color,color,box-shadow] duration-150 cursor-pointer';

export const btnPrimary = cn(
  btnBase,
  'bg-red text-white border border-red hover:bg-red-dark hover:border-red-dark',
);

export const btnSecondary = cn(
  btnBase,
  'bg-navy text-white border border-navy hover:bg-navy-dark hover:border-navy-dark',
);

export const btnCorrect = cn(
  btnBase,
  'bg-success text-white border border-success hover:bg-success-dark hover:border-success-dark',
);

export const btnIncorrect = cn(
  btnBase,
  'bg-red text-white border border-red hover:bg-red-dark hover:border-red-dark',
);

export const btnGhost = cn(
  btnBase,
  'bg-transparent text-ink border border-line shadow-none hover:bg-surface-hover hover:shadow-none',
);

export const btnGhostDanger = cn(
  btnBase,
  'bg-transparent text-red border border-red/30 shadow-none hover:bg-red/[0.06] hover:shadow-none dark:text-fail-text dark:border-fail-text/30 dark:hover:bg-fail-text/[0.08]',
);
