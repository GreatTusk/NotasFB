'use client';

import type { Tag } from '@/types';
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface TagContextType {
  tags: Tag[];
  isLoading: boolean;
  addTag: (tagData: Pick<Tag, 'name' | 'color'>) => Tag;
  updateTag: (updatedTag: Tag) => void;
  deleteTag: (id: string) => void;
  getTagById: (id: string) => Tag | undefined;
  getTagsByIds: (ids: string[]) => Tag[];
}

const TagContext = createContext<TagContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'notevault_tags';

export const TagProvider = ({ children }: { children: ReactNode }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedTags = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTags) {
        setTags(JSON.parse(storedTags));
      }
    } catch (error) {
      console.error("Failed to load tags from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const saveTagsToLocalStorage = useCallback((updatedTags: Tag[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTags));
    } catch (error) {
      console.error("Failed to save tags to localStorage", error);
    }
  }, []);

  const addTag = useCallback((tagData: Pick<Tag, 'name' | 'color'>): Tag => {
    const newTag: Tag = {
      id: Date.now().toString(),
      ...tagData,
    };

    setTags(prevTags => {
      // Check if a tag with this name already exists
      const nameExists = prevTags.some(t =>
        t.name.toLowerCase() === tagData.name.toLowerCase());

      if (nameExists) {
        throw new Error('A tag with this name already exists.');
      }

      const updated = [...prevTags, newTag];
      saveTagsToLocalStorage(updated);
      return updated;
    });

    return newTag;
  }, [saveTagsToLocalStorage]);

  const updateTag = useCallback((updatedTag: Tag) => {
    setTags(prevTags => {
      // Check for duplicate name
      const nameExists = prevTags.some(t =>
        t.id !== updatedTag.id &&
        t.name.toLowerCase() === updatedTag.name.toLowerCase());

      if (nameExists) {
        throw new Error('A tag with this name already exists.');
      }

      const updated = prevTags.map(tag =>
        tag.id === updatedTag.id ? updatedTag : tag
      );
      saveTagsToLocalStorage(updated);
      return updated;
    });
  }, [saveTagsToLocalStorage]);

  const deleteTag = useCallback((id: string) => {
    setTags(prevTags => {
      const updated = prevTags.filter(tag => tag.id !== id);
      saveTagsToLocalStorage(updated);
      return updated;
    });
  }, [saveTagsToLocalStorage]);

  const getTagById = useCallback((id: string) => {
    return tags.find(tag => tag.id === id);
  }, [tags]);

  const getTagsByIds = useCallback((ids: string[]) => {
    return tags.filter(tag => ids.includes(tag.id));
  }, [tags]);

  return (
    <TagContext.Provider value={{
      tags,
      isLoading,
      addTag,
      updateTag,
      deleteTag,
      getTagById,
      getTagsByIds
    }}>
      {children}
    </TagContext.Provider>
  );
};

export default TagContext;
