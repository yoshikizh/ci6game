import React from "react";
import { connect } from 'dva';

const ActorInit = (props) => {

  const render_cycles = [];

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
    for(let i = 0; i < 24; i++){
      render_cycles.push(createCycle(i));
    }
  }

  createCycles();

  return(
    <div id="database-actor-wrap">
      <div className="item item1" id="database-actor-banner">
        Actors
      </div>
      <div className="item item2" id="database-actor-select-list">
        <div class="cycle-layer">
          <div class="back">
            {render_cycles.map(div => div)}
          </div>
          <div id="content">
          </div>
        </div>
      </div>
      <div className="item item3" id="database-actor-change-max">
      </div>
      <div className="item item4 area" id="database-actor-general-settings">
        <div className="title">General Settings</div>
      </div>
      <div className="item item5 area" id="database-actor-images">
        <div className="title">Images</div>
      </div>
      <div className="item item6 area" id="database-actor-initial-equipment">
        <div className="title">Initial Equipment</div>
      </div>
      <div className="item item7 area" id="database-actor-traits">
        <div className="title">Traits</div>
      </div>
      <div className="item item8 area" id="database-actor-note">
        <div className="title">Note</div>
      </div>

    </div>
  );
};

export default ActorInit;