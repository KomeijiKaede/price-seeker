export const state = () => ({
  list: []
})

export const mutations = {
  add (state, data) {
    if (state.list.length === 5) {
      state.list.pop()
    }
    state.list.unshift(data)
  },
  remove (state, data) {
    state.list.splice(state.list.indexOf(data), 1)
  },
  set (state, list) {
    state.list.splice(0, list.length)
    state.list.concat(list)
  }
}

export const getters = {
  getList (state) {
    return state.list
  }
}
