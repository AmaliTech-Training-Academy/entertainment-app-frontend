export interface Screenshot {
  screenshotId: number;
  imageUrl: string;
}

export interface MediaDetails {
  mediaId: number;
  title: string;
  mediaType: string;
  synopsis: string;
  mediaUrl: string;
  thumbnailUrl: string;
  trailerUrl: string;
  releaseYear: number;
  duration: number;
  language: string;
  averageRating: number;
  genres: string[];
  episodeList: any[];
  castMembers: any[];
  reviews: any[];
  comments: any[];
  screenshots: Screenshot[];
}

export interface MediaDetailsResponse {
  data: MediaDetails;
  status: number;
  success: boolean;
  error: string[] | null;
  message: string | null;
  timestamp: string;
}
