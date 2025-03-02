// Function to create or update the alarm
function setAlarm(interval) {
    chrome.alarms.clear("breakReminder", () => {
        chrome.alarms.create("breakReminder", { periodInMinutes: interval });
    });
}

// Function to clear the alarm (disable reminders)
function clearAlarm() {
    chrome.alarms.clear("breakReminder");
}

// Handle alarm trigger
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "breakReminder") {
        // Show notification
        chrome.notifications.create("", {
            type: "basic",
            iconUrl: "icons/icon-128.png",
            title: "Eye Break Reminder",
            message: "Look at something 20 meters away for 20 seconds!",
            priority: 2
        });

        // Open a custom reminder page
        chrome.tabs.create({ url: "reminder.html" }, (tab) => {
            // Listen for the tab being closed
            chrome.tabs.onRemoved.addListener(function tabClosedListener(tabId) {
                if (tabId === tab.id) {
                    // Restart the timer when the reminder tab is closed
                    chrome.storage.sync.get(["breakInterval", "reminderEnabled"], (result) => {
                        if (result.reminderEnabled) {
                            setAlarm(result.breakInterval || 20);
                        }
                    });

                    // Remove this listener after it's triggered
                    chrome.tabs.onRemoved.removeListener(tabClosedListener);
                }
            });
        });
    }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "toggleReminder") {
        if (request.enabled) {
            setAlarm(request.interval);
        } else {
            clearAlarm();
        }
    }
});

// Set up the alarm on installation or update
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["breakInterval", "reminderEnabled"], (result) => {
        const interval = result.breakInterval || 20;
        const enabled = result.reminderEnabled ?? true;
        if (enabled) setAlarm(interval);
    });
});
