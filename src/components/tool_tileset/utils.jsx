import React from "react";

export const getTilemapConfig = (filename) => {
  const image_config = App.config.tileset_names[filename];
  const image = require(`../../assets/rtp/tilesets/${filename}.png`).default;
  return { image: image, config: image_config };
}

export const createTileEle = (image_config, x, y, key) => {
  const width = image_config.config.width / 1.5;
  const height = image_config.config.height / 1.5;
  const style = {
    backgroundImage: `url(${image_config.image})`,
    backgroundPosition: `-${x}px -${y}px`,
    backgroundSize: `${width}px ${height}px`
  };
  return(
    <div key={key} className="tilemap-grid" style={style}></div>
  );
}
