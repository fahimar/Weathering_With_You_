import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
//include layout
import Header from './layouts/Header.js';
import Highlights from './layouts/Highlights';
import Sidebar from './layouts/Sidebar';
import Today from './layouts/Today';
import Week from './layouts/Week';
import Container from './layouts/Container';

//shanto
import Spinner from './elements/Spinner';
import SpinnerContainer from './elements/SpinnerContainer';
import { useCoordinations } from '../../../../hooks/useCoordinations';
import { useWeatherFetch } from '../../../../hooks/useWeatherFetch';
import { useImageFetch } from '../../../../hooks/useImageFetch';
import { SEARCH_BY_WORD } from '../index.js';
//shanto


import { StyledGlobal, StyledDashboard } from '../../styles/index.js';
import { themeLight, themeDark } from '../../constants/index.js';
import { useNightMode } from '../../../../hooks/useNightMode.js';
import { useTempUnit } from '../../../../hooks/UseTempUnit';

const Dashboard = () => {
    

    //Shanto

    const [nightMode, nightModeChanged] = useNightMode();
    const [unitMode, unitModeChanged] = useTempUnit();
    const [image, fetchImage] = useImageFetch();
    const [{ lat, long }, loadingLocation, findCoordinates] = useCoordinations();
    const [weather, loading, error, fetchWeather, searchByLocation, getWeatherLocation] = useWeatherFetch();
    const [showDays, setShowDays] = useState(false);
    const fetchCoordinates = () => {
        findCoordinates();
        getWeatherLocation(lat, long);
    }
    const nightModeCallback = () => {
        nightModeChanged();
    }
    const showDaysCallback = (enabled) => {
        setShowDays(enabled);
    }

    const doSearchLocation = (searchTerm) => {
        searchByLocation(searchTerm);
        fetchImage(`${SEARCH_BY_WORD}${weather.city}`);
    }
    const unitTempCallback = (enabled) => {
        unitModeChanged(enabled);
    }

    //console.log("location", lat, long);
    //console.log('Weather', weather);

    useEffect(() => {
        //default fetching..
        getWeatherLocation(lat, long);
        fetchImage(`${SEARCH_BY_WORD}${weather.city}`);
    }, [lat, long])

    if (!weather) return <ThemeProvider theme={nightMode ? themeDark : themeLight} ><Spinner /><StyledGlobal /></ThemeProvider>


    //Shanto

   
    return (
        
        //shanto
        <ThemeProvider theme={nightMode ? themeDark : themeLight} >
            <StyledDashboard>
                <Sidebar
                    findCoordinates={fetchCoordinates}
                    data={weather}
                    searchCallback={doSearchLocation}
                    error={error}
                    image={image}
                    titleLocation={weather}
                    unitTemp={unitMode}
                />
                <Container>
                    <Header
                        unitMode={unitMode}
                        unitTempCallback={unitTempCallback}
                        nightModeCallback={nightModeCallback}
                        nightMode={nightMode} showDaysCallback={showDaysCallback} showActive={showDays} />
                    {loading || loadingLocation ? <SpinnerContainer />
                        : <>
                            {!showDays ? (<Week data={weather.daily} tempUnit={unitMode} />)
                                : (<Today tempUnit={unitMode} data={weather.hourly} />)}
                            <Highlights data={weather.current} />
                        </>}
                </Container>
                <StyledGlobal />
            </StyledDashboard>
        </ThemeProvider>
        //shanto

    )
}
export default Dashboard;
