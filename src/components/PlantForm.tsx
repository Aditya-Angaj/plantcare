import React, { useState, useEffect } from 'react';
import { Plant } from '../types/Plant';
import { X, Upload, Loader2 } from 'lucide-react';

interface PlantFormProps {
  plant?: Plant;
  onSave: (plant: Plant) => void;
  onClose: () => void;
}

export function PlantForm({ plant, onSave, onClose }: PlantFormProps) {
  const [formData, setFormData] = useState<Omit<Plant, 'id'>>({
    name: '',
    species: '',
    wateringFrequency: 7,
    lastWatered: new Date().toISOString().split('T')[0],
    health: 'Good',
    image: '',
    notes: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (plant) {
      setFormData({
        name: plant.name,
        species: plant.species,
        wateringFrequency: plant.wateringFrequency,
        lastWatered: new Date(plant.lastWatered).toISOString().split('T')[0],
        health: plant.health,
        image: plant.image || '',
        notes: plant.notes || ''
      });
    }
  }, [plant]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: plant?.id || crypto.randomUUID(),
      ...formData
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-semibold mb-4">
          {plant ? 'Edit Plant' : 'Add New Plant'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Species</label>
            <input
              type="text"
              required
              value={formData.species}
              onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Watering Frequency (days)
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.wateringFrequency}
              onChange={(e) => setFormData({ ...formData, wateringFrequency: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Watered
            </label>
            <input
              type="date"
              required
              value={formData.lastWatered}
              onChange={(e) => setFormData({ ...formData, lastWatered: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Health</label>
            <select
              value={formData.health}
              onChange={(e) => setFormData({ ...formData, health: e.target.value as Plant['health'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plant Image</label>
            <div className="space-y-2">
              {formData.image && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={formData.image}
                    alt="Plant preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {!formData.image && (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-500 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                        <p className="text-xs text-gray-500">(Max 5MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Save Plant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}