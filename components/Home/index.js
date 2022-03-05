import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import Head from "next/head";
import { toWords } from "./where39";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic21peWFrYXdhIiwiYSI6ImNrZ2Z0N2RoeTFvNDUyeXF1MmplaTF0b3oifQ.cJFNRdlJrym41VBUFq4aBQ";
const BITCOIN_LOGO_SIZE = 20;

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
  const handleOnResult = useCallback(({ result }) => {
    const [longitude, latitude] = result.center;
    const words = toWords(latitude, longitude).join(" ");

    setTooltip({ longitude, latitude, words });
  }, []);
  const handleOnClear = useCallback(() => {
    setTooltip(null);
  }, []);

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
