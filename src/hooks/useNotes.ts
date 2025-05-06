'use client';

import NoteContext from '@/contexts/NoteContext';
import { useContext } from 'react';

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};
