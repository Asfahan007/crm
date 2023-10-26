const { store } = require("@/Store");

export const fetchGetApiData = async (url, headers = {}, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${store.getState().auth.token}`,
    ...headers,
  };

  const defaultOptions = {
    method: 'GET',
    headers: defaultHeaders,
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  const data = await response.json();

  return data;
};