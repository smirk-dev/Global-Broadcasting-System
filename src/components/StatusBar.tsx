import React from 'react';
import { Activity, Users, Radio, Globe } from 'lucide-react';

interface StatusBarProps {
  totalViewers: number;
  activeStations: number;
  totalStations: number;
}

export default function StatusBar({ totalViewers, activeStations, totalStations }: StatusBarProps) {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    timeZoneName: 'short' 
  });

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm text-slate-300">System Status:</span>
            <span className="text-sm font-medium text-green-400">Operational</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">Total Viewers:</span>
            <span className="text-sm font-medium text-blue-400">
              {totalViewers.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300">Active Stations:</span>
            <span className="text-sm font-medium text-cyan-400">
              {activeStations}/{totalStations}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-300">Coverage:</span>
            <span className="text-sm font-medium text-purple-400">
              {Math.round((activeStations / totalStations) * 100)}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-300">
            <span>UTC: {currentTime}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}