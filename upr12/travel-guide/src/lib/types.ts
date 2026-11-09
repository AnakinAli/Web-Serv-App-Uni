export type Destination = {
  id: number;
  name: string;
  city: string;
  country: string;
  type: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  rating: number;
  estimatedBudget: number;
};
export type Review = {
  id: number;
  destinationId: number;
  author: string;
  text: string;
  rating: number;
};
export type DestinationInput = Omit<Destination, "id">;
export type ReviewInput = Omit<Review, "id">;
