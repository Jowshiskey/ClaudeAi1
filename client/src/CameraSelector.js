import React, { useState, useEffect } from 'react';

const CameraSelector = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("Choose");
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  // Get camera devices on component mount
  useEffect(() => {
    async function getDevices() {
      try {
        // Request permission to access media devices
        await navigator.mediaDevices.getUserMedia({ video: true });
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
      } catch (err) {
        setError('Error accessing camera devices: ' + err.message);
        console.error('Error accessing camera devices:', err);
      }
    }

    getDevices();
    // Clean up function to stop any active streams

  }, []);

  // Start the camera stream when a device is selected
  useEffect(() => {
    async function startCamera() {
      if (selectedDevice !== "Choose") {
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

  const handleDeviceReset = (e) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setSelectedDevice("Choose");
      
      // const videoElement = document.getElementById('camera-preview');
      // if (videoElement) {
      //   videoElement.srcObject = null;
      // }
    }
  };
  const handleCameraSnapShot = () => {
    if (selectedDevice) {
      // You can add additional logic here, like taking a photo
      alert('Camera selected: ' + 
        (devices.find(d => d.deviceId === selectedDevice)?.label || 'Unknown device'));
    }
  }
console.log(selectedDevice);
  if(selectedDevice === "Choose") {
  return (
    <div className="">
      <div className="">
        <div className="">
          <h2 className="">Camera Selector</h2>
        </div>
        {/* <div className="">
          <button className="" onClick={handleDeviceReset} disabled={""}>Stop Camera</button>
        </div>  */}
      </div>
      <div className="">
          <label for="cameraInput">Select Camera Device:</label>
          <select className="cameraInput" name="cameraInput" id="cameraInput" onChange={handleDeviceChange} disabled={devices.length === 0} >
            {devices.length === 0 ? <option value="">No camera devices found</option> : <option value="Choose">Pick a Camera</option>}
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>{device.label || `Camera ${devices.indexOf(device) + 1}`}</option>
            ))}
          </select>
          {/* <div className="">
            <video id="camera-preview" className="" autoPlay playsInline />
          </div> */}
      </div>
      {/* <div className="flex justify-between">
        <button className="" onClick={handleCameraSnapShot} disabled={!selectedDevice} >Confirm Selection</button>
      </div> */}
    </div>
  );
} else {
  return (
    <div className="">
      <div className="">
        <h2 className="">Camera Selector</h2>
      </div> 
      <div className="">
        <div className="">
          <h2 className="">Camera Selector</h2>
        </div>
        <div className="">
          <button className="" onClick={handleDeviceReset} disabled={""}>Stop Camera</button>
        </div> 
      </div>
      <div className="">
          <label for="cameraInput">Select Camera Device:</label>
          <select className="cameraInput" name="cameraInput" id="cameraInput" onChange={handleDeviceChange} disabled={devices.length === 0} >
            {devices.length === 0 ? <option value="">No camera devices found</option> : <option value="Choose">Pick a Camera</option>}
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>{device.label || `Camera ${devices.indexOf(device) + 1}`}</option>
            ))}
          </select>
          <div className="">
            <video id="camera-preview" className="" autoPlay playsInline />
          </div>
      </div>
      <div className="flex justify-between">
        <button className="" onClick={handleCameraSnapShot} disabled={!selectedDevice} >Confirm Selection</button>
      </div>
    </div>
  );
}
  
};

export default CameraSelector;