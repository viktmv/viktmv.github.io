import React from "react"
import { StaticQuery, graphql } from "gatsby"

import { rhythm } from "../utils/typography"

const Bio = () =>
  <StaticQuery
    query={bioQuery}
    render={data => {
      const { author, social } = data.site.siteMetadata
      return (
        <div style={styles.wrapper}>
          <p>
            by <strong>{author}</strong>
            {` `}
            <a href={`https://twitter.com/${social.twitter}`}>
              (twitter)
            </a>
          </p>
        </div>
      )
    }}
  />

const styles = {
  wrapper: {
    display: `flex`,
    marginBottom: rhythm(1 / 4),
  },
  image: {
    marginRight: rhythm(1 / 2),
    marginBottom: 0,
    minWidth: 50,
    borderRadius: `100%`,
  },
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

export default Bio
