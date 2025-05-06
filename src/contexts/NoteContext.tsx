'use client';

import type { Note, SortOption } from '@/types';
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface NoteContextType {
  notes: Note[];
  isLoading: boolean;
  addNote: (newNote: Pick<Note, 'title' | 'content'>) => void;
  updateNote: (updatedNote: Note) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'notevault_notes';

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOptionState] = useState<SortOption>('createdAt_desc');

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error("Failed to load notes from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const saveNotesToLocalStorage = useCallback((updatedNotes: Note[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedNotes));
    } catch (error) {
      console.error("Failed to save notes to localStorage", error);
    }
  }, []);

  const sortNotes = useCallback((notesToSort: Note[], option: SortOption): Note[] => {
    return [...notesToSort].sort((a, b) => {
      switch (option) {
        case 'createdAt_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'createdAt_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, []);
  
  useEffect(() => {
    setNotes(prevNotes => sortNotes(prevNotes, sortOption));
  }, [sortOption, sortNotes]);


  const addNote = useCallback((newNoteData: Pick<Note, 'title' | 'content'>) => {
    const now = new Date().toISOString();
    const noteToAdd: Note = {
      id: Date.now().toString(), // Simple ID generation
      ...newNoteData,
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prevNotes => {
      const updated = sortNotes([noteToAdd, ...prevNotes], sortOption);
      saveNotesToLocalStorage(updated);
      return updated;
    });
  }, [saveNotesToLocalStorage, sortOption, sortNotes]);

  const updateNote = useCallback((updatedNoteData: Note) => {
    const now = new Date().toISOString();
    setNotes(prevNotes => {
      const updated = prevNotes.map(note =>
        note.id === updatedNoteData.id ? { ...updatedNoteData, updatedAt: now } : note
      );
      const sorted = sortNotes(updated, sortOption);
      saveNotesToLocalStorage(sorted);
      return sorted;
    });
  }, [saveNotesToLocalStorage, sortOption, sortNotes]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prevNotes => {
      const updated = prevNotes.filter(note => note.id !== id);
      saveNotesToLocalStorage(updated);
      // No need to re-sort here as filtering maintains order relative to sortOption
      return updated;
    });
  }, [saveNotesToLocalStorage]);

  const getNoteById = useCallback((id: string) => {
    return notes.find(note => note.id === id);
  }, [notes]);

  const setSortOption = (option: SortOption) => {
    setSortOptionState(option);
  };


  return (
    <NoteContext.Provider value={{ notes, isLoading, addNote, updateNote, deleteNote, getNoteById, sortOption, setSortOption }}>
      {children}
    </NoteContext.Provider>
  );
};

export default NoteContext;
