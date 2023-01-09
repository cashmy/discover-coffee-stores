const getUrlForCoffeeStores = (latlong, query, limit) => {
    return 'https://api.foursquare.com/v3/places/search?' + 
    `query=${query}&ll=${latlong}&radius=40000&limit=${limit}`;
}

export const fetchCoffeeStores = async () => {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.FOURSQUARE_API_KEY
        }
      };
      
      const response = await fetch(
        getUrlForCoffeeStores(
            "42.72608572051579%2C-87.78234322881177",
            "coffee",
            6
        ), options);

      const data = await response.json();
      console.log("results: ", data.results)
      return data.results; 
}