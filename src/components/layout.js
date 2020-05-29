import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"

import './layout.css'

const renderPrimaryHeader = title =>
  <h1 style={Styles.heading}>
    <Link style={Styles.link} to={`/`}>
      {title}
    </Link>
  </h1>

const renderSecondaryHeader = title =>
  <h3 style={Styles.pageHeading}>
    <Link style={Styles.link} to={`/`}>
      {title}
    </Link>
  </h3>

const Layout = props => {
    const { location, title, children } = props
    const rootPath = `${__PATH_PREFIX__}/`
    let header = location.pathname === rootPath
      ? renderPrimaryHeader(title)
      : renderSecondaryHeader(title)

    return (
      <div style={Styles.wrapper}>
        <header>{header}</header>
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    )
  }

export default Layout

const Styles = {
  rootHeading: {
    ...scale(1.5),
    marginBottom: rhythm(1.5),
    marginTop: 0
  },
  pageHeading: {
    fontFamily: `Montserrat, sans-serif`,
    marginTop: 0,
  },
  link: {
    boxShadow: `none`,
    textDecoration: `none`,
    color: `inherit`
  },
  wrapper: {
    marginLeft: `auto`,
    marginRight: `auto`,
    maxWidth: rhythm(24),
    padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
  }
}
