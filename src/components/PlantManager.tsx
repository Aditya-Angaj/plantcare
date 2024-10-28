import React, { useState, useEffect } from 'react';
import { Plant } from '../types/Plant';
import { PlantCard } from './PlantCard';
import { PlantForm } from './PlantForm';
import { Plus, Leaf, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';

export function PlantManager() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | undefined>();
  const { user, token, logout } = useAuth();

  useEffect(() => {
    if (user && token) {
      api.getPlants(token)
        .then(setPlants)
        .catch(console.error);
    }
  }, [user, token]);

  const handleSavePlant = async (plant: Plant) => {
    if (!user || !token) return;

    try {
      if (selectedPlant) {
        const updatedPlant = await api.updatePlant(plant.id, plant, token);
        setPlants(plants.map(p => p.id === plant.id ? updatedPlant : p));
      } else {
        const newPlant = await api.createPlant(plant, token);
        setPlants([...plants, newPlant]);
      }
      setSelectedPlant(undefined);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to save plant:', error);
    }
  };

  const handleEditPlant = (plant: Plant) => {
    setSelectedPlant(plant);
    setIsFormOpen(true);
  };

  const handleDeletePlant = async (plantId: string) => {
    if (!user || !token) return;
    
    try {
      await api.deletePlant(plantId, token);
      setPlants(plants.filter(p => p.id !== plantId));
    } catch (error) {
      console.error('Failed to delete plant:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">PlantCare</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="w-4 h-4" />
                Add Plant
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {plants.length === 0 ? (
          <div className="text-center py-12">
            <Leaf className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No plants</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new plant.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Plant
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onEdit={handleEditPlant}
                onDelete={() => handleDeletePlant(plant.id)}
              />
            ))}
          </div>
        )}
      </main>

      {isFormOpen && (
        <PlantForm
          plant={selectedPlant}
          onSave={handleSavePlant}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedPlant(undefined);
          }}
        />
      )}
    </div>
  );
}