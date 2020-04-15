import React from "react";
import { connect } from 'dva';
import { getTilemapConfig } from "./utils";

const TilesetBtoE = (props) => {

  const tab = props.tab;
  const tab_index_hash = {
    "B": 5,
    "C": 6,
    "D": 7,
    "E": 8
  };

  // const [cursor_id, setCursorId] = useState(null);

  const render_tilemaps = [];
  const filename = props.tool_tileset.tileset_filenames[tab_index_hash[tab]];

  const onClickHandle = (tile_id) => {
    props.dispatch({
      type: 'tool_tileset/selectTile',
      tile_id: tile_id
    });
  };

  const createTileEle = (image_config, x, y, key) => {
    const width = image_config.config.width / 1.5;
    const height = image_config.config.height / 1.5;
    const tile_id = props.tool_tileset.selected_tile_id;
    
    const style = {
      backgroundImage: `url(${image_config.image})`,
      backgroundPosition: tile_id === key ? `-${x+3}px -${y+3}px` : `-${x}px -${y}px`,
      backgroundSize: `${width}px ${height}px`,

      border: tile_id === key ? "3px solid black" : "none",
      width: tile_id === key ? "26px" : "32px",
      height: tile_id === key ? "26px" : "32px",
      lineHeight: tile_id === key ? "26px" : "32px"
    };
    return(
      <div onClick={onClickHandle.bind(this,key)} key={key} className="tilemap-grid" style={style}></div>
    );
  }

  const createTilemap = () => {
    if (filename === "") return;
    const image_config = getTilemapConfig(filename)
    const tile_name_units = image_config.config.units;
    const map_width = image_config.config.width / 1.5;
    const map_height = image_config.config.height / 1.5;

    tile_name_units.forEach((tile_name,index) => {

      const group_nums = (map_height / 32) * (map_width / 2 / 32);
      const group_index = index < group_nums ? 0 : 1

      let x,y,key;
      if (group_index === 0){
        x = (index % 8) * (1 * 32);
        y = parseInt(index / 8) * (1 * 32);
      } else {
        x = (map_width / 2) + (index % 8) * (1 * 32);
        y = parseInt((index % group_nums) / 8) * (1 * 32);
      }
      key = `${tab}_${index}_${x}_${y}`
      render_tilemaps.push(createTileEle(image_config,x,y,key));
    });

  }

  createTilemap();

  return (
    <div className="tilemap-grids-wrapper flex flex-row flex-wrap" style={{display: props.tool_tileset.current_tab === tab ? 'flex' : 'none'}}>
      {render_tilemaps.map(div => div)}
    </div>
  );
}

export default connect(({ tool_tileset }) => ({ tool_tileset }))(TilesetBtoE);
