import React, { useState } from "react";
import Grow from "@material-ui/core/Grow";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MinimizeRoundedIcon from "@material-ui/icons/MinimizeRounded";
import InfoIcon from "@material-ui/icons/Info";
import styles from "./Info.module.css";

export default function Info() {
  const [isInfoMaximized, setIsInfoMaximized] = useState(
    window.innerWidth > 620
  );

  return (
    <>
      <Grow in={isInfoMaximized} style={{ transformOrigin: "top right" }}>
        <div className={styles.panel}>
          <Grid container justifyContent="space-between">
            <h1>Bitcoin Treasure Map</h1>
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
            Search or click on the map to reveal BIP39 words for a given
            location.
          </p>
          <p className={styles.madeWithText}>
            <small>
              Powered by{" "}
              <a href="https://github.com/arcbtc/where39" target="_blank">
                Where39
              </a>
            </small>
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
    </>
  );
}
