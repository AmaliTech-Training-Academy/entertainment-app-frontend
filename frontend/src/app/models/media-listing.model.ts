export interface MediaListing {
  mediaId: number;
  mediaType: 'MOVIE' | 'TV';
  title: string;
  releaseYear: number;
  thumbnailUrl: string;
  genres: string[];
  averageRating: number;
}


export interface GenreChartData {
  name: string;
  value: number;
}

