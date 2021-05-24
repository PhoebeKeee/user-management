import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { css, useTheme, manipulator } from '../styles/theme'
import { ActionTypes } from '../lib/index'
import { Container, Button } from '../components/index'
import type { User } from '../lib/types'

function HeaderItem({ label, style }: { label: string; style: string }) {
  const { mq } = useTheme()
  const { t } = useTranslation()
  return (
    <div
      css={css`
        margin-right: 10px;
        display: none;
        ${style};
        ${mq[0]} {
          display: block;
        }
      `}
    >
      {t(label)}
    </div>
  )
}

function UserItemField({ label, style, value }: { label: string; style: string; value: number | string }) {
  const { mq } = useTheme()
  const { t } = useTranslation()

  return (
    <div
      css={css`
        ${manipulator.container('row', 'flex-start', 'center')};
        ${style};
        margin-right: 10px;
      `}
    >
      <div
        css={css`
          font-size: 14px;
          color: gray;
          display: block;
          min-width: 60px;
          ${mq[0]} {
            display: none;
          }
        `}
      >{`${t(label)}`}</div>
      <div
        css={css`
          font-size: 14px;
          margin: 0;
          ${mq[0]} {
            font-size: 16px;
            margin-right: 10px;
          }
        `}
      >
        {value}
      </div>
    </div>
  )
}

function UserList ({ data, dispatch }: { data: User[], dispatch: (value: { type: ActionTypes; payload: any }) => void }) {
  const { mq, colors } = useTheme()
  const { t } = useTranslation()
  return (
    <>
      <Container
        css={css`
          padding: 6px 10px;
          background-color: ${colors.menuBackground};
          align-items: flex-start;
          ${mq[0]} {
            align-items: center;
          }
        `}
      >
        <HeaderItem style="width: 60px" label={'USER_FORM.HEADER_LABEL_ID'} />
        <HeaderItem style="width: 200px" label={'USER_FORM.HEADER_LABEL_NAME'} />
        <HeaderItem style="flex: 1" label={'USER_FORM.HEADER_LABEL_EMAIL'} />
        <div
          css={css`
            width: 100px;
            display: none;
            ${mq[0]} {
              display: block;
            }
          `}
        />
        <div
          css={css`
            flex: 1;
            display: block;
            ${mq[0]} {
              display: none;
            }
          `}
        >
          {t('USER_FORM.MOBILE_HEADER_LABEL')}
        </div>
      </Container>
      {data.length > 0 ? (
        data.map((user, index) => (
          <Container
            key={user.id}
            css={css`
              padding: 10px;
              border-bottom: ${index + 1 === data.length ? 0 : 1}px solid #d4d4d4;
              align-items: flex-start;
              ${mq[0]} {
                align-items: center;
              }
            `}
          >
            <UserItemField label="USER_FORM.HEADER_LABEL_ID" value={user.id} style="width: 60px" />
            <UserItemField label="USER_FORM.HEADER_LABEL_NAME" value={user.name} style="width: 200px" />
            <UserItemField label="USER_FORM.HEADER_LABEL_EMAIL" value={user.email} style="flex: 1" />
            <div
              css={css`
                width: 90vw;
                justify-content: flex-end;
                display: flex;
                ${mq[0]} {
                  width: 100px;
                }
              `}
            >
              <Button
                css={css``}
                onClick={() => {
                  dispatch({ type: ActionTypes.Delete, payload: { id: user.id } })
                }}
              >
                {t('FORM.BUTTON_DELETE_USER')}
              </Button>
            </div>
          </Container>
        ))
      ) : (
        <div
          css={css`
            padding: 10px;
            font-size: 14px;
          `}
        >
          {t('USER_FORM.LABEL_USER_EMPTY')}
        </div>
      )}
    </>
  )
}

export default UserList