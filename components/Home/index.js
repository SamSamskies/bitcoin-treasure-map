import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ReactMapGL from "react-map-gl";
import Head from "next/head";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Home() {
  const router = useRouter();
  const [viewport, setViewport] = useState({
    longitude: -89.4417,
    latitude: 13.4975,
    zoom: 5,
    pitch: 0,
    bearing: 0,
  });
  const handleViewportChange = (viewport) => {
    if (router.isReady) {
      router.query.long = viewport.longitude;
      router.query.lat = viewport.latitude;
      router.query.zoom = viewport.zoom;
      router.push(router);
    }

    setViewport(viewport);
  };

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
        {...viewport}
        mapStyle="mapbox://styles/smiyakawa/ckxm947bt40jf14oa5koel25y"
        width="100vw"
        height="100vh"
        mapboxApiAccessToken="pk.eyJ1Ijoic21peWFrYXdhIiwiYSI6ImNrZ2Z0N2RoeTFvNDUyeXF1MmplaTF0b3oifQ.cJFNRdlJrym41VBUFq4aBQ"
        onViewportChange={handleViewportChange}
      />
    </div>
  );
}
