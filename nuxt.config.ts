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
  }
})
