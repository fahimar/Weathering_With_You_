import React from 'react';
import { StyledToday } from '../../../../Scripts/src/styles/index.js';
import { convertC, convertF } from '../../../../Scripts/src/helpers/index.js'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

//@import 'swiper-vars.scss';
import 'swiper/scss'
import 'swiper/scss/navigation'
import 'swiper/scss/pagination'

const Today = ({ data, tempUnit }) => (
    <StyledToday>
        <Swiper
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
                // when window width is >= 640px
                640: {
                    width: 640,
                    slidesPerView: 4,
                },
                // when window width is >= 768px
                768: {
                    width: 768,
                    slidesPerView: 5,
                },
                // when window width is >= 991px
                991: {
                    width: 991,
                    slidesPerView: 6,
                },
                // when window width is >= 1024px
                1024: {
                    width: 1024,
                    slidesPerView: 6,
                },
            }}
        //onSlideChange={() => console.log('slide change')}
        //onSwiper={(swiper) => console.log(swiper)}
        >
            {data && data.map((item, i) => (
                <SwiperSlide key={i.toString()}>
                    <div className="box_info" >
                        <div>{(new Date(item.dt * 1000)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                        <img src={'../../../../Scripts/src/images/v2/' + item.weather[0].icon + '.png'} alt={item.weather[0].description} />
                        <div className="temp_info">
                            <span>{tempUnit ? convertF(item.temp).toFixed(0) : convertC(item.temp).toFixed(0)}° {tempUnit ? "F" : "C"}</span>
                        </div>
                    </div>
                </SwiperSlide>))}
        </Swiper>
    </StyledToday>);

export default Today;

//{ '../../../../Scripts/src/images/v2/' + icon + '.png' }