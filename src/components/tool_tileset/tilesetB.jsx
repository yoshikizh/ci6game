import React from "react";
import { connect } from 'dva';

const TilesetB = (props) => {
  return (
    <div className="tilemap-grids-wrapper flex flex-row flex-wrap" style={{display: props.tool_tileset.current_tab === 'B' ? 'flex' : 'none'}}>
      <div>B-placeholder</div>
    </div>
  );
}

export default connect(({ tool_tileset }) => ({ tool_tileset }))(TilesetB);