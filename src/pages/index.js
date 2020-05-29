import React, { useState } from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Switch from "../components/switch"
import { rhythm } from "../utils/typography"

const renderNode = ({ node }) => {
  const title = node.frontmatter.title || node.fields.slug
  return (
    <div key={node.fields.slug}>
      <h3
        style={{ marginBottom: rhythm(1 / 8) }}
      >
        <Link style={{ boxShadow: `none` }} to={node.fields.slug.split('/')[1]}>
          {title}
        </Link>
      </h3>
      <small>{node.frontmatter.date}</small>
      <p
        dangerouslySetInnerHTML={{
          __html: node.frontmatter.description || node.excerpt,
        }}
      />
    </div>
  )
}

const Index = props => {
    const { data } = props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    const [shouldIncludeDrafts, toggleDrafts] = useState(false)
    const notHidden = ({node: {frontmatter}}) => !(frontmatter.tags || '')
      .includes('hidden')

    return (
      <Layout location={props.location} title={siteTitle}>
        <SEO title="All posts" />
        <Bio />
        {posts
          .filter(notHidden)
          .map(renderNode)
        }
      </Layout>
    )
  }

export default Index

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            tags
          }
        }
      }
    }
  }
`
