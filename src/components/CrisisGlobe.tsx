import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { CrisisZone, toGeoJSON, severityColors } from '@/data/crisisZones';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiaGFiaWJpcSIsImEiOiJjbW5hZm54NDgwaHlrMnJweXhubW4yZDg5In0.rfTJCKgKfNEvbxmSvYRdMg';

export interface CrisisGlobeHandle {
  getMap: () => mapboxgl.Map | null;
  flyTo: (coords: [number, number], zoom?: number, duration?: number) => void;
}

interface CrisisGlobeProps {
  zones: CrisisZone[];
  severityFilter: number | 'all';
  categoryFilter: string[];
  onZoneClick: (zone: CrisisZone) => void;
}

const CrisisGlobe = forwardRef<CrisisGlobeHandle, CrisisGlobeProps>(
  ({ zones, severityFilter, categoryFilter, onZoneClick }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const rotatingRef = useRef(true);
    const rafRef = useRef<number>(0);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    useImperativeHandle(ref, () => ({
      getMap: () => mapRef.current,
      flyTo: (coords, zoom = 5, duration = 1800) => {
        mapRef.current?.flyTo({ center: coords, zoom, duration, essential: true });
      },
    }));

    const clearMarkers = useCallback(() => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
    }, []);

    const addPulseMarkers = useCallback((map: mapboxgl.Map, filteredZones: CrisisZone[]) => {
      clearMarkers();
      filteredZones
        .filter(z => z.severity === 4)
        .forEach(z => {
          const el = document.createElement('div');
          el.className = 'pulse-marker';
          el.style.cssText = `width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,${severityColors[4]}88,transparent 70%);position:absolute;pointer-events:none;`;
          const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
            .setLngLat(z.coordinates)
            .addTo(map);
          markersRef.current.push(marker);
        });
    }, [clearMarkers]);

    useEffect(() => {
      if (!containerRef.current || !MAPBOX_TOKEN) return;

      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        center: [20, 20],
        zoom: 1.8,
        attributionControl: false,
      });

      map.dragRotate.enable();
      map.scrollZoom.enable();
      map.touchZoomRotate.enable();

      mapRef.current = map;

      map.on('style.load', () => {
        map.setFog({
          color: '#000000',
          'high-color': '#000000',
          'horizon-blend': 0.0,
          'space-color': '#000000',
          'star-intensity': 1.0,
        });

        const geojson = toGeoJSON(zones);
        map.addSource('crises', { type: 'geojson', data: geojson as any });

        // Glow halo layer — smaller
        map.addLayer({
          id: 'crises-glow',
          type: 'circle',
          source: 'crises',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              1, ['*', ['get', 'severity'], 6],
              3, ['*', ['get', 'severity'], 10],
              6, ['*', ['get', 'severity'], 14],
            ],
            'circle-color': [
              'match', ['get', 'severity'],
              4, '#CC2200', 3, '#D44000', 2, '#E8A020', 1, '#2E8B57', '#999',
            ],
            'circle-opacity': 0.18,
            'circle-blur': 0.6,
          },
        });

        // Main circles — smaller
        map.addLayer({
          id: 'crises-circles',
          type: 'circle',
          source: 'crises',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              1, ['*', ['get', 'severity'], 3],
              3, ['*', ['get', 'severity'], 5],
              6, ['*', ['get', 'severity'], 8],
            ],
            'circle-color': [
              'match', ['get', 'severity'],
              4, '#CC2200', 3, '#D44000', 2, '#E8A020', 1, '#2E8B57', '#999',
            ],
            'circle-opacity': 0.65,
            'circle-blur': 0.3,
          },
        });

        addPulseMarkers(map, zones);

        map.on('click', 'crises-circles', (e) => {
          if (e.features?.[0]) {
            const id = e.features[0].properties?.id;
            const zone = zones.find(z => z.id === id);
            if (zone) onZoneClick(zone);
          }
        });

        map.on('mouseenter', 'crises-circles', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'crises-circles', () => {
          map.getCanvas().style.cursor = '';
        });
      });

      // Auto-rotation
      const rotate = () => {
        if (rotatingRef.current && mapRef.current) {
          const center = mapRef.current.getCenter();
          mapRef.current.setCenter([center.lng + 0.008, center.lat]);
        }
        rafRef.current = requestAnimationFrame(rotate);
      };
      rafRef.current = requestAnimationFrame(rotate);

      const stop = () => { rotatingRef.current = false; };
      const start = () => { rotatingRef.current = true; };
      map.on('mousedown', stop);
      map.on('touchstart', stop);
      map.on('mouseup', start);
      map.on('touchend', start);

      return () => {
        cancelAnimationFrame(rafRef.current);
        clearMarkers();
        map.remove();
      };
    }, [zones, onZoneClick, addPulseMarkers, clearMarkers]);

    // Filter update
    useEffect(() => {
      const map = mapRef.current;
      if (!map || !map.isStyleLoaded()) return;

      const filters: any[] = ['all'];
      if (severityFilter !== 'all') {
        filters.push(['==', ['get', 'severity'], severityFilter]);
      }
      if (categoryFilter.length > 0) {
        filters.push(['in', ['get', 'category'], ['literal', categoryFilter]]);
      }

      const filterExpr = filters.length === 1 ? null : filters;

      ['crises-circles', 'crises-glow'].forEach(layer => {
        if (map.getLayer(layer)) {
          map.setFilter(layer, filterExpr);
        }
      });

      const filteredZones = zones.filter(z => {
        const sevMatch = severityFilter === 'all' || z.severity === severityFilter;
        const catMatch = categoryFilter.length === 0 || categoryFilter.includes(z.category);
        return sevMatch && catMatch;
      });
      addPulseMarkers(map, filteredZones);
    }, [severityFilter, categoryFilter, zones, addPulseMarkers]);

    if (!MAPBOX_TOKEN) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="glass-panel rounded-xl p-8 max-w-md text-center space-y-3">
            <p className="text-lg font-medium">Mapbox Token Required</p>
            <p className="text-sm opacity-50">
              Add your Mapbox token as <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">VITE_MAPBOX_TOKEN</code> in your environment variables.
            </p>
          </div>
        </div>
      );
    }

    return <div ref={containerRef} className="w-full h-full" />;
  }
);

CrisisGlobe.displayName = 'CrisisGlobe';
export default CrisisGlobe;
