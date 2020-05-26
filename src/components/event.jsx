import React from "react";
import { connect } from 'dva';

const EventInit = (props) => {

  App.props.Event = props;

  const is_show_event = props.event.show_event_window;

  const app_config = App.config.app;
  const window_width = app_config.interface_size.window_width;
  const window_height = app_config.interface_size.window_height;

  const render_cycles = [];

  const style = {
    left: (window_width / 2 - 1024 / 2) + "px",
    top: (window_height / 2 - 640 / 2) + "px"
  };

  const createCycle = (index) => {
    const style = {
      height: "21px",
      width: "100%",
      backgroundColor: index % 2 === 0 ? "white" : "#e3ebf1"
    }
    const key = `cycle-${index}`;
    return(
      <div key={key} style={style}></div>
    );
  }

  const createCycles = () => {
    for(let i = 0; i < 20; i++){
      render_cycles.push(createCycle(i));
    }
  }

  const onClickOkEventHandle = () => {
    props.dispatch({
      type: 'event/hideEventWindow'
    });
  };
  const onClickCancelEventHandle = () => {
    props.dispatch({
      type: 'event/hideEventWindow'
    });
  };
  const onClickApplyEventHandle = () => {
    props.dispatch({
      type: 'event/hideEventWindow'
    });
  };



  createCycles();

  if (is_show_event){
    return (
      <div id="event-wrapper" className="main-background-gradient" style={style}>
        <div id="event-header">
          ID:001 - Event Editor
        </div>

        <div id="event-body">

          <div id="event-body-top">
            <div className="item">
              <div>Name:</div>
              <div>
                <input type="text" />
              </div>
            </div>
            <div className="item">
              <div>Note:</div>
              <div>
                <input type="text" />
              </div>
            </div>

            <a className="block item ok-btn-background-gradient">New</a>
            <a className="block item ok-btn-background-gradient">Delete</a>
            <a className="block item ok-btn-background-gradient">Clear</a>
          </div>

          <div id="event-body-tabs">
            <a className="item">1</a>
            <a className="item">2</a>
            <a className="item">3</a>
            <a className="item">4</a>
          </div>

          <div id="event-body-container">
            <div className="item item1 area" id="event-body-container-conditions">
              <div className="title">Conditions</div>
            </div>
            <div className="item item2 area" id="event-body-container-image">
              <div className="title">Image</div>
            </div>
            <div className="item item3 area" id="event-body-container-options">
              <div className="title">Options</div>
            </div>
            <div className="item item4 area" id="event-body-container-auto-movement">
              <div className="title">Auto-movement</div>
            </div>
            <div className="item item5 area" id="event-body-container-priortiy">
              <div className="title">Priortiy</div>
            </div>
            <div className="item item6 area" id="event-body-container-trigger">
              <div className="title">Trigger</div>
            </div>
            <div className="item item7 area" id="event-body-container-contents">
              <div className="title">Contents</div>
              <div id="event-body-container-contents-code-wrap" className="mt5">

                <div id="event-body-container-contents-code-back">
                  {render_cycles.map(div => div)}
                </div>
                <div id="event-body-container-contents-code-content"></div>


              </div>
            </div>
          </div>

          <div id="event-buttons">
            <a onClick={onClickOkEventHandle.bind(this)} className="block item ok-btn-background-gradient">Ok</a>
            <a onClick={onClickCancelEventHandle.bind(this)} className="block item ok-btn-background-gradient">Cancel</a>
            <a onClick={onClickApplyEventHandle.bind(this)} className="block item ok-btn-background-gradient">Apply</a>
          </div>

        </div>
        
      </div>
    )
  } else {
    return ""
  }

}

export default connect(({ event }) => ({ event }))(EventInit);


