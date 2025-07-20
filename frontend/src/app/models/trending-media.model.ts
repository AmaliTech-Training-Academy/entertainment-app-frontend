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

export interface CreateMediaRequest {
  mediaTypeEnum: 'MOVIE' | 'TV_SHOW';
  title: string;
  synopsis: string;
  url: string;
  releaseDate: string; // ISO string
  releaseYear: number;
  duration: number;
  thumbnailUrl: string;
  trailer: string;
  language: 'ENGLISH' | 'FRENCH' | 'SPANISH' | string;
  genres: string[];
  castMembers: {
    actorId: number;
    mediaRoles: string[];
  }[];
}

export interface Actor {
  actorId: number;
  name: string;
}