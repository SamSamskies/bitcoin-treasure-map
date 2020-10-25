import React, { useState } from "react";
import ReactMapGL, { Popup, FlyToInterpolator } from "react-map-gl";
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
  const handleShowMeClick = () => {
    setViewport({
      ...viewport,
      latitude: 13.4968,
      longitude: -89.4395,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 8000,
    });
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
        <div className={styles.panel}>
          <h1>Bitcoin Treasure Map #2</h1>
          <p>There are 100k sats hidden in a single location on this map.</p>
          <p>hint 1: Bitcoin ATM</p>
          <p>hint 2: coffee</p>
          <p>status: treasure has been found</p>
          <button onClick={handleShowMeClick}>SHOW ME THE TREASURE</button>
          <p className={styles.madeWithText}>
            <small>Made with NgU Technology</small>
          </p>
        </div>
        {tooltip && (
          <Popup
            latitude={tooltip.lat}
            longitude={tooltip.lng}
            closeButton={false}
          >
            <h1>Welcome to Café Cocoa</h1>
            <p>
              Café Cocoa is located in El Zonte, El Salvador where the community
              has started a Bitcoin circular economy. Check out Bitcoin Beach
              for more details.
            </p>
            <a href="https://www.bitcoinbeach.com/" target="_blank">
              https://www.bitcoinbeach.com/
            </a>
            <QRCode
              value={tooltip.lnurl}
              style={{ margin: "24px auto auto auto" }}
              includeMargin
            />
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
