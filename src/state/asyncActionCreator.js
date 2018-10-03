export const createAsyncActionTypes = (root, options) => {
  return {
    ROOT: root,
    REQUEST: `${root}@REQUEST`,
    SUCCESS: `${root}@SUCCESS`,
    FAILURE: `${root}@FAILURE`,
  }
};

export const createAsyncActions = (actionTypes, overrides = {}) => {
  const request = overrides.request ? overrides.request : () => ({ type: actionTypes.REQUEST});
  const success = overrides.success ? overrides.success : response => ({ type: actionTypes.SUCCESS, response });
  const failure = overrides.failure ? overrides.failure : error => ({ type: actionTypes.FAILURE, error });
  return {
    request,
    success,
    failure
  }
}


export const createAll = (root, actionOverrides = {}) => {
  const actionTypes = createAsyncActionTypes(root);
  const actions = createAsyncActionTypes(actionTypes, actionOverrides);
  return {
    actionTypes: actionTypes,
    actions
  }
}