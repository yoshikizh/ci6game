import React from "react";
import { connect } from 'dva';

const TilesetC = (props) => {
  return (
    <div className="tilemap-grids-wrapper flex flex-row flex-wrap" style={{display: props.tool_tileset.current_tab === 'C' ? 'flex' : 'none'}}>
      <div>C-placeholder</div>
    </div>
  );
}

export default connect(({ tool_tileset }) => ({ tool_tileset }))(TilesetC);