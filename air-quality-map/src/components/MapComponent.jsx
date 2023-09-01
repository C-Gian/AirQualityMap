import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Popup from "./Popup";
import * as turf from "@turf/turf";
import { setCurrentLayer, setSidebar } from "../actions/index.js";
import { useDispatch, useSelector } from "react-redux";
import { WindLayer, ScalarFill } from "@sakitam-gis/mapbox-wind";
import axios from "axios";

function MapComponent({ datas, dotsDatas, windDatas, stateClicked }) {
  const mapRef = useRef(null);
  let hoveredPolygonId = null;
  const zoomThreshold = 3;
  const dispatch = useDispatch();
  const sliderValue = useSelector((state) => state.sliderValue);
  const currentLayer = useSelector((state) => state.currentLayer);
  const layerToShow = useSelector((state) => state.layerToShow);
  const wind = useSelector((state) => state.wind);
  const windHeatmap = useSelector((state) => state.windHeatmap);
  const map3D = useSelector((state) => state.map3d);
  const nightMode = useSelector((state) => state.nightMode);
  const colorBlind = useSelector((state) => state.colorBlindMode);
  const sidebar = useSelector((state) => state.sidebar);
  const [dataR, setDataR] = useState(datas[sliderValue]);
  const [dataRDots, setDataRDots] = useState(dotsDatas[sliderValue + 1]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({});
  const [hoveredState, setHoveredState] = useState(null);
  const [hoveredStateColor, setHoveredStateColor] = useState(null);
  const colorsLayers = colorBlind
    ? [
        0,
        "rgba(255, 255, 255, 1)",
        20,
        "rgba(240, 240, 255, 1)",
        40,
        "rgba(208, 208, 255, 1)",
        60,
        "rgba(176, 176, 255, 1)",
        80,
        "rgba(144, 144, 255, 1)",
        100,
        "rgba(112, 112, 255, 1)",
        120,
        "rgba(80, 80, 255, 1)",
        140,
        "rgba(48, 48, 255, 1)",
        160,
        "rgba(16, 16, 255, 1)",
        180,
        "rgba(0, 0, 255, 1)",
      ]
    : [
        0,
        "rgba(255, 255, 255, 1)",
        16.8,
        "rgba(0, 255, 4, 1)",
        33.4,
        "rgba(162, 255, 0, 1)",
        50,
        "rgba(187, 255, 0, 1)",

        51,
        "rgba(246, 255, 0, 1)",
        67.4,
        "rgba(255, 234, 0, 1)",
        83.7,
        "rgba(255, 208, 0, 1)",
        100,
        "rgba(255, 179, 0, 1)",

        101,
        "rgba(255, 153, 0, 1)",
        117.4,
        "rgba(255, 128, 0, 1)",
        133.7,
        "rgba(255, 102, 0, 1)",
        150,
        "rgba(255, 72, 0, 1)",

        151,
        "rgba(255, 0, 0, 1)",
        167.4,
        "rgba(255, 0, 60, 1)",
        183.7,
        "rgba(255, 0, 102, 1)",
        200,
        "rgba(214, 0, 111, 1)",

        201,
        "rgba(219, 0, 114, 1)",
        220.8,
        "rgba(181, 4, 96, 1)",
        240.6,
        "rgba(158, 2, 83, 1)",
        260.4,
        "rgba(138, 3, 73, 1)",
        280.2,
        "rgba(122, 1, 64, 1)",
        300,
        "rgba(105, 1, 55, 1)",

        301,
        "rgba(87, 1, 45, 1)",
      ];

  useEffect(() => {
    if (mapRef.current && mapRef.current.getStyle()) {
      mapRef.current.getStyle().layers.forEach((layer) => {
        if (
          layer.id == "glowy-things-1" ||
          layer.id == "glowy-things-2" ||
          layer.id == "glowy-things-3" ||
          (layer.source == "aqi" && layer.type !== "line") ||
          layer.id == "heatmap-layer"
        ) {
          mapRef.current.setLayoutProperty(layer.id, "visibility", "none");
        }
      });
      switch (layerToShow) {
        case "AQI":
          mapRef.current.setLayoutProperty(
            "state-aqi",
            "visibility",
            "visible"
          );
          mapRef.current.setLayoutProperty(
            "country-aqi",
            "visibility",
            "visible"
          );
          break;
        case "PM2.5":
          mapRef.current.setLayoutProperty(
            "state-pm2.5-aqi",
            "visibility",
            "visible"
          );
          break;
        case "PM10":
          mapRef.current.setLayoutProperty(
            "state-pm10-aqi",
            "visibility",
            "visible"
          );
          break;
        case "OZONE":
          mapRef.current.setLayoutProperty(
            "state-ozone-aqi",
            "visibility",
            "visible"
          );
          break;
        case "NO2":
          mapRef.current.setLayoutProperty(
            "state-no2-aqi",
            "visibility",
            "visible"
          );
          break;
        case "CO":
          mapRef.current.setLayoutProperty(
            "state-co-aqi",
            "visibility",
            "visible"
          );
          break;
        case "SO2":
          mapRef.current.setLayoutProperty(
            "state-so2-aqi",
            "visibility",
            "visible"
          );
          break;
        case "DOTS":
          mapRef.current.setLayoutProperty(
            "glowy-things-1",
            "visibility",
            "visible"
          );
          mapRef.current.setLayoutProperty(
            "glowy-things-2",
            "visibility",
            "visible"
          );
          mapRef.current.setLayoutProperty(
            "glowy-things-3",
            "visibility",
            "visible"
          );
          break;
        case "HEAT":
          mapRef.current.setLayoutProperty(
            "heatmap-layer",
            "visibility",
            "visible"
          );
          break;
      }
    }
  }, [layerToShow]);

  useEffect(() => {
    if (mapRef.current) {
      if (wind) {
        //window.windLayer.stop();
        window.windLayer.setWindOptions({
          colorScale: nightMode
            ? [
                "rgb(255, 255, 255)", // Bianco
                "rgb(220, 235, 255)",
                "rgb(190, 215, 245)",
                "rgb(160, 195, 235)",
                "rgb(130, 175, 225)",
                "rgb(100, 155, 215)",
                "rgb(75, 135, 205)",
                "rgb(50, 115, 195)",
                "rgb(30, 95, 185)",
                "rgb(15, 75, 175)",
                "rgb(5, 55, 165)",
                "rgb(1, 40, 155)",
                "rgb(2, 25, 145)",
                "rgb(1, 15, 135)",
                "rgb(0, 5, 125)",
                "rgb(0, 0, 115)", // Blu scuro
              ]
            : [
                "rgb(240, 250, 255)",
                "rgb(200, 230, 255)",
                "rgb(160, 210, 255)",
                "rgb(120, 190, 255)",
                "rgb(80, 170, 255)",
                "rgb(40, 150, 255)",
                "rgb(0, 130, 255)",
                "rgb(0, 110, 255)",
                "rgb(0, 90, 255)",
                "rgb(0, 70, 255)",
                "rgb(0, 50, 255)",
                "rgb(0, 30, 255)",
                "rgb(0, 10, 255)",
                "rgb(0, 0, 255)",
                "rgb(0, 0, 200)",
              ],
          /* colorScale: [
            "rgb(36,104, 180)",
            "rgb(60,157, 194)",
            "rgb(128,205,193 )",
            "rgb(151,218,168 )",
            "rgb(198,231,181)",
            "rgb(238,247,217)",
            "rgb(255,238,159)",
            "rgb(252,217,125)",
            "rgb(255,182,100)",
            "rgb(252,150,75)",
            "rgb(250,112,52)",
            "rgb(245,64,32)",
            "rgb(237,45,28)",
            "rgb(220,24,32)",
            "rgb(180,0,35)",
          ], */
          frameRate: 25, //speed
          maxAge: 60,
          globalAlpha: 0.9,
          velocityScale: 0.03, //single particles length
          paths: 3000,
        });
      } else {
        //window.windLayer.render();
        window.windLayer.setWindOptions({
          colorScale: nightMode
            ? [
                "rgb(255, 255, 255)", // Bianco
                "rgb(220, 235, 255)",
                "rgb(190, 215, 245)",
                "rgb(160, 195, 235)",
                "rgb(130, 175, 225)",
                "rgb(100, 155, 215)",
                "rgb(75, 135, 205)",
                "rgb(50, 115, 195)",
                "rgb(30, 95, 185)",
                "rgb(15, 75, 175)",
                "rgb(5, 55, 165)",
                "rgb(1, 40, 155)",
                "rgb(2, 25, 145)",
                "rgb(1, 15, 135)",
                "rgb(0, 5, 125)",
                "rgb(0, 0, 115)", // Blu scuro
              ]
            : [
                "rgb(240, 250, 255)",
                "rgb(200, 230, 255)",
                "rgb(160, 210, 255)",
                "rgb(120, 190, 255)",
                "rgb(80, 170, 255)",
                "rgb(40, 150, 255)",
                "rgb(0, 130, 255)",
                "rgb(0, 110, 255)",
                "rgb(0, 90, 255)",
                "rgb(0, 70, 255)",
                "rgb(0, 50, 255)",
                "rgb(0, 30, 255)",
                "rgb(0, 10, 255)",
                "rgb(0, 0, 255)",
                "rgb(0, 0, 200)",
              ],
          /* colorScale: [
            "rgb(36,104, 180)",
            "rgb(60,157, 194)",
            "rgb(128,205,193 )",
            "rgb(151,218,168 )",
            "rgb(198,231,181)",
            "rgb(238,247,217)",
            "rgb(255,238,159)",
            "rgb(252,217,125)",
            "rgb(255,182,100)",
            "rgb(252,150,75)",
            "rgb(250,112,52)",
            "rgb(245,64,32)",
            "rgb(237,45,28)",
            "rgb(220,24,32)",
            "rgb(180,0,35)",
          ], */
          frameRate: 25,
          maxAge: 60,
          globalAlpha: 0.9,
          velocityScale: 0.03,
          paths: 0,
        });
      }
    }
  }, [wind]);

  useEffect(() => {
    if (mapRef.current) {
      if (windHeatmap) {
        mapRef.current.setLayoutProperty("wind-fill", "visibility", "visible");
      } else {
        mapRef.current.setLayoutProperty("wind-fill", "visibility", "none");
      }
    }
  }, [windHeatmap]);

  useEffect(() => {
    if (!sidebar && mapRef.current) {
      if (currentLayer == "country") {
        mapRef.current.flyTo({
          center: [-100.86857959024933, 38.482552979137004],
          zoom: 2, // Livello di zoom desiderato
          speed: 1.5, // Velocità dell'animazione
          curve: 1.5, // Curva di accelerazione dell'animazione
          essential: true, // Indica che questa animazione è essenziale per l'esperienza dell'utente
        });
      } else {
        mapRef.current.flyTo({
          center: [-100.86857959024933, 38.482552979137004],
          zoom: 3, // Livello di zoom desiderato
          speed: 1.5, // Velocità dell'animazione
          curve: 1.5, // Curva di accelerazione dell'animazione
          essential: true, // Indica che questa animazione è essenziale per l'esperienza dell'utente
        });
      }
    }
  }, [sidebar]);

  useEffect(() => {
    dispatch(setCurrentLayer("country"));
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYy1naWFuIiwiYSI6ImNsanB3MXVjdTAwdmUzZW80OWwxazl2M2EifQ.O0p5OWTAIw07QDYHYTH1rw";
    let style = "mapbox://styles/mapbox/dark-v10";
    if (map3D) {
      style = nightMode
        ? "mapbox://styles/mapbox/dark-v11" //3d map
        : "mapbox://styles/mapbox/light-v11"; //3d map
    } else {
      style = nightMode
        ? "mapbox://styles/mapbox/dark-v10" //2d map
        : "mapbox://styles/mapbox/light-v10"; //2d map
    }
    const map = new mapboxgl.Map({
      container: "map",
      //style: "mapbox://styles/c-gian/clk5ue5ru00ij01pd1w9k89ek?fresh=true",
      style: style,
      center: [-98.30953630020429, 38.75491131673913],
      minZoom: 0,
      zoom: 1,
      pitch: 0, // Imposta il pitch a 0 per ottenere una vista 2D
      bearing: 0,
      attributionControl: false,
      logoPosition: "top-left",
    });
    mapRef.current = map;

    const scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: "imperial",
    });
    map.addControl(scale, "top-right");
    scale.setUnit("metric");

    /* map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    ); */

    const nav = new mapboxgl.NavigationControl({
      visualizePitch: true,
      showCompass: false,
    });
    map.addControl(nav, "top-right");

    // Seleziona tutti gli elementi con la classe mapboxgl-ctrl-icon
    document.querySelectorAll(".mapboxgl-ctrl-icon").forEach((icon) => {
      icon.removeAttribute("title");
    });

    if (nightMode) {
      document.body.classList.add("night-mode");
    } else {
      document.body.classList.remove("night-mode");
    }

    map.doubleClickZoom.disable();

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

      map.addSource("aqi", {
        type: "geojson",
        data: dataR,
      });

      map.addSource("glowy-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: dataRDots.map((coord) => ({
            type: "Feature",
            geometry: coord.point.geometry,
          })),
        },
      });

      map.addLayer({
        id: "glowy-things-1",
        type: "circle",
        layout: {
          visibility: "none",
        },
        source: "glowy-source",
        paint: {
          "circle-radius": 10,
          "circle-color": "rgb(0, 255, 0)", //"rgb(255, 50, 0)",
          "circle-opacity": 0.4,
          "circle-blur": 3,
        },
      });

      // Aggiungi il secondo layer "Glowy things 2"
      map.addLayer({
        id: "glowy-things-2",
        type: "circle",
        layout: {
          visibility: "none",
        },
        source: "glowy-source",
        paint: {
          "circle-radius": 5,
          "circle-color": "rgb(0, 255, 0)", //"rgb(255, 50, 0)",
          "circle-opacity": 0.4,
          "circle-blur": 3,
        },
      });

      // Aggiungi il terzo layer "Glowy things 3"
      map.addLayer({
        id: "glowy-things-3",
        type: "circle",
        layout: {
          visibility: "none",
        },
        source: "glowy-source",
        paint: {
          "circle-radius": 1,
          "circle-color": "white",
          "circle-opacity": 1,
          "circle-blur": 0,
        },
      });

      map.addLayer({
        id: "country-aqi",
        source: "aqi",
        maxzoom: zoomThreshold,
        type: "fill",
        layout: {
          visibility: "visible",
        },
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "countryAQI"],
            ...colorsLayers,
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            1,
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
            ...colorsLayers,
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.75,
          ],
          "fill-outline-color": "rgba(0, 0, 0, 1)",
        },
      });

      /* map.addLayer({
        id: "state-outline-layer",
        minzoom: zoomThreshold,
        type: "line",
        interactive: false,
        source: "aqi",
        layout: {
          visibility: "visible",
        },
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
            0.3, // Larghezza del contorno per gli stati non selezionati
          ],
        },
      }); */

      const layersToShow = [
        "state-pm2.5-aqi",
        "state-pm10-aqi",
        "state-ozone-aqi",
        "state-no2-aqi",
        "state-co-aqi",
        "state-so2-aqi",
      ];
      layersToShow.forEach((layer) => {
        map.addLayer({
          id: layer,
          source: "aqi",
          minzoom: zoomThreshold,
          layout: {
            visibility: "none",
          },
          type: "fill",
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", layer],
              ...colorsLayers,
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              0.75,
            ],
            "fill-outline-color": "rgba(0, 0, 0, 1)",
          },
        });
      });

      const color = {
        temp: [
          [203, [115, 70, 105, 255]],
          [218, [202, 172, 195, 255]],
          [233, [162, 70, 145, 255]],
          [248, [143, 89, 169, 255]],
          [258, [157, 219, 217, 255]],
          [265, [106, 191, 181, 255]],
          [269, [100, 166, 189, 255]],
          [273.15, [93, 133, 198, 255]],
          [274, [68, 125, 99, 255]],
          [283, [128, 147, 24, 255]],
          [294, [243, 183, 4, 255]],
          [303, [232, 83, 25, 255]],
          [320, [71, 14, 0, 255]],
        ],
        wind: colorBlind
          ? [
              [0, [255, 255, 255, 255]], // Bianco
              [1, [204, 204, 255, 255]], // Blu Chiaro
              [3, [176, 176, 255, 255]], // Blu
              [5, [141, 141, 255, 255]], // Blu Scuro
              [7, [83, 83, 255, 255]], // Blu Molto Scuro
              [9, [53, 53, 255, 255]], // Blu Ultra Scuro
              [11, [0, 0, 255, 255]], // Blu Scuro Profondo
            ]
          : [
              [0, [98, 113, 183, 255]],
              [1, [57, 97, 159, 255]],
              [3, [74, 148, 169, 255]],
              [5, [77, 141, 123, 255]],
              [7, [83, 165, 83, 255]],
              [9, [53, 159, 53, 255]],
              [11, [167, 157, 81, 255]],
              [13, [159, 127, 58, 255]],
              [15, [161, 108, 92, 255]],
              [17, [129, 58, 78, 255]],
              [19, [175, 80, 136, 255]],
              [21, [117, 74, 147, 255]],
              [24, [109, 97, 163, 255]],
              [27, [68, 105, 141, 255]],
              [29, [92, 144, 152, 255]],
              [36, [125, 68, 165, 255]],
              [46, [231, 215, 215, 255]],
              [51, [219, 212, 135, 255]],
              [77, [205, 202, 112, 255]],
              [104, [128, 128, 128, 255]],
            ],
      };

      const windInterpolateColor = color.wind.reduce(
        (result, item, key) =>
          result.concat(item[0], "rgba(" + item[1].join(",") + ")"),
        []
      );

      const fillLayer = new ScalarFill(
        "wind-fill",
        {
          /* type: "jsonArray",
          data: windDatas[1].data, */
          type: "image",
          url: colorBlind ? "/wind-scalar-fill.png" : "/wind-scalar-fill.png",
          //url: "https://sakitam.oss-cn-beijing.aliyuncs.com/codepen/wind-layer/image/var_ugrd-var_vgrd.png",
          extent: [
            [-180, 85.051129],
            [-180, -85.051129],
            [180, 85.051129],
            [180, -85.051129],
          ],
          width: 1440,
          height: 720,
          uMin: -21.34380340576172,
          uMax: 30.7261962890625,
          vMin: -23.916271209716797,
          vMax: 24.693727493286133,
        },
        {
          styleSpec: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "value"],
              ...windInterpolateColor,
            ],
            opacity: 0.5,
          },
          wrapX: true,
          renderForm: "rg",
          widthSegments: 720,
          heightSegments: 360,
          // widthSegments: 1,
          // heightSegments: 1,
          displayRange: [0, 150],
          mappingRange: [0, 100000],
        }
      );

      map.addLayer(fillLayer);

      map.setLayoutProperty("wind-fill", "visibility", "none");

      window.windLayer = new WindLayer("wind", windDatas, {
        windOptions: {
          colorScale: nightMode
            ? [
                "rgb(255, 255, 255)", // Bianco
                "rgb(220, 235, 255)",
                "rgb(190, 215, 245)",
                "rgb(160, 195, 235)",
                "rgb(130, 175, 225)",
                "rgb(100, 155, 215)",
                "rgb(75, 135, 205)",
                "rgb(50, 115, 195)",
                "rgb(30, 95, 185)",
                "rgb(15, 75, 175)",
                "rgb(5, 55, 165)",
                "rgb(1, 40, 155)",
                "rgb(2, 25, 145)",
                "rgb(1, 15, 135)",
                "rgb(0, 5, 125)",
                "rgb(0, 0, 115)", // Blu scuro
              ]
            : [
                "rgb(240, 250, 255)",
                "rgb(200, 230, 255)",
                "rgb(160, 210, 255)",
                "rgb(120, 190, 255)",
                "rgb(80, 170, 255)",
                "rgb(40, 150, 255)",
                "rgb(0, 130, 255)",
                "rgb(0, 110, 255)",
                "rgb(0, 90, 255)",
                "rgb(0, 70, 255)",
                "rgb(0, 50, 255)",
                "rgb(0, 30, 255)",
                "rgb(0, 10, 255)",
                "rgb(0, 0, 255)",
                "rgb(0, 0, 200)",
              ],
          /* colorScale: [
            "rgb(36,104, 180)",
            "rgb(60,157, 194)",
            "rgb(128,205,193 )",
            "rgb(151,218,168 )",
            "rgb(198,231,181)",
            "rgb(238,247,217)",
            "rgb(255,238,159)",
            "rgb(252,217,125)",
            "rgb(255,182,100)",
            "rgb(252,150,75)",
            "rgb(250,112,52)",
            "rgb(245,64,32)",
            "rgb(237,45,28)",
            "rgb(220,24,32)",
            "rgb(180,0,35)",
          ], */
          frameRate: 25,
          maxAge: 60,
          globalAlpha: 0.9,
          velocityScale: 0.03,
          paths: 0,
        },
        fieldOptions: {
          wrapX: true,
        },
      });

      window.windLayer.addTo(map);

      map.addSource("heatmap-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: dataRDots.map((el) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: el.point.geometry.coordinates,
            },
            properties: {
              value: el.value,
            },
          })),
        },
      });

      map.addLayer({
        id: "heatmap-layer",
        type: "heatmap",
        source: "heatmap-source",
        layout: {
          visibility: "none",
        },
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "value"],
            0,
            0,
            1,
            1,
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            1,
            9,
            3,
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0, 0, 255, 0)",
            0.2,
            "royalblue",
            0.4,
            "cyan",
            0.6,
            "lime",
            0.8,
            "yellow",
            1,
            "red",
          ],
          "heatmap-opacity": 0.8,
        },
      });
    });

    return () => map.remove(); // Cleanup della mappa
  }, [nightMode, colorBlind, map3D]); //dataR added to prevent map to be black at the start, if problems delete this

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
          setHoveredState([dataR, e.features[0].id, false]);
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
          setHoveredState([dataR, e.features[0].id, false]);
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
        setHoveredState([dataR, e.features[0].id, true]);
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
        color: e.features[0].layer.paint["fill-color"],
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
      dispatch(setSidebar(true));
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
        color: e.features[0].layer.paint["fill-color"],
      };
      stateClicked(stateInfos);
      const center = [-108.15050813778196, 43.20742527199025];
      dispatch(setSidebar(true));
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
        dispatch(setSidebar(false));
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

    mapRef.current.on("zoom", () => {
      if (mapRef.current.getZoom() < zoomThreshold) {
        dispatch(setCurrentLayer("country"));
      } else {
        dispatch(setCurrentLayer("state"));
      }
    });
  }, [dataR, nightMode, colorBlind, map3D]);

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
    const data = {
      type: "FeatureCollection",
      features: dotsDatas[sliderValue + 1].map((coord) => ({
        type: "Feature",
        geometry: coord.point.geometry,
      })),
    };
    setDataRDots(dotsDatas[sliderValue + 1]);
    mapRef.current.getSource("glowy-source").setData(data);
    mapRef.current.getSource("heatmap-source").setData(data);
  }, [sliderValue, nightMode, colorBlind, map3D, datas]);

  useEffect(() => {
    if (mapRef.current) {
      if (mapRef.current.getZoom() < zoomThreshold) {
        dispatch(setCurrentLayer("country"));
      } else {
        dispatch(setCurrentLayer("state"));
      }
    }
  }, [map3D]);

  return (
    <div style={{ zIndex: 0 }}>
      <div id="map"></div>
      {showPopup && (
        <Popup
          x={popupPosition.x}
          y={popupPosition.y}
          hoveredState={hoveredState}
          hoveredStateColor={hoveredStateColor}
          nightMode={nightMode}
          colorBlindMode={colorBlind}
        />
      )}
    </div>
  );
}

export default MapComponent;
