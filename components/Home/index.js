import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import ReactMapGL from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import Head from "next/head";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic21peWFrYXdhIiwiYSI6ImNrZ2Z0N2RoeTFvNDUyeXF1MmplaTF0b3oifQ.cJFNRdlJrym41VBUFq4aBQ";

export default function Home() {
  const router = useRouter();
  const mapRef = useRef();
  const [viewport, setViewport] = useState({
    longitude: -89.4417,
    latitude: 13.4975,
    zoom: 5,
    pitch: 0,
    bearing: 0,
  });
  const handleViewportChange = useCallback(
    (viewport) => {
      if (router.isReady) {
        router.query.long = viewport.longitude;
        router.query.lat = viewport.latitude;
        router.query.zoom = viewport.zoom;
        router.push(router);
      }

      setViewport(viewport);
    },
    [router.isReady]
  );
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );

  useEffect(() => {
    if (router.isReady) {
      const normalizeQueryParam = (param) => {
        const normalized = Number(param);

        return Number.isNaN(normalized) ? undefined : normalized;
      };

      setViewport({
        ...viewport,
        longitude: normalizeQueryParam(router.query?.long),
        latitude: normalizeQueryParam(router.query?.lat),
        zoom: normalizeQueryParam(router.query?.zoom),
      });
    }
  }, [router.isReady]);

  return (
    <div>
      <Head>
        <title>Bitcoin Treasure Map</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        mapStyle="mapbox://styles/smiyakawa/ckxm947bt40jf14oa5koel25y"
        width="100vw"
        height="100vh"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={handleViewportChange}
      >
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position="top-left"
        />
      </ReactMapGL>
    </div>
  );
}
