export interface Activity {
  id: string;
  actor_name: string;
  action: string;
  content_type: string;
  object_id: string;
  object_repr: string;
  note: string;
  created_at: string;
}

export interface GetActivityResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Activity[];
}

export interface NewsAnalyticsTrend {
  day: string;
  count: number;
}

export interface NewsSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  total_views: number;
  new_last_7_days: number;
}

export interface NewsletterSummary {
  total: number;
  active: number;
}

export interface UsersByRole {
  [role: string]: number;
}

export interface UsersSummary {
  total: number;
  new_last_7_days: number;
  by_role: UsersByRole;
}

export interface DashboardSummaryResponse {
  news: NewsSummary;
  categories_count: number;
  tags_count: number;
  newsletter: NewsletterSummary;
  users: UsersSummary;
  transfers_count: number;
}
