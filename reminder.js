document.addEventListener("DOMContentLoaded", function () {
    let timeLeft = 20;
    const countdownEl = document.getElementById("countdown");
    const closeButton = document.getElementById("closeButton");

    const timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            countdownEl.textContent = timeLeft;
        } else {
            clearInterval(timer);
        }
    }, 1000);

    closeButton.addEventListener("click", () => {
        clearInterval(timer);
        window.close();
    });
});
