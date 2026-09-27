import { Watershed, Sensor, EnvironmentalState, HealthStatus } from '../types';

const API_BASE_URL = '/api/v1';

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchWatersheds(): Promise<Watershed[]> {
  const res = await fetch(`${API_BASE_URL}/watersheds`);
  if (!res.ok) throw new Error('Failed to fetch watersheds');
  return res.json();
}

export async function fetchSensors(watershedId?: number): Promise<Sensor[]> {
  const url = watershedId 
    ? `${API_BASE_URL}/sensors?watershed_id=${watershedId}` 
    : `${API_BASE_URL}/sensors`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch sensors');
  return res.json();
}

export async function fetchEnvironmentalStates(watershedId?: number, days: number = 30): Promise<EnvironmentalState[]> {
  const url = watershedId 
    ? `${API_BASE_URL}/environmental-state?watershed_id=${watershedId}&days=${days}` 
    : `${API_BASE_URL}/environmental-state?days=${days}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch environmental state');
  return res.json();
}
