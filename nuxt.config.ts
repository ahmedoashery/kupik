import path from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],
  components:[
    {path: '~/components'},
    {path: '~/components/entities'},
    {path: '~/components/home'},
    {path: '~/components/inbox'},
    {path: '~/components/settings'},
    {path: '~/components/users'},
    {path: '~/components/inventory'},
  ],
  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@sidebase/nuxt-auth',
    '@vexip-ui/nuxt'
  ],
  ui: {
    icons: ['heroicons', 'simple-icons'],
    safelistColors: ['primary', 'red', 'orange', 'green']
  },
  fonts: {
    experimental: { addPreloadLinks: true },
    provider: 'authjs',
    families: [
      { name: 'Cairo', src: 'url(fonts/Cairo-Font.ttf)', weight: 400 }
    ]
  },
  devtools: {
    enabled: false
  },
  build: {
    transpile: ['jsonwebtoken']
  },
  runtimeConfig:{
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY
  },
  auth: {
    isEnabled: true,
    provider: {
      type: 'refresh',
      // refreshOnlyToken: true,
      endpoints: {
        getSession: { path: '/user' },
        refresh: { path: '/refresh', method: 'post' }
      },
      pages: {
        login: '/auth/login'
      },
      token: {
        signInResponseTokenPointer: '/token/accessToken',
        maxAgeInSeconds: 60 * 5, // 5 min
        sameSiteAttribute: 'lax'
      },
      refreshToken: {
        signInResponseRefreshTokenPointer: '/token/refreshToken'
      }
    },
    globalAppMiddleware: {
      isEnabled: false,
    }
  },
  vite: {
    ssr:{
      external: true
    },
    resolve: {
      alias: [
        {
          find: /^moment$/,
          replacement: path.resolve(__dirname, './alias.js'),
        },
        {
          find: /^gc-dv$/,
          replacement: path.resolve(
            __dirname,
            './node_modules/@grapecity/activereports/lib/node_modules/gc-dv.js'
          ),
        },
        {
          find: /^@grapecity\/ar-js-pagereport$/,
          replacement: path.resolve(
            __dirname,
            './node_modules/@grapecity/activereports/lib/node_modules/@grapecity/ar-js-pagereport.js'
          ),
        },
        {
          find: /^barcodejs$/,
          replacement: path.resolve(
            __dirname,
            './node_modules/@grapecity/activereports/lib/node_modules/barcodejs.js'
          ),
        },
      ],
    },
  }
})
