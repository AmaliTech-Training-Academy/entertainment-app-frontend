export interface MediaDetails {
  mediaId: number;
  mediaTypeEnum: string | null;
  title: string;
  synopsis: string | null;
  url: string | null;
  trailer: string | null;
  releaseDate: string;
  genres: string[];
  mimeType: string | null;
  filename: string | null;
  castMembers: string[];
  ratings: number | null;
  duration: number;
  commentCount: number;
  thumbnail_url: string | null;
  language: string | null;
  screenshots: string[];
  created_at: string | null;
  last_update_at: string | null;
  episodes: string[];
}

export interface MediaDetailsResponse {
  data: MediaDetails;
  status: number;
}