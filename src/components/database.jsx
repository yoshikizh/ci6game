import React from "react";
import { connect } from 'dva';

import ActorComponent from './database/actor';


const DatabaseInit = (props) => {

  const app_config = App.config.app;
  const window_width = app_config.interface_size.window_width;
  const window_height = app_config.interface_size.window_height;

  const is_show_event = props.database.show_database_window;

  const style = {
    left: (window_width / 2 - 1024 / 2) + "px",
    top: (window_height / 2 - 640 / 2) + "px"
  };

  const onClickOkDatabaseHandle = () => {
    props.dispatch({
      type: 'database/hideDatabaseWindow'
    });
  };
  const onClickCancelDatabaseHandle = () => {
    props.dispatch({
      type: 'database/hideDatabaseWindow'
    });
  };
  const onClickApplyDatabaseHandle = () => {

  };

  const current_tab = props.database.current_tab;
  let bodyHtml = '';
  if (current_tab === 'actor'){
    bodyHtml = <ActorComponent />;
  }
  // const tabHtml = require(`./database/${current_tab}`).default;

  if (is_show_event){
    return (
      <div id="database-wrapper" className="main-background-gradient" style={style} >
        <div id="database-header">
          Database
        </div>

        <div id="database-body">

          <div id="database-body-wraps">
            <div id="database-body-tabs">
              <a className="item">Actors</a>
              <div className="splitline"></div>
              <a className="item">ClassNames</a>
              <div className="splitline"></div>
              <a className="item">Skills</a>
              <div className="splitline"></div>
              <a className="item">Items</a>
              <div className="splitline"></div>
              <a className="item">Weapons</a>
              <div className="splitline"></div>
              <a className="item">Armors</a>
              <div className="splitline"></div>
              <a className="item">Enemies</a>
              <div className="splitline"></div>
              <a className="item">Troops</a>
              <div className="splitline"></div>
              <a className="item">States</a>
              <div className="splitline"></div>
              <a className="item">Animations</a>
              <div className="splitline"></div>
              <a className="item">Tilesets</a>
              <div className="splitline"></div>
              <a className="item">CommonEvents</a>
              <div className="splitline"></div>
              <a className="item">System</a>
              <div className="splitline"></div>
              <a className="item">Types</a>
              <div className="splitline"></div>
              <a className="item">Terms</a>
              <div className="splitline"></div>
            </div>
            <div id="database-body-container">{bodyHtml}</div>
          </div>

          <div id="database-buttons">
            <a onClick={onClickOkDatabaseHandle.bind(this)} className="block item ok-btn-background-gradient">Ok</a>
            <a onClick={onClickCancelDatabaseHandle.bind(this)} className="block item ok-btn-background-gradient">Cancel</a>
            <a onClick={onClickApplyDatabaseHandle.bind(this)} className="block item ok-btn-background-gradient">Apply</a>
          </div>

        </div>
      </div>
    )
  } else {
    return ""
  }
}

export default connect(({ database }) => ({ database }))(DatabaseInit);

