import React, { useContext, useMemo } from 'react'
import MyContext from '../../Context/data/MyContext'

// Same helpers to keep count in sync
const toNumber = (val) => {
  if (val == null) return NaN
  if (typeof val === 'number') return val
  const cleaned = String(val).replace(/[^0-9.]/g, '')
  const n = parseFloat(cleaned)
  return Number.isFinite(n) ? n : NaN
}
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

function Filter() {
  const {
    mode,
    searchkey, setSearchkey,
    filterType, setFilterType,
    filterPrice, setFilterPrice,
    product
  } = useContext(MyContext)

  const uniqueCategories = useMemo(() => {
    const list = Array.isArray(product) ? product : []
    return [...new Set(list.map(i => (i?.category || '').toLowerCase()).filter(Boolean))].sort()
  }, [product])

  // Ensure we store canonical range tokens on change
  const handlePriceChange = (e) => {
    const val = e.target.value // tokens like "0-100", "100-500", "5000+"
    setFilterPrice(val)
  }

  const filteredCount = useMemo(() => {
    const list = Array.isArray(product) ? product : []
    const term = (searchkey || '').toLowerCase().trim()
    const cat = (filterType || '').toLowerCase().trim()
    const range = filterPrice
    return list.filter((obj) => {
      const title = (obj?.title || '').toLowerCase()
      const desc = (obj?.description || '').toLowerCase()
      const category = (obj?.category || '').toLowerCase()
      const matchesSearch =
        !term || title.includes(term) || desc.includes(term) || category.includes(term)
      const matchesCategory = !cat || category.includes(cat)
      const matchesPrice = inPriceRange(obj?.price, range)
      return matchesSearch && matchesCategory && matchesPrice
    }).length
  }, [product, searchkey, filterType, filterPrice])

  const hasActiveFilters = searchkey || filterType || filterPrice

  return (
    <div className={`w-full ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-xl p-6 mb-8`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h2 className={`text-xl font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Filter Products
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearchkey('')
              setFilterType('')
              setFilterPrice('')
            }}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              mode === 'dark' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-100 hover:bg-red-200 text-red-700'
            }`}
          >
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Filter */}
        <div className="space-y-2">
          <label className={`flex items-center space-x-2 text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <span>Search Products</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="searchkey"
              value={searchkey}
              onChange={(e) => setSearchkey(e.target.value)}
              placeholder="Search by product name..."
              className={`w-full px-4 py-3 pl-10 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                mode === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            {searchkey && (
              <button
                onClick={() => setSearchkey('')}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${mode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <span className="w-3 h-3" />
              </button>
            )}
          </div>
          {searchkey && (
            <p className={`text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Searching for "{searchkey}"
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className={`flex items-center space-x-2 text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <span>Category</span>
          </label>
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value.toLowerCase())}
              className={`w-full px-4 py-3 pl-10 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer ${
                mode === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <svg className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {filterType && (
            <p className={`text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Category: {filterType}
            </p>
          )}
        </div>

        {/* Price Filter */}
        <div className="space-y-2">
          <label className={`flex items-center space-x-2 text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <span>₹</span>
            <span>Price Range</span>
          </label>
          <div className="relative">
            <select
              value={filterPrice}
              onChange={handlePriceChange}
              className={`w-full px-4 py-3 pl-10 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer ${
                mode === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            >
              <option value="">All Prices</option>
              <option value="0-100">₹0 - ₹100</option>
              <option value="100-500">₹100 - ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="1000-5000">₹1000 - ₹5000</option>
              <option value="5000+">₹5000+</option>
            </select>
            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>₹</span>
            <svg className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {filterPrice && (
            <p className={`text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Price: {filterPrice === '5000+' ? '₹5000+' : `₹${filterPrice.replace('-', ' - ₹')}`}
            </p>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Active Filters:
            </span>
            {searchkey && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                mode === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
              }`}>
                Search: {searchkey}
                <button
                  onClick={() => setSearchkey('')}
                  className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                >
                  <span className="w-3 h-3" />
                </button>
              </span>
            )}
            {filterType && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                mode === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
              }`}>
                Category: {filterType}
                <button
                  onClick={() => setFilterType('')}
                  className="ml-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                >
                  <span className="w-3 h-3" />
                </button>
              </span>
            )}
            {filterPrice && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                mode === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
              }`}>
                Price: {filterPrice === '5000+' ? '₹5000+' : `₹${filterPrice.replace('-', ' - ₹')}`}
                <button
                  onClick={() => setFilterPrice('')}
                  className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                >
                  <span className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 text-center">
        <p className={`text-sm ${mode==='dark'?'text-gray-400':'text-gray-600'}`}>
          {filteredCount} products found
        </p>
      </div>
    </div>
  )
}

export default Filter