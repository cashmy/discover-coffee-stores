export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const fetcher = (url) => fetch(url).then((res) => res.json());

//* fetcher for axios
// export const fetcherAxios = (url) => axios.get(url).then((res) => res.data);

//* fetcher for GraphQL🌗 
// export const fetcherGraph = (query) => request('/api/graphql', query);
