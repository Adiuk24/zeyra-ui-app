import React, { useEffect, useRef, useState } from "react";
// You must install face-api.js: npm install face-api.js
import * as faceapi from "face-api.js";

// Reusable speech function
export function speak(text) {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  }
}

const MODEL_URL = "/models";
const REFERENCE_IMAGE = "/your-face.png";

const FaceGuard = ({ onUnauthorized }) => {
  const videoRef = useRef();
  const [locked, setLocked] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  // Load face-api.js models
  useEffect(() => {
    async function loadModels() {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      } catch (e) {
        setError("Failed to load face-api.js models");
      }
    }
    loadModels();
  }, []);

  // Start webcam
  useEffect(() => {
    if (!modelsLoaded) return;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError("Could not access webcam"));
  }, [modelsLoaded]);

  // Face recognition logic
  useEffect(() => {
    if (!modelsLoaded) return;
    let interval;
    let referenceDescriptor = null;
    let unauthorizedTriggered = false;

    async function loadReference() {
      const img = await faceapi.fetchImage(REFERENCE_IMAGE);
      const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceDescriptor();
      if (!detection) throw new Error("Reference face not found");
      return detection.descriptor;
    }

    async function checkFace() {
      if (!videoRef.current || locked || unauthorizedTriggered) return;
      setChecking(true);
      try {
        if (!referenceDescriptor) referenceDescriptor = await loadReference();
        const result = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceDescriptor();
        if (!result) return; // No face detected
        const distance = faceapi.euclideanDistance(referenceDescriptor, result.descriptor);
        if (distance > 0.5) {
          unauthorizedTriggered = true;
          setLocked(true);
          speak("You are not authorized to use Adi's laptop.");
          if (onUnauthorized) onUnauthorized();
        }
      } catch (e) {
        setError("Face recognition error");
      } finally {
        setChecking(false);
      }
    }

    interval = setInterval(checkFace, 2000);
    return () => clearInterval(interval);
  }, [modelsLoaded, locked, onUnauthorized]);

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        width={1}
        height={1}
        style={{ position: "absolute", left: -9999, top: -9999 }}
      />
      {locked && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(200,0,0,0.85)",
          color: "#fff",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: 2,
        }}>
          <div>ACCESS DENIED</div>
          <div style={{ fontSize: 18, marginTop: 16 }}>You are not authorized to use Adi's laptop.</div>
        </div>
      )}
      {error && (
        <div style={{ color: "#c00", position: "fixed", top: 10, left: 10, zIndex: 10000 }}>{error}</div>
      )}
    </div>
  );
};

export default FaceGuard;
