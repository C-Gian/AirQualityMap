import React, { useEffect, useRef, useState } from "react";
import mapboxgl1 from "react-map-gl";
import mapboxgl from "mapbox-gl";

function HomePage() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYy1naWFuIiwiYSI6ImNsanB3MXVjdTAwdmUzZW80OWwxazl2M2EifQ.O0p5OWTAIw07QDYHYTH1rw";
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  const zoomThreshold = 4;
  const stateLegendEl = document.getElementById("state-legend");
  const countyLegendEl = document.getElementById("county-legend");
  map.on("zoom", () => {
    if (map.getZoom() > zoomThreshold) {
      stateLegendEl.style.display = "none";
      countyLegendEl.style.display = "block";
    } else {
      stateLegendEl.style.display = "block";
      countyLegendEl.style.display = "none";
    }
  });
  map.on("load", () => {
    // Add a custom vector tileset source. The tileset used in
    // this example contains a feature for every state and
    // county in the U.S.
    // Each state contains four properties. For example:
    //     {
    //         isState: true,
    //         name: "Wyoming",
    //         population: 584153,
    //         state: 56
    //     }
    // Each county contains four properties. For example:
    //     {
    //         county: 16049,
    //         isCounty: true,
    //         name: "Idaho County",
    //         population: 16315
    //     }
    map.addSource("population", {
      type: "vector",
      url: "mapbox://mapbox.660ui7x6",
    });

    map.addLayer(
      {
        id: "state-population",
        source: "population",
        "source-layer": "state_county_population_2014_cen",
        maxzoom: zoomThreshold,
        type: "fill",
        // only include features for which the "isState"
        // property is "true"
        filter: ["==", "isState", true],
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "population"],
            0,
            "#F2F12D",
            500000,
            "#EED322",
            750000,
            "#E6B71E",
            1000000,
            "#DA9C20",
            2500000,
            "#CA8323",
            5000000,
            "#B86B25",
            7500000,
            "#A25626",
            10000000,
            "#8B4225",
            25000000,
            "#723122",
          ],
          "fill-opacity": 0.75,
        },
      },
      "road-label-simple" // Add layer below labels
    );

    map.addLayer(
      {
        id: "county-population",
        source: "population",
        "source-layer": "state_county_population_2014_cen",
        minzoom: zoomThreshold,
        type: "fill",
        // only include features for which the "isCounty"
        // property is "true"
        filter: ["==", "isCounty", true],
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "population"],
            0,
            "#F2F12D",
            100,
            "#EED322",
            1000,
            "#E6B71E",
            5000,
            "#DA9C20",
            10000,
            "#CA8323",
            50000,
            "#B86B25",
            100000,
            "#A25626",
            500000,
            "#8B4225",
            1000000,
            "#723122",
          ],
          "fill-opacity": 0.75,
        },
      },
      "road-label-simple" // Add layer below labels
    );
  });
  function changeFunc1(ev) {
    ev.preventDefault();
    setMap(false);
  }
  function changeFunc2(ev) {
    ev.preventDefault();
    setMap(true);
  }
  return (
    <div>
      <div className="relative ">
        <div className="absolute top-1 left-1 gap-3 bg-gray-500 items-center border border-gray-400 rounded-2xl p-1">
          <div onClick={(ev) => changeFunc2(ev)} className="p-1 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
              />
            </svg>
          </div>
          <div onClick={(ev) => changeFunc1(ev)} className="p-1 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
              />
            </svg>
          </div>
        </div>
      </div>
      {/* <div className="w-full h-full">
        {map && (
          <img
            className="w-full h-full object-cover"
            src="https://www.react-simple-maps.io/images/cover-lg.jpg"
          ></img>
        )}
        {!map && (
          <img
            className="w-full h-full object-cover"
            src="https://preview.redd.it/chhrw4vdnq241.png?width=1558&format=png&auto=webp&s=527fbbdec25923e985aba1dc2cb765e5bf6271fe"
          ></img>
        )}
      </div> */}
      <div id="map"></div>
      <div id="state-legend" class="legend">
        <h4>Population</h4>
        <div>
          <span style="background-color: #723122"></span>25,000,000
        </div>
        <div>
          <span style="background-color: #8b4225"></span>10,000,000
        </div>
        <div>
          <span style="background-color: #a25626"></span>7,500,000
        </div>
        <div>
          <span style="background-color: #b86b25"></span>5,000,000
        </div>
        <div>
          <span style="background-color: #ca8323"></span>2,500,000
        </div>
        <div>
          <span style="background-color: #da9c20"></span>1,000,000
        </div>
        <div>
          <span style="background-color: #e6b71e"></span>750,000
        </div>
        <div>
          <span style="background-color: #eed322"></span>500,000
        </div>
        <div>
          <span style="background-color: #f2f12d"></span>0
        </div>
      </div>

      <div id="county-legend" class="legend" style="display: none">
        <h4>Population</h4>
        <div>
          <span style="background-color: #723122"></span>1,000,000
        </div>
        <div>
          <span style="background-color: #8b4225"></span>500,000
        </div>
        <div>
          <span style="background-color: #a25626"></span>100,000
        </div>
        <div>
          <span style="background-color: #b86b25"></span>50,000
        </div>
        <div>
          <span style="background-color: #ca8323"></span>10,000
        </div>
        <div>
          <span style="background-color: #da9c20"></span>5,000
        </div>
        <div>
          <span style="background-color: #e6b71e"></span>1,000
        </div>
        <div>
          <span style="background-color: #eed322"></span>100
        </div>
        <div>
          <span style="background-color: #f2f12d"></span>0
        </div>
      </div>
    </div>
  );
}

export default HomePage;
