'use client';

import type { Note } from '@/types';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import NoteDialog from './NoteDialog';
import { useNotes } from '@/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';

interface NoteListItemProps {
  note: Note;
}

const NoteListItem: React.FC<NoteListItemProps> = ({ note }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { deleteNote } = useNotes();
  const { toast } = useToast();

  const handleDelete = () => {
    deleteNote(note.id);
    toast({ title: "Note Deleted", description: "The note has been successfully deleted." });
  };

  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">{note.title || 'Untitled Note'}</CardTitle>
          <div className="text-xs text-muted-foreground flex items-center pt-1">
            <CalendarDays className="h-3 w-3 mr-1" />
            <span>Last updated: {format(new Date(note.updatedAt), 'MMM d, yyyy HH:mm')}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="text-sm text-foreground whitespace-pre-wrap">
            {truncateContent(note.content)}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t pt-4 mt-auto">
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)} aria-label={`Edit note ${note.title || 'Untitled Note'}`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)} aria-label={`Delete note ${note.title || 'Untitled Note'}`}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        itemName={`note "${note.title || 'Untitled Note'}"`}
      />
      
      {isEditDialogOpen && (
        <NoteDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          noteToEdit={note}
        />
      )}
    </>
  );
};

export default NoteListItem;
