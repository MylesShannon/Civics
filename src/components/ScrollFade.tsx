import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  className?: string;
  wrapperClassName?: string;
  fadeClassName?: string;
  children: ReactNode;
};

export function ScrollFade({
  className,
  wrapperClassName = 'relative flex-1 min-h-0',
  fadeClassName = 'from-surface',
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const overflowing = el.scrollHeight > el.clientHeight + 1;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      setShowFade(overflowing && !atBottom);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [children]);

  return (
    <div className={wrapperClassName}>
      <div ref={ref} className={className}>
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t to-transparent transition-opacity duration-150 ${fadeClassName} ${showFade ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
