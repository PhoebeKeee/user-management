import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import resources from '../res/translations'

i18n
  .use(initReactI18next)
  .init({
    resources,
    debug: false,
    fallbackLng: 'en',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  })
  .catch(console.error)

export default i18n
