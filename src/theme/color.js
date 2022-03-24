//
// Color
//

// -- COLORS --

const white = 'hsl(0, 0%, 100%)'
const black = 'hsl(0, 0%, 0%)'

const grey = {
  100:  'hsl(220, 7%, 91%)',
  200:  'hsl(216, 5%, 82%)',
  300:  'hsl(225, 5%, 69%)',
  400:  'hsl(224, 5%, 60%)',
  500:  'hsl(226, 5%, 51%)',
  600:  'hsl(225, 7%, 42%)',
  700:  'hsl(227, 10%, 34%)',
  800:  'hsl(225, 16%, 25%)',
  900:  'hsl(224, 28%, 16%)',
  1000: 'hsl(225, 41%, 11%)'
}

const primary = {
  light:        'hsl(227, 100%, 72%)',
  main:         'hsl(221, 92%, 54%)',
  dark:         'hsl(222, 100%, 38%)',
  contrastText: 'hsl(0, 0%, 100%)',
  20:           'hsl(225, 100%, 99%)',
  40:           'hsl(220, 100%, 98%)',
  80:           'hsl(222, 89%, 96%)',
  160:          'hsl(221, 95%, 93%)',
  240:          'hsl(222, 93%, 89%)'
}

const secondary = {
  light:        'hsl(236, 37%, 35%)',
  main:         'hsl(222, 100%, 15%)',
  dark:         'hsl(240, 100%, 8%)',
  contrastText: white
}

const error = {
  light:        'hsl(7, 72%, 64%)',
  main:         'hsl(6, 72%, 52%)',
  dark:         'hsl(6, 66%, 40%)',
  contrastText: white
}

const warning = {
  light:        'hsl(37, 90%, 72%)',
  main:         'hsl(37, 90%, 59%)',
  dark:         'hsl(37, 63%, 45%)',
  contrastText: white
}

const success = {
  light:        'hsl(132, 75%, 45%)',
  main:         'hsl(132, 75%, 34%)',
  dark:         'hsl(132, 61%, 63%)',
  contrastText: white
}



// -- THEME --

export const palette = {
  grey,
  primary,
  secondary,
  error,
  warning,
  success,
  common: {
    white,
    black
  },
  background: {
    default: primary[20],
    paper:   white
  },
  text: {
    primary:   secondary.main,
    secondary: grey[500]
  }
}
