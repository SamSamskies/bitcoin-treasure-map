import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import Head from "next/head";
import Info from "./Info";
import { toWords } from "./where39";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic21peWFrYXdhIiwiYSI6ImNrZ2Z0N2RoeTFvNDUyeXF1MmplaTF0b3oifQ.cJFNRdlJrym41VBUFq4aBQ";
const BITCOIN_LOGO_SIZE = 20;

export default function Home() {
  const router = useRouter();
  const mapRef = useRef();
  const geocoderContainerRef = useRef();
  const [viewport, setViewport] = useState({
    longitude: -89.4417,
    latitude: 13.4975,
    zoom: 10,
    pitch: 0,
    bearing: 0,
  });
  const [tooltip, setTooltip] = useState(null);
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
  const setTooltipValues = ([longitude, latitude]) => {
    const words = toWords(latitude, longitude).join(".");

    setTooltip({ longitude, latitude, words });
  };
  const handleOnResult = useCallback(({ result }) => {
    setTooltipValues(result.center);
  }, []);
  const handleOnClear = useCallback(() => {
    setTooltip(null);
  }, []);
  const handleMapClick = ({ lngLat }) => {
    setTooltipValues(lngLat);

    router.query.long = lngLat[0];
    router.query.lat = lngLat[1];
    router.push(router);
  };

  useEffect(() => {
    if (router.isReady) {
      const normalizeQueryParam = (param) => {
        const normalized = Number(param);

        return Number.isNaN(normalized) ? undefined : normalized;
      };
      const longitude = normalizeQueryParam(router.query?.long);
      const latitude = normalizeQueryParam(router.query?.lat);

      setViewport({
        ...viewport,
        longitude,
        latitude,
        zoom: normalizeQueryParam(router.query?.zoom),
      });

      if (longitude && latitude) {
        setTooltipValues([longitude, latitude]);
      }
    }
  }, [router.isReady]);

  return (
    <div>
      <Head>
        <title>Bitcoin Treasure Map</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Info />
      <div
        ref={geocoderContainerRef}
        style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}
      />
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        width="100vw"
        height="100vh"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={handleViewportChange}
        onClick={handleMapClick}
      >
        <Geocoder
          mapRef={mapRef}
          containerRef={geocoderContainerRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position="top-left"
          marker={false}
          onResult={handleOnResult}
          onClear={handleOnClear}
        />
        {tooltip && (
          <>
            <Marker
              latitude={tooltip.latitude}
              longitude={tooltip.longitude}
              offsetLeft={-BITCOIN_LOGO_SIZE / 2}
              offsetTop={-BITCOIN_LOGO_SIZE / 2}
            >
              <img
                src="bitcoinLogo.png"
                alt="Bitcoin logo"
                width={BITCOIN_LOGO_SIZE}
                height={BITCOIN_LOGO_SIZE}
              />
            </Marker>
            <Popup
              latitude={tooltip.latitude}
              longitude={tooltip.longitude}
              closeButton={false}
            >
              <p>{tooltip.words}</p>
              <p>{`${tooltip.latitude}, ${tooltip.longitude}`}</p>
            </Popup>
          </>
        )}
      </ReactMapGL>
    </div>
  );
}
