import createModule from './../create-module'
import * as types from "../common/mutation-types";
import {api} from "../../api";

const state = {}

const getters = {
    apiEndpoint() {
        return '/v1/order'
    }
}
const actions = {
    async setCarrier ({ commit, getters }, {id, data}) {
        commit(types.LOADING_START)
        try {
            let endpoint = getters.apiEndpoint + '/' + id + '/set-carrier';
            if (typeof endpoint !== 'string') {
                endpoint = endpoint()
            }
            await api.put(endpoint, JSON.stringify(data))
            commit(types.LOADING_SUCCESS)
            return true
        } catch (error) {
            const response = error.response
            if (response.status === 400) {
                commit(types.LOADING_FAILURE, response.data)
            } else {
                commit(types.LOADING_FAILURE, [response.statusText + ' (' + response.status + ')'])
            }
            return false
        }
    },

    async setCourier ({ commit, getters }, {id, data}) {
        commit(types.LOADING_START)
        try {
            let endpoint = getters.apiEndpoint + '/' + id + '/set-courier';
            if (typeof endpoint !== 'string') {
                endpoint = endpoint()
            }
            await api.put(endpoint, JSON.stringify(data))
            commit(types.LOADING_SUCCESS)
            return true
        } catch (error) {
            const response = error.response
            if (response.status === 400) {
                commit(types.LOADING_FAILURE, response.data)
            } else {
                commit(types.LOADING_FAILURE, [response.statusText + ' (' + response.status + ')'])
            }
            return false
        }
    },

    async setOwner ({ commit, getters }, {id, data}) {
        commit(types.LOADING_START)
        try {
            let endpoint = getters.apiEndpoint + '/' + id + '/set-owner';
            if (typeof endpoint !== 'string') {
                endpoint = endpoint()
            }
            await api.put(endpoint, JSON.stringify(data))
            commit(types.LOADING_SUCCESS)
            return true
        } catch (error) {
            const response = error.response
            if (response.status === 400) {
                commit(types.LOADING_FAILURE, response.data)
            } else {
                commit(types.LOADING_FAILURE, [response.statusText + ' (' + response.status + ')'])
            }
            return false
        }
    },

    async setCar ({ commit, getters }, {id, data}) {
        commit(types.LOADING_START)
        try {
            let endpoint = getters.apiEndpoint + '/' + id + '/set-car';
            if (typeof endpoint !== 'string') {
                endpoint = endpoint()
            }
            await api.put(endpoint, JSON.stringify(data))
            commit(types.LOADING_SUCCESS)
            return true
        } catch (error) {
            const response = error.response
            if (response.status === 400) {
                commit(types.LOADING_FAILURE, response.data)
            } else {
                commit(types.LOADING_FAILURE, [response.statusText + ' (' + response.status + ')'])
            }
            return false
        }
    },

    async fetchOne({commit, getters}, id) {
        commit(types.LOADING_START)
        try {
            let endpoint = getters.apiEndpoint
            if (typeof endpoint !== 'string') {
                endpoint = endpoint()
            }
            const {data} = await api.get(endpoint + '/number/' + id)
            commit(types.FETCHING_ITEM_SUCCESS, data)
            // commit(types.FETCHING_META_SUCCESS, data.meta)
            commit(types.LOADING_SUCCESS)
            return true
        } catch (error) {
            commit(types.LOADING_FAILURE, [error.response.statusText + ' (' + error.response.status + ')'])
            return false
        }
    },

    async fetchSharing({commit, getters}, id) {
        commit(types.LOADING_START)
        try {
            let endpoint = getters.apiEndpoint
            if (typeof endpoint !== 'string') {
                endpoint = endpoint()
            }
            const {data} = await api.get('/v1/public/order/' + id + '/history')
            commit(types.FETCHING_ITEM_SUCCESS, data)
            // commit(types.FETCHING_META_SUCCESS, data.meta)
            commit(types.LOADING_SUCCESS)
            return true
        } catch (error) {
            commit(types.LOADING_FAILURE, [error.response.statusText + ' (' + error.response.status + ')'])
            return false
        }
    },
}

const mutations = {}

export default createModule({
    state,
    getters,
    actions,
    mutations
})
