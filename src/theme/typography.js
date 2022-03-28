//
// Typography
//

import { mapObj } from '@/lib/object'



// -- CONSTANTS --

const fontFamily   = '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
const fontSize     = 16
const htmlFontSize = 16
const light        = 300
const regular      = 400
const medium       = 500
const semiBold     = 600
const bold         = 700



// -- VARIANTS --

const variantDefaults = {
  fontFamily,
  textTransform: undefined
}

const variants = {
  h1:        { xs: [ 32, 40, semiBold ], sm: [ 64, 72 ] },
  h2:        { xs: [ 28, 40, semiBold ], sm: [ 48, 72 ] },
  h3:        { xs: [ 24, 40, semiBold ], sm: [ 40, 60 ] },
  h4:        { xs: [ 20, 30, semiBold ], sm: [ 32, 48 ] },
  h5:        { xs: [ 18, 28, semiBold ], sm: [ 24, 36 ] },
  h6:        { xs: [ 16, 24, medium   ], sm: [ 24, 36 ] },
  subtitle1: { xs: [ 16, 24, semiBold ], sm: [ 20, 30 ] },
  subtitle2: { xs: [ 14, 20, medium   ], sm: [ 18, 24 ] },
  body1:     { xs: [ 14, 20, regular  ], sm: [ 16, 24 ]  },
  body2:     { xs: [ 12, 18, regular  ], sm: [ 14, 20 ] },
  text1:     { xs: [ 14, 20, regular  ], sm: [ 20, 30 ] },
  small1:    { xs: [ 13, 16, medium   ], sm: [ 13, 16 ] },
  button:    { xs: [ 16, 24, medium   ], sm: [ 18, 26 ] },
  overline:  { xs: [ 12, 18, semiBold ], sm: [ 16, 24 ] }
}

const toVariant = ({ xs = [], sm = [] }) => ({
  ...variantDefaults,
  ...toCss(xs),
  '@media (min-width: 600px)': toCss(sm)
})

const toCss = ([ fontSize, lineHeight, fontWeight ]) => ({
  fontSize:   fontSize   && `${fontSize / htmlFontSize}rem`,
  lineHeight: lineHeight && (lineHeight / fontSize),
  fontWeight
})



// -- THEME --

export const typography = {
  fontFamily,
  fontSize,
  htmlFontSize,
  fontWeightLight:    light,
  fontWeightRegular:  regular,
  fontWeightMedium:   medium,
  fontWeightSemiBold: semiBold,
  fontWeightBold:     bold,
  textTransform:      undefined,
  ...mapObj(variants, toVariant)
}
