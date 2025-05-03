# Travalia

Travalia is a full-stack travel and tour management platform. It allows users to explore tours, book trips, review experiences, and manage travel plans. The project includes a Node.js/Express backend and a React frontend.

## Features

- User authentication and authorization
- Browse and book tours
- Vehicle hire and management
- Itinerary planning
- User reviews and ratings
- Admin panel for managing tours, bookings, and users
- Responsive UI with Tailwind CSS
- Newsletter subscription

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Redux
- **Backend:** Node.js, Express, MongoDB
- **Other:** Cloudinary, Firebase, Framer Motion,leaflet map

## Project Structure

```
Travalia/
│
├── Backend/           # Node.js/Express backend
│   ├── controllers/   # Route controllers
│   ├── dev-data/      # Sample data and scripts
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── utills/        # Utility functions
│   ├── app.js
│   └── server.js
│
├── frontend/          # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── config.env         # Environment variables
├── README.md
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. Go to the `Backend` directory:

   ```bash
   cd Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file (or use `config.env`) and set your environment variables (MongoDB URI, JWT secret, etc.).

4. Start the backend server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. Go to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- Register or log in as a user.
- Browse available tours and book your trip.
- Hire vehicles and plan your itinerary.
- Leave reviews and read others' experiences.
- Admins can manage tours, bookings, and users.

## Contributors

Authentication & Profile Management-IT22031266-Kavindu Theekshana
Package Management-IT22892812-Janindu Jayasundara
Booking managemnt & itinerary Generation-IT22031266-Gayasri pethum
Hire management-IT22324238-Malitha Parikalpa

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
