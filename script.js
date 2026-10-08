```javascript
/* ==========================================
   WEBOS
   Main JavaScript
========================================== */


/* ==========================================
   VARIABLES
========================================== */

const startButton = document.getElementById("startButton");
const startMenu = document.getElementById("startMenu");

const clock = document.getElementById("clock");

const windows = document.querySelectorAll(".window");

let highestZIndex = 10;


/* ==========================================
   CLOCK
========================================== */

function updateClock() {

    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    minutes = minutes.toString().padStart(2, "0");

    clock.textContent =
        `${hours}:${minutes} ${ampm}`;
}

updateClock();

setInterval(updateClock, 1000);


/* ==========================================
   START MENU
========================================== */

startButton.addEventListener("click", function () {

    startMenu.classList.toggle("hidden");

});


/* ==========================================
   OPEN APPLICATION
========================================== */

function openApp(appName) {

    const windowElement =
        document.getElementById(appName + "Window");

    if (!windowElement) {
        return;
    }

    windowElement.classList.remove("hidden");

    highestZIndex++;

    windowElement.style.zIndex = highestZIndex;

    startMenu.classList.add("hidden");

    createTaskbarButton(appName, windowElement);
}


/* ==========================================
   DESKTOP ICONS
========================================== */

document.querySelectorAll(".desktop-icon").forEach(icon => {

    icon.addEventListener("dblclick", function () {

        const appName = this.dataset.app;

        openApp(appName);

    });

});


/* ==========================================
   START MENU APPS
========================================== */

document.querySelectorAll(".start-apps button").forEach(button => {

    button.addEventListener("click", function () {

        const appName = this.dataset.app;

        openApp(appName);

    });

});


/* ==========================================
   WINDOW CONTROLS
========================================== */

windows.forEach(windowElement => {

    const closeButton =
        windowElement.querySelector(".close");

    const minimizeButton =
        windowElement.querySelector(".minimize");

    const maximizeButton =
        windowElement.querySelector(".maximize");


    /* Close */

    closeButton.addEventListener("click", function (event) {

        event.stopPropagation();

        windowElement.classList.add("hidden");

        removeTaskbarButton(windowElement);

    });


    /* Minimize */

    minimizeButton.addEventListener("click", function (event) {

        event.stopPropagation();

        windowElement.classList.add("hidden");

    });


    /* Maximize */

    maximizeButton.addEventListener("click", function (event) {

        event.stopPropagation();

        windowElement.classList.toggle("maximized");

        if (windowElement.classList.contains("maximized")) {

            windowElement.style.left = "0";
            windowElement.style.top = "0";
            windowElement.style.transform = "none";

            windowElement.style.width = "100%";
            windowElement.style.height = "calc(100% - 52px)";

        } else {

            windowElement.style.left = "50%";
            windowElement.style.top = "45%";
            windowElement.style.transform =
                "translate(-50%, -50%)";

            windowElement.style.width = "600px";
            windowElement.style.height = "400px";

        }

    });


    /* Bring window to front */

    windowElement.addEventListener("mousedown", function () {

        highestZIndex++;

        windowElement.style.zIndex = highestZIndex;

    });

});


/* ==========================================
   DRAG WINDOWS
========================================== */

windows.forEach(windowElement => {

    const header =
        windowElement.querySelector(".window-header");

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;


    header.addEventListener("mousedown", function (event) {

        if (windowElement.classList.contains("maximized")) {
            return;
        }

        dragging = true;

        const rect =
            windowElement.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        highestZIndex++;

        windowElement.style.zIndex = highestZIndex;

    });


    document.addEventListener("mousemove", function (event) {

        if (!dragging) {
            return;
        }

        windowElement.style.left =
            (event.clientX - offsetX) + "px";

        windowElement.style.top =
            (event.clientY - offsetY) + "px";

        windowElement.style.transform = "none";

    });


    document.addEventListener("mouseup", function () {

        dragging = false;

    });

});


/* ==========================================
   TASKBAR BUTTONS
========================================== */

function createTaskbarButton(appName, windowElement) {

    const existingButton =
        document.querySelector(
            `[data-taskbar-app="${appName}"]`
        );

    if (existingButton) {
        return;
    }

    const button =
        document.createElement("button");

    button.className = "taskbar-app";

    button.dataset.taskbarApp = appName;

    button.textContent =
        getAppTitle(appName);


    button.addEventListener("click", function () {

        if (windowElement.classList.contains("hidden")) {

            windowElement.classList.remove("hidden");

            highestZIndex++;

            windowElement.style.zIndex =
                highestZIndex;

        } else {

            windowElement.classList.add("hidden");

        }

    });


    document
        .getElementById("taskbarApps")
        .appendChild(button);
}


/* ==========================================
   TASKBAR BUTTON REMOVAL
========================================== */

function removeTaskbarButton(windowElement) {

    const appName =
        windowElement.id.replace("Window", "");

    const button =
        document.querySelector(
            `[data-taskbar-app="${appName}"]`
        );

    if (button) {
        button.remove();
    }

}


/* ==========================================
   APP TITLES
========================================== */

function getAppTitle(appName) {

    const titles = {

        computer: "🖥️ Computer",

        files: "📁 Files",

        notepad: "📝 Notepad"

    };

    return titles[appName] || appName;

}
```
