import React from 'react'
import sushiImage from '../../assets/213-2.png'

function RestaurantGallery() {
  return (
    <div className='restaurant-gallery h-80 rounded-lg overflow-hidden shadow-lmd bg-cover bg-center bg-fixed' style={{backgroundImage: `url(${sushiImage})`}}>
    </div>
  )
}

export default RestaurantGallery 