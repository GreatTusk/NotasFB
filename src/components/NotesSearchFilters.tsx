'use client';

import { useNotes } from '@/hooks/useNotes';
import { useTags } from '@/hooks/useTags';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Tag as TagIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function NotesSearchFilters() {
  const { searchTerm, setSearchTerm, selectedTagFilter, setSelectedTagFilter } = useNotes();
  const { tags } = useTags();
  const [searchInputValue, setSearchInputValue] = useState(searchTerm);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInputValue);
  };

  const clearSearch = () => {
    setSearchInputValue('');
    setSearchTerm('');
  };

  const clearTagFilter = () => {
    setSelectedTagFilter(null);
  };

  const selectedTag = selectedTagFilter ? tags.find(tag => tag.id === selectedTagFilter) : null;

  return (
    <div className="space-y-4 mb-6">
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes by title or content..."
          className="pl-8 pr-10"
          value={searchInputValue}
          onChange={e => setSearchInputValue(e.target.value)}
        />
        {searchInputValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-9 w-9 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </form>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2">
          <TagIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by tag:</span>
        </div>

        <Select
          value={selectedTagFilter || 'all'}
          onValueChange={value => setSelectedTagFilter(value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tags</SelectItem>
            {tags.map(tag => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedTag && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <span>Showing: {selectedTag.name}</span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0"
              onClick={clearTagFilter}
            >
              <X size={12} />
              <span className="sr-only">Clear tag filter</span>
            </Button>
          </Badge>
        )}
      </div>
    </div>
  );
}
