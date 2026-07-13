export interface Category {
  id: string;
  name: string;
  slug: string;
  news_count?: number;
}

export interface GetCategoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export interface GetCategoriesQueryArg {
  page?: number;
  search?: string;
}

export interface AddCategoryRequest {
  name: string;
}

export interface AddCategoryResponse {
  id: string;
  name: string;
  slug: string;
}

export interface UpdateCategoryRequest {
  id: string;
  body: {
    name: string;
  };
}

export interface UpdateCategoryResponse {
  id: string;
  name: string;
  slug: string;
}
