document.addEventListener("DOMContentLoaded", () => {

    // =============================
    // HTML ELEMENTS
    // =============================

    const powerEl =
        document.getElementById("power");

    const timeEl =
        document.getElementById("time");

    const nightEl =
        document.getElementById("night");

    const statusEl =
        document.getElementById("status");


    const leftDoor =
        document.getElementById("leftDoor");

    const rightDoor =
        document.getElementById("rightDoor");


    const leftDoorBtn =
        document.getElementById("leftDoorBtn");

    const rightDoorBtn =
        document.getElementById("rightDoorBtn");


    const leftLightBtn =
        document.getElementById("leftLightBtn");

    const rightLightBtn =
        document.getElementById("rightLightBtn");


    const cameraBtn =
        document.getElementById("cameraBtn");

    const cameraPanel =
        document.getElementById("cameraPanel");

    const closeCameraBtn =
        document.getElementById("closeCameraBtn");


    const cameraTitle =
        document.getElementById("cameraTitle");

    const cameraText =
        document.getElementById("cameraText");

    const enemyVisual =
        document.getElementById("enemyVisual");


    const messageScreen =
        document.getElementById("messageScreen");

    const messageTitle =
        document.getElementById("messageTitle");

    const messageText =
        document.getElementById("messageText");

    const restartBtn =
        document.getElementById("restartBtn");


    const warningScreen =
        document.getElementById("warningScreen");


    const cameraButtons =
        document.querySelectorAll(".cam-button");


    // =============================
    // GAME VARIABLES
    // =============================

    let power = 100;

    let currentNight = 1;

    let hour = 0;

    let gameRunning = true;


    let leftDoorClosed = false;

    let rightDoorClosed = false;


    let leftLightOn = false;

    let rightLightOn = false;


    let camerasOpen = false;

    let selectedCamera = 0;


    /*
        0 = CAM 1
        1 = CAM 2
        2 = CAM 3
        3 = CAM 4
        4 = CAM 5
        5 = OFFICE
    */

    let enemyPosition = 0;


    // =============================
    // CAMERA DATA
    // =============================

    const cameraNames = [

        "CAM 1 — Вхід",

        "CAM 2 — Торговий зал",

        "CAM 3 — Склад",

        "CAM 4 — Темний коридор",

        "CAM 5 — Біля офісу"

    ];


    // =============================
    // POWER
    // =============================

    function updatePower() {

        if (!gameRunning) {
            return;
        }


        let drain = 0.015;


        if (leftDoorClosed) {

            drain += 0.022;

        }


        if (rightDoorClosed) {

            drain += 0.022;

        }


        if (leftLightOn) {

            drain += 0.014;

        }


        if (rightLightOn) {

            drain += 0.014;

        }


        if (camerasOpen) {

            drain += 0.02;

        }


        power -= drain;


        if (power <= 0) {

            power = 0;

            powerEl.textContent = "0";

            powerOut();

            return;
        }


        powerEl.textContent =
            Math.floor(power);


        if (power <= 20) {

            powerEl.style.color =
                "#ff3b3b";

        }
        else if (power <= 40) {

            powerEl.style.color =
                "#ffd54a";

        }
        else {

            powerEl.style.color =
                "white";

        }

    }


    function powerOut() {

        if (!gameRunning) {
            return;
        }


        leftDoorClosed = false;

        rightDoorClosed = false;


        leftDoor.classList.remove("closed");

        rightDoor.classList.remove("closed");


        leftDoorBtn.classList.remove("active");

        rightDoorBtn.classList.remove("active");


        leftLightOn = false;

        rightLightOn = false;


        leftLightBtn.classList.remove("active");

        rightLightBtn.classList.remove("active");


        closeCamera();


        statusEl.textContent =
            "⚡ Енергія закінчилась...";


        setTimeout(() => {

            if (gameRunning) {

                showWarning();

            }

        }, 1500);


        setTimeout(() => {

            if (gameRunning) {

                loseGame(
                    "Світло згасло, і ніч стала небезпечною..."
                );

            }

        }, 3500);

    }


    // =============================
    // DOORS
    // =============================

    leftDoorBtn.addEventListener(
        "click",

        () => {

            if (!canUseControls()) {
                return;
            }


            leftDoorClosed =
                !leftDoorClosed;


            leftDoor.classList.toggle(
                "closed",
                leftDoorClosed
            );


            leftDoorBtn.classList.toggle(
                "active",
                leftDoorClosed
            );


            leftDoorBtn.textContent =
                leftDoorClosed
                    ? "🔒 Ліві двері"
                    : "🚪 Ліві двері";

        }
    );


    rightDoorBtn.addEventListener(
        "click",

        () => {

            if (!canUseControls()) {
                return;
            }


            rightDoorClosed =
                !rightDoorClosed;


            rightDoor.classList.toggle(
                "closed",
                rightDoorClosed
            );


            rightDoorBtn.classList.toggle(
                "active",
                rightDoorClosed
            );


            rightDoorBtn.textContent =
                rightDoorClosed
                    ? "🔒 Праві двері"
                    : "🚪 Праві двері";

        }
    );


    // =============================
    // LIGHTS
    // =============================

    leftLightBtn.addEventListener(
        "click",

        () => {

            if (!canUseControls()) {
                return;
            }


            leftLightOn =
                !leftLightOn;


            leftLightBtn.classList.toggle(
                "active",
                leftLightOn
            );


            if (
                leftLightOn &&
                enemyPosition === 5
            ) {

                statusEl.textContent =
                    "👀 Щось стоїть біля лівого проходу!";

            }
            else {

                statusEl.textContent =
                    "Лівий прохід виглядає порожнім...";

            }

        }
    );


    rightLightBtn.addEventListener(
        "click",

        () => {

            if (!canUseControls()) {
                return;
            }


            rightLightOn =
                !rightLightOn;


            rightLightBtn.classList.toggle(
                "active",
                rightLightOn
            );


            if (
                rightLightOn &&
                enemyPosition === 5
            ) {

                statusEl.textContent =
                    "👀 Біля правого проходу хтось є!";

            }
            else {

                statusEl.textContent =
                    "Правий прохід виглядає порожнім...";

            }

        }
    );


    function canUseControls() {

        return (
            gameRunning &&
            power > 0
        );

    }


    // =============================
    // CAMERAS
    // =============================

    cameraBtn.addEventListener(
        "click",

        () => {

            if (!canUseControls()) {
                return;
            }


            camerasOpen = true;


            cameraPanel.classList.remove(
                "hidden"
            );


            renderCamera();

        }
    );


    closeCameraBtn.addEventListener(
        "click",

        closeCamera
    );


    function closeCamera() {

        camerasOpen = false;


        cameraPanel.classList.add(
            "hidden"
        );

    }


    cameraButtons.forEach(

        (button) => {

            button.addEventListener(
                "click",

                () => {

                    selectedCamera =
                        Number(
                            button.dataset.cam
                        );


                    cameraButtons.forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    cameraFlash();

                    renderCamera();

                }

            );

        }

    );


    function cameraFlash() {

        cameraPanel.style.opacity =
            "0.3";


        setTimeout(() => {

            cameraPanel.style.opacity =
                "1";

        }, 80);

    }


    function renderCamera() {

        cameraTitle.textContent =
            cameraNames[selectedCamera];


        if (
            enemyPosition ===
            selectedCamera
        ) {

            enemyVisual.classList.add(
                "visible"
            );


            cameraText.textContent =
                "⚠️ Щось знаходиться на цій камері...";

        }
        else {

            enemyVisual.classList.remove(
                "visible"
            );


            cameraText.textContent =
                "Нікого не видно...";

        }

    }


    // =============================
    // ENEMY AI
    // =============================

    function moveEnemy() {

        if (!gameRunning) {
            return;
        }


        const difficulty =
            0.40 +
            currentNight * 0.05;


        const chance =
            Math.random();


        if (
            chance < difficulty &&
            enemyPosition < 5
        ) {

            enemyPosition++;

        }
        else if (
            chance > 0.94 &&
            enemyPosition > 0
        ) {

            enemyPosition--;

        }


        if (camerasOpen) {

            renderCamera();

        }


        if (enemyPosition === 4) {

            statusEl.textContent =
                "📹 Ти чуєш дивний шум у коридорі...";

        }


        if (enemyPosition >= 5) {

            attackOffice();

        }

    }


    function attackOffice() {

        if (!gameRunning) {
            return;
        }


        const attackLeft =
            Math.random() < 0.5;


        if (attackLeft) {

            if (leftDoorClosed) {

                statusEl.textContent =
                    "💥 Щось вдарило у ліві двері!";


                enemyPosition = 2;

            }
            else {

                showWarning();


                setTimeout(() => {

                    loseGame(
                        "Ти не встиг закрити ліві двері."
                    );

                }, 900);

            }

        }
        else {

            if (rightDoorClosed) {

                statusEl.textContent =
                    "💥 Щось вдарило у праві двері!";


                enemyPosition = 2;

            }
            else {

                showWarning();


                setTimeout(() => {

                    loseGame(
                        "Ти не встиг закрити праві двері."
                    );

                }, 900);

            }

        }

    }


    // =============================
    // WARNING
    // =============================

    function showWarning() {

        warningScreen.classList.remove(
            "hidden"
        );


        setTimeout(() => {

            warningScreen.classList.add(
                "hidden"
            );

        }, 700);

    }


    // =============================
    // TIME
    // =============================

    function advanceTime() {

        if (!gameRunning) {
            return;
        }


        hour++;


        if (hour >= 6) {

            hour = 6;

            timeEl.textContent =
                "6 AM";


            winGame();

            return;
        }


        timeEl.textContent =
            `${hour} AM`;

    }


    // =============================
    // WIN
    // =============================

    function winGame() {

        if (!gameRunning) {
            return;
        }


        gameRunning = false;


        closeCamera();


        messageScreen.classList.remove(
            "hidden"
        );


        messageTitle.textContent =
            "🎉 6 AM";


        messageText.textContent =
            `Ти пережив ніч ${currentNight}!`;


        messageTitle.style.animation =
            "none";


        messageTitle.style.color =
            "#fff";

    }


    // =============================
    // LOSE
    // =============================

    function loseGame(reason) {

        if (!gameRunning) {
            return;
        }


        gameRunning = false;


        closeCamera();


        warningScreen.classList.add(
            "hidden"
        );


        messageScreen.classList.remove(
            "hidden"
        );


        messageTitle.textContent =
            "GAME OVER";


        messageText.textContent =
            reason;

    }


    // =============================
    // RESTART
    // =============================

    restartBtn.addEventListener(
        "click",

        () => {

            window.location.reload();

        }
    );


    // =============================
    // GAME LOOPS
    // =============================

    setInterval(
        updatePower,
        100
    );


    setInterval(
        moveEnemy,
        4500
    );


    /*
        1 година = 20 секунд
        повна ніч ≈ 2 хвилини
    */

    setInterval(
        advanceTime,
        20000
    );


    // =============================
    // START
    // =============================

    nightEl.textContent =
        currentNight;


    powerEl.textContent =
        Math.floor(power);


    timeEl.textContent =
        "12 AM";


    statusEl.textContent =
        "Слухай звуки та перевіряй камери...";


    console.log(
        "П'ять ночей в АТБ запущено!"
    );

});
