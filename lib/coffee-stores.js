import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
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


export const fetchCoffeeStores = async (latLong = "43.0389025%2C-87.9064736", limit = 6) => {
  // Racine = "42.72608572051579%2C-87.78234322881177"
  // Milwaukee = "43.0389025%2C-87.9064736"
  // Chicago = "41.8781136%2C-87.6297982"
  // Madison = "43.0730517%2C-89.4012302"
  // Green Bay = "44.51915899999999%2C-88.019826"
  // Toronto = "43.653225%2C-79.383186"
    const photos = await getListofCoffeeStorePhotos();
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
        }
      };
      
      const response = await fetch(
        getUrlForCoffeeStores(
            latLong,
            "coffee",
            limit
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