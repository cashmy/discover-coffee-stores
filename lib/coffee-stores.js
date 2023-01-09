import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});


const getUrlForCoffeeStores = (latlong, query, limit) => {
    return 'https://api.foursquare.com/v3/places/search?' + 
    `query=${query}&ll=${latlong}&radius=40000&limit=${limit}`;
}

const getListofCoffeeStorePhotos = async () => {
    const photos = await unsplash.search.getPhotos({
        query: 'coffee shop',
        page: 1,
        perPage: 30,
      });
    const unsplashResults = photos.response.results
    
    return unsplashResults.map((result) => result.urls.small);
}


export const fetchCoffeeStores = async () => {
    const photos = await getListofCoffeeStorePhotos();
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
    //   console.log("results: ", data.results)
      return data.results.map((result,index) => {
        return {
            ...result,
            id: result.fsq_id,
            name: result.name,
            address: result.location.address,
            neighborhood: result.location.locality,
            // imgUrl: photos[Math.floor(Math.random() * photos.length)]
            imgUrl: photos.length > 0 ? photos[index] : null
        }
      }); 
}