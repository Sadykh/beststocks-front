import createModule from './../create-module'
import * as types from "../common/mutation-types";
import {api} from "../../api";

const state = {}

const getters = {
    apiEndpoint() {
        return '/comments/'
    }
}
const actions = {

    async fetchAll({commit, getters}, params) {
        commit(types.LOADING_START)
        try {
            let endpoint = getters.apiEndpoint
            if (typeof endpoint !== 'string') {
                endpoint = endpoint()
            }
            const {data} = await api.get(endpoint, {params: params})
            commit(types.FETCHING_ITEMS_SUCCESS, data.items)
            commit(types.LOADING_SUCCESS)
            commit(types.FETCHING_PAGINATION_SUCCESS, {
                totalCount: data.pagination.total_count,
            })
            return true
        } catch (error) {
            commit(types.LOADING_FAILURE, [error.response.statusText + ' (' + error.response.status + ')'])
            return false
        }
    },

    async create({commit, getters}, data) {
        commit(types.LOADING_START)
        try {
            let endpoint = getters.apiEndpoint
            if (typeof endpoint !== 'string') {
                endpoint = endpoint()
            }
            const result = await api.post(endpoint + 'add', JSON.stringify(data))
            if (result.data.errors) {
                commit(types.LOADING_FAILURE, result.data.errors);
            } else {
                commit(types.CREATING_ITEM_SUCCESS, result.data)
                commit(types.LOADING_SUCCESS)
            }
            return true
        } catch (error) {
            const response = error.response
            commit(types.LOADING_FAILURE, response.errors)
            if (response.status === 400) {
                commit(types.LOADING_FAILURE, response.data)
            } else {
                commit(types.LOADING_FAILURE, [response.statusText + ' (' + response.status + ')'])
            }
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
