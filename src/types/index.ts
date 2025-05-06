export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type SortOption = 'createdAt_desc' | 'createdAt_asc' | 'title_asc' | 'title_desc';
