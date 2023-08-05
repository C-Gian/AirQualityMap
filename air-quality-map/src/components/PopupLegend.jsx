import React from "react";

function PopupLegend({ position, colorBlind }) {
  const startColor = colorBlind ? "rgba(0, 147, 0, 1)" : "#00D900";
  const mid1Color = colorBlind ? "rgba(181, 140, 0, 1)" : "#B5B500";
  const mid2Color = colorBlind ? "rgba(245, 116, 0, 1)" : "#F57300";
  const mid3Color = colorBlind ? "rgba(245, 0, 0, 1)" : "#F50000";
  const mid4Color = colorBlind ? "rgba(131, 52, 140, 1)" : "#83328C";
  const endColor = colorBlind ? "rgba(115, 0, 23, 1)" : "#730017";
  // Ottieni il colore associato al valore fornito
  return (
    <div
      className="absolute w-500 h-fit bg-gray-700 rounded-lg flex-col"
      style={{ top: position.y - 500, left: position.x - 510 }}
    >
      <div className="flex p-3 items-center">
        <div
          className="w-4 h-4 mr-5"
          style={{ background: `${startColor}` }}
        ></div>
        <h2 className="text-white">
          Air quality is satisfactory, and air pollution poses little or no risk
        </h2>
      </div>
      <div className="flex p-3 items-center">
        <div
          className="w-4 h-4 mr-5 flex-shrink-0"
          style={{ background: `${mid1Color}` }}
        ></div>
        <h2 className="text-white">
          Air quality is acceptable. However, there may be a risk for some
          people, particularly those who are unusually sensitive to air
          pollution
        </h2>
      </div>
      <div className="flex p-3 items-center">
        <div
          className="w-4 h-4 mr-5  flex-shrink-0"
          style={{ background: `${mid2Color}` }}
        ></div>
        <h2 className="text-white">
          Members of sensitive groups may experience health effects. The general
          public is less likely to be affected
        </h2>
      </div>
      <div className="flex p-3 items-center">
        <div
          className="w-4 h-4 mr-5  flex-shrink-0"
          style={{ background: `${mid3Color}` }}
        ></div>
        <h2 className="text-white">
          Some members of the general public may experience health effects;
          members of sensitive groups may experience more serious health effects
        </h2>
      </div>
      <div className="flex p-3 items-center">
        <div
          className="w-4 h-4 mr-5  flex-shrink-0"
          style={{ background: `${mid4Color}` }}
        ></div>
        <h2 className="text-white">
          Health alert: The risk of health effects is increased for everyone
        </h2>
      </div>
      <div className="flex p-3 items-center">
        <div
          className="w-4 h-4 mr-5  flex-shrink-0"
          style={{ background: `${endColor}` }}
        ></div>
        <h2 className="text-white">
          Health warning of emergency conditions: everyone is more likely to be
          affected
        </h2>
      </div>
    </div>
  );
}

export default PopupLegend;
