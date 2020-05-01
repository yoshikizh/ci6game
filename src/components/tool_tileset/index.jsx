import React from "react";
import { connect } from 'dva';
import TilesetA from './tilesetA'
// import TilesetB from './tilesetB'
// import TilesetC from './tilesetC'
// import TilesetBC from './TilesetBC'
import TilesetBtoE from './TilesetBtoE'
import TilesetR from './tilesetR'
import TabTileset from './tab'

const ToolTileset = (props) => {

  App.props.tool_tileset = props;

  return (
    <div id="container-tool-tileset-wrapper" className="area-border-color">
      <div id="container-tool-tileset">
        <TilesetA />
        <TilesetBtoE tab="B" />
        <TilesetBtoE tab="C" />
        <TilesetBtoE tab="D" />
        <TilesetBtoE tab="E" />
        <TilesetR />
      </div>
      <TabTileset />
    </div>
  );
};

export default connect(({ tool_tileset }) => ({ tool_tileset }))(ToolTileset);