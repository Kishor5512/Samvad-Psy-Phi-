export function captureFrame(videoElement, quality = 0.8) {
  if (!videoElement) {
    throw new Error("Video element is required.");
  }

  if (
    videoElement.videoWidth === 0 ||
    videoElement.videoHeight === 0
  ) {
    throw new Error("Video is not ready.");
  }

  const canvas = document.createElement("canvas");

  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create canvas context.");
  }

  // Mirror correction because the camera preview is mirrored.
  context.translate(canvas.width, 0);
  context.scale(-1, 1);

  context.drawImage(
    videoElement,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to create image blob."));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}