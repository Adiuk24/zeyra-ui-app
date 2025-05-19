// src/cameraVision.js
// Zeyra Camera Vision Module
import * as faceapi from 'face-api.js';
import { setMood } from './emotionState.js';

const MODEL_URL = '/models';
let knownDescriptor = null;
let isLocked = false;
let greeted = false;
let lastSeen = Date.now();
let absenceOverlay = null;

function handleFaceDetection(faceDetected) {
  if (faceDetected) {
    lastSeen = Date.now();
    if (absenceOverlay) {
      absenceOverlay.remove();
      absenceOverlay = null;
    }
  } else if (Date.now() - lastSeen > 5 * 60 * 1000) {
    if (!absenceOverlay) {
      absenceOverlay = document.createElement('div');
      absenceOverlay.style.position = 'fixed';
      absenceOverlay.style.top = 0;
      absenceOverlay.style.left = 0;
      absenceOverlay.style.width = '100vw';
      absenceOverlay.style.height = '100vh';
      absenceOverlay.style.background = 'rgba(0,0,0,0.7)';
      absenceOverlay.style.zIndex = 99999;
      absenceOverlay.innerHTML = '<div style="color:#fff;font-size:2rem;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">Zeyra: I don\'t see you. Taking a break?</div>';
      document.body.appendChild(absenceOverlay);
      window.speechSynthesis.speak(new window.SpeechSynthesisUtterance("I don't see you. Taking a break?"));
    }
  }
}

export async function initCameraVision(videoElementId, knownImageUrl, onUnauthorized) {
  // Load models
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

  // Get known face descriptor
  const knownImage = await faceapi.fetchImage(knownImageUrl);
  const singleResult = await faceapi
    .detectSingleFace(knownImage)
    .withFaceLandmarks()
    .withFaceDescriptor();

  knownDescriptor = singleResult?.descriptor;
  if (!knownDescriptor) throw new Error('No face detected in known image.');

  // Get video stream
  const video = document.getElementById(videoElementId);
  if (!video) throw new Error(`Video element #${videoElementId} not found`);
  navigator.mediaDevices.getUserMedia({ video: {} }).then(stream => {
    video.srcObject = stream;
  });

  video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        handleFaceDetection(false);
        return;
      }

      const faceMatcher = new faceapi.FaceMatcher([
        new faceapi.LabeledFaceDescriptors('AuthorizedUser', [knownDescriptor])
      ]);
      const results = detections.map(d => faceMatcher.findBestMatch(d.descriptor));

      const unauthorized = results.some(r => r.label !== 'AuthorizedUser' || r.distance > 0.55);

      if (unauthorized && !isLocked) {
        isLocked = true;
        console.warn('Unauthorized face detected!');
        setMood('alert');
        onUnauthorized();
      }
      if (!unauthorized && !greeted) {
        greeted = true;
        const synth = window.speechSynthesis;
        const utter = new window.SpeechSynthesisUtterance("Welcome back, Adi.");
        utter.voice = synth.getVoices().find(v => v.lang.includes("en"));
        synth.speak(utter);
        setMood('happy');
      }

      handleFaceDetection(true);
    }, 2000);
  });
}
