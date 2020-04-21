import React from "react";
import { connect } from 'dva';

const MapEditor = (props) => {

  App.props.Editor = props;

  const style = {};
  return (
    <div id="rmmv-map-editor" style={style}></div>
  )
}

export default connect(({ project }) => ({ project }))(MapEditor);
