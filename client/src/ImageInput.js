import React, { useRef, useState } from 'react';

const FileUploadButton = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    if (selectedFile) {
      // If a file is already selected, clear it
      handleClear();
    } else {
      // If no file is selected, trigger the file input
      fileInputRef.current.click();
    }
  };

return (
    <div>
      {selectedFile ? <button onClick={handleButtonClick}> {selectedFile ? `Clear: ${selectedFile.name}` : 'Upload File'} </button> : <input type="file" ref={fileInputRef} onChange={handleFileChange}/>}
    </div>
  );
};

export default FileUploadButton;