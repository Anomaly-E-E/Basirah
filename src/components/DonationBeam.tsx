import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const DONOR_COORDS: [number, number] = [-79.347, 43.651];

function greatCirclePoints(
  start: [number, number],
  end: [number, number],
  numPoints = 120
): [number, number][] {
  const points: [number, number][] = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lng = start[0] + (end[0] - start[0]) * t;
    const baseLat = start[1] + (end[1] - start[1]) * t;
    const arcHeight = Math.sin(Math.PI * t) * 4.5;

    points.push([lng, baseLat + arcHeight]);
  }

  return points;
}

interface DonationBeamProps {
  map: mapboxgl.Map | null;
  target: [number, number] | null;
  onComplete: () => void;
}

export default function DonationBeam({
  map,
  target,
  onComplete,
}: DonationBeamProps) {
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!map || !target || !map.isStyleLoaded()) return;

    const baseId = `beam-${Date.now()}`;
    const glowId = `${baseId}-glow`;
    const lineId = `${baseId}-line`;
    const headId = `${baseId}-head`;
    const arc = greatCirclePoints(DONOR_COORDS, target);

    const lineGeoJson: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: arc,
      },
    };

    const pointGeoJson: GeoJSON.Feature<GeoJSON.Point> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: arc[0],
      },
    };

    map.addSource(lineId, {
      type: 'geojson',
      data: lineGeoJson,
    });

    map.addSource(headId, {
      type: 'geojson',
      data: pointGeoJson,
    });

    map.addLayer({
      id: glowId,
      type: 'line',
      source: lineId,
      paint: {
        'line-color': '#F5C842',
        'line-width': 10,
        'line-opacity': 0.14,
        'line-blur': 3,
      },
    });

    map.addLayer({
      id: lineId,
      type: 'line',
      source: lineId,
      paint: {
        'line-color': '#FFD85A',
        'line-width': 2.8,
        'line-opacity': 0.95,
      },
    });

    map.addLayer({
      id: headId,
      type: 'circle',
      source: headId,
      paint: {
        'circle-radius': 6,
        'circle-color': '#FFF6CC',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#F5C842',
        'circle-opacity': 0.95,
        'circle-blur': 0.15,
      },
    });

    let frame = 0;
    const totalFrames = arc.length;

    const animate = () => {
      if (!map.getSource(headId) || !map.getLayer(headId)) return;

      const currentIndex = Math.min(frame, totalFrames - 1);
      const currentPoint = arc[currentIndex];

      const pointSource = map.getSource(headId) as mapboxgl.GeoJSONSource;
      pointSource.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: currentPoint,
        },
      });

      const radius = 5 + Math.sin(frame * 0.25) * 1.5;
      map.setPaintProperty(headId, 'circle-radius', radius);

      frame += 1;

      if (frame < totalFrames) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        rippleEffect(map, target);

        setTimeout(() => {
          try {
            if (map.getLayer(headId)) map.removeLayer(headId);
            if (map.getLayer(lineId)) map.removeLayer(lineId);
            if (map.getLayer(glowId)) map.removeLayer(glowId);
            if (map.getSource(headId)) map.removeSource(headId);
            if (map.getSource(lineId)) map.removeSource(lineId);
          } catch {}

          onComplete();
        }, 800);
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);

      try {
        if (map.getLayer(headId)) map.removeLayer(headId);
        if (map.getLayer(lineId)) map.removeLayer(lineId);
        if (map.getLayer(glowId)) map.removeLayer(glowId);
        if (map.getSource(headId)) map.removeSource(headId);
        if (map.getSource(lineId)) map.removeSource(lineId);
      } catch {}
    };
  }, [map, target, onComplete]);

  return null;
}

function rippleEffect(map: mapboxgl.Map, coords: [number, number]) {
  const rippleId = `ripple-${Date.now()}`;
  const coreId = `${rippleId}-core`;

  map.addSource(rippleId, {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: coords,
      },
    },
  });

  map.addLayer({
    id: rippleId,
    type: 'circle',
    source: rippleId,
    paint: {
      'circle-radius': 10,
      'circle-color': '#22C55E',
      'circle-opacity': 0.35,
      'circle-blur': 0.8,
    },
  });

  map.addLayer({
    id: coreId,
    type: 'circle',
    source: rippleId,
    paint: {
      'circle-radius': 4,
      'circle-color': '#DCFCE7',
      'circle-opacity': 0.95,
      'circle-blur': 0.1,
    },
  });

  let frame = 0;
  const totalFrames = 42;

  const animateRipple = () => {
    frame += 1;
    const t = frame / totalFrames;

    const radius = 8 + t * 26;
    const opacity = 0.38 * (1 - t);
    const coreOpacity = 0.95 * (1 - t);

    if (map.getLayer(rippleId)) {
      map.setPaintProperty(rippleId, 'circle-radius', radius);
      map.setPaintProperty(rippleId, 'circle-opacity', opacity);
    }

    if (map.getLayer(coreId)) {
      map.setPaintProperty(coreId, 'circle-opacity', coreOpacity);
    }

    if (frame < totalFrames) {
      requestAnimationFrame(animateRipple);
    } else {
      try {
        if (map.getLayer(coreId)) map.removeLayer(coreId);
        if (map.getLayer(rippleId)) map.removeLayer(rippleId);
        if (map.getSource(rippleId)) map.removeSource(rippleId);
      } catch {}
    }
  };

  requestAnimationFrame(animateRipple);
}