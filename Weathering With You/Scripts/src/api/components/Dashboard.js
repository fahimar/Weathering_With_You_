import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
//include layout
import Header from '../../../Scripts/src/components/layouts/Header.js';
import Highlights from '../../../Scripts/src/components/layouts/Highlights';
import Sidebar from '../../../Scripts/src/components/layouts/Sidebar';
import Today from '../../../Scripts/src/components/layouts/Today';
import Week from '../../../Scripts/src/components/layouts/Week';
import Container from '../../../Scripts/src/components/layouts/Container';

//shanto
import Spinner from '../../../Scripts/src/components/elements/Spinner';
import SpinnerContainer from '../../../Scripts/src/components/elements/SpinnerContainer';
import { useCoordinations } from '../../../Scripts/src/hooks/useCoordinations';
import { useWeatherFetch } from '../../../Scripts/src/hooks/useWeatherFetch';
import { useImageFetch } from '../../../Scripts/src/hooks/useImageFetch';
import { SEARCH_BY_WORD } from '../../../Scripts/src/api/index.js';
//shanto


import { StyledGlobal, StyledDashboard } from '../../../Scripts/src/styles/index.js';
import { themeLight, themeDark } from '../../../Scripts/src/constants/index.js';
import { useNightMode } from '../../../Scripts/src/hooks/useNightMode.js';
import { useTempUnit } from '../../../Scripts/src/hooks/UseTempUnit';

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
