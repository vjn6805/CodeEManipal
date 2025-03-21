console.log("Content script loaded...");

// Establish a WebSocket connection to the backend
const socket = new WebSocket("ws://localhost:5000");

// Log connection status
socket.onopen = () => console.log("WebSocket connected...");
socket.onerror = (error) => console.error("WebSocket error:", error);
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Received translation:", data.translated_text);
    
    // Play the translated speech audio
    const translatedAudio = new Audio(`http://localhost:5000/get_real_time_audio/${data.language_code}`);
    translatedAudio.play();
};

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startTranslation") {
        console.log("Translation started...");

        const video = document.querySelector("video");
        if (video) {
            const mediaStream = video.captureStream();
            const recorder = new MediaRecorder(mediaStream, { mimeType: "audio/webm" });

            recorder.ondataavailable = async (event) => {
                if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                    console.log("Sending audio chunk...");
                    socket.send(JSON.stringify({
                        language: message.language, // Send selected language
                        audio: await event.data.arrayBuffer() // Convert audio to array buffer
                    }));
                }
            };

            recorder.start(1000); // Capture audio in 1-second chunks
            console.log("Recording started...");
        } else {
            console.warn("No video element found on the page.");
        }
    }
});
