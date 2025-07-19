// models/trending-media.ts
export interface TrendingMedia {
  mediaId: number;
  mediaType: string;
  title: string;
  releaseYear: number;
  thumbnailUrl: string;
  genres: string[];
  averageRating: number;
}

export interface TrendingMediaResponse {
  data: TrendingMedia[];
  status: number;
  success: boolean;
  error: string | null;
  message: string | null;
  timestamp: string;
}
