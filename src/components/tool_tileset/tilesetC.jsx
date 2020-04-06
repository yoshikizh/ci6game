import React, {useState} from "react";
import { connect } from 'dva';
import { getTilemapConfig } from "./utils";

const TilesetC = (props) => {

  const [cursor_id, setCursorId] = useState(null);

  const render_tilemaps = [];
  const filename = props.tool_tileset.tileset_filenames[6];

  const onClickHandle = (cursor_id) => {
    setCursorId(cursor_id);
  };

  const createTileEle = (image_config, x, y, key) => {
    const width = image_config.config.width / 1.5;
    const height = image_config.config.height / 1.5;
    const style = {
      backgroundImage: `url(${image_config.image})`,
      backgroundPosition: cursor_id === key ? `-${x+3}px -${y+3}px` : `-${x}px -${y}px`,
      backgroundSize: `${width}px ${height}px`,

      border: cursor_id === key ? "3px solid black" : "none",
      width: cursor_id === key ? "26px" : "32px",
      height: cursor_id === key ? "26px" : "32px",
      lineHeight: cursor_id === key ? "26px" : "32px"

    };
    return(
      <div onClick={onClickHandle.bind(this,key)} key={key} className="tilemap-grid" style={style}></div>
    );
  }

  const createTilemap = () => {
    if (filename === "") return;
    const image_config = getTilemapConfig(filename)
    const tile_name_units = image_config.config.units;

    tile_name_units.forEach((tile_name,index) => {
      const x = (index % 8) * (1 * 32);
      const y = parseInt(index / 8) * (1 * 32);
      const key = `C_${index}_${x}_${y}`
      render_tilemaps.push(createTileEle(image_config,x,y,key))
    });
  }

  createTilemap();

  return (
    <div className="tilemap-grids-wrapper flex flex-row flex-wrap" style={{display: props.tool_tileset.current_tab === 'C' ? 'flex' : 'none'}}>
      {render_tilemaps.map(div => div)}
    </div>
  );
}

export default connect(({ tool_tileset }) => ({ tool_tileset }))(TilesetC);