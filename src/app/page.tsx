import NoteListPageClient from '@/components/NoteListPageClient';
import { TagSummary } from '@/components/TagSummary';

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <NoteListPageClient />
      </div>
      <div className="lg:col-span-1">
        <TagSummary />
      </div>
    </div>
  );
}
