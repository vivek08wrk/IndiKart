import React, { useContext } from 'react'
import Layout from '../../Components/Layout/Layout'
import MyContext from '../../Context/data/MyContext'
import HeroSection from '../../Components/HeroSection/HeroSection'
import Filter from '../../Components/Filter/Filter'
import ProductCard from '../../Components/ProductCard/ProductCard'

import Testimonial from '../../Components/Testimonial/Testimonial'

import { useDispatch, useSelector } from 'react-redux'
import Track from '../../Components/Track/Track'

import { addToCart, deleteFromCart } from '../../Redux/CartSlice'


function Home() {
  const dispatch = useDispatch();
  const cartItem = useSelector((state)=> state.cart)

  console.log(cartItem)

  const addCart = () => {
    dispatch(addToCart("shirt"));
  }

  const deleteCart = () => {
    dispatch(deleteFromCart("shirt"));
  }
  return (
    <Layout>
 
      <HeroSection />
      <Filter />
      <ProductCard />
      <Track/>
      <Testimonial />

    </Layout>
  )
}

export default Home