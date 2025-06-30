export interface BroadcastStation {
  id: string;
  name: string;
  position: [number, number]; // [latitude, longitude]
  status: 'live' | 'standby' | 'maintenance' | 'offline';
  viewers: number;
  signal: number; // Signal strength percentage
  channel: string;
  description?: string;
  frequency?: string;
  power?: number; // Transmission power in kW
  youtubeUrl?: string; // YouTube live stream URL
}

export interface Satellite {
  id: string;
  name: string;
  position: [number, number, number]; // [x, y, z] in 3D space
  orbital: {
    altitude: number;
    inclination: number;
    period: number;
  };
  status: 'active' | 'inactive' | 'maintenance';
}

export interface BroadcastSignal {
  stationId: string;
  strength: number;
  coverage: number;
  interference: number;
}