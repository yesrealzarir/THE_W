/* =========================================
   THE W
   SUPABASE CONFIG
========================================= */

const SUPABASE_URL =
    "https://mtobiuuuvkuhyvwtcouz.supabase.co";

const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2JpdXV1dmt1aHl2d3Rjb3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MTM0OTEsImV4cCI6MjEwMjk4OTQ5MX0.osFVJGr2BiekiaQAFREZ4L1W8AqiaM7O4BcCN2_qbIw";


/* =========================================
   ACCESS REQUEST FUNCTION
========================================= */

const ACCESS_REQUEST_URL =
    "https://mtobiuuuvkuhyvwtcouz.supabase.co/functions/v1/access-request";


/* =========================================
   SUPABASE CLIENT
========================================= */

let supabaseClient;


/* =========================================
   MEMBER NAMES
========================================= */

const members = {

    xarif: "X",
    jaim: "J",
    marzia: "M",
    tahya: "T",
    zarir: "Z",
    tahmid: "T"

};


/* =========================================
   START
========================================= */

window.addEventListener(
    "DOMContentLoaded",
    async function () {

        /* Create Supabase client */

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        /* Check existing login */

        await checkSession();


        /* Login */

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                login
            );

        }


        /* Logout */

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logout
            );

        }


        /* Request Access */

        const requestAccessButton =
            document.getElementById(
                "requestAccessButton"
            );


        if (requestAccessButton) {

            requestAccessButton.addEventListener(
                "click",
                requestAccess
            );

        }

    }
);


/* =========================================
   CHECK SESSION
========================================= */

async function checkSession() {

    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();


    if (
        error ||
        !data.session
    ) {

        showLogin();

        return;

    }


    showApp(
        data.session.user
    );

}


/* =========================================
   LOGIN
========================================= */

async function login(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("email")
            .value
            .trim();


    const password =
        document
            .getElementById("password")
            .value;


    const errorBox =
        document.getElementById(
            "loginError"
        );


    errorBox.textContent =
        "Checking...";


    const {
        data,
        error
    } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


    if (error) {

        console.error(
            "Login error:",
            error
        );


        errorBox.textContent =
            "Login failed. Email/password check koro.";

        return;

    }


    errorBox.textContent = "";


    showApp(
        data.user
    );

}


/* =========================================
   REQUEST ACCESS
========================================= */

async function requestAccess() {

    const emailInput =
        document.getElementById(
            "requestEmail"
        );


    const message =
        document.getElementById(
            "requestMessage"
        );


    const button =
        document.getElementById(
            "requestAccessButton"
        );


    if (
        !emailInput ||
        !message ||
        !button
    ) {

        console.error(
            "Request Access elements not found."
        );

        return;

    }


    const email =
        emailInput.value.trim();


    /* Validate email */

    if (!email) {

        message.textContent =
            "Gmail address dao.";

        return;

    }


    if (!email.includes("@")) {

        message.textContent =
            "Valid email address dao.";

        return;

    }


    /* Disable button */

    button.disabled = true;

    button.textContent =
        "Sending...";


    message.textContent = "";


    try {

        const response =
            await fetch(
                ACCESS_REQUEST_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            email: email

                        })

                }
            );


        let result = {};

        try {

            result =
                await response.json();

        } catch {

            result = {};

        }


        /* Function returned an error */

        if (!response.ok) {

            throw new Error(
                result.error ||
                "Request failed."
            );

        }


        /* Success */

        message.textContent =
            "Request sent! Wait for approval.";

        emailInput.value = "";


    } catch (error) {

        console.error(
            "Access request error:",
            error
        );


        message.textContent =
            error.message ||
            "Could not send request. Try again later.";

    }


    /* Enable button again */

    button.disabled = false;

    button.textContent =
        "Request Access";

}


/* =========================================
   SHOW LOGIN
========================================= */

function showLogin() {

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );


    const app =
        document.getElementById(
            "app"
        );


    if (loginScreen) {

        loginScreen.classList.remove(
            "hidden"
        );

    }


    if (app) {

        app.classList.add(
            "hidden"
        );

    }

}


/* =========================================
   SHOW APP
========================================= */

async function showApp(user) {

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );


    const app =
        document.getElementById(
            "app"
        );


    if (loginScreen) {

        loginScreen.classList.add(
            "hidden"
        );

    }


    if (app) {

        app.classList.remove(
            "hidden"
        );

    }


    const currentMember =
        document.getElementById(
            "currentMember"
        );


    if (currentMember) {

        currentMember.textContent =
            user.email;

    }


    await loadAllMemories();

}


/* =========================================
   LOGOUT
========================================= */

async function logout() {

    const {
        error
    } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error(
            "Logout error:",
            error
        );

        return;

    }


    showLogin();

}


/* =========================================
   UPLOAD MEMORY
========================================= */

async function uploadMemory(member) {

    const {
        data: {
            user
        }
    } =
        await supabaseClient.auth.getUser();


    if (!user) {

        alert(
            "Please login first."
        );

        return;

    }


    const fileInput =
        document.getElementById(
            "file-" + member
        );


    const captionInput =
        document.getElementById(
            "caption-" + member
        );


    if (
        !fileInput ||
        !captionInput
    ) {

        alert(
            "Upload area not found."
        );

        return;

    }


    const file =
        fileInput.files[0];


    const caption =
        captionInput.value.trim();


    if (!file) {

        alert(
            "First choose a picture."
        );

        return;

    }


    if (!caption) {

        alert(
            "Caption dao."
        );

        return;

    }


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "Only image files are allowed."
        );

        return;

    }


    if (
        file.size >
        8 * 1024 * 1024
    ) {

        alert(
            "Picture must be under 8MB."
        );

        return;

    }


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        crypto.randomUUID()
        + "."
        + extension;


    const filePath =
        user.id
        + "/"
        + fileName;


    try {

        /* =================================
           UPLOAD FILE
        ================================= */

        const {
            error: uploadError
        } =
            await supabaseClient.storage
                .from("the-w-private")
                .upload(
                    filePath,
                    file,
                    {

                        cacheControl:
                            "3600",

                        upsert:
                            false

                    }
                );


        if (uploadError) {

            throw uploadError;

        }


        /* =================================
           SAVE DATABASE RECORD
        ================================= */

        const {
            error: databaseError
        } =
            await supabaseClient
                .from("memories")
                .insert({

                    user_id:
                        user.id,

                    member_name:
                        member,

                    caption:
                        caption,

                    file_path:
                        filePath

                });


        if (databaseError) {

            /* Remove uploaded file
               if database insert fails */

            await supabaseClient.storage
                .from("the-w-private")
                .remove([
                    filePath
                ]);

            throw databaseError;

        }


        /* Clear inputs */

        fileInput.value = "";

        captionInput.value = "";


        /* Refresh gallery */

        await loadAllMemories();


        alert(
            "Memory added successfully."
        );


    } catch (error) {

        console.error(
            "Upload error:",
            error
        );


        alert(
            "Something went wrong. Check your Supabase setup."
        );

    }

}


/* =========================================
   LOAD MEMORIES
========================================= */

async function loadAllMemories() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("memories")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Load memories error:",
            error
        );

        return;

    }


    const galleries = [

        "xarif",
        "jaim",
        "marzia",
        "tahya",
        "zarir",
        "tahmid"

    ];


    /* Clear galleries */

    galleries.forEach(
        function(member) {

            const gallery =
                document.getElementById(
                    "gallery-" + member
                );


            if (gallery) {

                gallery.innerHTML = "";

            }

        }
    );


    /* Render memories */

    for (
        const memory of data
    ) {

        await renderMemory(
            memory
        );

    }

}


/* =========================================
   RENDER ONE MEMORY
========================================= */

async function renderMemory(memory) {

    const gallery =
        document.getElementById(
            "gallery-" +
            memory.member_name
        );


    if (!gallery) {

        return;

    }


    /* =================================
       CREATE TEMPORARY SIGNED URL
    ================================= */

    const {
        data,
        error
    } =
        await supabaseClient.storage
            .from("the-w-private")
            .createSignedUrl(
                memory.file_path,
                3600
            );


    if (
        error ||
        !data
    ) {

        console.error(
            "Signed URL error:",
            error
        );

        return;

    }


    /* =================================
       CARD
    ================================= */

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "memory-card";


    /* =================================
       IMAGE
    ================================= */

    const image =
        document.createElement(
            "img"
        );


    image.src =
        data.signedUrl;


    image.alt =
        "THE W memory";


    /* =================================
       INFO
    ================================= */

    const info =
        document.createElement(
            "div"
        );


    info.className =
        "memory-info";


    /* =================================
       CAPTION
    ================================= */

    const caption =
        document.createElement(
            "div"
        );


    caption.className =
        "memory-caption";


    caption.textContent =
        memory.caption;


    info.appendChild(
        caption
    );


    /* =================================
       CHECK CURRENT USER
    ================================= */

    const {
        data: userData
    } =
        await supabaseClient.auth.getUser();


    const user =
        userData.user;


    /* =================================
       DELETE BUTTON
    ================================= */

    if (
        user &&
        user.id === memory.user_id
    ) {

        const deleteButton =
            document.createElement(
                "button"
            );


        deleteButton.className =
            "delete-memory";


        deleteButton.textContent =
            "Delete";


        deleteButton.onclick =
            function () {

                deleteMemory(
                    memory
                );

            };


        info.appendChild(
            deleteButton
        );

    }


    /* =================================
       APPEND CARD
    ================================= */

    card.appendChild(
        image
    );


    card.appendChild(
        info
    );


    gallery.appendChild(
        card
    );

}


/* =========================================
   DELETE MEMORY
========================================= */

async function deleteMemory(memory) {

    const confirmed =
        confirm(
            "Delete this memory?"
        );


    if (!confirmed) {

        return;

    }


    /* Get current user */

    const {
        data: {
            user
        }
    } =
        await supabaseClient.auth.getUser();


    if (
        !user ||
        user.id !== memory.user_id
    ) {

        alert(
            "You can only delete your own memories."
        );

        return;

    }


    /* =================================
       DELETE IMAGE
    ================================= */

    const {
        error: fileError
    } =
        await supabaseClient.storage
            .from("the-w-private")
            .remove([
                memory.file_path
            ]);


    if (fileError) {

        console.error(
            "File delete error:",
            fileError
        );


        alert(
            "Could not delete the picture."
        );

        return;

    }


    /* =================================
       DELETE DATABASE RECORD
    ================================= */

    const {
        error: databaseError
    } =
        await supabaseClient
            .from("memories")
            .delete()
            .eq(
                "id",
                memory.id
            );


    if (databaseError) {

        console.error(
            "Database delete error:",
            databaseError
        );

        alert(
            "Could not delete the memory."
        );

        return;

    }


    /* Refresh */

    await loadAllMemories();

}
