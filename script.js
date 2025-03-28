// Function to upload a file
function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let uploadMessage = document.getElementById("uploadMessage");

    if (fileInput.files.length === 0) {
        uploadMessage.innerText = "Please select a file to upload!";
        return;
    }

    let file = fileInput.files[0];
    let reader = new FileReader();

    reader.onload = function(event) {
        let fileData = event.target.result;
        let key = generateKey(); // Generate unique key
        let expiryTime = Date.now() + 24 * 60 * 60 * 1000; // Expires in 24 hours

        let fileObject = {
            fileName: file.name,
            fileData: fileData,
            expiry: expiryTime
        };

        localStorage.setItem(key, JSON.stringify(fileObject)); // Store in localStorage

        uploadMessage.innerHTML = `File uploaded successfully!<br> Your Key: <b>${key}</b><br> (Valid for 24 hours)`;
    };

    reader.readAsDataURL(file);
}

// Function to generate a unique key
function generateKey() {
    return Math.random().toString(36).substr(2, 8); // Random 8-character key
}

// Function to download a file
function downloadFile() {
    let keyInput = document.getElementById("keyInput").value.trim();
    let downloadMessage = document.getElementById("downloadMessage");

    if (!keyInput) {
        downloadMessage.innerText = "Please enter a valid key!";
        return;
    }

    let fileObject = JSON.parse(localStorage.getItem(keyInput));

    if (!fileObject) {
        downloadMessage.innerText = "Invalid key! File not found.";
        return;
    }

    if (Date.now() > fileObject.expiry) {
        downloadMessage.innerText = "This key has expired. File is deleted!";
        localStorage.removeItem(keyInput); // Delete expired file
        return;
    }

    // Create a link and trigger the download
    let downloadLink = document.createElement("a");
    downloadLink.href = fileObject.fileData;
    downloadLink.download = fileObject.fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    downloadMessage.innerText = "File downloaded successfully!";
}
