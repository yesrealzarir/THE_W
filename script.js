/* =========================
   THE W JAVASCRIPT
========================= */


/* SECRET PASSWORD */

const secretPassword = "zarir is the goat";


/* =========================
   HUMAN VERIFICATION
========================= */

function verifyHuman() {

    const checkbox =
        document.getElementById("checkbox");

    const loading =
        document.getElementById("loading");

    checkbox.classList.add("checked");

    checkbox.innerHTML = "✓";

    loading.style.display = "block";


    setTimeout(function () {

        document.getElementById("humanScreen")
            .style.display = "none";

        document.getElementById("passwordScreen")
            .style.display = "flex";

    }, 1200);
}


/* =========================
   PASSWORD
========================= */

function checkPassword() {

    const entered =
        document.getElementById("password")
        .value
        .trim()
        .toLowerCase();

    const error =
        document.getElementById("passwordError");


    if (entered === secretPassword) {

        document.getElementById("passwordScreen")
            .style.display = "none";

        document.getElementById("website")
            .style.display = "block";

        window.scrollTo(0, 0);

    } else {

        error.textContent =
            "Wrong password 💀 Try again.";

    }
}


/* =========================
   SECRET BUTTON
========================= */

function showSecret() {

    const message =
        document.getElementById("secretMessage");

    message.textContent =
        "Welcome to THE W. এখন normal behave করার চেষ্টা করো. 💀";

}


/* =========================
   ENTER KEY
========================= */

document
    .getElementById("password")
    .addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            checkPassword();
        }

    });
