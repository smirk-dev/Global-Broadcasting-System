import { useState } from 'react';
import EarthViewer from './components/EarthViewer';
import BroadcastPanel from './components/BroadcastPanel';
import ChannelManager from './components/ChannelManager';
import StatusBar from './components/StatusBar';
import { BroadcastStation } from './types/broadcast.types';

const initialStations: BroadcastStation[] = [
  {
    id: '1',
    name: 'Global News Network',
    position: [40.7128, -74.0060], // New York
    status: 'live',
    viewers: 2450000,
    signal: 95,
    channel: 'GNN',
    youtubeUrl: 'https://www.youtube.com/watch?v=9Auq9mYxFEE' // ABC News Live
  },
  {
    id: '2',
    name: 'Europa Broadcasting',
    position: [51.5074, -0.1278], // London
    status: 'live',
    viewers: 1800000,
    signal: 88,
    channel: 'EBC',
    youtubeUrl: 'https://www.youtube.com/watch?v=pykz4W8U8eE' // Sky News
  },
  {
    id: '3',
    name: 'Asia Pacific Media',
    position: [35.6762, 139.6503], // Tokyo
    status: 'standby',
    viewers: 3200000,
    signal: 92,
    channel: 'APM',
    youtubeUrl: 'https://www.youtube.com/watch?v=coYw-eVU0Ks' // NHK World
  },
  {
    id: '4',
    name: 'Southern Cross TV',
    position: [-33.8688, 151.2093], // Sydney
    status: 'live',
    viewers: 950000,
    signal: 78,
    channel: 'SCTV',
    youtubeUrl: 'https://www.youtube.com/watch?v=vOTiJkg1voo' // ABC Australia
  },
  {
    id: '5',
    name: 'Arctic Broadcasting',
    position: [64.2008, -149.4937], // Fairbanks
    status: 'maintenance',
    viewers: 125000,
    signal: 65,
    channel: 'ABC',
    youtubeUrl: 'https://www.youtube.com/watch?v=dp8PhLsUcFE' // NASA Live
  },
  {
    id: '6',
    name: 'African Continental',
    position: [-26.2041, 28.0473], // Johannesburg
    status: 'live',
    viewers: 1200000,
    signal: 83,
    channel: 'ACN',
    youtubeUrl: 'https://www.youtube.com/watch?v=NMre6IAAAiU' // Al Jazeera English
  }
];

function App() {
  const [selectedStation, setSelectedStation] = useState<BroadcastStation | null>(null);
  const [stations, setStations] = useState<BroadcastStation[]>(initialStations);
  const [activeView, setActiveView] = useState<'overview' | 'channels' | 'analytics'>('overview');

  const updateStationStatus = (stationId: string, status: BroadcastStation['status']) => {
    setStations(prev => prev.map(station => 
      station.id === stationId ? { ...station, status } : station
    ));
  };

  const totalViewers = stations.reduce((sum, station) => sum + station.viewers, 0);
  const activeStations = stations.filter(station => station.status === 'live').length;

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GB</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Global Broadcasting System
            </h1>
          </div>
          
          <nav className="flex space-x-6">
            {(['overview', 'channels', 'analytics'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 capitalize ${
                  activeView === view
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {view}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Status Bar */}
      <StatusBar 
        totalViewers={totalViewers}
        activeStations={activeStations}
        totalStations={stations.length}
      />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Panel - Earth Viewer */}
        <div className="flex-1 relative">
          <EarthViewer 
            stations={stations}
            selectedStation={selectedStation}
            onStationSelect={setSelectedStation}
          />
        </div>

        {/* Right Panel - Controls */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-md border-l border-slate-700 overflow-y-auto">
          {activeView === 'overview' && (
            <BroadcastPanel
              stations={stations}
              selectedStation={selectedStation}
              onStationSelect={setSelectedStation}
              onStatusUpdate={updateStationStatus}
            />
          )}
          {activeView === 'channels' && (
            <ChannelManager
              stations={stations}
              onStationUpdate={setStations}
            />
          )}
          {activeView === 'analytics' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Broadcasting Analytics</h2>
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Peak Hours</h3>
                  <p className="text-2xl font-bold text-blue-400">18:00 - 22:00 UTC</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Coverage</h3>
                  <p className="text-2xl font-bold text-green-400">94.7%</p>
                  <p className="text-xs text-slate-400">Global population</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Uptime</h3>
                  <p className="text-2xl font-bold text-cyan-400">99.8%</p>
                  <p className="text-xs text-slate-400">Last 30 days</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;