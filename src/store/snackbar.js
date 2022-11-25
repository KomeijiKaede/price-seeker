export const state = () => ({
  text: ""
})

export const getters = {
  getSnackbar: (state) => state.text,
  existsSnackbar: (state) => state.text !== ""
}

export const mutations = {
  setSnackbar (state, text) {
    state.text = text
  },
  unsetSnackbar (state) {
    state.text = ""
  }
}

export const actions = {
  openSnackbar: ({ commit }, text) => {
    commit('setSnackbar', text)
  },
  closeSnackbar: ({ commit }) => {
    commit('unsetSnackbar')
  }
}
