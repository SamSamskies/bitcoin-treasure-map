import React, { useState } from "react";
import ReactMapGL, { Popup } from "react-map-gl";
import Head from "next/head";
import QRCode from "qrcode.react";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [viewport, setViewport] = useState({
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 13,
    pitch: 0,
    bearing: 0,
  });
  const [tooltip, setTooltip] = useState(null);
  const handleMapClick = ({ lngLat: [lng, lat], features }) => {
    const treasure = features.find(
      ({ sourceLayer }) => sourceLayer === "Bitcoin_Treasure_Map_2"
    );
    const tooltip = treasure
      ? { lnurl: treasure.properties.lnurl, lat, lng }
      : null;

    setTooltip(tooltip);
  };

  return (
    <div>
      <Head>
        <title>Bitcoin Treasure Map</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReactMapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://styles/smiyakawa/ckghbwlxq0aqp19p292d5y7eb"
        mapboxApiAccessToken="pk.eyJ1Ijoic21peWFrYXdhIiwiYSI6ImNrZ2Z0N2RoeTFvNDUyeXF1MmplaTF0b3oifQ.cJFNRdlJrym41VBUFq4aBQ"
        onViewportChange={setViewport}
        onClick={handleMapClick}
      >
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            backgroundColor: "white",
            width: 280,
            padding: 16,
          }}
        >
          <h1>Bitcoin Treasure Map #2</h1>
          <p>There are 100k sats hidden in a single location on this map.</p>
          <p>hint 1: Bitcoin ATM</p>
          <p>hint 2: coffee</p>
          <p>status: treasure has been found</p>
        </div>
        {tooltip && (
          <Popup
            latitude={tooltip.lat}
            longitude={tooltip.lng}
            onClose={() => setTooltip(null)}
            closeButton={false}
          >
            <QRCode value={tooltip.lnurl} style={{ margin: "auto" }} />
            <p className={styles.bitcoinText}>
              scan with{" "}
              <span role="img" aria-label="lightning">
                ⚡️
              </span>{" "}
              wallet
            </p>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}
