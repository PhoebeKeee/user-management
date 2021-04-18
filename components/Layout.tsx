import { FC, HTMLAttributes } from 'react'
import Div100vh from 'react-div-100vh'
import { css, useTheme } from '../styles/theme'

const Layout: FC<{ navbarProps?: any } & HTMLAttributes<HTMLDivElement>> = ({ children, navbarProps, ...props }) => {
  const { mq } = useTheme()
  return (
    <Div100vh
      {...props}
      css={css`
        width: 100vw;
        overflow-x: hidden;
        overflow-y: auto;
      `}
    >
      <div
        css={css`
          position: relative;
          min-height: 100vh;
          width: 100vw;
          overflow-x: hidden;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        <main
          css={css`
            padding: 0;
            width: 100vw;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            ${mq[0]} {
              flex: 1;
              align-items: center;
            }
          `}
        >
          {children}
        </main>
      </div>
    </Div100vh>
  )
}

export default Layout
