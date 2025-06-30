import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { BroadcastStation } from '../types/broadcast.types';

interface EarthViewerProps {
  stations: BroadcastStation[];
  selectedStation: BroadcastStation | null;
  onStationSelect: (station: BroadcastStation | null) => void;
}

function Earth({ stations, selectedStation, onStationSelect }: EarthViewerProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);
  const [loading, setLoading] = useState(true);

  // --- NEW: Optionally load a bump map for more realism ---
  // const bumpMap = useLoader(THREE.TextureLoader, 'https://upload.wikimedia.org/wikipedia/commons/1/17/Earth_elevation.jpg');

  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();

    loader.load(
      'https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg',
      (texture) => {
        if (isMounted) {
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          setEarthTexture(texture);
          setLoading(false);
        }
      },
      undefined,
      () => {
        if (isMounted) {
          setEarthTexture(null);
          setLoading(false);
        }
      }
    );

    return () => { isMounted = false; };
  }, []);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });

  // Convert lat/lng to 3D coordinates on sphere
  const latLngToVector3 = (lat: number, lng: number, radius: number = 5.1) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  return (
    <group>
      {/* Earth */}
      <Sphere ref={earthRef} args={[5, 64, 64]}>
        {earthTexture ? (
          <meshStandardMaterial
            map={earthTexture}
            metalness={0.2}
            roughness={0.7}
          />
        ) : (
          <meshStandardMaterial color="#2266cc" />
        )}
      </Sphere>

      {/* Atmosphere */}
      <Sphere args={[5.08, 64, 64]}>
        <meshPhongMaterial
          color="#87CEEB"
          transparent
          opacity={0.15}
        />
      </Sphere>

      {/* Broadcast Stations */}
      {stations.map((station) => {
        const position = latLngToVector3(station.position[0], station.position[1]);
        const isSelected = selectedStation?.id === station.id;
        
        return (
          <group key={station.id} position={position}>
            {/* Station Marker */}
            <Sphere 
              args={[0.08, 16, 16]}
              onClick={() => onStationSelect(station)}
            >
              <meshBasicMaterial 
                color={
                  station.status === 'live' ? '#10B981' :
                  station.status === 'standby' ? '#F59E0B' :
                  station.status === 'maintenance' ? '#F97316' : '#EF4444'
                }
              />
            </Sphere>
            
            {/* Broadcast Signal Visualization */}
            {station.status === 'live' && (
              <Sphere args={[0.5, 16, 16]}>
                <meshBasicMaterial 
                  color="#10B981" 
                  transparent 
                  opacity={0.1}
                  wireframe
                />
              </Sphere>
            )}
            
            {/* Station Info */}
            {isSelected && (
              <Html distanceFactor={10}>
                <div className="bg-slate-800/90 backdrop-blur-md rounded-lg p-3 border border-slate-600 min-w-48">
                  <h3 className="font-semibold text-white mb-2">{station.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Status:</span>
                      <span className={`font-medium ${
                        station.status === 'live' ? 'text-green-400' :
                        station.status === 'standby' ? 'text-yellow-400' :
                        station.status === 'maintenance' ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        {station.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Viewers:</span>
                      <span className="text-blue-400 font-medium">
                        {station.viewers.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Signal:</span>
                      <span className="text-cyan-400 font-medium">{station.signal}%</span>
                    </div>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
      
      {loading && (
        <Html center>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-slate-300 text-sm">Loading Earth map...</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 15);
  }, [camera]);
  
  return null;
}

export default function EarthViewer(props: EarthViewerProps) {
  return (
    <div className="w-full h-full bg-black">
      <Canvas>
        <CameraController />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={300} depth={60} count={20000} factor={4} saturation={0} fade speed={1} />
        <Earth {...props} />
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
          minDistance={8}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
}