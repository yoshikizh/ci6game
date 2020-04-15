import React from "react";

export const getTilemapConfig = (filename) => {
  const image_config = App.config.tileset_names[filename];
  const image = require(`../../assets/rtp/tilesets/${filename}.png`).default;
  return { image: image, config: image_config };
}


