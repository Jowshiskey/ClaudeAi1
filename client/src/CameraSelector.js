import React, { useState, useEffect } from 'react';

const CameraSelector = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  // Get camera devices on component mount
  useEffect(() => {
    async function getDevices() {
      try {
        // Request permission to access media devices
        await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Get all media devices
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        
        // Filter for video input devices (cameras)
        const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
        
        setDevices(videoDevices);
        
        // Select the first device by default if available
        if (videoDevices.length > 0 && !selectedDevice) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
      } catch (err) {
        setError('Error accessing camera devices: ' + err.message);
        console.error('Error accessing camera devices:', err);
      }
    }

    getDevices();

    // Clean up function to stop any active streams
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start the camera stream when a device is selected
  useEffect(() => {
    async function startCamera() {
      if (selectedDevice) {
        // Stop any existing stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        try {
          // Start new stream with selected device
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: selectedDevice } }
          });
          
          setStream(newStream);
          setError(null);
          
          // Set the stream to the video element
          const videoElement = document.getElementById('camera-preview');
          if (videoElement) {
            videoElement.srcObject = newStream;
          }
        } catch (err) {
          setError('Error starting camera: ' + err.message);
          console.error('Error starting camera:', err);
        }
      }
    }

    startCamera();
  }, [selectedDevice]);

  // Handle device selection change
  const handleDeviceChange = (e) => {
    setSelectedDevice(e.target.value);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-4 flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mr-2 text-blue-500"
        >
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
        <h2 className="text-xl font-bold">Camera Selector</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Camera Device:</label>
        <select className="cameraInput" value={ selectedDevice } defaultValue={""}
          onChange={handleDeviceChange}
          disabled={devices.length === 0}
        >
          {devices.length === 0 && (
            <option value="">No camera devices found</option>
          )}
          {devices.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${devices.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 bg-gray-100 rounded overflow-hidden">
        <video 
          id="camera-preview" 
          className="w-full h-64 object-cover" 
          autoPlay 
          playsInline
        />
      </div>

      <div className="flex justify-between">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            if (selectedDevice) {
              // You can add additional logic here, like taking a photo
              alert('Camera selected: ' + 
                (devices.find(d => d.deviceId === selectedDevice)?.label || 'Unknown device'));
            }
          }}
          disabled={!selectedDevice}
        >
          Confirm Selection
        </button>
        
        <button 
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => {
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
              setStream(null);
              
              const videoElement = document.getElementById('camera-preview');
              if (videoElement) {
                videoElement.srcObject = null;
              }
            }
          }}
          disabled={!stream}
        >
          Stop Camera
        </button>
      </div>
    </div>
  );
};

export default CameraSelector;