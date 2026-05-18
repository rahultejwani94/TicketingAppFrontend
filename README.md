# Ticket Booking Application - Frontend

A modern, responsive ticket booking application built with React and Vite. This frontend provides an intuitive interface for users to book tickets and for admins to manage bookings with QR code generation capabilities.

## 🎫 Features

- **User Ticket Booking**: Easy-to-use booking interface with quantity selection
- **Payment Integration**: Payment QR code display for seamless transactions
- **Admin Dashboard**: Secure admin login with admin-specific booking management
- **Ticket Download**: Generate and download tickets with QR codes
- **Protected Routes**: Secure admin pages with authentication
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Smooth Animations**: Polished UX with Framer Motion
- **Real-time Notifications**: Toast notifications for user feedback
- **Concert Landing Page**: Homepage showcases event details and CTA
- **Sold-Out Handling**: Dedicated sold-out page when tickets are unavailable
- **Optimized Performance**: Built with Vite for lightning-fast development and builds

## 🛠️ Tech Stack

- **React 19**: Modern React with hooks and latest features
- **Vite**: Ultra-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side navigation
- **Axios**: HTTP client for API communication
- **Framer Motion**: Animation library
- **QRCode React**: QR code generation
- **React Hot Toast**: Toast notifications
- **Lucide React**: Icon library
- **ESLint**: Code quality and linting

## 📁 Project Structure

```
src/
├── config/             # Configuration files
│   └── api.js         # API base URL and event details
├── pages/             # Page components
│   ├── Booking.jsx    # Main booking page (user & admin)
│   ├── Success.jsx    # Success page after booking
│   ├── AdminLogin.jsx # Admin login page
│   ├── DownloadTicket.jsx  # Ticket download page
│   ├── SoldOutPage.jsx # Sold-out page
│   ├── TheNotebookConcert.jsx # Event homepage
│   └── NotFound.jsx   # 404 fallback page
├── routes/            # Route management
│   └── ProtectedRoute.jsx  # Protected route wrapper
├── App.jsx            # Main app component with routes
└── main.jsx           # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ticket-frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
VITE_API_BASE_URL=http://your-api-url:port
VITE_MERCHANT_NAME=Merchant_name
VITE_UPI_ID=upi_id
```

### Development

Start the development server with hot module replacement:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📋 Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Create optimized production build
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## 🔐 Routes

| Route | Component | Protection | Description |
|-------|-----------|-----------|-------------|
| `/` | TheNotebookConcert | Public | Event homepage and CTA |
| `/booking` | Booking | Public | Main ticket booking page |
| `/admin-login` | AdminLogin | Public | Admin authentication |
| `/admin-booking` | Booking | Protected | Admin booking management |
| `/success` | Success | Public | Booking confirmation |
| `/download-ticket` | DownloadTicket | Public | Ticket download |
| `/sold-out` | SoldOutPage | Public | Sold-out notification page |

## 🔌 API Integration

The application communicates with a backend API configured in `src/config/api.js`. By default it uses `http://192.168.1.4:8080`. Override this using a local environment variable file:
```env
VITE_API_BASE_URL=http://your-api-url:port
```

## ⚙️ Configurable Event & Pricing Settings

`src/config/api.js` also contains the event metadata and booking controls used by the UI.

- `EVENT_DETAILS`
  - `name`: event title shown across the app
  - `tagline`: subtitle or promotion text
  - `dates`: display-friendly event dates
  - `eventDateTimeStart`: ISO date-time for the event
  - `time`: shown event start time
  - `venue`: event location
  - `priceRegular`: fallback regular price
  - `pricing.earlyBird.enabled`: enable or disable early-bird pricing
  - `pricing.earlyBird.validTill`: ISO date-time cutoff for early-bird pricing
  - `pricing.earlyBird.price`: early-bird ticket price
  - `pricing.regular.singleTicketPrice`: regular single ticket price
  - `pricing.regular.bulkTicketPrice`: discounted bulk ticket price
  - `pricing.regular.bulkMinTickets`: minimum tickets required for bulk pricing

- `EVENT_STATE`
  - `isLive`: set `true` when booking is open, `false` to pause bookings
  - `isSoldOut`: set `true` to show the sold-out page instead of booking
  - `isEventEnded`: set `true` when the event is over; the homepage uses `POST_EVENT` overrides

- `POST_EVENT`
  - `ctaLabel`: button label shown after the event ends
  - `ctaHref`: URL for the post-event CTA
  - `badge`: message shown after the event ends

Example use cases:
- Change the event title, venue, and date in `EVENT_DETAILS`
- Update `pricing.earlyBird.validTill` and price values to control discount timing
- Switch `EVENT_STATE.isLive`/`isSoldOut`/`isEventEnded` to change site behavior without code changes

## 🎨 Styling

The project uses **Tailwind CSS** for styling. Configuration available in `tailwind.config.js`.

## 🧪 Code Quality

ESLint is configured to maintain code quality. Run:
```bash
npm run lint
```

## 📦 Deployment

This project is configured for deployment on Vercel. See `vercel.json` for deployment configuration.

### Deploy to Vercel
```bash
vercel
```

## 📝 License

[Add your license information here]

## 👥 Contributing

[Add contribution guidelines here]
