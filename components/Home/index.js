import React, { useState } from "react";
import ReactMapGL, { Popup } from "react-map-gl";
import DeckGL, { IconLayer } from "deck.gl";
import Head from "next/head";
import QRCode from "qrcode.react";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import MinimizeRoundedIcon from "@material-ui/icons/MinimizeRounded";
import InfoIcon from "@material-ui/icons/Info";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./Home.module.css";
import { getWithdrawLinkMetadata } from "./services";
import { createRandomPoints } from "./utils";

const BITCOIN_LOGO_SIZE = 256;
const ICON_MAPPING = {
  bitcoinLogo: {
    x: 0,
    y: 0,
    width: BITCOIN_LOGO_SIZE,
    height: BITCOIN_LOGO_SIZE,
  },
};
const DIFFICULTY_LEVEL = 50;

export default function Home() {
  const [viewport, setViewport] = useState({
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 10,
    pitch: 0,
    bearing: 0,
  });
  const [features, setFeatures] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const [status, setStatus] = useState("game-over");
  const [isInfoMaximized, setIsInfoMaximized] = useState(true);
  const iconLayer = new IconLayer({
    id: "icon-layer",
    data: features,
    pickable: true,
    iconAtlas: "bitcoinLogo.png",
    iconMapping: ICON_MAPPING,
    getIcon: () => "bitcoinLogo",
    getPosition: (d) => d.geometry.coordinates,
    getSize: () => BITCOIN_LOGO_SIZE * DIFFICULTY_LEVEL,
    sizeUnits: "meters",
    sizeMaxPixels: BITCOIN_LOGO_SIZE * DIFFICULTY_LEVEL,
  });
  const updateStatusAndHideTreasures = () => {
    getWithdrawLinkMetadata().then(({ used, uses }) => {
      setStatus(`${used} of ${uses} treasures have been found`);
      setFeatures(createRandomPoints(uses - used));
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
        mapStyle="mapbox://styles/mapbox/dark-v10"
        width="100vw"
        height="100vh"
        mapboxApiAccessToken="pk.eyJ1Ijoic21peWFrYXdhIiwiYSI6ImNrZ2Z0N2RoeTFvNDUyeXF1MmplaTF0b3oifQ.cJFNRdlJrym41VBUFq4aBQ"
        onViewportChange={setViewport}
      >
        <DeckGL
          viewState={viewport}
          layers={[iconLayer]}
          onClick={({ lngLat: [lng, lat], object }) => {
            if (tooltip && object === null) {
              setTooltip(null);
              updateStatusAndHideTreasures();
              return;
            }

            if (object === null) {
              return;
            }

            const includeLnurl = true;

            getWithdrawLinkMetadata(includeLnurl).then(({ lnurl }) => {
              setTooltip({ lnurl, lat, lng });
            });
          }}
        />
        <Grow in={isInfoMaximized} style={{ transformOrigin: "top right" }}>
          <div className={styles.panel}>
            <Grid container justify="space-between">
              <h1>Bitcoin Treasure Map #3</h1>
              <div>
                <IconButton
                  aria-label="minimize"
                  size="small"
                  onClick={() => setIsInfoMaximized(false)}
                >
                  <MinimizeRoundedIcon />
                </IconButton>
              </div>
            </Grid>
            <p>
              There is a total of 200k sats hidden in this map. The game starts
              with 20 treasures and each treasure contains an lnurl redeemable
              for 10k sats. The locations are chosen at random on every page
              load. The number of treasures loaded on page load will keep going
              down until there are no treasures left. The earlier you start
              playing, the easier it will be to find a treasure.
            </p>
            <p>{`status: 20 of 20 treasures have been found`}</p>
            <p className={styles.madeWithText}>
              <small>Made with NgU technology</small>
            </p>
          </div>
        </Grow>
        <Grow in={!isInfoMaximized} style={{ transformOrigin: "top right" }}>
          <div className={styles.infoIcon}>
            <IconButton
              aria-label="minimize"
              size="small"
              onClick={() => setIsInfoMaximized(true)}
            >
              <InfoIcon fontSize="large" />
            </IconButton>
          </div>
        </Grow>
        {tooltip && (
          <Popup latitude={tooltip.lat} longitude={tooltip.lng}>
            <h1 className={styles.bitcoinText}>
              You found a bitcoin treasure!
            </h1>
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
        {status === "loading" && (
          <div className={styles.mask}>
            <h1>hiding treasures</h1>
          </div>
        )}
      </ReactMapGL>
    </div>
  );
}
