/* //aqi calculations
const aqi_breakpoints = [
    [0, 50],
    [51, 100],
    [101, 150],
    [151, 200],
    [201, 300],
    [301, 400],
    [401, 500],
  ];

function o3_aqi_calculator(o3_value) {
    const o3_breakpoints = [
      [0, 126.428],
      [160.714, 351.428],
      [437.142, 865.714],
      [1080, 1294.285],
    ];
    
    const C_P = o3_value;
    let aqiTotal = null;
    Object.keys(o3_breakpoints).forEach((key) => {
      if (C_P >= o3_breakpoints[key][0] && C_P <= o3_breakpoints[key][1]) {
        const BP_HI = o3_breakpoints[key][1];
        const BP_LO = o3_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }

  function pm25_aqi_calculator(pm25_value) {
    const pm25_breakpoints = [
      [0.0, 12.0],
      [12.1, 35.4],
      [35.5, 55.4],
      [55.5, 150.4],
      [150.5, 250.4],
      [250.5, 350.4],
      [350.5, 500.4],
    ];
    
    const C_P = pm25_value;
    let aqiTotal = null;

    Object.keys(pm25_breakpoints).forEach((key) => {
      if (C_P >= pm25_breakpoints[key][0] && C_P <= pm25_breakpoints[key][1]) {
        const BP_HI = pm25_breakpoints[key][1];
        const BP_LO = pm25_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }
  function pm10_aqi_calculator(pm10_value) {
    const pm10_breakpoints = [
      [0, 54],
      [55, 154],
      [155, 254],
      [255, 354],
      [355, 424],
      [425, 504],
      [505, 604],
    ];
    
    const C_P = pm10_value;
    let aqiTotal = null;
    Object.keys(pm10_breakpoints).forEach((key) => {
      if (C_P >= pm10_breakpoints[key][0] && C_P <= pm10_breakpoints[key][1]) {
        const BP_HI = pm10_breakpoints[key][1];
        const BP_LO = pm10_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }
  function co_aqi_calculator(co_value) {
    const co_breakpoints = [
      [0.0, 4.4],
      [4.5, 9.4],
      [9.5, 12.4],
      [12.5, 15.4],
      [15.5, 30.4],
      [30.5, 40.4],
      [40.5, 50.4],
    ];
    
    const C_P = co_value;
    let aqiTotal = null;
    Object.keys(co_breakpoints).forEach((key) => {
      if (C_P >= co_breakpoints[key][0] && C_P <= co_breakpoints[key][1]) {
        const BP_HI = co_breakpoints[key][1];
        const BP_LO = co_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }
  function so2_aqi_calculator(so2_value) {
    const so2_breakpoints = [
      [0, 53],
      [54, 100],
      [101, 360],
      [361, 649],
      [650, 1249],
      [1250, 1649],
      [1650, 2049],
    ];
    
    const C_P = so2_value;
    let aqiTotal = null;
    Object.keys(so2_breakpoints).forEach((key) => {
      if (C_P >= so2_breakpoints[key][0] && C_P <= so2_breakpoints[key][1]) {
        const BP_HI = so2_breakpoints[key][1];
        const BP_LO = so2_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }
  function no2_aqi_calculator(no2_value) {
    const no2_breakpoints = [
      [0, 50],
      [51, 100],
      [101, 150],
      [151, 200],
      [210, 300],
      [301, 400],
      [401, 500],
    ];
    
    const C_P = no2_value;
    let aqiTotal = null;
    Object.keys(no2_breakpoints).forEach((key) => {
      if (C_P >= no2_breakpoints[key][0] && C_P <= no2_breakpoints[key][1]) {
        const BP_HI = no2_breakpoints[key][1];
        const BP_LO = no2_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }
  function nox_aqi_calculator(nox_value) {
    const nox_breakpoints = [
      [0, 50],
      [51, 100],
      [101, 150],
      [151, 200],
      [210, 300],
      [301, 400],
      [401, 500],
    ];
    
    const C_P = nox_value;
    let aqiTotal = null;
    Object.keys(nox_breakpoints).forEach((key) => {
      if (C_P >= nox_breakpoints[key][0] && C_P <= nox_breakpoints[key][1]) {
        const BP_HI = nox_breakpoints[key][1];
        const BP_LO = nox_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }

  function no_aqi_calculator(no_value) {
    const no_breakpoints = [
      [0, 50],
      [51, 100],
      [101, 150],
      [151, 200],
      [210, 300],
      [301, 400],
      [401, 500],
    ];
    // C_P = the truncated concentration of pollutant
    // BP_HI = the concentration breakpoint that is greater than or equal to C_P
    // BP_LO = the concentration breakpoint that is less than or equal to C_P
    // I_HI = the AQI value corresponding to BP_HI
    // I_LO = the AQI value corresponding to BP_LO
    
    const C_P = no_value;
    let aqiTotal = null;
    Object.keys(no_breakpoints).forEach((key) => {
      if (C_P >= no_breakpoints[key][0] && C_P <= no_breakpoints[key][1]) {
        const BP_HI = no_breakpoints[key][1];
        const BP_LO = no_breakpoints[key][0];
        const I_HI = aqi_breakpoints[key][1];
        const I_LO = aqi_breakpoints[key][0];
        aqiTotal = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (C_P - BP_LO) + I_LO;
      }
    });
    return aqiTotal;
  }

  function AQICalculator(pollutant) {
    const parameter = pollutant[0];
    const value = pollutant[1];

    switch (parameter) {
      case "pm25":
        const aqi_pm25 = pm25_aqi_calculator(value);
        if (aqi_pm25 != null) {
          return aqi_pm25;
        }
        break;
      case "o3":
        const aqi_o3 = o3_aqi_calculator(value);
        if (aqi_o3 != null) {
          return aqi_o3;
        }
        break;
      case "pm10":
        const aqi_pm10 = pm10_aqi_calculator(value);
        if (aqi_pm10 != null) {
          return aqi_pm10;
        }
        break;
      case "co":
        const aqi_co = co_aqi_calculator(value);
        if (aqi_co != null) {
          return aqi_co;
        }
        break;
      case "so2":
        const aqi_so2 = so2_aqi_calculator(value);
        if (aqi_so2 != null) {
          return aqi_so2;
        }
        break;
      case "no2":
        const aqi_no2 = no2_aqi_calculator(value);
        if (aqi_no2 != null) {
          return aqi_no2;
        }
        break;
      case "no":
        const aqi_no = no_aqi_calculator(value);
        if (aqi_no != null) {
          return aqi_no;
        }
        break;
      case "nox":
        const aqi_nox = nox_aqi_calculator(value);
        if (aqi_nox != null) {
          return aqi_nox;
        }
        break;
    }
  } */

/* others API


//ambee - 100 richieste al giorno ma ogni richiesta ti da tutte le stazioni, problema è che tutte le stazioni = 5 stazioni
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.ambeedata.com/latest/by-country-code?countryCode=US",
          {
            headers: {
              "x-api-key":
                "4b9272ed189ece1ebc2d886d014ff08d763ce0c95c86325c8b97e9be27c25640",
              "Content-type": "application/json",
            },
          }
        );
        const data = response.data;
        console.log(data);
        setAirQualityData(data);
        console.log(data);
        console.log(data.stations[0].state);
        for (let i = 0; i < data2.features.length; i++) {
          if (data2.features[i].properties.name === data.stations[0].state) {
            data2.features[i].properties.population = data.stations[0].AQI;
          }
        } 
      } catch (error) {
        console.error("Error fetching air quality data:", error);
      }
    };

    fetchData();
  }, []); */

/* //waqi API - totalmente free? - una singola chiamata ottieni tutte stazioni ma hai solo AQI senza inquinanti
  const tokenaqicn = "551302aec928205074ba444ee505af1db545b83c";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.waqi.info/map/bounds/?latlng=24.396308,-125.000000,49.384358,-66.934570&token=${tokenaqicn}`
        );

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log("Errore durante il recupero dei dati:", error);
      }
    };

    fetchData();
  }, []); */

/* //openAQ API - max 300 richieste ogni 5m - una singola chiamata ottieni max 1000 stazioni ma con tutti gli inquinanti
  const OPENAQ_ENDPOINT =
    "https://api.openaq.org/v2/latest?limit=6000&offset=0&sort=desc&country_id=US&order_by=city&dumpRaw=false";
 */
