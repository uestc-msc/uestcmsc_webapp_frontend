interface SnackBarState {
  msg: string,
  visible: boolean
}

let state: SnackBarState = {
  msg: '',
  visible: false
}

const mutations = {
  postMessage: function(state: SnackBarState, msg: string) {
    state.msg = msg;
    state.visible = true;
  }
}

export default {
  namespaced: true,
  state,
  mutations
};
