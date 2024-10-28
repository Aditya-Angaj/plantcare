export interface Plant {
  id: string;
  name: string;
  species: string;
  wateringFrequency: number; // days
  lastWatered: string;
  health: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  notes: string;
  imageUrl: string;
}