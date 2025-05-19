import * as faceapi from 'face-api.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import canvas from 'canvas';
import fetch from 'node-fetch';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODEL_PATH = path.join(__dirname, '..', 'models');

export async function loadFaceModels() {
  console.log('🧠 Loading face-api.js models from:', MODEL_PATH);
  await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
  console.log('✅ Models loaded');
}
