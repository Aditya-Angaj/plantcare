export interface Plant {
  id: string;
  name: string;
  species: string;
  wateringFrequency: number;
  lastWatered: string;
  health: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  image?: string;
  notes?: string;
}