'use client';

import { useState } from 'react';
import { useTags } from '@/hooks/useTags';
import { useNotes } from '@/hooks/useNotes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag as TagIcon, Pencil, Trash2, Plus, X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

export function TagManagement() {
  const { tags, addTag, updateTag, deleteTag } = useTags();
  const { notes, updateNote } = useNotes();
  const { toast } = useToast();
  const [newTagName, setNewTagName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<{ id: string, name: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);

  // Add new tag
  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    try {
      addTag({ name: newTagName.trim() });
      setNewTagName('');
      setError(null);
      toast({ title: "Tag Created", description: `Tag "${newTagName.trim()}" has been created.` });
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Edit tag name
  const startEditing = (tagId: string, tagName: string) => {
    setEditingTag({ id: tagId, name: tagName });
  };

  const cancelEditing = () => {
    setEditingTag(null);
    setError(null);
  };

  const saveTagEdit = () => {
    if (!editingTag) return;

    try {
      const tagToUpdate = tags.find(t => t.id === editingTag.id);
      if (tagToUpdate) {
        updateTag({ ...tagToUpdate, name: editingTag.name });
        toast({ title: "Tag Updated", description: `Tag name has been updated.` });
      }
      setEditingTag(null);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Delete tag
  const openDeleteDialog = (tagId: string) => {
    setTagToDelete(tagId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTag = () => {
    if (!tagToDelete) return;

    // First remove this tag from all notes
    const notesWithTag = notes.filter(note => note.tags.includes(tagToDelete));
    notesWithTag.forEach(note => {
      const updatedTags = note.tags.filter(id => id !== tagToDelete);
      updateNote({ ...note, tags: updatedTags });
    });

    // Then delete the tag
    deleteTag(tagToDelete);
    toast({
      title: "Tag Deleted",
      description: `Tag has been deleted and removed from ${notesWithTag.length} note${notesWithTag.length !== 1 ? 's' : ''}.`
    });

    setIsDeleteDialogOpen(false);
    setTagToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border shadow p-4">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <TagIcon className="h-5 w-5" />
          <span>Create New Tag</span>
        </h3>

        <div className="flex gap-2">
          <Input
            placeholder="Enter tag name"
            value={newTagName}
            onChange={e => setNewTagName(e.target.value)}
          />
          <Button
            onClick={handleCreateTag}
            disabled={!newTagName.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="bg-card rounded-lg border shadow">
        <h3 className="text-lg font-medium p-4 border-b">Manage Tags</h3>

        {tags.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No tags created yet.</p>
          </div>
        ) : (
          <ul className="divide-y">
            {tags.map(tag => (
              <li key={tag.id} className="p-4 flex items-center justify-between">
                {editingTag && editingTag.id === tag.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editingTag.name}
                      onChange={e => setEditingTag({...editingTag, name: e.target.value})}
                      className="max-w-[300px]"
                    />
                    <Button size="sm" variant="ghost" onClick={cancelEditing}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={saveTagEdit} disabled={!editingTag.name.trim()}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Badge className="px-3 py-1 text-base">
                    <TagIcon className="h-4 w-4 mr-2" />
                    {tag.name}
                  </Badge>
                )}

                {!editingTag && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEditing(tag.id, tag.name)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit tag</span>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(tag.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete tag</span>
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete tag confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tag? It will be removed from all notes.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTag}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
