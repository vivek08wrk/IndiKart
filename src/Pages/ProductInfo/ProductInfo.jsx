import { useContext, useEffect, useState } from "react";
import Layout from "../../Components/Layout/Layout";
import MyContext from "../../Context/data/MyContext";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { addToCart } from "../../Redux/CartSlice";
import { fireDB } from "../../Firebase/FirebaseConfig";
import React from "react";
function ProductInfo() {
  const context = useContext(MyContext);
  const { loading, setLoading, mode } = context;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Add quantity state
  const params = useParams();
  const navigate = useNavigate();

  const getProductData = async () => {
    setLoading(true);
    try {
      const productTemp = await getDoc(doc(fireDB, "products", params.id));
      if (productTemp.exists()) {
        setProduct(productTemp.data());
      } else {
        toast.error("Product not found");
        navigate("/allproducts");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product");
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  // Quantity handlers
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 99) {
      setQuantity(value);
    }
  };

  // Calculate total price
  const totalPrice = product
    ? (parseFloat(product.price) * quantity).toFixed(2)
    : 0;

  // Add to cart with quantity
  const addCart = () => {
    if (!product) {
      toast.error("Product data not available");
      return;
    }

    const productWithQuantity = {
      ...product,
      quantity: quantity,
      totalPrice: totalPrice,
      id: params.id,
    };

    dispatch(addToCart(productWithQuantity));
    toast.success(`${quantity} x ${product.title} added to cart!`);
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <section className="text-gray-600 body-font overflow-hidden">
          <div className="container px-5 py-10 mx-auto">
            {product && (
              <div className="lg:w-4/5 mx-auto flex flex-wrap">
                <img
                  alt="ecommerce"
                  className="lg:w-1/3 w-full lg:h-auto object-cover object-center rounded"
                  src={product.imageUrl}
                />
                <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                  <h2 className="text-sm title-font text-gray-500 tracking-widest">
                    {product.category}
                  </h2>
                  <h1
                    className="text-3xl title-font font-medium mb-1"
                    style={{ color: mode === "dark" ? "white" : "" }}
                  >
                    {product.title}
                  </h1>

                  {/* Rating stars */}
                  <div className="flex mb-4">
                    <span className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          fill={i < 4 ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          className="w-4 h-4 text-indigo-500"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                      <span className="text-gray-600 ml-3">4 Reviews</span>
                    </span>
                  </div>

                  <p
                    className="leading-relaxed border-b-2 mb-5 pb-5"
                    style={{ color: mode === "dark" ? "white" : "" }}
                  >
                    {product.description}
                  </p>

                  {/* Quantity Selector */}
                  <div className="flex items-center mb-5">
                    <div className="flex items-center">
                      <span
                        className="mr-3 text-lg font-medium"
                        style={{ color: mode === "dark" ? "white" : "" }}
                      >
                        Quantity:
                      </span>
                      <div className="flex items-center border-2 border-gray-200 rounded">
                        <button
                          onClick={decreaseQuantity}
                          disabled={quantity <= 1}
                          className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            color: mode === "dark" ? "white" : "",
                            backgroundColor:
                              mode === "dark" ? "rgb(64 66 70)" : "",
                          }}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={handleQuantityChange}
                          min="1"
                          max="99"
                          className="w-16 px-2 py-1 text-center border-0 focus:outline-none"
                          style={{
                            color: mode === "dark" ? "white" : "",
                            backgroundColor:
                              mode === "dark" ? "rgb(64 66 70)" : "",
                          }}
                        />
                        <button
                          onClick={increaseQuantity}
                          className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100"
                          style={{
                            color: mode === "dark" ? "white" : "",
                            backgroundColor:
                              mode === "dark" ? "rgb(64 66 70)" : "",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="flex items-center mb-5">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span
                          className="text-sm text-gray-500 mr-2"
                          style={{ color: mode === "dark" ? "#9CA3AF" : "" }}
                        >
                          Unit Price:
                        </span>
                        <span className="text-lg font-medium">
                          ₹{product.price}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span
                          className="text-sm text-gray-500 mr-2"
                          style={{ color: mode === "dark" ? "#9CA3AF" : "" }}
                        >
                          Total Price:
                        </span>
                        <span className="text-2xl title-font font-bold text-indigo-600">
                          ₹{totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="flex items-center">
                    <button
                      onClick={addCart}
                      className="flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded transition-colors duration-200"
                    >
                      Add {quantity} to Cart - ₹{totalPrice}
                    </button>
                    <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4 hover:bg-gray-300 transition-colors duration-200">
                      <svg
                        fill="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </Layout>
  );
}

export default ProductInfo;
