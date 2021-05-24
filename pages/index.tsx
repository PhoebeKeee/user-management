import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import React, { createContext, useContext, useState, useReducer, useEffect, Dispatch, useCallback } from 'react'
import useSWR from 'swr'
import { useForm, Controller } from 'react-hook-form'
import Head from 'next/head'
import { css, styled, useTheme, manipulator } from '../styles/theme'
import { fetcher, userFormReducer, ActionTypes, UserFormActions } from '../lib/index'
import { Container, TextInput, Layout, UserForm, HeroTitle, Button, Picker } from '../components/index'
import Modal from '../lib/Modal'

enum UserListSort {
  ByOrderAscending = 'BY_ORDER_ASC',
  ByOderDescending = 'BY_ORDER_DESC',
  ByUserName = 'BY_USER_NAME',
}
interface Filters {
  name: string
  sort: string
}

type UserProps = {
  id: number
  name: string
  email: string
}

type InitStateType = {
  users: UserProps[]
}

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

function UserList ({ data, dispatch }: { data: UserProps[], dispatch: (value: { type: ActionTypes; payload: any }) => void }) {
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

function UserContent () {
  const { mq, colors } = useTheme()
  const { t } = useTranslation()
  const { state, dispatch } = useContext(AppContext)
  const [showAddUserForm, setShowAddUserForm] = useState(false)

  const defaultValues: Filters = {
    name: '',
    sort: '',
  }
  const { control, watch } = useForm({ defaultValues, mode: 'onChange' })
  const formState = watch()
  let userList = _.filter(state.users, (user) => {
    return _.isEmpty(formState.name) || user.name.toUpperCase().match(formState.name.toUpperCase())
  })

  switch (formState.sort) {
    case UserListSort.ByUserName:
      userList = _.sortBy(userList, ['name'])
      break
    case UserListSort.ByOderDescending:
      userList = _.reverse(_.sortBy(userList, ['id']))
      break
    case UserListSort.ByOrderAscending:
    default:
      userList = _.sortBy(userList, ['id'])
      break
  }

  const handleAddUserFormShowable = useCallback(() => setShowAddUserForm((prev) => !prev), [])
  const handleAddUser = useCallback(
    async (payload) => {
      const nextId = state.users.length + 1
      await dispatch({ type: ActionTypes.Add, payload: { id: nextId, ...payload } })
      return handleAddUserFormShowable()
    },
    [state.users]
  )

  const Label = styled.div`
    margin: 0 0 4px 0;
    font-size: 14px;
    color: #777777;
    ${mq[0]} {
      margin: 0;
    }
  `

  return (
    <div css={css`${mq[0]} { min-width: 600px; }`}>
      <div
        css={css`
          margin-bottom: 10px;
          display: flex;
          ${manipulator.container('column', 'flex-start', 'flex-start')};
          ${mq[0]} {
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 20px;
          }
        `}
      >
        <Container
          css={css`
            align-items: flex-start;
            width: 92vw;
            ${mq[0]} {
              align-items: center;
              width: auto;
            }
          `}
        >
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <Label>{t('USER.FIELD_LABEL_NAME')}</Label>
                <TextInput
                  css={css`
                    width: 88vw;
                    ${mq[0]} {
                      width: auto;
                      margin: 0 14px 0 0;
                    }
                  `}
                  value={value}
                  onChange={onChange}
                  placeholder={t('USER.FIELD_LABEL_NAME_PLACEHOLDER')}
                />
              </>
            )}
          />
          <Controller
            name="sort"
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <Label>{t('USER.FIELD_LABEL_SORT')}</Label>
                <Picker
                  css={css`
                    width: 100%;
                    margin-bottom: 14px;
                    ${mq[0]} {
                      width: auto;
                      margin-bottom: 0;
                    }
                  `}
                  onChange={onChange}
                  value={value}
                >
                  <option value="">{t('USER.FIELD_LABEL_SORT_ITEM_EMPTY')}</option>
                  {Object.values(UserListSort).map((value, index) => (
                    <option key={`${index}-${value}`} value={value}>
                      {t(`USER.FIELD_LABEL_SORT_ITEM_${value}`)}
                    </option>
                  ))}
                </Picker>
              </>
            )}
          />
        </Container>
        <div
          css={css`
            width: 92vw;
            display: flex;
            justify-content: flex-end;
            ${mq[0]} {
              width: auto;
            }
          `}
        >
          <Button
            css={css`
              padding: 6px 20px;
              background-color: ${colors.primary};
              color: white;
            `}
            onClick={handleAddUserFormShowable}
          >
            {t('FORM.BUTTON_ADD_USER')}
          </Button>
        </div>
      </div>
      <UserList
        data={userList}
        dispatch={dispatch}
      />
      <Modal title={t('USER_FORM.POPUP_TITLE')} showModal={showAddUserForm}>
        <UserForm onSubmit={handleAddUser} onCancel={handleAddUserFormShowable} />
      </Modal>
    </div>
  )
}
const initialState = {
  users: [],
}

const AppContext = createContext<{
  state: InitStateType
  dispatch: Dispatch<UserFormActions>
}>({
  state: initialState,
  dispatch: () => null,
})

const mainReducer = ({ users }, action) => ({
  users: userFormReducer(users, action),
})

function UserPage(props) {
  const { t } = useTranslation()
  const { data, error } = useSWR('/api/users', fetcher, { initialData: props.users })
  if (error) return <div>{t('ERROR.API_FAILED_TO_LOAD')}</div>
  if (!error && !data) return <div>{t('ERROR.API_IS_LOADING')}</div>

  const [state, dispatch] = useReducer(mainReducer, initialState)

  useEffect(() => {
    dispatch({
      type: ActionTypes.Create,
      payload: data,
    })
  }, [])

  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
      `}
    >
      <Head>
        <title>{t('USER.TITLE_USER_MANAGEMENT')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppContext.Provider value={{ state, dispatch }}>
        <Layout>
          <HeroTitle>{t('USER.TITLE_USER_MANAGEMENT')}</HeroTitle>
          <UserContent />
        </Layout>
      </AppContext.Provider>
    </div>
  )
}

export async function getStaticProps(): Promise<{ props: { users: any } }> {
  try {
    const users = await fetcher('https://jsonplaceholder.typicode.com/users')
    return {
      props: {
        users,
      },
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

export default UserPage
