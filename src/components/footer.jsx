import React from "react";
import { connect } from 'dva';

const AppFooterInit = (props) => {

  App.props.Footer = props;
  const current_map = props.status_bar.map_status;

  const onClickNewEventHandle = () => {
    App.props.Event.dispatch({
      type: 'event/showEventWindow'
    });
  };

  return (
    <div id="footer-wrapper" className="main-background-gradient flex flex-row flex-col-center">

      <div id="map-tilename">{props.status_bar.tilename}</div>
      <div className="split-vertical-line"></div>
      <div id="map-status">
        ID:{current_map.id}:{current_map.name} ({current_map.width}x{current_map.height})
      </div>
      <div className="split-vertical-line"></div>
      <div id="map-pos">{props.status_bar.cursor_pos.join(",")}</div>
      <div className="split-vertical-line"></div>
      <div id="map-zoom">{props.status_bar.zoom}%</div>
      <div className="split-vertical-line"></div>
      <div id="map-event-id">{props.status_bar.event_id ? `EVENT_ID:${props.status_bar.event_id} - ${props.status_bar.event_name}` : "noSelect"}%</div>
      <div className="split-vertical-line"></div>

      { props.status_bar.show_edit_btn ? <div><a id="edit-current-event" className="ok-btn-background-gradient">Edit</a></div> : "" }
      { props.status_bar.show_new_btn ? <div><a onClick={onClickNewEventHandle.bind(this)} id="new-current-event" className="ok-btn-background-gradient">New</a></div> : "" }
    </div>
  )
}

export default connect(({ status_bar }) => ({ status_bar }))(AppFooterInit);

