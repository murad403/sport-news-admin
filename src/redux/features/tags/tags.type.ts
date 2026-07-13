export interface Tag {
  id: string;
  name: string;
  slug: string;
  news_count?: number;
}

export interface GetTagsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tag[];
}

export interface GetTagsQueryArg {
  page?: number;
  search?: string;
}

export interface AddTagRequest {
  name: string;
}

export interface AddTagResponse {
  id: string;
  name: string;
  slug: string;
}

export interface UpdateTagRequest {
  slug: string;
  data: {
    name: string;
  };
}

export interface UpdateTagResponse {
  id: string;
  name: string;
  slug: string;
}
