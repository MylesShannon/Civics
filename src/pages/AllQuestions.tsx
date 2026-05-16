import { useMemo, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { civics2025, CATEGORIES, type CivicsQuestion } from '../data/civics2025';
import { getDynamicAnswer } from '../data/currentCivicsAnswers';
import { QuestionBadge } from '../components/QuestionBadge';
import { btnGhost } from '../utils/styles';

export function AllQuestions() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return civics2025.filter((item) => {
      if (activeCategory && item.category !== activeCategory) return false;
      if (!q) return true;
      if (String(item.id) === q) return true;
      return item.question.toLowerCase().includes(q);
    });
  }, [query, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, CivicsQuestion[]>();
    for (const cat of CATEGORIES) map.set(cat, []);
    for (const q of filtered) map.get(q.category)?.push(q);
    return Array.from(map.entries()).filter(([, qs]) => qs.length > 0);
  }, [filtered]);

  const allExpanded = filtered.length > 0 && filtered.every((q) => expandedIds.has(q.id));

  const toggle = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filtered.map((q) => q.id)));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="m-0 text-navy dark:text-ink tracking-tight font-bold text-[clamp(1.4rem,1.6vw+0.9rem,1.9rem)]">
          All Questions
        </h1>
        <p className="m-0 text-ink-muted text-[0.95rem]">
          Browse all {civics2025.length} official USCIS civics questions.
        </p>
      </header>

      <div className="flex flex-col gap-3 bg-surface border border-line rounded-2xl p-4 shadow-sm">
        <label className="relative block">
          <span className="sr-only">Search questions</span>
          <Search
            size={16}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by question or number…"
            className="w-full min-h-[40px] pl-9 pr-9 py-2 rounded-lg bg-page border border-line text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-navy/40"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-ink-muted hover:text-ink hover:bg-surface-hover"
            >
              <X size={16} aria-hidden="true" />
            </button>
          ) : null}
        </label>

        <div className="flex flex-wrap gap-1.5">
          <CategoryChip
            label="All categories"
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              label={shortCategory(cat)}
              title={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-sm text-ink-muted">
            {filtered.length} of {civics2025.length} shown
          </span>
          <button
            type="button"
            onClick={toggleAll}
            disabled={filtered.length === 0}
            className={`${btnGhost} min-h-[36px] px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
      </div>

      {grouped.length === 0 ? (
        <p className="text-center text-ink-muted py-10">No questions match your filters.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(([category, items]) => (
            <section key={category} className="flex flex-col gap-2">
              <h2 className="m-0 text-navy dark:text-ink text-[0.95rem] uppercase tracking-wider">
                {category}
              </h2>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {items.map((q) => (
                  <QuestionRow
                    key={q.id}
                    question={q}
                    expanded={expandedIds.has(q.id)}
                    onToggle={() => toggle(q.id)}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionRow({
  question,
  expanded,
  onToggle,
}: {
  question: CivicsQuestion;
  expanded: boolean;
  onToggle: () => void;
}) {
  const dynamicAnswers =
    question.isDynamic && question.dynamicKey ? getDynamicAnswer(question.dynamicKey) : null;
  const panelId = `q-${question.id}-panel`;

  return (
    <li className="bg-surface border border-line rounded-xl shadow-sm overflow-hidden">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
        className="w-full flex items-center gap-3 text-left p-3 hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
      >
        <span className="inline-flex items-center justify-center min-w-[2.25rem] h-[2.25rem] px-2 rounded-full bg-navy text-white text-xs font-bold">
          {question.id}
        </span>
        <span className="flex-1 font-semibold text-ink leading-snug">{question.question}</span>
        <span className="hidden md:flex flex-wrap gap-1.5">
          {question.is6520Question ? <QuestionBadge kind="6520" /> : null}
          {question.isDynamic ? <QuestionBadge kind="current" /> : null}
          {question.id === 29 ? <QuestionBadge kind="address" /> : null}
        </span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={`shrink-0 text-ink-muted transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded ? (
        <div id={panelId} className="px-4 pb-4 pt-1 border-t border-line">
          <div className="flex md:hidden flex-wrap gap-1.5 pt-3">
            {question.is6520Question ? <QuestionBadge kind="6520" /> : null}
            {question.isDynamic ? <QuestionBadge kind="current" /> : null}
            {question.id === 29 ? <QuestionBadge kind="address" /> : null}
          </div>
          {dynamicAnswers && dynamicAnswers.length > 0 ? (
            <>
              <ul className="mt-3 pl-5 flex flex-col gap-1.5 text-base text-ink list-disc">
                {dynamicAnswers.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <p className="mt-3 px-3 py-2.5 border-l-[3px] border-line bg-surface-hover text-[0.85rem] text-ink-muted">
                <strong>Official PDF answer: </strong>
                {question.answers[0]}
              </p>
            </>
          ) : (
            <ul className="mt-3 pl-5 flex flex-col gap-1.5 text-base text-ink list-disc">
              {question.answers.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
          {question.note ? (
            <p className="mt-2 text-[0.85rem] text-ink-muted italic">Note: {question.note}</p>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

function CategoryChip({
  label,
  title,
  active,
  onClick,
}: {
  label: string;
  title?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
        active
          ? 'bg-navy text-white border-navy'
          : 'bg-surface text-ink border-line hover:bg-surface-hover'
      }`}
    >
      {label}
    </button>
  );
}

function shortCategory(category: string): string {
  const [, sub] = category.split(': ');
  return sub ?? category;
}
