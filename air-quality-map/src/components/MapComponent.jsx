import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Popup from "./Popup";
import * as turf from "@turf/turf";
import { connect } from "react-redux";

function MapComponent({
  datas,
  stateClicked,
  buttonPressed,
  onButtonClick,
  sliderValue,
}) {
  const mapRef = useRef(null);
  let hoveredPolygonId = null;
  const [dataR, setDataR] = useState(datas[sliderValue]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({});
  const [hoveredState, setHoveredState] = useState(null);
  const [hoveredStateColor, setHoveredStateColor] = useState(null);

  //close button sidebar actions
  if (buttonPressed) {
    mapRef.current.flyTo({
      center: [-100.86857959024933, 38.482552979137004],
      zoom: 3, // Livello di zoom desiderato
      speed: 1.5, // Velocità dell'animazione
      curve: 1.5, // Curva di accelerazione dell'animazione
      essential: true, // Indica che questa animazione è essenziale per l'esperienza dell'utente
    });
    for (let i = 0; i < 50; i++) {
      mapRef.current.setFeatureState(
        { source: "aqi", id: i },
        { selected: false }
      );
    }
    onButtonClick();
  }

  /* useEffect(() => {
    console.log("update!!");
    dataR = datas[selectedDay];
  }, [selectedDay]); */

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYy1naWFuIiwiYSI6ImNsanB3MXVjdTAwdmUzZW80OWwxazl2M2EifQ.O0p5OWTAIw07QDYHYTH1rw";
    const map = new mapboxgl.Map({
      container: "map",
      //style: "mapbox://styles/c-gian/clk5ue5ru00ij01pd1w9k89ek?fresh=true",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-98.30953630020429, 38.75491131673913],
      minZoom: 2,
      zoom: 2.5,
      attributionControl: false,
      logoPosition: "top-left",
    });
    mapRef.current = map;

    const zoomThreshold = 3;

    map.on("load", () => {
      let show = false;
      map.style.stylesheet.layers.forEach(function (layer) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(
            layer.id,
            "visibility",
            show ? "visible" : "none"
          );
        }
      });

      //map.addControl(new NavigationControl(), "top-right");

      map.addSource("aqi", {
        type: "geojson",
        data: dataR,
      });

      map.addLayer({
        id: "country-aqi",
        source: "aqi",
        maxzoom: zoomThreshold,
        type: "fill",
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "countryAQI"],
            0,
            "#FFFFFF",
            16.8,
            "#00ff04",
            33.4,
            "#a2ff00",
            50,
            "#bbff00",

            51,
            "#f6ff00",
            67.4,
            "#ffea00",
            83.7,
            "#ffd000",
            100,
            "#ffb300",

            101,
            "#ff9900",
            117.4,
            "#ff8000",
            133.7,
            "#ff6600",
            150,
            "#ff4800",

            151,
            "#ff0000",
            167.4,
            "#ff003c",
            183.7,
            "#ff0066",
            200,
            "#d6006f",

            201,
            "#db0072",
            220.8,
            "#b50460",
            240.6,
            "#9e0253",
            260.4,
            "#8a0349",
            280.2,
            "#7a0140",
            300,
            "#690137",

            301,
            "#57012d",
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.75,
          ],
        },
      });

      map.addLayer({
        id: "state-aqi",
        source: "aqi",
        minzoom: zoomThreshold,
        type: "fill",
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "AQI"],
            0,
            "#FFFFFF",
            16.8,
            "#00ff04",
            33.4,
            "#a2ff00",
            50,
            "#bbff00",

            51,
            "#f6ff00",
            67.4,
            "#ffea00",
            83.7,
            "#ffd000",
            100,
            "#ffb300",

            101,
            "#ff9900",
            117.4,
            "#ff8000",
            133.7,
            "#ff6600",
            150,
            "#ff4800",

            151,
            "#ff0000",
            167.4,
            "#ff003c",
            183.7,
            "#ff0066",
            200,
            "#d6006f",

            201,
            "#db0072",
            220.8,
            "#b50460",
            240.6,
            "#9e0253",
            260.4,
            "#8a0349",
            280.2,
            "#7a0140",
            300,
            "#690137",

            301,
            "#57012d",
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.75,
          ],
        },
      });

      map.addLayer({
        id: "state-outline-layer",
        minzoom: zoomThreshold,
        type: "line",
        interactive: false,
        source: "aqi",
        paint: {
          "line-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            "white", // Stato selezionato: bianco
            "black", // Stato non selezionato: nero
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "selected"], false], // Lo stato selezionato avrà true per 'selected'
            4, // Larghezza del contorno per lo stato selezionato (modifica questo valore come preferisci)
            0.1, // Larghezza del contorno per gli stati non selezionati
          ],
        },
      });

      /* map.addLayer({
        id: "state-aqi-line",
        source: "aqi",
        minzoom: zoomThreshold,
        type: "line",
        interactive: false,
        paint: {
          "line-opacity": 0.3, // Opacità delle linee dei confini
          "line-color": "#212121", // Colore delle linee dei confini
          "line-width": 0.5, // Spessore delle linee dei confini
        },
      }); */
    });
  }, []); //dataR added to prevent map to be black at the start, if problems delete this

  useEffect(() => {
    mapRef.current.on("mousemove", "state-aqi", (e) => {
      mapRef.current.getCanvas().style.cursor = "pointer";
      if (e.features.length > 0) {
        if (hoveredPolygonId == null) {
          hoveredPolygonId = e.features[0].id;
          mapRef.current.setFeatureState(
            { source: "aqi", id: hoveredPolygonId },
            { hover: true }
          );
          setHoveredState([dataR.features[e.features[0].id], false]);
          setHoveredStateColor(e.features[0].layer.paint["fill-color"]);
        } else if (e.features[0].id != hoveredPolygonId) {
          mapRef.current.setFeatureState(
            { source: "aqi", id: hoveredPolygonId },
            { hover: false }
          );
          hoveredPolygonId = e.features[0].id;
          mapRef.current.setFeatureState(
            { source: "aqi", id: hoveredPolygonId },
            { hover: true }
          );
          setHoveredState([dataR.features[e.features[0].id], false]);
          setHoveredStateColor(e.features[0].layer.paint["fill-color"]);
        }
        setPopupPosition({
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY,
        });
        setShowPopup(true);
      }
    });

    mapRef.current.on("mouseleave", "state-aqi", () => {
      mapRef.current.getCanvas().style.cursor = "";
      setShowPopup(false);
      setHoveredState({});
      setHoveredStateColor({});
      if (hoveredPolygonId !== null) {
        mapRef.current.setFeatureState(
          { source: "aqi", id: hoveredPolygonId },
          { hover: false }
        );
      }
      hoveredPolygonId = null;
    });

    mapRef.current.on("mousemove", "country-aqi", (e) => {
      mapRef.current.getCanvas().style.cursor = "pointer";
      if (e.features.length > 0) {
        for (let i = 0; i < 50; i++) {
          mapRef.current.setFeatureState(
            { source: "aqi", id: i },
            { hover: true }
          );
        }
        setHoveredState([dataR.features[e.features[0].id], true]);
        setHoveredStateColor(e.features[0].layer.paint["fill-color"]);
        setPopupPosition({
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY,
        });
        setShowPopup(true);
      }
    });

    mapRef.current.on("mouseleave", "country-aqi", () => {
      mapRef.current.getCanvas().style.cursor = "";
      setShowPopup(false);
      setHoveredState({});
      setHoveredStateColor({});
      for (let i = 0; i < 50; i++) {
        mapRef.current.setFeatureState(
          { source: "aqi", id: i },
          { hover: false }
        );
      }
      hoveredPolygonId = null;
    });

    mapRef.current.on("click", "state-aqi", (e) => {
      e.preventDefault();
      const stateInfos = {
        datas: datas,
        id: e.features[0].id,
        isState: true,
        //color: e.features[0], //.layer.paint["fill-color"],
      };
      for (let i = 0; i < 50; i++) {
        mapRef.current.setFeatureState(
          { source: "aqi", id: i },
          { selected: false }
        );
      }
      mapRef.current.setFeatureState(
        { source: "aqi", id: e.features[0].id },
        { selected: true }
      );
      stateClicked(stateInfos);
      const center = turf.center(e.features[0].geometry).geometry.coordinates;

      // Esegui l'animazione di zoom e panoramica verso il centro dello stato
      mapRef.current.flyTo({
        center: center,
        zoom: 4, // Livello di zoom desiderato
        speed: 1.5, // Velocità dell'animazione
        curve: 1.5, // Curva di accelerazione dell'animazione
        essential: true, // Indica che questa animazione è essenziale per l'esperienza dell'utente
      });
    });

    mapRef.current.on("click", "country-aqi", (e) => {
      e.preventDefault();
      const stateInfos = {
        datas: datas,
        id: e.features[0].id,
        isState: false,
        //color: e.features[0].layer.paint["fill-color"],
      };
      stateClicked(stateInfos);
      const center = [-108.15050813778196, 43.20742527199025];

      // Esegui l'animazione di zoom e panoramica verso il centro dello stato
      mapRef.current.flyTo({
        center: center,
        zoom: 2.5, // Livello di zoom desiderato
        speed: 1.5, // Velocità dell'animazione
        curve: 1.5, // Curva di accelerazione dell'animazione
        essential: true, // Indica che questa animazione è essenziale per l'esperienza dell'utente
      });
    });

    mapRef.current.on("click", (e) => {
      if (e.defaultPrevented === false) {
        mapRef.current.flyTo({
          center: [-100.86857959024933, 38.482552979137004],
          zoom: 2, // Livello di zoom desiderato
          speed: 1.5, // Velocità dell'animazione
          curve: 1.5, // Curva di accelerazione dell'animazione
          essential: true, // Indica che questa animazione è essenziale per l'esperienza dell'utente
        });
        onButtonClick();
      }
    });

    mapRef.current.on("dragstart", () => {
      setShowPopup(false);
      setHoveredState({});
      setHoveredStateColor({});
      if (hoveredPolygonId !== null) {
        mapRef.current.setFeatureState(
          { source: "aqi", id: hoveredPolygonId },
          { hover: false }
        );
      }
      hoveredPolygonId = null;
    });
  }, [dataR]);

  useEffect(() => {
    if (
      !mapRef.current ||
      sliderValue < 0 ||
      sliderValue > 6 ||
      !mapRef.current.getSource("aqi")
    )
      return;
    setDataR(datas[sliderValue]);
    mapRef.current.getSource("aqi").setData(datas[sliderValue]);
  }, [sliderValue]);

  return (
    <div>
      <div id="map"></div>
      {showPopup && (
        <Popup
          x={popupPosition.x}
          y={popupPosition.y}
          hoveredState={hoveredState}
          hoveredStateColor={hoveredStateColor}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    sliderValue: state.sliderValue,
  };
};

export default connect(mapStateToProps)(MapComponent);
