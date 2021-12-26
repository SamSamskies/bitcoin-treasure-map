import React, { useState } from "react";
import Grow from "@material-ui/core/Grow";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MinimizeRoundedIcon from "@material-ui/icons/MinimizeRounded";
import InfoIcon from "@material-ui/icons/Info";
import styles from "./Info.module.css";

export default function Info() {
  const [isInfoMaximized, setIsInfoMaximized] = useState(true);

  return (
    <>
      <Grow in={isInfoMaximized} style={{ transformOrigin: "top right" }}>
        <div className={styles.panel}>
          <Grid container justifyContent="space-between">
            <h1>Bitcoin Treasure Map #4</h1>
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
            <span style={{ textDecoration: "line-through" }}>
              There are 3 treasures hidden in this map each containing a 21k
              sats ⚡️ gift.
            </span>
            <br />
            <br />
            <span>Game over. All treasures have been found.</span>
            <br />
            <br />
            <a href="https://twitter.com/SamSamskies" target="_blank">
              {" "}
              Follow me on Twitter{" "}
            </a>
            for hints and updates.
          </p>
          <p className={styles.madeWithText}>
            <small>
              Powered by{" "}
              <a href="https://lightning.gifts/" target="_blank">
                Lightning Gifts
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
