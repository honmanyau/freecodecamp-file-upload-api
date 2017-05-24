'use strict'

const xhr = new XMLHttpRequest();
const form = document.getElementById("upload-form");
const fileInput = document.getElementById("input-file");
const outputContainer = document.getElementById("output-area");

// Reset the file input element
fileInput.value = "";

// Logic for text displayed upon file selection
fileInput.addEventListener("change", (event) => {
  outputContainer.innerHTML = "";
  
  const fileList = event.target.files;
  
  // Check if files were selected
  if (fileList.length) {
    // Limit number of files uploaded at a time
    if (fileList.length > 10) {
      outputContainer.innerHTML = "<code>Only 10 files can be uploaded at a time.</code>";
      fileInput.value = "";
      return;
    }
      
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const size = file.size;
      let name = file.name;

      // Client-side file limit
      if (size > 2000000) {
        outputContainer.innerHTML = "<code>" + name + " is larger than the 2MB limit.</code>"
        fileInput.value = "";
        return;
      }
      
      // Limit display to 20 characters including extension
      if (name.length > 20) {
        let match = name.match(/^([\w,\s-\.]+)\.([a-zA-Z\d]+)/);

        name = match[1](0, 21 - match[2].length - 5) + "... ." + match[2];
      }

      outputContainer.innerHTML += "<code>" + name + " (" + size + " byte)" + "</code><br />";
    }  
  }
})

// Form submit POST request
form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  outputContainer.innerHTML = "";
  
  const formData = new FormData();
  const files = fileInput.files;
  
  if (!files.length) {
    outputContainer.innerHTML = "<code>No files selected.</code>";
    return;
  }
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    formData.append("upload", file, file.name)
  }
  
  xhr.open("POST", "/upload", true);
  xhr.onload = (event) => {
    outputContainer.innerHTML = "<code>" + JSON.parse(event.target.response) + "</code>";
  };
  xhr.send(formData);
});