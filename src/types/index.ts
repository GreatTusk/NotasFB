export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  tags: string[]; // Array of tag IDs
  isPinned: boolean; // For pinned notes feature
}

export interface Tag {
  id: string;
  name: string;
  color?: string; // Optional color for visual distinction
}

export type SortOption = 'createdAt_desc' | 'createdAt_asc' | 'title_asc' | 'title_desc';
