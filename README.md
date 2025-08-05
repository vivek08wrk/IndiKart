# IndiKart

IndiKart is an e-commerce web application built with React, Redux, and Firebase. It allows users to browse products, view detailed product information, and add items to a shopping cart.

## Features

- **Product Listing & Details:** Browse and view detailed information about products.
- **Shopping Cart:** Add products to the cart and persist cart items using Redux and localStorage.
- **Firebase Integration:** Uses Firebase Firestore for product data storage.
- **User Notifications:** Provides feedback using React Toastify.
- **Responsive UI:** Styled with Tailwind CSS for a modern look and feel.

## Tech Stack

- **Frontend:** React, Redux, React Router, Tailwind CSS
- **Backend:** Firebase Firestore
- **State Management:** Redux Toolkit
- **Notifications:** React Toastify

## Getting Started

### Prerequisites

- Node.js and npm installed
- Firebase project set up (with Firestore enabled)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/IndiKart.git
   cd IndiKart
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Firebase:

   - Create a `src/Firebase/FirebaseConfig.js` file with your Firebase configuration.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## Project Structure

```
src/
  Components/      # Reusable UI components
  Context/         # React Context for global state
  Pages/           # Page components (e.g., ProductInfo)
  Redux/           # Redux slices and store
  Firebase/        # Firebase configuration
  App.js           # Main app component
```

## Usage

- Browse products on the homepage.
- Click on a product to view its details.
- Add products to your cart.
- Cart state is saved in localStorage.

## Contributing
