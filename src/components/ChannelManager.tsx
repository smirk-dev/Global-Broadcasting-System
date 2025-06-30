import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, ExternalLink } from 'lucide-react';
import { BroadcastStation } from '../types/broadcast.types';

interface ChannelManagerProps {
  stations: BroadcastStation[];
  onStationUpdate: (stations: BroadcastStation[]) => void;
}

export default function ChannelManager({ stations, onStationUpdate }: ChannelManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState<Partial<BroadcastStation>>({});

  const startEdit = (station: BroadcastStation) => {
    setEditingId(station.id);
    setEditForm(station);
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      const updatedStations = stations.map(station => 
        station.id === editingId ? { ...station, ...editForm } : station
      );
      onStationUpdate(updatedStations);
      setEditingId(null);
      setEditForm({});
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const deleteStation = (stationId: string) => {
    const updatedStations = stations.filter(station => station.id !== stationId);
    onStationUpdate(updatedStations);
  };

  const addStation = () => {
    const newStation: BroadcastStation = {
      id: Date.now().toString(),
      name: editForm.name || 'New Station',
      channel: editForm.channel || 'NEW',
      position: [editForm.position?.[0] || 0, editForm.position?.[1] || 0],
      status: 'offline',
      viewers: 0,
      signal: 0,
      youtubeUrl: editForm.youtubeUrl || '',
      ...editForm
    };
    onStationUpdate([...stations, newStation]);
    setShowAddForm(false);
    setEditForm({});
  };

  const openYouTubeLink = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Channel Manager</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Station</span>
        </button>
      </div>

      {/* Add Station Form */}
      {showAddForm && (
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <h3 className="font-medium mb-3">Add New Station</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Station Name"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400"
            />
            <input
              type="text"
              placeholder="Channel Code"
              value={editForm.channel || ''}
              onChange={(e) => setEditForm({ ...editForm, channel: e.target.value })}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400"
            />
            <input
              type="url"
              placeholder="YouTube Live Stream URL"
              value={editForm.youtubeUrl || ''}
              onChange={(e) => setEditForm({ ...editForm, youtubeUrl: e.target.value })}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Latitude"
                value={editForm.position?.[0] || ''}
                onChange={(e) => setEditForm({ 
                  ...editForm, 
                  position: [parseFloat(e.target.value) || 0, editForm.position?.[1] || 0] 
                })}
                className="px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={editForm.position?.[1] || ''}
                onChange={(e) => setEditForm({ 
                  ...editForm, 
                  position: [editForm.position?.[0] || 0, parseFloat(e.target.value) || 0] 
                })}
                className="px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addStation}
                className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-500 rounded text-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Add</span>
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditForm({});
                }}
                className="flex items-center space-x-1 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded text-sm transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Station List */}
      <div className="space-y-3">
        {stations.map((station) => (
          <div key={station.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            {editingId === station.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                />
                <input
                  type="text"
                  value={editForm.channel || ''}
                  onChange={(e) => setEditForm({ ...editForm, channel: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                />
                <input
                  type="url"
                  placeholder="YouTube Live Stream URL"
                  value={editForm.youtubeUrl || ''}
                  onChange={(e) => setEditForm({ ...editForm, youtubeUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={editForm.position?.[0] || ''}
                    onChange={(e) => setEditForm({ 
                      ...editForm, 
                      position: [parseFloat(e.target.value) || 0, editForm.position?.[1] || 0] 
                    })}
                    className="px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                  />
                  <input
                    type="number"
                    value={editForm.position?.[1] || ''}
                    onChange={(e) => setEditForm({ 
                      ...editForm, 
                      position: [editForm.position?.[0] || 0, parseFloat(e.target.value) || 0] 
                    })}
                    className="px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={saveEdit}
                    className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-500 rounded text-sm transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center space-x-1 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded text-sm transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-white">{station.channel}</h3>
                    <p className="text-sm text-slate-300">{station.name}</p>
                  </div>
                  <div className="flex space-x-2">
                    {station.youtubeUrl && (
                      <button
                        onClick={() => openYouTubeLink(station.youtubeUrl!)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded transition-colors"
                        title="Open YouTube Stream"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(station)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-600 rounded transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteStation(station.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Position: {station.position[0].toFixed(2)}°, {station.position[1].toFixed(2)}°</div>
                  <div>Viewers: {station.viewers.toLocaleString()}</div>
                  {station.youtubeUrl && (
                    <div className="text-red-400">
                      YouTube: {station.youtubeUrl.length > 40 ? station.youtubeUrl.substring(0, 40) + '...' : station.youtubeUrl}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}