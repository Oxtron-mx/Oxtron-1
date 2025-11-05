import i18n from "i18next";
import {z} from "zod";
import {zodI18nMap} from "zod-i18n-map";
import es from "zod-i18n-map/locales/es/zod.json";
import en from "zod-i18n-map/locales/en/zod.json";
import {initReactI18next} from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: 'en',
    ns: "zod",
    resources: {
      es: {zod: es},
      en: {zod: en},
    },
  });
z.setErrorMap(zodI18nMap);

export {z}

