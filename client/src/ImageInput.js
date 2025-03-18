import React, { useRef, useState } from 'react';

const ImageUploadButton = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //   }
  // };
  const handleImageUpload=(event)=>{
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload=()=>{
        console.log(reader.result);
        setSelectedFile(reader.result);
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
      {selectedFile ? <button onClick={handleButtonClick}> {selectedFile ? `Clear Image` : 'Upload File'} </button> : <input type="file" ref={fileInputRef} onChange={handleImageUpload}/>}
      {selectedFile ? <img src={selectedFile} alt="🙀" className="capture_img" style={{fontSize:"150px"}}/> : <div></div>}    </div>
  );
};

export default ImageUploadButton;