console.log("Content script loaded...");

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startTranslation") {
        console.log("Translation started...");

        const video = document.querySelector("video");

        if (video) {
            const mediaStream = video.captureStream();
            const recorder = new MediaRecorder(mediaStream);

            recorder.ondataavailable = async (event) => {
                const formData = new FormData();
                formData.append("audio", event.data);

                try {
                    const response = await fetch("http://localhost:5000/process-audio", {
                        method: "POST",
                        body: formData,
                    });

                    const data = await response.json();
                    console.log("Translated Text:", data.translatedText);
                    console.log("Audio URL:", data.audioUrl);

                    const translatedAudio = new Audio(data.audioUrl);
                    translatedAudio.play();
                } catch (error) {
                    console.error("Error processing audio:", error);
                }
            };

            recorder.start();
            console.log("Recording started...");
        } else {
            console.warn("No video element found on the page.");
        }
    }
});
