import React from 'react';
import { Plant } from '../types/Plant';
import { Droplet, Heart, Edit, Trash2, Calendar } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
  onEdit: (plant: Plant) => void;
  onDelete: () => void;
}

export function PlantCard({ plant, onEdit, onDelete }: PlantCardProps) {
  const healthColors = {
    Excellent: 'text-green-500',
    Good: 'text-green-400',
    Fair: 'text-yellow-500',
    Poor: 'text-red-500'
  };

  const daysUntilWatering = () => {
    const lastWatered = new Date(plant.lastWatered);
    const nextWatering = new Date(lastWatered);
    nextWatering.setDate(lastWatered.getDate() + plant.wateringFrequency);
    const today = new Date();
    const daysLeft = Math.ceil((nextWatering.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48 overflow-hidden">
        <img
          src={plant.image || 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&auto=format&fit=crop&q=80'}
          alt={plant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => onEdit(plant)}
            className="p-2 bg-white/90 rounded-full hover:bg-white"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-white/90 rounded-full hover:bg-white hover:text-red-500"
          >
            <Trash2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{plant.name}</h3>
        <p className="text-sm text-gray-600 italic mb-3">{plant.species}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-blue-500" />
            <span className="text-sm">
              {daysUntilWatering()} days until next watering
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Heart className={`w-4 h-4 ${healthColors[plant.health]}`} />
            <span className="text-sm">Health: {plant.health}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              Last watered: {new Date(plant.lastWatered).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {plant.notes && (
          <p className="mt-3 text-sm text-gray-600 italic">
            "{plant.notes}"
          </p>
        )}
      </div>
    </div>
  );
}