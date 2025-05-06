'use client';

import React, { useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import NoteListItem from './NoteListItem';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListFilter, FileText } from 'lucide-react';
import NoteDialog from './NoteDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SortOption } from '@/types';

const NoteListPageClient: React.FC = () => {
  const { notes, isLoading, sortOption, setSortOption } = useNotes();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-semibold text-foreground">My Notes</h2>
        <div className="flex gap-2 items-center">
           <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-[180px]" aria-label="Sort notes by">
              <ListFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt_desc">Newest First</SelectItem>
              <SelectItem value="createdAt_asc">Oldest First</SelectItem>
              <SelectItem value="title_asc">Title (A-Z)</SelectItem>
              <SelectItem value="title_desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreateDialogOpen(true)} aria-label="Create new note">
            <PlusCircle className="h-5 w-5 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-muted rounded-lg">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl font-medium text-muted-foreground">No notes yet.</p>
          <p className="text-muted-foreground">Click "New Note" to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notes.map(note => (
            <NoteListItem key={note.id} note={note} />
          ))}
        </div>
      )}

      {isCreateDialogOpen && (
        <NoteDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      )}
    </div>
  );
};

const CardSkeleton: React.FC = () => (
  <div className="p-4 border rounded-lg shadow space-y-3 bg-card">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-16 w-full" />
    <div className="flex justify-end space-x-2 pt-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);


export default NoteListPageClient;
