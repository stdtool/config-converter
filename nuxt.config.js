
const BASE_PATH = process.env.NODE_ENV === 'dev' ? '/' : '/config-translator/'

const options = [
  "json",
  "yaml",
  "ini",
  "toml",
]

let sets = [];
options.forEach(inOption => {
  options.forEach(outOption => {
    if (inOption !== outOption) sets.push(`${inOption} to ${outOption}`)
  })
})

module.exports = {
  head: {
    title: 'Config Translator - Utilon',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: `Config Translator. ${sets.join(", ")}.` },
      { hid: 'keywords', name: 'keywords', content: 'config,translator,yaml,yml,json,ini,toml' },
      { name: "msapplication-TileColor", content: "#ffffff" },
      { name: "msapplication-TileImage", content: BASE_PATH + "ms-icon-144x144.png" },
      { name: "theme-color", content: "#ffffff" },
    ],
    link: [
      { rel: "apple-touch-icon", sizes: "57x57", href: BASE_PATH + "apple-icon-57x57.png" },
      { rel: "apple-touch-icon", sizes: "60x60", href: BASE_PATH + "apple-icon-60x60.png" },
      { rel: "apple-touch-icon", sizes: "72x72", href: BASE_PATH + "apple-icon-72x72.png" },
      { rel: "apple-touch-icon", sizes: "76x76", href: BASE_PATH + "apple-icon-76x76.png" },
      { rel: "apple-touch-icon", sizes: "114x114", href: BASE_PATH + "apple-icon-114x114.png" },
      { rel: "apple-touch-icon", sizes: "120x120", href: BASE_PATH + "apple-icon-120x120.png" },
      { rel: "apple-touch-icon", sizes: "144x144", href: BASE_PATH + "apple-icon-144x144.png" },
      { rel: "apple-touch-icon", sizes: "152x152", href: BASE_PATH + "apple-icon-152x152.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: BASE_PATH + "apple-icon-180x180.png" },
      { rel: "icon", type: "image/x-icon", href: BASE_PATH + "favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "192x192" , href: BASE_PATH + "android-icon-192x192.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: BASE_PATH + "favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "96x96", href: BASE_PATH + "favicon-96x96.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: BASE_PATH + "favicon-16x16.png" },
      { rel: "manifest", href: BASE_PATH + "manifest.json" },
    ],
    script: [
      { async: true, src: "https://www.googletagmanager.com/gtag/js?id=UA-108846016-1" },
    ],
  },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "font-awesome/css/font-awesome.min.css",
  ],
  plugins: [
    { src: '~/plugins/ga', ssr: false },
  ],
  loading: { color: '#3B8070' },
  router: {
    base: BASE_PATH,
  },
  build: {
    vendor: [
      "brace",
    ],
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
