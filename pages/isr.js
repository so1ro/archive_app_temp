import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { fetchEntries } from '../lib/contentful';

export async function getStaticProps() {
  const res = await fetchEntries()
  const filters = await res.map((p) => {
    return p.fields
  })

  return {
    props: {
      filters
    },
    revalidate: 1, // In seconds
  }
}

const Isr = ({ filters }) => {
  const fils = filters.filter(item => !!item.filter)
  console.log('fils:', fils)
  // console.log('filters:', filters)
  return (
    <div className={styles.container}>
      <Head>
        <title>ISR Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>ISR Testing...</h1>
        {fils.map(fil => (
          <div key={fil.filter}>{fil.filter}</div>
        ))}
      </main>
    </div >
  )
};

export default Isr;

