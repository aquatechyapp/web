// lib/gtag.js
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Log page views
export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    linker: {
      domains: ['aquatechyapp.com', 'app.aquatechyapp.com'],
    }
  })
}

// Log specific events
export const event = ({ action, params }) => {
  window.gtag('event', action, params)
}
