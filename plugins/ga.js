
/* eslint-disable */
export default ({app}) => {
  if (process.env.NODE_ENV !== 'production') return

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-108846016-1')

  app.router.afterEach((to, from) => {
    gtag('config', 'UA-108846016-1', {
      page_path: location.href,
    })
  })
}