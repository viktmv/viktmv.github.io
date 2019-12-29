import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

const Bio = () =>
  <StaticQuery
    query={bioQuery}
    render={data => {
      const { author, social } = data.site.siteMetadata
      return (
        <div style={styles.wrapper}>
          <Image
            fixed={data.avatar.childImageSharp.fixed}
            alt={author}
            style={styles.image}
            imgStyle={{ borderRadius: `50%` }}
          />
          <p>
            Written by <strong>{author}</strong> who lives and works in San
            Francisco building useful things.
            {` `}
            <a href={`https://twitter.com/${social.twitter}`}>
              You should follow him on Twitter
            </a>
          </p>
        </div>
      )
    }}
  />

const styles = {
  wrapper: {
    display: `flex`,
    marginBottom: rhythm(2.5),
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
