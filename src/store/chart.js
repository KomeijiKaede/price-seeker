export const state = () => ({
  list: ['C/アビリティⅢ']
})

export const mutations = {
  add (state, name) {
    state.list.push(name)
  },
  remove (state, name) {
    state.list.splice(state.list.indexOf(name), 1)
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
