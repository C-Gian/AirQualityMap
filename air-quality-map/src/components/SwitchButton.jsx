import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSwitch } from "../actions";
import SwitchSelector from "react-switch-selector";

const SwitchButton = () => {
  const dispatch = useDispatch();
  const switchState = useSelector((state) => state.switchState);
  const options = [
    {
      label: (
        <span className="text-sm text-white pointer-events-none">Map</span>
      ),
    },
    {
      label: (
        <span className="text-sm text-white pointer-events-none">Analysis</span>
      ),
    },
  ];

  const onChange = () => {
    dispatch(toggleSwitch());
  };

  return (
    <div style={{ width: 125, height: 35 }}>
      <SwitchSelector
        onChange={onChange}
        options={options}
        initialSelectedIndex={switchState}
        backgroundColor={"#353b48"}
        fontColor={"#f5f6fa"}
        optionBorderRadius={0}
      />
    </div>
  );
};

export default SwitchButton;
