'use client';

import { topicBySlug, topics } from '@/lib/topics';
import { Chip } from '@/components/ui/Chip';

export function TopicFilter({
  topic,
  onChange,
}: {
  topic: string;
  onChange: (slug: string) => void;
}) {
  const selected = topicBySlug(topic)?.slug ?? '';

  return (
    <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
      <Chip pressed={selected === ''} onClick={() => onChange('')}>
        All
      </Chip>
      {topics.map((item) => (
        <Chip key={item.slug} pressed={selected === item.slug} onClick={() => onChange(item.slug)}>
          {item.label}
        </Chip>
      ))}
    </div>
  );
}
