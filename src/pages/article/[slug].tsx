​import React from 'react'
import { createClient, EntryCollection } from 'contentful'
import { GetStaticPaths, GetStaticProps } from 'next'
import { IResponse, IArticle } from '../../components/Interfaces/IArticle'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY
})

export const getStaticPaths: GetStaticPaths = async () => {
  const res: EntryCollection<IResponse> = await client.getEntries({
    content_type: 'article'
  })

  const paths = res.items.map(item => {
    return {
      params: { slug: item.fields.slug }
    }
  })

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  const { items } = await client.getEntries<IFields>({
    content_type: 'article',
    'fields.slug': params.slug
  })

  return {
    props: { article: items[0] }
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Article: NextPage<Props> = ({ article }) => {
  return (
    <Container>
      <Layout title={article.fields.title}></Layout>
      <div>
        <Flex>
          <h1>{article.fields.title}</h1>
          <h3>{moment(article.fields.date).utc().format('YYYY/MM/DD')}</h3>
        </Flex>
            <div>{documentToReactComponents(article.fields.content)}</div>
      </div>
    </Container>
  )
}

export default Article

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`