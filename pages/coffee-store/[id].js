import { useRouter } from 'next/router'
import Link from 'next/link'

const CoffeeStore = () => {
  const router = useRouter();
  return (
    <div>
      Coffee Store Page {router.query.id}
      <br/>
      <Link href="/">Back to Home</Link>
    </div>
  )
}

export default CoffeeStore