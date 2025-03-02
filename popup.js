document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("toggleReminder");
    const intervalSlider = document.getElementById("intervalSlider");
    const intervalDisplay = document.getElementById("intervalDisplay");
    const saveButton = document.getElementById("saveSettings");

    // Load stored settings
    chrome.storage.sync.get(["breakInterval", "reminderEnabled"], (result) => {
        toggle.checked = result.reminderEnabled ?? true;
        intervalSlider.value = result.breakInterval || 20;
        intervalDisplay.textContent = result.breakInterval || 20;
    });

    // Update display when slider moves
    intervalSlider.addEventListener("input", function () {
        intervalDisplay.textContent = this.value;
    });

    // Save settings
    saveButton.addEventListener("click", function () {
        const newInterval = parseInt(intervalSlider.value, 10);
        const enabled = toggle.checked;

        chrome.storage.sync.set({ breakInterval: newInterval, reminderEnabled: enabled }, () => {
            chrome.runtime.sendMessage({ type: "toggleReminder", enabled, interval: newInterval });
            alert("Settings saved!");
        });
    });
});
