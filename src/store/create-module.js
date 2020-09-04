import actions from './common/actions'
import getters from './common/getters'
import mutations from './common/mutations'

export default (module = {}) => {
  return {
    namespaced: true,
    state: {
      items: [],
      item: null,
      meta: null,
      isLoading: false,
      errors: [],
      progress: 0,
      pagination: {
        totalCount: null,
        pageCount: null
      },
      ...(module.state || {})
    },
    getters: {
      ...getters,
      ...(module.getters || {})
    },
    actions: {
      ...actions,
      ...(module.actions || {})
    },
    mutations: {
      ...mutations,
      ...(module.mutations || {})
    },
  }
}