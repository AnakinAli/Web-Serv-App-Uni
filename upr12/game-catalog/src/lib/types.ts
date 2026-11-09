export type Game = {
  id: number;
  title: string;
  genre: string;
  year: number;
  description: string;
  imageUrl: string;
  rating: number;
  developer: string;
};
export type GameInput = Omit<Game, "id"> & { id?: number };
