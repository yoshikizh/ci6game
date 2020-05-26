var _ = require('lodash');

export default {
  namespace: "event",
  state: {
    show_event_window: false
  },

  reducers: {
    showEventWindow: (state) => {
      state.show_event_window = true;
      return _.clone(state);
    },
    hideEventWindow: (state) => {
      state.show_event_window = false;
      return _.clone(state);
    }

  }
}