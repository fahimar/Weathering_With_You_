//*** OPEN WEATHER & UNSPLASH KEYS****//
/*const API_APPID = process.env.REACT_APP_API_KEY_APPID;
const API_UNPSLASH = process.env.REACT_APP_API_KEY_UNSPLASH;



const API_URL_APPID = "";
const DEFAULT_URL = ``;
const SEARCH_BY_LOCATION = ``; 

const GET_NEXT_DAYS_HOURS = ``; 
const DEF_N_D_H = ``;
*/

//*** UNSPLASH ****//
/*
const URL_UNSPLASH = "";
const SEARCH_BY_WORD = ``;
const SEARCH_DEFAULT = ``;

export {
  API_URL_APPID,
  API_APPID,
  DEFAULT_URL,
  SEARCH_BY_LOCATION,
  SEARCH_BY_WORD,
  SEARCH_DEFAULT,
  GET_NEXT_DAYS_HOURS,
  DEF_N_D_H,
};

*/


//*** OPEN WEATHER & UNSPLASH KEYS****//
// Injected at build time from .env (see .env.example) via webpack.DefinePlugin — never hardcode
// real keys here, this file is committed to source control.
const API_APPID = process.env.REACT_APP_OPENWEATHER_KEY;
const API_UNPSLASH = process.env.REACT_APP_UNSPLASH_KEY;

const API_URL_APPID = "https://api.openweathermap.org/data/2.5/weather";
const DEFAULT_URL = `${API_URL_APPID}/?APPID=${API_APPID}&lat=23.777176&lon=90.399452`;
const SEARCH_BY_LOCATION = `${API_URL_APPID}?appid=${API_APPID}`; //&lat={lat}&lon={lon}


const GET_NEXT_DAYS_HOURS = `https://api.openweathermap.org/data/2.5/onecall?exclude=minutely&appid=${API_APPID}`; //&lat={lat}&lon={lon}
const DEF_N_D_H = `https://api.openweathermap.org/data/2.5/onecall?exclude=minutely&appid=${API_APPID}&lat=41.390205&lon=2.154007`;

//*** UNSPLASH ****//
const URL_UNSPLASH = "https://api.unsplash.com/search/photos";
const SEARCH_BY_WORD = `${URL_UNSPLASH}?client_id=${API_UNPSLASH}&page=1&query=`;
const SEARCH_DEFAULT = `${URL_UNSPLASH}?client_id=${API_UNPSLASH}&page=1&query=Bangladesh`;


export {
    API_URL_APPID,
    API_APPID,
    DEFAULT_URL,
    SEARCH_BY_LOCATION,
    SEARCH_BY_WORD,
    SEARCH_DEFAULT,
    GET_NEXT_DAYS_HOURS,
    DEF_N_D_H,
};

