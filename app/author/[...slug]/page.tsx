import 'css/prism.css'
import 'katex/dist/katex.css'

import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent } from 'pliny/utils/contentlayer'
import { allAuthors } from 'contentlayer/generated'
import type { Authors } from 'contentlayer/generated'
import { Metadata } from 'next'
import AuthorLayout from '@/layouts/AuthorLayout'

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
  const author = allAuthors.find((p) => p.slug === slug)
  const authorDetails = coreContent(author as Authors)
  if (!author) {
    return
  }
  const [firstName, lastName] = authorDetails.name.split(' ')

  return {
    title: authorDetails.name,
    openGraph: {
      type: 'profile',
      firstName,
      lastName,
    },
    twitter: {
      card: 'summary_large_image',
      title: authorDetails.name,
    },
  }
}

export const generateStaticParams = async () => {
  const paths = allAuthors.map((p) => ({ slug: p.slug.split('/') }))

  return paths
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  // Filter out drafts in production
  const author = allAuthors.find((p) => p.slug === slug) as Authors
  const authorDetails = coreContent(author)

  return (
    <>
      <AuthorLayout content={authorDetails}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
