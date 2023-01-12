import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head';
import styles from '../../styles/coffee-store.module.css'
import Image from 'next/image';
import cls from 'classnames';
import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { StoreContext } from '../../store/store-context';
import { isEmpty } from '../../utils';
import useSWR from 'swr';
import { fetcher } from '../../utils';
// import fetch from 'unfetch'

export async function getStaticProps(context) {
  const params = context.params
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id;
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  return {
    paths: coffeeStores.map((store) => {
      return {
        params: {
          id: store.id.toString(),
        },
      }
    }
    ),
    fallback: true,
  }
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const {
    state: {
      coffeeStores
    }
  } = useContext(StoreContext);

  const id = router.query.id;
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const [votingCount, setVotingCount] = useState(0);
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher)

  const handleCreateCoffeeStore = async (coffeeStore) => {
    const { id, name, voting, address, neighborhood, imgUrl } = coffeeStore;
    try {
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          address: address || "",
          neighborhood: neighborhood || "",
          voting: 0,
          imgUrl,
        }),
      })
      const dbCoffeeStore = await response.json();
    } catch (error) {
      console.error('Error creating or finding record', error);
    }

  }


  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0])
      setVotingCount(data[0].voting)
    }
  },[data])


  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id;
        });
        // if(coffeStoreFromContext){
        setCoffeeStore(coffeStoreFromContext);
        handleCreateCoffeeStore(coffeStoreFromContext);
        // }
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore)
    }
  }, [id, initialProps, initialProps.coffeeStore])

  const { address, name, neighborhood, imgUrl, } = coffeeStore;

  // * Handle UpVote
  const handleUpvoteButton = async () => {
    try {
      const response = await fetch('/api/upVoteCoffeeStoreById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
        }),
      })
      const dbCoffeeStore = await response.json();
      
      // TODO: Notice for team mates
      // * The original code is not working because the dbCoffeeStore is not being cast as an array!
      if (dbCoffeeStore) {
        setVotingCount(votingCount + 1);
      }
    } catch (error) {
      console.error('Error upvoting the coffee store', error);
    }
  }

  // * Check SWR error for data fetching
  if (error) {
    return <div>Failed to load data/page.</div>
  }

  return (
    <div className={styles.layout}>
      <Head >
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'}
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name || 'coffee store'}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/places.svg" width={24} height={24} alt="icon" />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width={24} height={24} alt="icon" />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width={24} height={24} alt="icon" />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button
            className={styles.upvoteButton}
            onClick={handleUpvoteButton}
          >
            Up Vote</button>
        </div>
      </div>
    </div>
  )
}

export default CoffeeStore