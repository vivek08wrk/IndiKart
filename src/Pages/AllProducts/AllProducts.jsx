import React, { useContext, useEffect, useMemo } from 'react'
import Filter from '../../Components/Filter/Filter'
import Layout from '../../Components/Layout/Layout'
import MyContext from '../../Context/data/MyContext'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../Redux/CartSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

// Parse price to number (handles ₹, commas, "/-", strings)
const toNumber = (val) => {
  if (val == null) return NaN
  if (typeof val === 'number') return val
  const cleaned = String(val).replace(/[^0-9.]/g, '')
  const n = parseFloat(cleaned)
  return Number.isFinite(n) ? n : NaN
}

// Support "0-100", "₹100 - ₹500", "5000+", {min,max}
const parseRange = (range) => {
  if (!range) return [-Infinity, Infinity]
  if (typeof range === 'string') {
    const plus = range.includes('+')
    const nums = range.match(/[\d.]+/g) || []
    if (plus && nums[0]) return [parseFloat(nums[0]), Infinity]
    if (nums.length >= 2) return [parseFloat(nums[0]), parseFloat(nums[1])]
    if (nums.length === 1) return [parseFloat(nums[0]), parseFloat(nums[0])]
    return [-Infinity, Infinity]
  }
  if (typeof range === 'object') {
    const min = toNumber(range.min)
    const max = toNumber(range.max)
    return [Number.isFinite(min) ? min : -Infinity, Number.isFinite(max) ? max : Infinity]
  }
  return [-Infinity, Infinity]
}

const inPriceRange = (price, range) => {
  if (!range) return true
  const p = toNumber(price)
  if (!Number.isFinite(p)) return false
  const [min, max] = parseRange(range)
  return p >= min && p <= max
}

function AllProducts() {
    const context = useContext(MyContext)
    const { mode, loading, product, searchkey, filterType, filterPrice } = context

    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart)
    const navigate = useNavigate()

    // Add to cart function
    const addCart = (product) => {
        dispatch(addToCart(product))
        toast.success('Added to cart successfully!')
    }

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems))
    }, [cartItems])

    // Filtered products (search + category + price), memoized
    const filteredProducts = useMemo(() => {
        const list = Array.isArray(product) ? product : []
        const term = (searchkey || '').toLowerCase().trim()
        const cat = (filterType || '').toLowerCase().trim()
        const range = filterPrice // can be "0-100", "₹100 - ₹500", "5000+", {min,max}

        return list.filter((obj) => {
            const title = (obj?.title || '').toLowerCase()
            const desc = (obj?.description || '').toLowerCase()
            const category = (obj?.category || '').toLowerCase()

            const matchesSearch =
                !term || title.includes(term) || desc.includes(term) || category.includes(term)

            const matchesCategory = !cat || category.includes(cat)

            const matchesPrice = inPriceRange(obj?.price, range)

            return matchesSearch && matchesCategory && matchesPrice
        })
    }, [product, searchkey, filterType, filterPrice])

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
                        <div className="h-1 w-20 bg-indigo-500 rounded"></div>
                    </div>

                    {/* Debug Info - Remove in production */}
                    {(searchkey || filterType || filterPrice) && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Active Filters:</strong> 
                                {searchkey && ` Search: "${searchkey}"`}
                                {filterType && ` Category: "${filterType}"`}
                                {filterPrice && ` Price: "${filterPrice}"`}
                                {` | Found: ${filteredProducts.length} products`}
                            </p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
                        </div>
                    )}

                    {/* No Products Found */}
                    {!loading && filteredProducts.length === 0 && (
                        <div className="text-center py-16">
                            <h3 className={`text-xl font-medium mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                No products found
                            </h3>
                            <p className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Adjust your search or filters
                            </p>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && filteredProducts.length > 0 && (
                        <div className="flex flex-wrap -m-4">
                            {filteredProducts.map((item, index) => {
                                const { title, price, imageUrl, id, category, description } = item
                                return (
                                    <div key={index} className="p-4 md:w-1/4 drop-shadow-lg">
                                        <div 
                                            className="h-full border-2 hover:shadow-gray-100 hover:shadow-2xl transition-shadow duration-300 ease-in-out border-gray-200 border-opacity-60 rounded-2xl overflow-hidden" 
                                            style={{ 
                                                backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', 
                                                color: mode === 'dark' ? 'white' : '' 
                                            }}
                                        >
                                            {/* Product Image */}
                                            <div 
                                                className="flex justify-center cursor-pointer" 
                                                onClick={() => navigate(`/productinfo/${id}`)}
                                            >
                                                <img 
                                                    className="rounded-2xl w-full h-80 object-cover hover:scale-105 transition-transform duration-300" 
                                                    src={imageUrl} 
                                                    alt={title}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found'
                                                    }}
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="p-6">
                                                {/* Category */}
                                                <h2 
                                                    className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1 uppercase"
                                                    style={{ color: mode === 'dark' ? '#9CA3AF' : '' }}
                                                >
                                                    {category || 'E-COMMERCE'}
                                                </h2>

                                                {/* Product Title */}
                                                <h1 
                                                    className="title-font text-lg font-medium text-gray-900 mb-3 cursor-pointer hover:text-indigo-600 transition-colors duration-200" 
                                                    style={{ color: mode === 'dark' ? 'white' : '' }}
                                                    onClick={() => navigate(`/productinfo/${id}`)}
                                                >
                                                    {title?.length > 25 ? `${title.substring(0, 25)}...` : title}
                                                </h1>

                                                {/* Description */}
                                                {description && (
                                                    <p 
                                                        className="leading-relaxed mb-3 text-sm"
                                                        style={{ color: mode === 'dark' ? '#D1D5DB' : '#6B7280' }}
                                                    >
                                                        {description.length > 50 ? `${description.substring(0, 50)}...` : description}
                                                    </p>
                                                )}

                                                {/* Price */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <span 
                                                        className="title-font text-lg font-bold text-indigo-600" 
                                                        style={{ color: mode === 'dark' ? '#818CF8' : '' }}
                                                    >
                                                        ₹{price}
                                                    </span>
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg
                                                                key={i}
                                                                className="w-4 h-4 text-yellow-300 fill-current"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Add to Cart Button */}
                                                <div className="flex justify-center">
                                                    <button 
                                                        onClick={() => addCart(item)}
                                                        className="bg-indigo-500 hover:bg-indigo-700 w-full text-white py-2 rounded-lg font-bold transition-colors duration-200 transform hover:scale-105"
                                                    >
                                                        Add To Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Filter Results Summary */}
                    {!loading && (
                        <div className="text-center mt-8">
                            <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Showing {filteredProducts.length} of {product.length} products
                                {(searchkey || filterType || filterPrice) && (
                                    <span className="ml-2 text-indigo-600 font-medium">
                                        (filtered)
                                    </span>
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    )
}

export default AllProducts
