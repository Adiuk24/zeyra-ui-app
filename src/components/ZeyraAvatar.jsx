import React from "react";
import Lottie from "lottie-react";
import zeyraAvatar from "../assets/zeyra-avatar.json";
import { getMood } from '../emotionState';

const ZeyraAvatar = () => {
  const mood = getMood();
  let animationData = zeyraAvatar;
  if (mood === 'happy') {
    // Optionally swap to a happy animation
    // animationData = happyZeyraAvatar;
  } else if (mood === 'alert' || mood === 'angry') {
    // Optionally swap to an alert/angry animation
    // animationData = alertZeyraAvatar;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginBottom: 24 }}>
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: 180, height: 180 }}
      />
    </div>
  );
};

export default ZeyraAvatar;
