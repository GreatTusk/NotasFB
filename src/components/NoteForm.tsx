'use client';

import type { Note } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TagSelector } from '@/components/TagSelector';
import { useState } from 'react';

const noteFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required if content is empty.' }).optional().or(z.literal('')),
  content: z.string().min(1, { message: 'Content is required if title is empty.' }).optional().or(z.literal('')),
}).refine(data => data.title || data.content, {
  message: 'Either title or content must be filled.',
  path: ['title'], // You can point this to 'title' or 'content' or a general form error
});


type NoteFormValues = z.infer<typeof noteFormSchema>;

interface NoteFormProps {
  note?: Note | null;
  onSubmit: (values: NoteFormValues & { tags: string[] }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({ note, onSubmit, onCancel, isSubmitting }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(note?.tags || []);

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: note?.title || '',
      content: note?.content || '',
    },
  });

  const handleSubmit = (values: NoteFormValues) => {
    onSubmit({ ...values, tags: selectedTags });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter note title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter note content" className="min-h-[200px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <TagSelector
              selectedTagIds={selectedTags}
              onChange={setSelectedTags}
            />
          </FormControl>
        </FormItem>

        {form.formState.errors.root && (
           <FormMessage>{form.formState.errors.root.message}</FormMessage>
        )}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (note ? 'Saving...' : 'Creating...') : (note ? 'Save Changes' : 'Create Note')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NoteForm;
