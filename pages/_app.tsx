import React, { useEffect } from 'react'
import { useSSR } from 'react-i18next'
import { useRouter } from 'next/router'
import resources from '../res/translations'
import i18n from '../lib/i18n'

function MyApp({ Component, pageProps }): JSX.Element {
  const router = useRouter()

  useSSR(resources, router.locale)
  useEffect(() => {
    if (router.locale !== i18n.language) {
      i18n.changeLanguage(router.locale).catch(console.error)
    }
  }, [router.locale])

  return <Component {...pageProps} />
}

export default MyApp
