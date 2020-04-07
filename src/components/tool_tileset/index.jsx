import React from "react";
import { connect } from 'dva';
import TilesetA from './tilesetA'
// import TilesetB from './tilesetB'
// import TilesetC from './tilesetC'
import TilesetBC from './TilesetBC'
import TilesetDE from './TilesetDE'
import TilesetR from './tilesetR'
import TabTileset from './tab'

const ToolTileset = (props) => {

  return (
    <div id="container-tool-tileset-wrapper" className="area-border-color">
      <div id="container-tool-tileset">
        <TilesetA />
        <TilesetBC tab="B" />
        <TilesetBC tab="C" />
        <TilesetDE tab="D" />
        <TilesetDE tab="E" />
        <TilesetR />
      </div>
      <TabTileset />
    </div>
  );
};

export default connect(({ tool_tileset }) => ({ tool_tileset }))(ToolTileset);