import React from "react";
import { connect } from 'dva';

const Toolbar = (props) => {

  const onClickHandle = (tool_name) => {
    props.dispatch({
      type: "toolbar/callTool",
      params: { tool_name: tool_name }
    });

  };

  const buildToolbarImages = () => {
    const arr = [];
    const toolbar_images = App.config.app.toolbar.images;
    const images_length = toolbar_images.length;
    App.config.app.toolbar.images.forEach((group,index) => {
      group.forEach((obj,_index) => {
        const tool_name = obj.name;

        let class_name = "";
        if (tool_name === "map_edit" && props.toolbar.current_mode === "map_edit" ){
          class_name = "active";
        }
        if (tool_name === "event" && props.toolbar.current_mode === "event"){
          class_name = "active";
        }
        if (tool_name === "pencil" && props.toolbar.current_draw === "pencil"){
          class_name = "active";
        }
        if (tool_name === "square" && props.toolbar.current_draw === "square"){
          class_name = "active";
        }
        if (tool_name === "ellipse" && props.toolbar.current_draw === "ellipse"){
          class_name = "active";
        }
        if (tool_name === "fill" && props.toolbar.current_draw === "fill"){
          class_name = "active";
        }
        if (tool_name === "shadow_pen" && props.toolbar.current_draw === "shadow_pen"){
          class_name = "active";
        }

        arr.push(<a className={ class_name } onClick={onClickHandle.bind(this,tool_name)} key={tool_name}><img src={require("../"+obj.path).default} /></a>);
      })
      if (index < images_length - 1) {
        arr.push(<span className="split-vertical-line" key={"span"+index}></span>);
      }
    });
    return arr;
  };

  return (
    <div id="header-toolbar" className="inline-flex flex-row flex-col-center">
      { buildToolbarImages().map(ele => ele )}
    </div>
  );
}

export default connect(({ toolbar }) => ({ toolbar }))(Toolbar);
