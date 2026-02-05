import React from 'react'
import Slider from 'react-slick'
import { Image } from 'antd'

const SliderComponent = ({ arrImage }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    }

    return (
        <Slider {...settings}>
            {arrImage.map((image, index) => (
                <div key={index}>
                    <Image 
                        src={image} 
                        alt={`slider-${index}`} 
                        preview={false} 
                        width="100%" 
                        height="400px"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            ))}
        </Slider>
    )
}

export default SliderComponent