//Shanto
import React from "react";
import { countries } from "country-data";
import SearchBar from '../../../../Scripts/src/components/elements/searchBar.js';// "../elements/searchBar";
import WeatherIcon from "../../../../Scripts/src/components/elements/WeatherIcon";
import LocationBox from "../../../../Scripts/src/components/elements/LocationBox";
import WeatherInfo from "../../../../Scripts/src/components/elements/WeatherInfo";
import { StyledSidebar } from '../../../../Scripts/src/styles/index.js';

const Sidebar = ({
    findCoordinates,
    searchCallback,
    image,
    titleLocation,
    error,
    data,
    unitTemp,
}) => {
    return (
        <StyledSidebar>
            <SearchBar
                findCoordinates={findCoordinates}
                searchCallback={searchCallback}
                error={error}
            />
            {data.weather[0] && <WeatherIcon icon={data.weather[0].icon} />}
            <WeatherInfo data={data} unit={unitTemp} />
            {titleLocation.country && (
                <LocationBox
                    image={image}
                    titleLocation={
                        titleLocation.city + ", " + countries[titleLocation.country].name
                    }
                />
            )}
        </StyledSidebar>
    );
};

export default Sidebar;
