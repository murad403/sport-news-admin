export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleTag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  display_image: string | null;
  image_url: string | null;
  link: string | null;
  categories: ArticleCategory[];
  tags: ArticleTag[];
  author_name: string;
  source_name: string | null;
  source_url: string | null;
  language: string;
  sentiment: "positive" | "neutral" | "negative" | null;
  pub_date: string | null;
  is_featured: boolean;
  views_count: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GetArticlesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}

export interface GetArticlesQueryArg {
  page?: number;
  search?: string;
  category?: string;
  status?: string;
}
