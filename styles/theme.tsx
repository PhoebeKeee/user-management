import { css } from '@emotion/react'
import styled from '@emotion/styled'
interface Theme {
  breakpoints: string[]
  mq: string[]
  fontSizes: number[]
  colors: Record<string, string>
}

const breakpoints = ['40rem', '52rem', '64rem', '80rem']

const theme: Theme = {
  breakpoints,
  get mq() {
    return breakpoints.map((bp) => `@media (min-width: ${bp})`)
  },
  fontSizes: [12, 14, 16, 18, 22, 26, 30, 40, 52, 68, 80],
  colors: {
    primary: '#0b8176',
    gray: '#dcdcdc',
    grayTitle: '#777777',
    menuBackground: '#f4f4f4',
  },
}


const useTheme = () => theme

const manipulator = {
  container: (flexDirection = 'column', justifyContent = 'flex-start', alignItems = 'center') => {
    return `display: flex; flex-direction: ${flexDirection}; justify-content: ${justifyContent}; align-items: ${alignItems}`
  }
}

export {
  styled,
  css,
  useTheme,
  manipulator
}
