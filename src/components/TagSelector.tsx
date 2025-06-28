'use client';

import { useState } from 'react';
import { Tag } from '@/types';
import { useTags } from '@/hooks/useTags';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TagSelectorProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagSelector({ selectedTagIds, onChange }: TagSelectorProps) {
  const { tags, addTag } = useTags();
  const [newTagName, setNewTagName] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));
  const availableTags = tags.filter(tag => !selectedTagIds.includes(tag.id));

  const handleRemoveTag = (tagId: string) => {
    onChange(selectedTagIds.filter(id => id !== tagId));
  };

  const handleAddExistingTag = (tagId: string) => {
    onChange([...selectedTagIds, tagId]);
    setOpen(false);
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    try {
      const newTag = addTag({ name: newTagName.trim() });
      onChange([...selectedTagIds, newTag.id]);
      setNewTagName('');
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
            {tag.name}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0"
              onClick={() => handleRemoveTag(tag.id)}
            >
              <X size={12} />
              <span className="sr-only">Remove {tag.name}</span>
            </Button>
          </Badge>
        ))}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="h-7 gap-1 text-muted-foreground"
            >
              <TagIcon size={16} />
              <span>Add Tag</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="start">
            <div className="space-y-4">
              {/* Create new tag */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Create a new tag</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tag name"
                    value={newTagName}
                    onChange={e => setNewTagName(e.target.value)}
                    className="h-8"
                  />
                  <Button
                    onClick={handleCreateTag}
                    size="sm"
                    variant="secondary"
                    disabled={!newTagName.trim()}
                    className="h-8"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
              </div>

              {/* Existing tags */}
              {availableTags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Or select an existing tag</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleAddExistingTag(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
