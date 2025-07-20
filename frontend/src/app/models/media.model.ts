// models/media.ts
export interface MediaItem {
  mediaId: number;
  mediaType: string;
  title: string;
  releaseYear: number;
  thumbnailUrl: string;
  genres: string[];
  averageRating: number;
}

export interface PaginatedMediaResponse {
  data: {
    totalElements: number;
    totalPages: number;
    content: MediaItem[];
    number: number;
    size: number;
    first: boolean;
    last: boolean;
  };
  status: number;
  success: boolean;
  error: string[];
  message: string;
  timestamp: string;
}
