document.addEventListener("DOMContentLoaded", () => {
    const languageSelect = document.getElementById("language");
    const saveButton = document.getElementById("save");
    const translateButton = document.getElementById("translateButton");

    // Load saved language preference
    chrome.storage.sync.get("language", (data) => {
        if (data.language) {
            languageSelect.value = data.language;
        }
    });

    // Save selected language
    saveButton.addEventListener("click", () => {
        const selectedLanguage = languageSelect.value;
        chrome.storage.sync.set({ language: selectedLanguage }, () => {
            alert(`Language set to: ${selectedLanguage}`);
        });
    });

    // Send message to start translation
    translateButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "startTranslation" }, (response) => {
            console.log("Message sent to start translation.");
            if (response && response.status) {
                console.log("Response:", response.status);
            }
        });
    });
});
