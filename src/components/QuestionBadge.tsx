import { Star, Calendar, MapPin } from 'lucide-react';
import { currentCivicsAnswers } from '../data/currentCivicsAnswers';

type BadgeKind = '6520' | 'current' | 'address';

const formattedVerifiedDate = new Date(currentCivicsAnswers.lastVerified + 'T00:00:00').toLocaleDateString(
  'en-US',
  { year: 'numeric', month: 'long', day: 'numeric' },
);

const LABELS: Record<BadgeKind, string> = {
  '6520': '65/20 question',
  current: `Current answer — verified ${formattedVerifiedDate}`,
  address: 'Verify by home address before interview.',
};

const STYLES: Record<BadgeKind, string> = {
  '6520': 'bg-badge-6520-bg border-badge-6520-border text-badge-6520-text',
  current: 'bg-badge-current-bg border-badge-current-border text-badge-current-text',
  address: 'bg-badge-address-bg border-badge-address-border text-badge-address-text',
};

export function QuestionBadge({ kind }: { kind: BadgeKind }) {
  const Icon = kind === '6520' ? Star : kind === 'current' ? Calendar : MapPin;
  return (
    <span
      role="note"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.78rem] font-semibold border whitespace-nowrap ${STYLES[kind]}`}
    >
      <Icon size={14} aria-hidden="true" />
      <span>{LABELS[kind]}</span>
    </span>
  );
}
