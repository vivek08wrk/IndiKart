import React, { useContext } from "react";
import MyContext from "../../Context/data/MyContext";

function Features() {
  const { mode } = useContext(MyContext);

  return (
    <section
      id="features"
      className="py-12 sm:py-16"
      style={{ backgroundColor: mode === "dark" ? "#111827" : "#f9fafb" }}
    >
      <div className="container mx-auto px-4">
        <h2
          className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12"
          style={{ color: mode === "dark" ? "white" : "" }}
        >
          Why Choose IndiKart?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: "Free Delivery",
              desc: "Free shipping on orders over ₹300",
            },
            {
              title: "Quality Assured",
              desc: "100% authentic products guaranteed",
            },
            {
              title: "Best Prices",
              desc: "Competitive prices with great deals",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="text-center bg-white rounded-xl p-6 shadow"
              style={{ backgroundColor: mode === "dark" ? "#1f2937" : "" }}
            >
              <div className="bg-pink-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v8m-4-4h8"
                  />
                </svg>
              </div>
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                {card.title}
              </h3>
              <p
                className="text-gray-600"
                style={{ color: mode === "dark" ? "#a0aec0" : "" }}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Make sure you have a default export
export default Features;
