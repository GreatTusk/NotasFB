'use client';

import type { Note } from '@/types';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import NoteForm from './NoteForm';
import { useNotes } from '@/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';

interface NoteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  noteToEdit?: Note | null;
}

const NoteDialog: React.FC<NoteDialogProps> = ({ isOpen, onOpenChange, noteToEdit }) => {
  const { addNote, updateNote } = useNotes();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: { title?: string; content?: string }) => {
    setIsSubmitting(true);
    try {
      if (noteToEdit) {
        updateNote({ ...noteToEdit, title: values.title || '', content: values.content || '' });
        toast({ title: "Note Updated", description: "Your note has been successfully updated." });
      } else {
        addNote({ title: values.title || '', content: values.content || '' });
        toast({ title: "Note Created", description: "Your new note has been successfully created." });
      }
      onOpenChange(false); // Close dialog on success
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save note. Please try again." });
      console.error("Error saving note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{noteToEdit ? 'Edit Note' : 'Create New Note'}</DialogTitle>
          <DialogDescription>
            {noteToEdit ? 'Modify the details of your existing note.' : 'Fill in the details for your new note.'}
          </DialogDescription>
        </DialogHeader>
        <NoteForm
          note={noteToEdit}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
