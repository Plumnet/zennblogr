​import React from 'react'
import Head from 'next/head'
import { Container } from '../styles/pages/Home'
import { createClient } from 'contentful'
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link'

export const getStaticProps = async () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY
  })

  const response: EntryCollection<IFields> = await client.getEntries({
    content_type: 'article'
  })


  return {
    props: {
      article: response.items
    }
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Home: NextPage<Props> = ({ article }) => {

  return (
    <Container>
      <Head>
        <title>Homepage</title>
      </Head>

      <ul>
      {article.map(item => (
        <li key={item.sys.id}>
          <Link href={'/article/' + item.fields.slug}>
            <a>{item.fields.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  </Container>
)
}

export default Home
