const useTranslation = () => ({
  t: (key: string) => key,
  i18n: {
    changeLanguage: () => Promise.resolve(),
    language: "en"
  }
})

const Trans = ({ children }: { children: React.ReactNode }) => children

const initReactI18next = {
  type: "3rdParty",
  init: () => {}
}

export default {
  useTranslation,
  Trans,
  initReactI18next
}

export { initReactI18next, Trans, useTranslation }
