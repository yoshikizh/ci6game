import React from "react";
import { connect } from 'dva';

const MapEditor = (props) => {

  const style = {};
  return (
    <div id="rmmv-map-editor" style={style}></div>
  )
}

export default connect(({ project }) => ({ project }))(MapEditor);
