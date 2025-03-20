        const webcamVideo = document.getElementById('webcam-video');
        const captureButton = document.getElementById('capture-button');
        const capturedImageCanvas = document.getElementById('captured-image');
        const savedImagesContainer = document.getElementById('saved-images');
        const cameraRollButton = document.getElementById('camera-roll');
        const errorMessage = document.getElementById('error-message');
        let capturedImages = [];

        // Access the user's webcam
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                webcamVideo.srcObject = stream;
                webcamVideo.play();
            })
            .catch(error => {
                console.error("Camera access error:", error);
                errorMessage.style.display = "block"; // Show error message
            });

        // Capture and save image while keeping the camera ON
        captureButton.addEventListener('click', () => {
            const context = capturedImageCanvas.getContext('2d');
            capturedImageCanvas.width = webcamVideo.videoWidth;
            capturedImageCanvas.height = webcamVideo.videoHeight;
            context.drawImage(webcamVideo, 0, 0, capturedImageCanvas.width, capturedImageCanvas.height);

            // Save captured image to storage section
            const imageDataURL = capturedImageCanvas.toDataURL();
            const imgElement = document.createElement('img');
            imgElement.src = imageDataURL;
            savedImagesContainer.appendChild(imgElement);

            // Scroll to bottom to keep "Camera Roll" button visible
            savedImagesContainer.scrollTop = savedImagesContainer.scrollHeight;

            // Store image in array
            capturedImages.push(imageDataURL);
        });

        // Function to download all images as ZIP
        cameraRollButton.addEventListener('click', () => {
            if (capturedImages.length === 0) {
                alert("No images to extract!");
                return;
            }

            let zip = new JSZip();
            capturedImages.forEach((imgData, index) => {
                let imgBase64 = imgData.replace(/^data:image\/(png|jpg);base64,/, "");
                zip.file(`captured_image_${index + 1}.png`, imgBase64, { base64: true });
            });

            // Generate ZIP file and trigger download
            zip.generateAsync({ type: "blob" }).then(content => {
                saveAs(content, "Camera_Roll.zip");
            });
        });