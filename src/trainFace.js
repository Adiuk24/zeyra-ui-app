import * as faceapi from 'face-api.js';

export async function getDescriptorFromImage(imgUrl) {
  const img = await faceapi.fetchImage(imgUrl);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) throw new Error("No face found in image.");

  return detection.descriptor;
}
