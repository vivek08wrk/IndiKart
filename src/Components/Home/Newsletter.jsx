import React from 'react';
export default function Newsletter() {
  return (
    <section className="bg-pink-500 py-12 sm:py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Stay Updated</h2>
        <p className="text-pink-100 mb-6 sm:mb-8">
          Subscribe to get updates on new products and exclusive offers
        </p>
        <form
          className="max-w-md mx-auto flex"
          onSubmit={(e) => {
            e.preventDefault();
            // Add your submit logic or toast here
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none"
          />
          <button
            type="submit"
            className="bg-white text-pink-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
