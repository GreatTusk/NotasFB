'use client';

import type { Note, SortOption } from '@/types';
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface NoteContextType {
  notes: Note[];
  filteredNotes: Note[]; // Notes after applying search/filters
  isLoading: boolean;
  addNote: (newNote: Pick<Note, 'title' | 'content' | 'tags'>) => void;
  updateNote: (updatedNote: Note) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  togglePinNote: (id: string) => void; // Toggle note pin status
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTagFilter: string | null;
  setSelectedTagFilter: (tagId: string | null) => void;
  getTagCount: () => Record<string, number>; // For tag summary
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'notevault_notes';

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOptionState] = useState<SortOption>('createdAt_desc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        // Handle migration of existing notes to include new fields
        const migratedNotes = parsedNotes.map((note: any) => ({
          ...note,
          tags: note.tags || [],
          isPinned: note.isPinned || false
        }));
        setNotes(migratedNotes);
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
    // First separate pinned and unpinned notes
    const pinnedNotes = notesToSort.filter(note => note.isPinned);
    const unpinnedNotes = notesToSort.filter(note => !note.isPinned);

    // Sort both arrays separately
    const sortFn = (a: Note, b: Note) => {
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
    };

    const sortedPinned = [...pinnedNotes].sort(sortFn);
    const sortedUnpinned = [...unpinnedNotes].sort(sortFn);

    // Return pinned notes first, then unpinned
    return [...sortedPinned, ...sortedUnpinned];
  }, []);
  
  // Apply filters and search to notes
  useEffect(() => {
    let result = [...notes];

    // Apply tag filter if selected
    if (selectedTagFilter) {
      result = result.filter(note => note.tags.includes(selectedTagFilter));
    }

    // Apply search term if provided
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(note =>
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower)
      );
    }

    // Sort the filtered results
    result = sortNotes(result, sortOption);

    setFilteredNotes(result);
  }, [notes, selectedTagFilter, searchTerm, sortOption, sortNotes]);

  const addNote = useCallback((newNoteData: Pick<Note, 'title' | 'content' | 'tags'>) => {
    const now = new Date().toISOString();
    const noteToAdd: Note = {
      id: Date.now().toString(), // Simple ID generation
      ...newNoteData,
      tags: newNoteData.tags || [],
      isPinned: false,
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
      return updated;
    });
  }, [saveNotesToLocalStorage]);

  const getNoteById = useCallback((id: string) => {
    return notes.find(note => note.id === id);
  }, [notes]);

  const setSortOption = (option: SortOption) => {
    setSortOptionState(option);
  };

  // Toggle pin status of a note
  const togglePinNote = useCallback((id: string) => {
    setNotes(prevNotes => {
      const updated = prevNotes.map(note =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      );
      const sorted = sortNotes(updated, sortOption);
      saveNotesToLocalStorage(sorted);
      return sorted;
    });
  }, [saveNotesToLocalStorage, sortOption, sortNotes]);

  // Get count of notes by tag for summary
  const getTagCount = useCallback(() => {
    const tagCount: Record<string, number> = {};

    notes.forEach(note => {
      note.tags.forEach(tagId => {
        if (tagCount[tagId]) {
          tagCount[tagId]++;
        } else {
          tagCount[tagId] = 1;
        }
      });
    });

    return tagCount;
  }, [notes]);

  return (
    <NoteContext.Provider value={{
      notes,
      filteredNotes,
      isLoading,
      addNote,
      updateNote,
      deleteNote,
      getNoteById,
      sortOption,
      setSortOption,
      togglePinNote,
      searchTerm,
      setSearchTerm,
      selectedTagFilter,
      setSelectedTagFilter,
      getTagCount
    }}>
      {children}
    </NoteContext.Provider>
  );
};

export default NoteContext;
