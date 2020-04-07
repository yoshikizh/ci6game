import React from "react";
import { connect } from 'dva';

const TabTileset = (props) => {
  const handleClick = (tab) => {
    props.dispatch({
      type: 'tool_tileset/setTab',
      tab: tab
    })
  }

  return(
    <div id="container-tool-tileset-layer-tabs" className="inline-flex flex-row flex-row-center">
      <a onClick={handleClick.bind(this,'A')} className={props.tool_tileset.current_tab === 'A' ? 'active' : ''}>A</a>
      <a onClick={handleClick.bind(this,'B')} className={props.tool_tileset.current_tab === 'B' ? 'active' : ''}>B</a>
      <a onClick={handleClick.bind(this,'C')} className={props.tool_tileset.current_tab === 'C' ? 'active' : ''}>C</a>
      <a onClick={handleClick.bind(this,'D')} className={props.tool_tileset.current_tab === 'D' ? 'active' : ''}>D</a>
      <a onClick={handleClick.bind(this,'E')} className={props.tool_tileset.current_tab === 'E' ? 'active' : ''}>E</a>
      <a onClick={handleClick.bind(this,'R')} className={props.tool_tileset.current_tab === 'R' ? 'active' : ''}>R</a>
    </div>
  );
};

export default connect(({ tool_tileset }) => ({ tool_tileset }))(TabTileset);