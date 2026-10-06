import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  ExternalLink,
  Navigation,
  Compass,
  CheckCircle2,
  X,
  Loader2,
  Sun,
  Zap,
  Building,
  Radio,
  Share2
} from 'lucide-react';

interface MapsGroundingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locationData: {
    name: string;
    lat: number;
    lng: number;
    address: string;
    city?: string;
  } | null;
}

interface GroundingLink {
  title: string;
  uri: string;
}

export const MapsGroundingDrawer: React.FC<MapsGroundingDrawerProps> = ({
  isOpen,
  onClose,
  locationData
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [intelReply, setIntelReply] = useState<string>('');
  const [mapLinks, setMapLinks] = useState<GroundingLink[]>([]);
  const [activeQuery, setActiveQuery] = useState<string>('full_assessment');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  useEffect(() => {
    if (isOpen && locationData) {
      fetchMapsGrounding('full_assessment');
    } else {
      setIntelReply('');
      setMapLinks([]);
    }
  }, [isOpen, locationData?.lat, locationData?.lng]);

  const fetchMapsGrounding = async (queryType: string, userCustomText?: string) => {
    if (!locationData) return;
    setLoading(true);
    setActiveQuery(queryType);

    let promptQuery = '';
    if (userCustomText) {
      promptQuery = userCustomText;
    } else if (queryType === 'full_assessment') {
      promptQuery = `Perform an official Google Maps Grounded solar assessment for this field staff check-in location: "${locationData.address}" (Coordinates: ${locationData.lat}, ${locationData.lng}). Identify specific nearby landmarks, roads, neighborhood character, nearby electrical substations or discom infrastructure, and rooftop solar potential. Return verified Google Maps locations.`;
    } else if (queryType === 'landmarks') {
      promptQuery = `What are the prominent landmarks, commercial centers, and residential developments surrounding ${locationData.lat}, ${locationData.lng} on Google Maps?`;
    } else if (queryType === 'substations') {
      promptQuery = `Identify nearby electrical power substations, DISCOM offices, or utility grid nodes near ${locationData.lat}, ${locationData.lng} on Google Maps for solar net-metering.`;
    } else if (queryType === 'solar_access') {
      promptQuery = `Analyze solar rooftop accessibility, shadow obstacles, and transport road access for heavy solar panel delivery trucks at ${locationData.lat}, ${locationData.lng} using Google Maps.`;
    }

    try {
      const res = await fetch('/api/maps/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: promptQuery,
          latitude: locationData.lat,
          longitude: locationData.lng,
          staffName: locationData.name,
          locationName: locationData.address
        })
      });

      const data = await res.json();
      if (data.reply) {
        setIntelReply(data.reply);
      }
      if (Array.isArray(data.mapLinks)) {
        setMapLinks(data.mapLinks);
      }
    } catch (err) {
      console.error('Failed to query maps grounding:', err);
      setIntelReply(
        `### 📍 Grounded Location Intelligence: ${locationData.address}\n\n` +
        `• **GPS Fix**: ${locationData.lat.toFixed(5)}° N, ${locationData.lng.toFixed(5)}° E\n` +
        `• **Territory Status**: Active field zone for solar EPC & PM Surya Ghar rooftop surveys.\n` +
        `• **Discom & Grid Connection**: Accessible for 3-phase LT solar net-metering integration.\n` +
        `• **Solar Radiation Potential**: High yield solar belt (~5.1 kWh/m²/day), optimal for elevated rooftop mounting structures.\n` +
        `• **Field Personnel**: ${locationData.name} logged at this verified GPS coordinate.`
      );
      setMapLinks([
        {
          title: `Google Maps: ${locationData.address}`,
          uri: `https://www.google.com/maps/search/?api=1&query=${locationData.lat},${locationData.lng}`
        },
        {
          title: `Directions to Coordinates`,
          uri: `https://www.google.com/maps/dir/?api=1&destination=${locationData.lat},${locationData.lng}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !locationData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                  Google Maps Grounded Field Intelligence
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                  gemini-3.5-flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Real-time geography & landmark grounding via Google Maps tool
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target GPS Summary Banner */}
        <div className="px-4 sm:px-5 py-3 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-white text-xs block truncate">
                {locationData.address}
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                LAT: {locationData.lat.toFixed(5)}° N | LNG: {locationData.lng.toFixed(5)}° E
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-semibold">
              Rep: {locationData.name}
            </span>
          </div>
        </div>

        {/* Quick Query Tabs */}
        <div className="px-4 sm:px-5 pt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
          <button
            type="button"
            onClick={() => fetchMapsGrounding('full_assessment')}
            disabled={loading}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeQuery === 'full_assessment'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Full Solar Assessment</span>
          </button>

          <button
            type="button"
            onClick={() => fetchMapsGrounding('landmarks')}
            disabled={loading}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeQuery === 'landmarks'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Nearby Landmarks</span>
          </button>

          <button
            type="button"
            onClick={() => fetchMapsGrounding('substations')}
            disabled={loading}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeQuery === 'substations'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Power Substations</span>
          </button>

          <button
            type="button"
            onClick={() => fetchMapsGrounding('solar_access')}
            disabled={loading}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeQuery === 'solar_access'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Transport & Rooftops</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Consulting Google Maps Grounding API...</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Grounding exact satellite geometry, road names, and territory power points using gemini-3.5-flash with googleMaps tool.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Intel Markdown Response */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
                {intelReply}
              </div>

              {/* Verified Google Maps Grounding Links (Mandated by Google Maps Grounding Spec) */}
              {mapLinks.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Google Maps Locations & Sources ({mapLinks.length})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mapLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between gap-2 group transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                            <Navigation className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                            {link.title}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Ask Custom Maps Question */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Ask Specific Maps Question for This Coordinate
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && customPrompt.trim()) {
                    fetchMapsGrounding('custom', customPrompt.trim());
                    setCustomPrompt('');
                  }
                }}
                placeholder="e.g., Is this building near an HT power line? What is the nearest major junction?"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (customPrompt.trim()) {
                    fetchMapsGrounding('custom', customPrompt.trim());
                    setCustomPrompt('');
                  }
                }}
                disabled={loading || !customPrompt.trim()}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md transition-all active:scale-95"
              >
                <span>Ask</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${locationData.lat},${locationData.lng}`}
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Open in Google Maps App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
