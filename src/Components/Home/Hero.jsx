import { useContext } from 'react';
import MyContext from '../../Context/data/MyContext';
import React from 'react';
export default function Hero() {
  const { mode } = useContext(MyContext);

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Welcome to IndiKart</h1>
        <p className="text-lg sm:text-xl mb-8 opacity-90">Discover amazing products at unbeatable prices</p>
        <div className="flex justify-center gap-4">
          <a href="/allproducts" className="bg-white text-pink-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Shop Now
          </a>
          <a href="#features" className="border-2 border-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}