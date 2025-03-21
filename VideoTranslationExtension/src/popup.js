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

    // Start translation
    translateButton.addEventListener("click", () => {
        chrome.storage.sync.get("language", (data) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    action: "startTranslation", 
                    language: data.language || "hindi" // Default to Hindi
                });
            });
        });
    });
});
