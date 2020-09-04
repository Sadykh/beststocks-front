import Vue from 'vue'
import Vuex from 'vuex'
import news from './store/modules/news'
import comments from './store/modules/comments'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        news,
        comments,
    },
    state: {
        identity: {
            company: null
        }
    },
    actions: {
        setUser({commit}, user) {
            commit('setUser', user)
        },
        setCompany({commit}, company) {
            commit('setCompany', company)
        }
    },
    mutations: {
        setUser(state, user) {
            state.identity = user
        },
        setCompany(state, company) {
            state.identity.company = company
        }
    }
})
