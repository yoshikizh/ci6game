import React from "react";
import { connect } from 'dva';
import TilesetA from './tilesetA'
import TilesetB from './tilesetB'
import TilesetC from './tilesetC'
import TilesetR from './tilesetR'
import TabTileset from './tab'

const ToolTileset = (props) => {

  return (
    <div id="container-tool-tileset-wrapper" className="area-border-color">
      <div id="container-tool-tileset">
        <TilesetA />
        <TilesetB />
        <TilesetC />
        <TilesetR />
      </div>
      <TabTileset />
    </div>
  );
};

export default connect(({ tool_tileset }) => ({ tool_tileset }))(ToolTileset);