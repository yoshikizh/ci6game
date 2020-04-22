const _ = require('lodash');

export default {
  namespace: "toolbar",
  state: {
    proj_name: App.config.app.default_proj_name,
    current_mode: "map",
    current_manager: "map",
    current_draw: null
  },

  effects: {
    * callTool (params, { call, put, select }) {
      const tool_name = params.tool_name;
      const current_mode = yield select(state => state.toolbar.current_mode);

      if (["map","event"].includes(tool_name)){
        yield put({ type: 'setCurrentMode', mode: tool_name });
        yield put({ type: 'setCurrentDraw', draw: null });

        const [x,y] = yield select(state => state.project.current_map_cursor_pos);
        const exist_event = $gameMap.existEvent(x,y);

        if (tool_name === "map"){
          yield put({ type: 'status_bar/setShowEditBtn', is_show: false });
          yield put({ type: 'status_bar/setNewEditBtn', is_show: false });
        }
        if (tool_name === "event"){
          if (exist_event){
            yield put({ type: 'status_bar/setShowEditBtn', is_show: true });
          } else {
            yield put({ type: 'status_bar/setNewEditBtn', is_show: true });
          }
        } 
      }
      if (["pencil","square","ellipse","fill","shadow_pen"].includes(tool_name)){
        yield put({ type: 'setCurrentDraw', draw: current_mode === "map" ? tool_name : null })
      }
      if (tool_name === "play_test"){
        SceneManager.gameStart("run","rmmv-player")
      }
    }
  },

  reducers: {
    setCurrentMode: (state, params) => {
      state.current_mode = params.mode;
      return _.clone(state);
    },
    setCurrentDraw: (state, params) => {
      state.current_draw = params.draw;
      return _.clone(state);
    }
  }
}
