import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'
import { EVENT_DETAILS, CONCERT_THEME } from './src/config/event'

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          EVENT_NAME: EVENT_DETAILS.name,
          EVENT_DATES: EVENT_DETAILS.dates,
          EVENT_VENUE: EVENT_DETAILS.venue,
          EVENT_CITY: EVENT_DETAILS.city,
          EVENT_PRICE: EVENT_DETAILS.pricing.earlyBird.price,
          EVENT_DATETIME_START: EVENT_DETAILS.eventDateTimeStart,
          EVENT_DATETIME_END: EVENT_DETAILS.eventDateTimeEnd,
          CONCERT_THEME_NAME: `${CONCERT_THEME.title} ${CONCERT_THEME.subtitle}`, // "7 STAGES OF LOVE"
          CONCERT_DESCRIPTION: CONCERT_THEME.description,
        }
      }
    })
  ],
  base: '/',
  server: {
    host: true,
    allowedHosts: 'all',
  },
})