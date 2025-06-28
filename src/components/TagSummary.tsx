'use client';

import { useNotes } from '@/hooks/useNotes';
import { useTags } from '@/hooks/useTags';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag as TagIcon } from 'lucide-react';

export function TagSummary() {
  const { getTagCount } = useNotes();
  const { tags } = useTags();

  const tagCounts = getTagCount();
  const sortedTags = [...tags]
    .filter(tag => tagCounts[tag.id]) // Only show tags that have notes
    .sort((a, b) => (tagCounts[b.id] || 0) - (tagCounts[a.id] || 0)); // Sort by count

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TagIcon className="h-5 w-5" />
          <span>Tags Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTags.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No tags assigned to notes yet.
          </p>
        ) : (
          <div className="space-y-2">
            {sortedTags.map(tag => (
              <div key={tag.id} className="flex items-center justify-between">
                <Badge variant="outline" className="px-2 py-1">
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag.name}
                </Badge>
                <Badge variant="secondary">
                  {tagCounts[tag.id]} {tagCounts[tag.id] === 1 ? 'note' : 'notes'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
