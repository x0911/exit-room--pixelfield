import colors from 'vuetify/es5/util/colors';
import i18n from './plugins/i18n.js';

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',
  ssr: true,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s',
    title: 'Privacy Cruise',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/scss/utils/index.scss',
    '@/assets/global.scss',
    '@/assets/scss/components/vuetify.scss',
    '@/assets/fonts/index.scss',
  ],

  axios: {
    baseURL: process.env.SERVER_URL,
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '~/plugins/vue-lottie',
      ssr: false,
    },
    {
      src: '~/plugins/vue-awesome-swiper',
      ssr: false,
    },
    {
      src: '~/plugins/v-mask',
      ssr: false,
    },
    {
      src: '~/plugins/colored-passphrase-string',
    },
    {
      src: '~/plugins/global-mixins',
    },
    {
      src: '~/plugins/vue-typed.js',
      ssr: false,
    },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    [
      '@nuxtjs/eslint-module',
      {
        cache: false,
      },
    ],
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  eslint: {
    cache: false,
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/axios',
    [
      '@nuxtjs/google-gtag',
      {
        id: '', // will add id here
      },
    ],
  ],

  i18n: {
    vueI18nLoader: true,
    defaultLocale: 'en',
    lazy: process.env.DEV === '1',
    langDir: 'i18n',
    locales: [
      {
        code: 'en',
        name: 'en',
        file: 'en',
      },
      {
        code: 'fr',
        name: 'fr',
        file: 'fr',
      },
      {
        code: 'zh',
        name: 'zh',
        file: 'zh',
      },
      {
        code: 'it',
        name: 'it',
        file: 'it',
      },
      {
        code: 'ja',
        name: 'ja',
        file: 'ja',
      },
      {
        code: 'de',
        name: 'de',
        file: 'de',
      },
      {
        code: 'pt',
        name: 'pt',
        file: 'pt',
      },
      {
        code: 'ru',
        name: 'ru',
        file: 'ru',
      },
      {
        code: 'sl',
        name: 'sl',
        file: 'sl',
      },
      {
        code: 'es',
        name: 'es',
        file: 'es',
      },
      {
        code: 'tr',
        name: 'tr',
        file: 'tr',
      },
    ],
    strategy: 'no_prefix',
    noPrefixDefaultLocale: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      onlyOnRoot: true,
    },
    vueI18n: i18n,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      options: {
        customProperties: true,
      },
      dark: true,
      themes: {
        dark: {
          primary: '#64202f',
          'primary-lighten': '#a5354e',
          'primary-darken': '#3a121b',
          'dark-blue': '#132e4c',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common';
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mov|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: '[path][name].[ext]',
        },
      });
    },
  },
};
