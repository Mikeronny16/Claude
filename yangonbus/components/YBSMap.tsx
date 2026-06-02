'use client'

import { useEffect, useRef, useState } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'

// ── Types ──────────────────────────────────────────────────────────────────

export interface MapStop {
  id: number
  lat: number
  lng: number
  name_en: string
  name_mm?: string | null
}

export interface YBSMapProps {
  /** Map center [lng, lat]. Defaults to Yangon (96.1735, 16.8409) */
  center?: [number, number]
  /** Zoom level. Defaults to 13 */
  zoom?: number
  /** Stop markers to render as circles */
  stops?: MapStop[]
  /** Polyline coordinates [[lng, lat], …] for a route line */
  routeLine?: [number, number][]
  /** Route line color hex (WITHOUT #). Defaults to E42313 */
  routeColor?: string
  /** ID of the stop to highlight in amber */
  selectedStopId?: number
  /** Called when a stop circle is clicked */
  onStopClick?: (id: number) => void
  /** CSS height class override, default "h-full" */
  heightClass?: string
}

// ── Raster tile style (dark-ish via brightness/saturation filters) ─────────

function buildStyle(): object {
  return {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors',
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: 'osm-tiles',
        type: 'raster',
        source: 'osm',
        paint: {
          'raster-opacity': 1,
          'raster-brightness-max': 0.55,
          'raster-brightness-min': 0,
          'raster-contrast': 0.1,
          'raster-saturation': -0.4,
          'raster-hue-rotate': 180,
        },
      },
    ],
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export default function YBSMap({
  center = [96.1735, 16.8409],
  zoom = 13,
  stops = [],
  routeLine,
  routeColor = 'E42313',
  selectedStopId,
  onStopClick,
  heightClass = 'h-full',
}: YBSMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  const [ready, setReady] = useState(false)

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    let isMounted = true

    import('maplibre-gl').then((mod) => {
      if (!isMounted || !containerRef.current) return
      const maplibregl = mod.default

      // Derive initial viewport
      let initialCenter: [number, number] = center
      let initialZoom = zoom

      if (stops.length > 0 || (routeLine && routeLine.length > 0)) {
        const allPoints: [number, number][] = [
          ...stops.map((s) => [s.lng, s.lat] as [number, number]),
          ...(routeLine ?? []),
        ]
        if (allPoints.length > 0) {
          const lngs = allPoints.map(([lng]) => lng)
          const lats = allPoints.map(([, lat]) => lat)
          initialCenter = [
            (Math.min(...lngs) + Math.max(...lngs)) / 2,
            (Math.min(...lats) + Math.max(...lats)) / 2,
          ]
          if (allPoints.length > 1) initialZoom = zoom
        }
      }

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: buildStyle() as string | import('maplibre-gl').StyleSpecification,
        center: initialCenter,
        zoom: initialZoom,
        attributionControl: false,
      })

      mapRef.current = map

      map.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        'bottom-right'
      )

      map.on('load', () => {
        if (!isMounted) return

        // ── Route line ──────────────────────────────────────────────────────
        if (routeLine && routeLine.length > 1) {
          map.addSource('route-line', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'LineString', coordinates: routeLine },
            },
          })
          map.addLayer({
            id: 'route-line-layer',
            type: 'line',
            source: 'route-line',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': `#${routeColor}`,
              'line-width': 4,
              'line-opacity': 0.9,
            },
          })
        }

        // ── Stop circles ────────────────────────────────────────────────────
        if (stops.length > 0) {
          map.addSource('stops', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: stops.map((s) => ({
                type: 'Feature' as const,
                properties: { id: s.id, name_en: s.name_en, name_mm: s.name_mm ?? '' },
                geometry: { type: 'Point' as const, coordinates: [s.lng, s.lat] },
              })),
            },
          })

          // White halo
          map.addLayer({
            id: 'stops-halo',
            type: 'circle',
            source: 'stops',
            paint: {
              'circle-radius': 7,
              'circle-color': '#ffffff',
              'circle-opacity': 0.9,
            },
          })

          // Colored fill — amber for selected, red otherwise
          map.addLayer({
            id: 'stops-fill',
            type: 'circle',
            source: 'stops',
            paint: {
              'circle-radius': 5,
              'circle-color': [
                'case',
                ['==', ['get', 'id'], selectedStopId ?? -1],
                '#F59E0B',
                `#${routeColor}`,
              ],
              'circle-opacity': 1,
            },
          })

          // Hover cursor
          map.on('mouseenter', 'stops-fill', () => {
            map.getCanvas().style.cursor = 'pointer'
          })
          map.on('mouseleave', 'stops-fill', () => {
            map.getCanvas().style.cursor = ''
          })

          // Tooltip popup
          const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'ybs-popup',
            offset: 10,
          })

          map.on('mouseenter', 'stops-fill', (e) => {
            const feat = e.features?.[0]
            if (!feat) return
            const coords = (feat.geometry as { coordinates: number[] }).coordinates
            const name = (feat.properties as { name_en: string }).name_en
            popup
              .setLngLat([coords[0], coords[1]])
              .setHTML(`<span class="ybs-popup-label">${name}</span>`)
              .addTo(map)
          })

          map.on('mouseleave', 'stops-fill', () => {
            popup.remove()
          })

          // Click handler
          if (onStopClick) {
            map.on('click', 'stops-fill', (e) => {
              const feat = e.features?.[0]
              if (!feat) return
              const id = (feat.properties as { id: number }).id
              onStopClick(Number(id))
            })
          }
        }

        // ── Fit to content ──────────────────────────────────────────────────
        const allPoints: [number, number][] = [
          ...stops.map((s) => [s.lng, s.lat] as [number, number]),
          ...(routeLine ?? []),
        ]
        if (allPoints.length > 1) {
          const lngs = allPoints.map(([lng]) => lng)
          const lats = allPoints.map(([, lat]) => lat)
          map.fitBounds(
            [
              [Math.min(...lngs), Math.min(...lats)],
              [Math.max(...lngs), Math.max(...lats)],
            ],
            { padding: 40, maxZoom: 15, duration: 600 }
          )
        }

        setReady(true)
      })
    })

    return () => {
      isMounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
    // Re-run only when key data changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    center.join(','),
    zoom,
    stops.map((s) => s.id).join(','),
    routeLine?.length,
    routeColor,
  ])

  // ── Sync selected stop highlight without full re-init ─────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!map.getLayer('stops-fill')) return
    map.setPaintProperty('stops-fill', 'circle-color', [
      'case',
      ['==', ['get', 'id'], selectedStopId ?? -1],
      '#F59E0B',
      `#${routeColor}`,
    ])
  }, [selectedStopId, routeColor])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }} className={heightClass}>
      {/* Loading skeleton */}
      {!ready && (
        <div
          className="shimmer"
          style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', zIndex: 2 }}
        />
      )}

      {/* Map canvas */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
      />

      {/* Popup + attribution overrides */}
      <style>{`
        .ybs-popup .maplibregl-popup-content {
          background: #1D2023 !important;
          border: 1px solid #252729 !important;
          border-radius: 8px !important;
          padding: 5px 10px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,.6) !important;
          color: #F1F3F4 !important;
          font-size: 12px !important;
          font-weight: 600 !important;
        }
        .ybs-popup .maplibregl-popup-tip {
          border-top-color: #1D2023 !important;
          border-bottom-color: #1D2023 !important;
        }
        .maplibregl-ctrl-attrib {
          background: rgba(13,14,15,.7) !important;
          color: #8A8D90 !important;
          font-size: 10px !important;
        }
        .maplibregl-ctrl-attrib a {
          color: #8A8D90 !important;
        }
      `}</style>
    </div>
  )
}
