import { TagManagement } from '@/components/TagManagement';

export const metadata = {
  title: 'Manage Tags | NoteVault',
  description: 'Create, edit and delete tags to organize your notes effectively.',
};

export default function TagsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tag Management</h1>
      <p className="text-muted-foreground mb-8">
        Create, edit, and delete tags to help organize your notes. Tags can be assigned to notes when creating or editing them.
      </p>
      <TagManagement />
    </div>
  );
}
