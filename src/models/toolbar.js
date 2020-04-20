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
    * callTool ({ params }, { call, put, select }) {
      const tool_name = params.tool_name;
      const current_mode = yield select(state => state.toolbar.current_mode);

      if (["map","event"].includes(tool_name)){
        yield put({ type: 'setCurrentMode', mode: tool_name });
        yield put({ type: 'setCurrentDraw', draw: null });
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
