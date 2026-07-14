import z from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, "Article title is required"),
  description: z.string().optional(),
  content: z.string().min(10, "Article content must be at least 10 characters long"),
  image: z.any().optional(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  tags: z.array(z.string()).min(1, "Select at least one tag"),
  language: z.string().min(1, "Language is required"),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;
