// src/faceWatcher.js
// Face detection and recognition using face-api.js
import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';
const DESCRIPTOR_KEY = 'adi_face_descriptor';

let watching = false;
let onUnauthorized = null;
let knownDescriptors = [];

export async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
}

export async function enrollYourFace(videoElement) {
  await loadModels();
  const detection = await faceapi.detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions()).withFaceDescriptor();
  if (!detection) throw new Error('No face detected for enrollment.');
  localStorage.setItem(DESCRIPTOR_KEY, JSON.stringify(Array.from(detection.descriptor)));
  return detection.descriptor;
}

export function getStoredDescriptor() {
  const desc = localStorage.getItem(DESCRIPTOR_KEY);
  return desc ? Float32Array.from(JSON.parse(desc)) : null;
}

// Returns true if Adi's face is detected, false otherwise
export async function detectUser(videoElement) {
  await loadModels();
  const storedDescriptor = getStoredDescriptor();
  if (!storedDescriptor) return false;
  const detection = await faceapi.detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions()).withFaceDescriptor();
  if (!detection) return false;
  const distance = faceapi.euclideanDistance(storedDescriptor, detection.descriptor);
  return distance <= 0.5;
}

export async function loadKnownDescriptor(referenceImageUrl) {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  const img = await faceapi.fetchImage(referenceImageUrl);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (detection) {
    knownDescriptors = [detection.descriptor];
  }
}

const stored = JSON.parse(localStorage.getItem('adi_descriptor'));
const adiDescriptor = stored ? new Float32Array(stored) : null;

export async function detectUserVideo(videoEl) {
  if (!adiDescriptor) return "no-face";
  const detection = await faceapi
    .detectSingleFace(videoEl)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) return "no-face";

  const dist = faceapi.euclideanDistance(detection.descriptor, adiDescriptor);
  console.log("👤 Face match distance:", dist);

  return dist < 0.45 ? "authorized" : "unauthorized";
}

export function startWatching(videoElement, unauthorizedCallback) {
  watching = true;
  onUnauthorized = unauthorizedCallback;
  watchLoop(videoElement);
}

export function stopWatching() {
  watching = false;
}

async function watchLoop(videoElement) {
  await loadModels();
  const storedDescriptor = getStoredDescriptor();
  if (!storedDescriptor) return;
  while (watching) {
    const detection = await faceapi.detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions()).withFaceDescriptor();
    if (detection) {
      const distance = faceapi.euclideanDistance(storedDescriptor, detection.descriptor);
      if (distance > 0.5 && onUnauthorized) {
        onUnauthorized();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 2000));
  }
}
