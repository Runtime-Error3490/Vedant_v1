let pc = new RTCPeerConnection({
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
});

// Create an offer
pc.createOffer().then(offer => {
    pc.setLocalDescription(offer);
    fetch('http://10.86.6.95:5000/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offer)
    }).then(response => response.json()).then(answer => {
        pc.setRemoteDescription(new RTCSessionDescription(answer));
    });
});

// Create a data channel
const dataChannel = pc.createDataChannel('dataChannel');

// Set up data channel event handlers
dataChannel.onopen = () => {
    console.log('Data channel opened.');
};

dataChannel.onmessage = event => {
    // Handle received data, e.g., image data
    const imageData = event.data;
    // Process and display the image data
    displayReceivedImage(imageData);
};

// Function to send image data
function sendImageData(imageData) {
    dataChannel.send(imageData);
   }

// Function to display received image data (you should implement this)
function displayReceivedImage(imageData) {
    // Here you can decode and display the image
    const img = new Image();
    img.src = "data:image/jpeg;base64," + imageData;
    document.body.appendChild(img);
}

// Example usage to send image data
const img = new Image();
img.src = 'path/to/your/image.jpg';
img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Convert the image to base64 data URL
    const imageData = canvas.toDataURL('image/jpeg');
    sendImageData(imageData);
};

