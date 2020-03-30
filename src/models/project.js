var _ = require('lodash');

function getCurrentMapInfo(){
  const game_data = App.game_data;
  const map_info = game_data.map_infos[1];
  const map_id = map_info.id;
  const game_map = game_data.maps[map_id];
  return {
    id: map_id,
    name: map_info.name,
    width: game_map.width,
    height: game_map.height
  }
}

function getDefaultSession(){
  return {
    proj_name: App.config.app.default_proj_name,
    current_mode: "event",
    current_manager: "map",
    current_draw: null,
    current_zoom: 100,
    current_cursor_pos: [0,0]
  }
}

export default {
  namespace: "project",
  state: {
    session: getDefaultSession(),
    current_map: getCurrentMapInfo()
  },
  reducers: {
    set_mode_event: (state) => {
      state.current_mode = "event";
      return _.clone(state);
    },
    set_current_zoom: (state,params) => {
      // console.log("set_current_zoom called");
      // console.log(state,params);
      state.current_zoom += params.n;
      return _.clone(state);
    },
  }
}