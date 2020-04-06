import React from "react";
import { connect } from 'dva';

const TilesetR = (props) => {
  return (
    <div className="tilemap-grids-wrapper flex flex-row flex-wrap" style={{display: props.tool_tileset.current_tab === 'R' ? 'flex' : 'none'}}>
      <div>R-placeholder</div>
    </div>
  );
}

export default connect(({ tool_tileset }) => ({ tool_tileset }))(TilesetR);