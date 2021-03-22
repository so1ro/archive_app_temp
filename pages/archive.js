import { fetchContent } from '@/lib/contentful-hook'

const Archive = ({ allArchives }) => {
    console.log('allArchives:', allArchives)
    return (
        <div>
            Archives
        </div>
    );
};

export default Archive;

export async function getStaticProps() {
    const res = await fetchContent(`
        {
            kasumibroVideoCollection {
                items {
                    thumbnail {
                        url
                    }
                    title
            }
        }
      }
  `);
    return {
        props: {
            allArchives: res.kasumibroVideoCollection.items,
        },
        revalidate: 1,
    }
}