import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const DONOR_COORDS: [number, number] = [-79.347, 43.651]; // Toronto

function greatCirclePoints(start: [number, number], end: [number, number], numPoints = 80): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lng = start[0] + (end[0] - start[0]) * t;
    const lat = start[1] + (end[1] - start[1]) * t + Math.sin(Math.PI * t) * 15 * 0.1;
    points.push([lng, lat]);
  }
  return points;
}

interface DonationBeamProps {
  map: mapboxgl.Map | null;
  target: [number, number] | null;
  onComplete: () => void;
}

export default function DonationBeam({ map, target, onComplete }: DonationBeamProps) {
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!map || !target || !map.isStyleLoaded()) return;

    const id = 'beam-' + Date.now();
    const glowId = id + '-glow';
    const arc = greatCirclePoints(DONOR_COORDS, target);

    const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: arc },
    };

    map.addSource(id, { type: 'geojson', data: geojson });

    // Glow layer
    map.addLayer({
      id: glowId,
      type: 'line',
      source: id,
      paint: {
        'line-color': '#F5C842',
        'line-width': 8,
        'line-opacity': 0.15,
        'line-blur': 4,
      },
    });

    // Main beam
    map.addLayer({
      id,
      type: 'line',
      source: id,
      paint: {
        'line-color': '#F5C842',
        'line-width': 2,
        'line-opacity': 0.9,
        'line-dasharray': [0.5, 100],
      },
    });

    let step = 0;
    const totalSteps = 60;
    const dashLength = 0.5;
    const gapLength = 100;

    const animate = () => {
      step++;
      const offset = step / totalSteps;
      map.setPaintProperty(id, 'line-dasharray', [dashLength, gapLength - dashLength * offset * 2]);

      if (step < totalSteps) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        // Ripple effect on target
        rippleEffect(map, target);

        setTimeout(() => {
          try {
            if (map.getLayer(id)) map.removeLayer(id);
            if (map.getLayer(glowId)) map.removeLayer(glowId);
            if (map.getSource(id)) map.removeSource(id);
          } catch {}
          onComplete();
        }, 700);
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      try {
        if (map.getLayer(id)) map.removeLayer(id);
        if (map.getLayer(glowId)) map.removeLayer(glowId);
        if (map.getSource(id)) map.removeSource(id);
      } catch {}
    };
  }, [map, target, onComplete]);

  return null;
}

function rippleEffect(map: mapboxgl.Map, coords: [number, number]) {
  const rippleId = 'ripple-' + Date.now();
  map.addSource(rippleId, {
    type: 'geojson',
    data: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: coords } },
  });
  map.addLayer({
    id: rippleId,
    type: 'circle',
    source: rippleId,
    paint: {
      'circle-radius': 10,
      'circle-color': '#F5C842',
      'circle-opacity': 0.6,
      'circle-blur': 0.4,
    },
  });

  let frame = 0;
  const totalFrames = 36; // ~600ms at 60fps
  const animateRipple = () => {
    frame++;
    const t = frame / totalFrames;
    const radius = 10 + 20 * Math.sin(Math.PI * t);
    const opacity = 0.6 * (1 - t);
    map.setPaintProperty(rippleId, 'circle-radius', radius);
    map.setPaintProperty(rippleId, 'circle-opacity', opacity);

    if (frame < totalFrames) {
      requestAnimationFrame(animateRipple);
    } else {
      try {
        if (map.getLayer(rippleId)) map.removeLayer(rippleId);
        if (map.getSource(rippleId)) map.removeSource(rippleId);
      } catch {}
    }
  };
  requestAnimationFrame(animateRipple);
}
