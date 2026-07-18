import { useEffect, useRef, useState } from 'react';

export const useEyeTracking = (videoRef, isStarted) => {
  const [isDistracted, setIsDistracted] = useState(false);
  const [distractionCount, setDistractionCount] = useState(0);
  const distractionTimer = useRef(null);

  useEffect(() => {
    // Wait until the video is active AND Google's scripts have loaded
    if (!videoRef.current || !isStarted || !window.FaceMesh || !window.Camera) return;

    // 1. Initialize Google MediaPipe Face Mesh from the global window object
    const faceMesh = new window.FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true, // Tracks irises
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    // 2. The Logic: What happens every single frame
    faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        
        // Grab the coordinates for the Nose and the edges of the face
        const nose = landmarks[1];
        const leftCheek = landmarks[234];
        const rightCheek = landmarks[454];

        // Calculate Head Rotation (Yaw)
        const faceWidth = rightCheek.x - leftCheek.x;
        const nosePosition = (nose.x - leftCheek.x) / faceWidth;

        // If nose is centered, value is ~0.5. 
        // If < 0.25 (looking hard left) or > 0.75 (looking hard right)
        const lookingAway = nosePosition < 0.25 || nosePosition > 0.75;

        if (lookingAway) {
          if (!distractionTimer.current) {
            // Start a 3-second countdown
            distractionTimer.current = setTimeout(() => {
              setIsDistracted(true);
              setDistractionCount(prev => prev + 1);
            }, 3000); 
          }
        } else {
          // They looked back at the camera! Reset everything.
          if (distractionTimer.current) {
            clearTimeout(distractionTimer.current);
            distractionTimer.current = null;
          }
          setIsDistracted(false);
        }
      }
    });

    // 3. Hook the FaceMesh up to your existing Webcam feed
    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await faceMesh.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();

    // Cleanup when the interview ends
    return () => {
      camera.stop();
      if (distractionTimer.current) clearTimeout(distractionTimer.current);
    };
  }, [videoRef, isStarted]);

  return { isDistracted, distractionCount };
};