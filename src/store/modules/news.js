import createModule from './../create-module'
import * as types from "../common/mutation-types";
import {api} from "../../api";

const state = {}

const getters = {
    apiEndpoint() {
        return '/news/'
    }
}
const actions = {

    async fetchOne({commit, getters}, params) {
        commit(types.LOADING_START)
        try {
            let endpoint = getters.apiEndpoint
            if (typeof endpoint !== 'string') {
                endpoint = endpoint()
            }
            const {data} = await api.get(endpoint + 'view/' + params.id, {params: params.queryFilter || {}})
            commit(types.FETCHING_ITEM_SUCCESS, data)
            // commit(types.FETCHING_META_SUCCESS, data.meta)
            commit(types.LOADING_SUCCESS)
            return true
        } catch (error) {
            commit(types.LOADING_FAILURE, [error.response.statusText + ' (' + error.response.status + ')'])
            return false
        }
    },

    async fetchAll({commit, getters}, params) {
        commit(types.LOADING_START)
        try {
            let endpoint = getters.apiEndpoint
            if (typeof endpoint !== 'string') {
                endpoint = endpoint()
            }
            const response = await api.get(endpoint, {params: params})
            if (response.data.items !== undefined) {
                commit(types.FETCHING_ITEMS_SUCCESS, response.data.items)
            } else {
                commit(types.FETCHING_ITEMS_SUCCESS, response.data)
            }
            commit(types.FETCHING_PAGINATION_SUCCESS, {
                totalCount: response.data.pagination.total_count,
                pageCount: response.headers['x-page-count'] || 0
            })
            commit(types.LOADING_SUCCESS)
            return true
        } catch (error) {
            const response = error.response
            if (response.status === 500) {
                commit(types.LOADING_FAILURE, [{field: 'Server', message: response.data.detail}])
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
