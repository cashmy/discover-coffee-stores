import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Banner from '../components/banner'
import Card from '../components/card'
import { fetchCoffeeStores } from '../lib/coffee-stores'
import useTrackLocation from '../hooks/use-track-location'
import { useState, useEffect, useContext } from 'react'
import { StoreContext, ACTION_TYPES } from '../store/store-context'
import HeroImage from '../public/static/hero-image.png'


// * Server Side Code below
export async function getStaticProps() {

  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores
    },
  };
}

// * Client Side Code below
export default function Home(props) {

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation();
  // const [coffeeStores, setCoffeeStores] = useState('');
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const response = await fetch(`/api/getCoffeeStoresByLocation?latLogn=${latLong}&limit=20`);
          const coffeeStores = await response.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores }
          })
          setCoffeeStoresError('');
        }
        catch (error) {
          setCoffeeStoresError(error.message);
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [latLong])

  const handleOnBannerClick = () => {
    handleTrackLocation();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connosisseur</title>
        <meta name="description" content="Discover your local coffee shops!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnBannerClick}
        />
        {locationErrorMsg && <p>Something went wrong {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong {coffeeStoresError}</p>}

        <div className={styles.heroImage}>
          <Image src={HeroImage} alt="Hero image" />
        </div>

        {coffeeStores && coffeeStores.length > 0 &&
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>

            <div className={styles.cardLayout}>
              {coffeeStores && coffeeStores.map((store) => {
                return (
                  <Card
                    key={store.id}
                    name={store.name}
                    imgUrl={store.imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'}
                    href={`/coffee-store/${store.id}`}
                    altText={store.name}
                    className={styles.card}
                  />
                )
              })
              }
            </div>
          </div>
        }

        {props.coffeeStores && props.coffeeStores.length > 0 &&
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Milwaukee shops</h2>

            <div className={styles.cardLayout}>
              {props.coffeeStores && props.coffeeStores.map((store) => {
                return (
                  <Card
                    key={store.id}
                    name={store.name}
                    imgUrl={store.imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'}
                    href={`/coffee-store/${store.id}`}
                    altText={store.name}
                    // className={styles.card}
                  />
                )
              })
              }
            </div>
          </div>
        }


      </main>
    </div>
  )
}
