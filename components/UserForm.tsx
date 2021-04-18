import _ from 'lodash'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { useTheme, css, styled, manipulator } from '../styles/theme'
import { TextInput, Label, Hint, FormButton } from '../components/index'

type UserFormProps = {
  onCancel: () => void
  onSubmit: (value: { name: string; email: string }) => void
}

function UserForm({ onCancel, onSubmit }: UserFormProps): JSX.Element {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const defaultValues = {
    name: '',
    email: '',
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, mode: 'onChange' })
  const handleAdd = useCallback((payload) => onSubmit(payload), [])

  return (
    <div
      css={css`
        ${manipulator.container('column', 'space-between', 'initial')};
        height: 100%;
      `}
    >
      <div>
        {_.map(defaultValues, (value, key) => {
          return (
            <Controller
              key={key}
              name={key}
              control={control}
              rules={
                key === 'name'
                  ? {
                      required: true,
                      validate: (data) => !_.isEmpty(_.trim(data)),
                    }
                  : {
                      required: true,
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    }
              }
              render={({ field: { onChange, value } }) => (
                <React.Fragment key={key}>
                  <Label>
                    {`${t(`USER_FORM.HEADER_LABEL_${key.toUpperCase()}`)}:`}
                    <Hint>{errors?.[key] && t(`USER_FORM.ERROR_${errors?.[key].type.toUpperCase()}`)}</Hint>
                  </Label>
                  <TextInput
                    css={css`
                      width: 98%;
                    `}
                    value={value}
                    onChange={onChange}
                  />
                </React.Fragment>
              )}
            />
          )
        })}
      </div>
      <div
        css={css`
          ${manipulator.container('row', 'space-between', 'center')}
        `}
      >
        <FormButton
          css={css`
            margin-right: 16px;
          `}
          onClick={onCancel}
        >
          {t('FORM.BUTTON_CANCEL')}
        </FormButton>
        <FormButton
          css={css`
            color: white;
            background-color: ${colors.primary};
          `}
          onClick={handleSubmit(handleAdd)}
        >
          {t('FORM.BUTTON_ADD')}
        </FormButton>
      </div>
    </div>
  )
}
export default UserForm
