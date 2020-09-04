export default {
  items (state) { return state.items },
  item (state) { return state.item },
  meta (state) { return state.meta },
  isLoading (state) { return state.isLoading },
  errors (state) { return state.errors },
  hasError: (state) => (property) => { return state.errors[property] !== undefined },
  firstError: (state) => { return state.errors.length > 0 ? state.errors[0] : null },
  progress (state) { return state.progress },
  pagination (state) { return state.pagination }
}