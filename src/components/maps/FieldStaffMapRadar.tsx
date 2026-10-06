import React, { useState } from 'react';
import { SalesLocationLog, SalesRepLiveStatus } from '../../types';
import {
  MapPin,
  Navigation,
  Radio,
  Battery,
  Clock,
  Compass,
  Eye,
  ExternalLink,
  Layers,
  Route,
  Sparkles,
  Camera,
  CheckCircle2,
  User,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

interface FieldStaffMapRadarProps {
  reps: SalesRepLiveStatus[];
  logs: SalesLocationLog[];
  selectedRepId?: string;
  onSelectRep?: (userId: string) => void;
  onSelectLog?: (log: SalesLocationLog) => void;
  onInspectMapsGrounding?: (logOrRep: { name: string; lat: number; lng: number; address: string }) => void;
}

export const FieldStaffMapRadar: React.FC<FieldStaffMapRadarProps> = ({
  reps,
  logs,
  selectedRepId = 'all',
  onSelectRep,
  onSelectLog,
  onInspectMapsGrounding
}) => {
  const [mapType, setMapType] = useState<'hybrid' | 'streets' | 'satellite'>('hybrid');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showPhotosOnly, setShowPhotosOnly] = useState<boolean>(false);
  const [activePin, setActivePin] = useState<SalesRepLiveStatus | SalesLocationLog | null>(null);

  // Filter items based on selected representative and photo filter
  const activeReps = reps.filter(r => selectedRepId === 'all' || r.userId === selectedRepId);
  const activeLogs = logs.filter(l => {
    if (selectedRepId !== 'all' && l.userId !== selectedRepId) return false;
    if (showPhotosOnly && !l.photoUrl) return false;
    return true;
  });

  // Compute map bounding box bounds
  const allPoints = [
    ...activeReps.map(r => ({ lat: r.latitude, lng: r.longitude })),
    ...activeLogs.map(l => ({ lat: l.latitude, lng: l.longitude }))
  ];

  const minLat = allPoints.length ? Math.min(...allPoints.map(p => p.lat)) - 0.05 : 18.5;
  const maxLat = allPoints.length ? Math.max(...allPoints.map(p => p.lat)) + 0.05 : 19.5;
  const minLng = allPoints.length ? Math.min(...allPoints.map(p => p.lng)) - 0.05 : 72.8;
  const maxLng = allPoints.length ? Math.max(...allPoints.map(p => p.lng)) + 0.05 : 74.0;

  // Convert GPS lat/lng to container % coordinates
  const getCoordinates = (lat: number, lng: number) => {
    const latSpan = Math.max(0.01, maxLat - minLat);
    const lngSpan = Math.max(0.01, maxLng - minLng);
    
    // Invert lat for Y (top is north, higher latitude)
    const y = 90 - ((lat - minLat) / latSpan) * 80;
    const x = 10 + ((lng - minLng) / lngSpan) * 80;
    return {
      top: `${Math.min(92, Math.max(8, y))}%`,
      left: `${Math.min(92, Math.max(8, x))}%`
    };
  };

  const getStatusBadge = (status: SalesRepLiveStatus['currentStatus']) => {
    switch (status) {
      case 'ON_DUTY':
        return { label: 'Active Field', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', dot: 'bg-emerald-400' };
      case 'AT_CLIENT':
        return { label: 'At Client Site', bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40', dot: 'bg-sky-400' };
      case 'IN_TRANSIT':
        return { label: 'In Transit', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', dot: 'bg-amber-400' };
      default:
        return { label: 'Off Duty', bg: 'bg-slate-800 text-slate-400 border-slate-700', dot: 'bg-slate-500' };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
      {/* Top Map Control Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black text-white leading-none">
                Interactive Field Staff GPS Radar & Route Map
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                Live Geotag Feed
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Tracking {activeReps.length} Field Personnel • {activeLogs.length} Verified Check-In Waypoints
            </p>
          </div>
        </div>

        {/* View Controls & Google Maps Link */}
        <div className="flex items-center gap-2">
          {/* GPS Photos Toggle */}
          <button
            type="button"
            onClick={() => setShowPhotosOnly(prev => !prev)}
            className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              showPhotosOnly
                ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400/40'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>GPS Photos ({logs.filter(l => l.photoUrl).length})</span>
          </button>

          {/* Map Layer Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setMapType('hybrid')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mapType === 'hybrid'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Radar
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mapType === 'satellite'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Area */}
      <div className="relative w-full h-[360px] sm:h-[440px] bg-slate-950 overflow-hidden select-none">
        {/* Background Map Grid & Satellite Styling */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            mapType === 'satellite'
              ? 'bg-[#06141d] bg-[radial-gradient(#0c2a38_1px,transparent_1px)] [background-size:24px_24px]'
              : 'bg-[#020617] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]'
          }`}
        />

        {/* Ambient Radar Scan Ring Animation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] rounded-full border border-emerald-500/20 pointer-events-none animate-ping [animation-duration:4s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[360px] h-[240px] sm:h-[360px] rounded-full border border-emerald-500/15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] sm:w-[200px] h-[120px] sm:h-[200px] rounded-full border border-emerald-500/10 pointer-events-none" />

        {/* Map Coordinates Crosshairs */}
        <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-xl px-2.5 py-1.5 text-[10px] font-mono text-slate-400 space-y-0.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Compass className="w-3 h-3 text-emerald-400" />
            <span>TERRITORY GPS BOUNDS</span>
          </div>
          <div>NW: {maxLat.toFixed(3)}°N, {minLng.toFixed(3)}°E</div>
          <div>SE: {minLat.toFixed(3)}°N, {maxLng.toFixed(3)}°E</div>
        </div>

        {/* Breadcrumb Route Connectors (SVG Trail between chronological logs) */}
        {activeLogs.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <polyline
              points={activeLogs
                .map(l => {
                  const coords = getCoordinates(l.latitude, l.longitude);
                  return `${coords.left},${coords.top}`;
                })
                .join(' ')}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="6,4"
              strokeOpacity="0.7"
            />
          </svg>
        )}

        {/* 1. Historical Waypoint Markers (Logs) */}
        {activeLogs.map((log, idx) => {
          const coords = getCoordinates(log.latitude, log.longitude);
          const isSelected = activePin && 'id' in activePin && activePin.id === log.id;

          return (
            <div
              key={log.id}
              style={{ top: coords.top, left: coords.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              onClick={() => {
                setActivePin(log);
                if (onSelectLog) onSelectLog(log);
              }}
            >
              <div
                className={`relative flex items-center justify-center transition-transform hover:scale-125 ${
                  isSelected ? 'scale-125' : ''
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ${
                    log.photoUrl
                      ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 shadow-emerald-500/40'
                      : 'bg-slate-900 border-2 border-emerald-400 text-white shadow-emerald-500/20'
                  }`}
                >
                  {log.photoUrl ? <Camera className="w-3.5 h-3.5 stroke-[2.5]" /> : idx + 1}
                </div>
                {/* Waypoint Tooltip */}
                <div className="absolute bottom-full mb-1.5 hidden group-hover:flex flex-col items-center bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-center whitespace-nowrap shadow-2xl z-30 pointer-events-none">
                  <span className="text-[10px] font-black text-white">{log.locationName}</span>
                  <span className="text-[9px] text-emerald-400 font-mono">{log.timeFormatted} • {log.userName}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* 2. Live Field Staff Pins (Real-time Personnel Positions) */}
        {activeReps.map(rep => {
          const coords = getCoordinates(rep.latitude, rep.longitude);
          const badge = getStatusBadge(rep.currentStatus);
          const isSelected = activePin && 'userId' in activePin && activePin.userId === rep.userId;

          return (
            <div
              key={rep.userId}
              style={{ top: coords.top, left: coords.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
              onClick={() => {
                setActivePin(rep);
                if (onSelectRep) onSelectRep(rep.userId);
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Pulsing Target Ring */}
                <div className="absolute -inset-2 rounded-full bg-emerald-400/20 animate-ping [animation-duration:2.5s]" />

                {/* Staff Avatar Pin */}
                <div
                  className={`relative w-9 h-9 rounded-2xl p-0.5 bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-xl transition-all duration-200 group-hover:scale-115 ${
                    isSelected ? 'ring-4 ring-emerald-400/60 scale-110' : ''
                  }`}
                >
                  <img
                    src={rep.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={rep.userName}
                    className="w-full h-full rounded-[14px] object-cover"
                  />
                  <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${badge.dot}`} />
                </div>

                {/* Floating Name & Status Capsule */}
                <div className="mt-1.5 px-2 py-0.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[10px] font-bold text-white whitespace-nowrap shadow-md flex items-center gap-1">
                  <span>{rep.userName.split(' ')[0]}</span>
                  <span className="text-[9px] text-emerald-400 font-mono">({rep.todayDistanceKm}km)</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Selected Pin Flyout Sheet (Bottom Overlay inside Map) */}
        {activePin && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl p-3.5 shadow-2xl z-40 animate-in slide-in-from-bottom duration-200 text-xs">
            {'currentStatus' in activePin ? (
              /* Rep Status Overview */
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activePin.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={activePin.userName}
                      className="w-10 h-10 rounded-xl object-cover border border-emerald-400"
                    />
                    <div>
                      <h4 className="font-black text-white text-sm">{activePin.userName}</h4>
                      <p className="text-[11px] text-slate-400">{activePin.territoryBeat} • {activePin.franchiseName}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePin(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] py-1 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block">Battery</span>
                    <strong className="text-emerald-400">{activePin.batteryLevel}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">GPS Precision</span>
                    <strong className="text-sky-400">±{activePin.accuracyMeters}m</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Distance</span>
                    <strong className="text-amber-400">{activePin.todayDistanceKm} km</strong>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-[11px] text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{activePin.lastAddress}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activePin.latitude},${activePin.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                    <span>View on Google Maps</span>
                  </a>

                  {onInspectMapsGrounding && (
                    <button
                      type="button"
                      onClick={() =>
                        onInspectMapsGrounding({
                          name: activePin.userName,
                          lat: activePin.latitude,
                          lng: activePin.longitude,
                          address: activePin.lastAddress
                        })
                      }
                      className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Maps Intel</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Waypoint Check-In Overview */
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      WAYPOINT FIX • {activePin.timeFormatted}
                    </span>
                    <h4 className="font-black text-white text-sm mt-0.5">{activePin.locationName}</h4>
                    <p className="text-[11px] text-slate-400">By {activePin.userName} ({activePin.franchiseName})</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePin(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    ✕
                  </button>
                </div>

                {activePin.photoUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 h-28 bg-slate-950">
                    <img src={activePin.photoUrl} alt="Geotagged Survey" className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400">
                      GPS VERIFIED
                    </div>
                  </div>
                )}

                {activePin.notes && (
                  <p className="text-[11px] text-slate-300 italic bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                    "{activePin.notes}"
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activePin.latitude},${activePin.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                    <span>Open in Google Maps</span>
                  </a>

                  {onInspectMapsGrounding && (
                    <button
                      type="button"
                      onClick={() =>
                        onInspectMapsGrounding({
                          name: activePin.userName,
                          lat: activePin.latitude,
                          lng: activePin.longitude,
                          address: activePin.locationName
                        })
                      }
                      className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Maps Intel</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Footer Bar with Direct Google Maps Integration */}
      <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Satellite Fix
          </span>
          <span>•</span>
          <span className="font-mono text-emerald-400">Carrier Assisted GPS</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${activeReps[0]?.latitude || 19.0760},${activeReps[0]?.longitude || 72.8777}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Territory Area in Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
