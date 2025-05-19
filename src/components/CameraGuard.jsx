import React, { useEffect, useRef, useState } from 'react';
import { startWatching, stopWatching, enrollYourFace } from '../faceWatcher';
import { speakWarning } from '../faceAlerts';

const CameraGuard = () => {
  const videoRef = useRef();
  const [locked, setLocked] = useState(false);
  const [enrolled, setEnrolled] = useState(!!localStorage.getItem('adi_face_descriptor'));
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  // Start webcam
  useEffect(() => {
    if (!enrolled) return;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError('Could not access webcam'));
  }, [enrolled]);

  // Start face watching
  useEffect(() => {
    if (!enrolled || !videoRef.current) return;
    startWatching(videoRef.current, () => {
      setLocked(true);
      speakWarning();
    });
    return () => stopWatching();
  }, [enrolled]);

  // Enroll face on first run
  const handleEnroll = async () => {
    setEnrolling(true);
    setError('');
    try {
      await enrollYourFace(videoRef.current);
      setEnrolled(true);
    } catch (e) {
      setError('Enrollment failed: ' + (e.message || e));
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        width={1}
        height={1}
        style={{ position: 'absolute', left: -9999, top: -9999 }}
      />
      {!enrolled && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', color: '#fff', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
          <div>Face enrollment required for security.</div>
          <button onClick={handleEnroll} disabled={enrolling} style={{ marginTop: 24, padding: '12px 32px', fontSize: 20, borderRadius: 8, background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>{enrolling ? 'Enrolling...' : 'Enroll My Face'}</button>
          {error && <div style={{ color: '#ff5555', marginTop: 16 }}>{error}</div>}
        </div>
      )}
      {locked && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(200,0,0,0.85)', color: '#fff', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, letterSpacing: 2 }}>
          <div>LOCKED</div>
          <div style={{ fontSize: 18, marginTop: 16 }}>You are not authorized to use Adi's laptop.</div>
        </div>
      )}
      {error && !locked && (
        <div style={{ color: '#c00', position: 'fixed', top: 10, left: 10, zIndex: 10000 }}>{error}</div>
      )}
    </div>
  );
};

export default CameraGuard;
