import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        lineArray: [],
    },
    mutations: {
        newlineArray(state, line) {
            state.lineArray = line.canvaslineArray;
        }
    },
    actions: {

    }
})