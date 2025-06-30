import React, { useState } from 'react';
import { Radio, Users, Signal, Settings, Play, Pause, Square, ExternalLink, X } from 'lucide-react';
import { BroadcastStation } from '../types/broadcast.types';

interface BroadcastPanelProps {
  stations: BroadcastStation[];
  selectedStation: BroadcastStation | null;
  onStationSelect: (station: BroadcastStation | null) => void;
  onStatusUpdate: (stationId: string, status: BroadcastStation['status']) => void;
}

export default function BroadcastPanel({ 
  stations, 
  selectedStation, 
  onStationSelect, 
  onStatusUpdate 
}: BroadcastPanelProps) {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');

  const getStatusColor = (status: BroadcastStation['status']) => {
    switch (status) {
      case 'live': return 'text-green-400';
      case 'standby': return 'text-yellow-400';
      case 'maintenance': return 'text-orange-400';
      case 'offline': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: BroadcastStation['status']) => {
    switch (status) {
      case 'live': return <Play className="w-4 h-4" />;
      case 'standby': return <Pause className="w-4 h-4" />;
      case 'maintenance': return <Settings className="w-4 h-4" />;
      case 'offline': return <Square className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  const openLiveStream = (station: BroadcastStation) => {
    if (station.youtubeUrl) {
      // Convert YouTube watch URL to embed URL
      const videoId = station.youtubeUrl.split('v=')[1]?.split('&')[0];
      if (videoId) {
        setCurrentVideoUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`);
        setShowVideoModal(true);
      }
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Broadcast Control</h2>
          <Radio className="w-5 h-5 text-blue-400" />
        </div>

        {/* Station List */}
        <div className="space-y-3">
          {stations.map((station) => (
            <div
              key={station.id}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                selectedStation?.id === station.id
                  ? 'bg-slate-700/70 border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500'
              }`}
              onClick={() => onStationSelect(station)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white">{station.channel}</h3>
                <div className={`flex items-center space-x-1 ${getStatusColor(station.status)}`}>
                  {getStatusIcon(station.status)}
                  <span className="text-xs uppercase font-medium">{station.status}</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-300 mb-3">{station.name}</p>
              
              <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                <div>
                  <div className="flex items-center space-x-1 text-slate-400 mb-1">
                    <Users className="w-3 h-3" />
                    <span>Viewers</span>
                  </div>
                  <p className="text-blue-400 font-medium">
                    {station.viewers.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-1 text-slate-400 mb-1">
                    <Signal className="w-3 h-3" />
                    <span>Signal</span>
                  </div>
                  <p className="text-cyan-400 font-medium">{station.signal}%</p>
                </div>
              </div>

              {/* Live Stream Button */}
              {station.status === 'live' && station.youtubeUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openLiveStream(station);
                  }}
                  className="w-full mb-3 px-3 py-2 text-xs rounded bg-red-600 hover:bg-red-500 text-white transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Watch Live Stream</span>
                </button>
              )}

              {/* Control Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusUpdate(station.id, 'live');
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded bg-green-600 hover:bg-green-500 text-white transition-colors"
                >
                  Go Live
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusUpdate(station.id, 'standby');
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded bg-yellow-600 hover:bg-yellow-500 text-white transition-colors"
                >
                  Standby
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusUpdate(station.id, 'offline');
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded bg-red-600 hover:bg-red-500 text-white transition-colors"
                >
                  Stop
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Station Details */}
        {selectedStation && (
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <h3 className="font-semibold mb-3">Station Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Location:</span>
                <span className="text-white">
                  {selectedStation.position[0].toFixed(2)}°, {selectedStation.position[1].toFixed(2)}°
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Frequency:</span>
                <span className="text-white">
                  {selectedStation.frequency || `${(95.5 + Math.random() * 10).toFixed(1)}MHz`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Power:</span>
                <span className="text-white">
                  {selectedStation.power || Math.floor(Math.random() * 100 + 50)}kW
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-600">
              <h3 className="text-lg font-semibold">Live Stream</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={currentVideoUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}