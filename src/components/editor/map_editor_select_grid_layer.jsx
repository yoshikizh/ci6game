import React, { useEffect } from "react";
import { connect } from 'dva';

const MapEditorSelectGridLayer = (props) => {
  App.props.MapEditorSelectGridLayer = props;
  const [x, y] = props.project.current_map_cursor_pos;
  const style = {
    left: x - (x % 48),
    top: y - (y % 48)
  };

  return (
    <div className="grid" style={style}>
    </div>
  )
}

export default connect(({ project }) => ({ project }))(MapEditorSelectGridLayer);
