import { Plant } from '../types/Plant';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    let errorMessage = 'An unexpected error occurred';
    
    try {
      if (isJson) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } else {
        errorMessage = await response.text() || errorMessage;
      }
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
    
    throw new ApiError(errorMessage, response.status);
  }

  return response.json();
}

async function makeRequest(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });
    return handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Unable to connect to the server. Please check your internet connection.');
  }
}

export async function login(email: string, password: string) {
  return makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string) {
  return makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getPlants(token: string) {
  return makeRequest('/plants', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

export async function createPlant(plant: Omit<Plant, 'id'>, token: string) {
  return makeRequest('/plants', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(plant),
  });
}

export async function updatePlant(id: string, plant: Partial<Plant>, token: string) {
  return makeRequest(`/plants/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(plant),
  });
}

export async function deletePlant(id: string, token: string) {
  return makeRequest(`/plants/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}