export interface Newsletter {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

export interface GetNewslettersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Newsletter[];
}

export interface GetNewslettersQueryArg {
  page?: number;
  search?: string;
}
