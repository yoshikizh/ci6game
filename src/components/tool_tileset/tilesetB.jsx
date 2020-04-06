import React from "react";
import { connect } from 'dva';
import { getTilemapConfig, createTileEle } from "./utils";

const TilesetB = (props) => {

  const render_tilemaps = [];
  const filename = props.tool_tileset.tileset_filenames[5];

  function createTilemapB(){
    if (filename === "") return;
    const image_config = getTilemapConfig(filename)
    const tile_name_units = image_config.config.units;

    tile_name_units.forEach((tile_name,index) => {
      const x = (index % 8) * (1 * 32);
      const y = parseInt(index / 8) * (1 * 32);
      const key = `A5_${index}_${x}_${y}`
      render_tilemaps.push(createTileEle(image_config,x,y,key))
    });
  }

  createTilemapB();

  return (
    <div className="tilemap-grids-wrapper flex flex-row flex-wrap" style={{display: props.tool_tileset.current_tab === 'B' ? 'flex' : 'none'}}>
      {render_tilemaps.map(div => div)}
    </div>
  );
}

export default connect(({ tool_tileset }) => ({ tool_tileset }))(TilesetB);