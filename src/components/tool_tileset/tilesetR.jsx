import React, { useState } from "react";
import { connect } from 'dva';

const TilesetR = (props) => {

  // const [cursorindex, setCursorindex] = useState(null);
  const tag_blocks = [];
  const filename = props.tool_tileset.tileset_filenames[6];

  const createBlock = (index,x,y,key) => {
    const tile_id = props.tool_tileset.selected_tile_id;
    const style = {
      textAlign: "center",
      color: "white",
      cursor: "default",
      fontSize: "13px",
      border: tile_id === key ? "3px solid black" : "none",
      width: tile_id === key ? "26px" : "32px",
      height: tile_id === key ? "26px" : "32px",
      lineHeight: tile_id === key ? "26px" : "32px"
    };

    if (index > 0) {
      let rgb = "";
      const n = (index - 1) % 12;
      switch(n){
        case 0:
          rgb = "c17575";
          break;
        case 1:
          rgb = "c19b75";
          break;
        case 2:
          rgb = "c1c175";
          break;
        case 3:
          rgb = "9bc175";
          break;
        case 4:
          rgb = "75c175";
          break;
        case 5:
          rgb = "75c19b";
          break;
        case 6:
          rgb = "75c1c1";
          break;
        case 7:
          rgb = "759bc1";
          break;
        case 8:
          rgb = "7575c1";
          break;
        case 9:
          rgb = "9b75c1";
          break;
        case 10:
          rgb = "c175c1";
          break;
        case 11:
          rgb = "c1759b";
          break;
      }
      style["backgroundColor"] = `#${rgb}`;
      style["opacity"] = "0.8";
    };

    return(
      <div key={key} onClick={onClickHandle.bind(this,key)} className="tilemap-grid" style={style}>{index === 0 ? '' : index}</div>
    );
  };

  const createTagBlocks = () => {
    for(let i = 0; i < 256; i++){
      const x = (i % 8) * (1 * 32);
      const y = parseInt(i / 8) * (1 * 32);
      const key = `R_${i}_${x}_${y}`
      tag_blocks.push(createBlock(i,x,y,key))
    };
  };

  const onClickHandle = (tile_id) => {
    props.dispatch({
      type: 'tool_tileset/selectTile',
      tile_id: tile_id
    });
  };

  createTagBlocks();

  return (
    <div className="tilemap-grids-wrapper flex flex-row flex-wrap" style={{display: props.tool_tileset.current_tab === 'R' ? 'flex' : 'none'}}>
      {tag_blocks.map(div => div)}
    </div>
  );
}

export default connect(({ tool_tileset }) => ({ tool_tileset }))(TilesetR);