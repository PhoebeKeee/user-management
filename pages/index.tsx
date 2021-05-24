import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import React, { createContext, useContext, useState, useReducer, useEffect, Dispatch, useCallback } from 'react'
import useSWR from 'swr'
import { useForm, Controller } from 'react-hook-form'
import Head from 'next/head'
import { css, styled, useTheme, manipulator } from '../styles/theme'
import { fetcher, userFormReducer, ActionTypes, UserFormActions } from '../lib/index'
import { Container, TextInput, Layout, UserForm, UserList, HeroTitle, Button, Picker } from '../components/index'
import Modal from '../lib/Modal'
import type { User } from '../lib/types'

enum UserListSort {
  ByOrderAscending = 'BY_ORDER_ASC',
  ByOderDescending = 'BY_ORDER_DESC',
  ByUserName = 'BY_USER_NAME',
}
interface Filters {
  name: string
  sort: string
}

type InitStateType = {
  users: User[]
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
