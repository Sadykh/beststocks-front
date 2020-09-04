import * as types from './mutation-types'

export default {
  [types.FETCHING_ITEMS_SUCCESS] (state, items) {
    state.items = items
  },
  [types.FETCHING_ITEM_SUCCESS] (state, item) {
    state.item = item
  },
  [types.FETCHING_META_SUCCESS] (state, meta) {
    state.meta = meta
  },
  [types.FETCHING_PAGINATION_SUCCESS] (state, { totalCount, pageCount }) {
    state.pagination = {
      totalCount: totalCount ? Number(totalCount) : 0,
      pageCount: pageCount ? Number(pageCount) : null
    }
  },
  [types.CREATING_ITEM_SUCCESS] (state, item) {
    state.item = item
  },
  [types.UPDATING_ITEM_SUCCESS] (state, item = null) {
    if (item) {
      state.item = item
    }
  },
  [types.DELETING_ITEM_SUCCESS] () {
  },
  [types.LOADING_START] (state) {
    state.isLoading = true
    state.errors = []
    state.progress = 0
  },
  [types.LOADING_SUCCESS] (state) {
    state.isLoading = false
  },
  [types.LOADING_FAILURE] (state, errors) {
    state.isLoading = false
    state.errors = []
    for (const key in errors) {
      state.errors.push(errors[key])
    }
  },
  [types.LOADING_PROGRESS] (state, progress) {
    state.progress = progress
  },
  [types.CLEAR] (state) {
    state.item = null
    state.pagination = {
      totalCount: 0,
      pageCount: null
    }
  },
  [types.CLEAR_ERROR] (state) {
    state.errors = []
  }
}
