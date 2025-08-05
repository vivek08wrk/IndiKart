import React, { useContext, useEffect } from 'react';
import Filter from '../../Components/Filter/Filter';
import Layout from '../../Components/Layout/Layout';
import MyContext from '../../Context/data/MyContext';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../Redux/CartSlice';
import { toast } from 'react-toastify';

function AllProducts() {
  const context = useContext(MyContext);
  const { mode, product, searchkey, filterType, filterPrice } = context;

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  console.log(cartItems);

  const addCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    toast.success('Added to cart');
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Filter />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-8 md:py-16 mx-auto">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-10">
            <h1
              className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900"
              style={{ color: mode === 'dark' ? 'white' : '' }}
            >
              Our Latest Collection
            </h1>
            <div className="h-1 w-20 bg-pink-600 rounded"></div>
          </div>

          <div className="flex flex-wrap -m-4">
            {product
              .filter((obj) =>
                obj.title.toLowerCase().includes(searchkey)
              )
              .filter((obj) =>
                obj.category.toLowerCase().includes(filterType)
              )
              .filter((obj) =>
                obj.price.includes(filterPrice)
              )
              .map((item, index) => {
                const { title, price, imageUrl, id } = item;
                return (
                  <div
                    key={index}
                    className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 drop-shadow-lg"
                  >
                    <div
                      className="h-full flex flex-col justify-between border-2 hover:shadow-2xl transition-shadow duration-300 ease-in-out border-gray-200 border-opacity-60 rounded-2xl overflow-hidden"
                      style={{
                        backgroundColor:
                          mode === 'dark' ? 'rgb(46 49 55)' : '',
                        color: mode === 'dark' ? 'white' : '',
                      }}
                    >
                      <div
                        onClick={() =>
                          (window.location.href = `/productinfo/${id}`)
                        }
                        className="cursor-pointer"
                      >
                        <img
                          className="rounded-2xl w-full h-80 object-cover p-2 hover:scale-110 transition-transform duration-300 ease-in-out"
                          src={imageUrl}
                          alt={title}
                        />
                      </div>
                      <div className="flex flex-col flex-1 justify-between p-5 border-t-2">
                        <div>
                          <h2
                            className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1"
                            style={{
                              color: mode === 'dark' ? 'white' : '',
                            }}
                          >
                            IndiKart
                          </h2>
                          <h1
                            className="title-font text-lg font-medium text-gray-900 mb-3"
                            style={{
                              color: mode === 'dark' ? 'white' : '',
                            }}
                          >
                            {title}
                          </h1>
                          <p
                            className="leading-relaxed mb-3"
                            style={{
                              color: mode === 'dark' ? 'white' : '',
                            }}
                          >
                            ₹{price}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => addCart(e, item)}
                          className="mt-4 focus:outline-none text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm w-full py-2"
                        >
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default AllProducts;
