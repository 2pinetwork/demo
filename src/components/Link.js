import PropTypes from 'prop-types'
import React from 'react'
import NextLink from 'next/link'
import { styled } from '@mui/material/styles'
import { Link as MuiLink } from '@mui/material'

// Next.js `Link` wrapped by a Material UI `Link`.
//
// - Reference implementation:
//   https://github.com/mui/material-ui/blob/5b0d0c343c9b195e7328cc20461c9adc1f5ac02d/examples/nextjs/src/Link.js
//
// - Use `passHref` and `React.forwardRef`:
//   https://nextjs.org/docs/api-reference/next/link/#if-the-child-is-a-functional-component
//
// - Security with external links (use `rel="noreferrer"`):
//   https://mui.com/components/links/#security
const Link = React.forwardRef(function Link(props, ref) {
  const pathname = props.href?.pathname || props.href || ''

  if (isExternal(pathname))
    return <MuiLink ref={ref} target="_blank" rel="noreferrer" {...props} />

  return <MuiLink ref={ref} component={NextAnchor} {...props} />
})

Link.propTypes = {
  href: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
}

export default Link



// -- HELPERS --

const isExternal = RegExp.prototype.test.bind(/^\w+:/)

// Add support for the `sx` prop
const Anchor = styled('a')({})

const NextAnchor = React.forwardRef(function NextAnchor(props, ref) {
  const { href, prefetch, locale, ...other } = props

  return (
    <NextLink href={href} passHref={true} prefetch={prefetch} locale={locale}>
      <Anchor ref={ref} {...other} />
    </NextLink>
  )
})

NextAnchor.propTypes = {
  href:     PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  prefetch: PropTypes.bool,
  locale:   PropTypes.string
}
