
/* =========================================
   THE W
   SUPABASE CONFIG
========================================= */

const SUPABASE_URL =
    "https://mtobiuuuvkuhyvwtcouz.supabase.co";

const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2JpdXV1dmt1aHl2d3Rjb3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MTM0OTEsImV4cCI6MjEwMjk4OTQ5MX0.osFVJGr2BiekiaQAFREZ4L1W8AqiaM7O4BcCN2_qbIw";


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

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

        await checkSession();

        document
            .getElementById("loginForm")
            .addEventListener(
                "submit",
                login
            );

        document
            .getElementById("logoutButton")
            .addEventListener(
                "click",
                logout
            );

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
        document
            .getElementById("loginError");

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

        console.error(error);

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
   SHOW LOGIN
========================================= */

function showLogin() {

    document
        .getElementById("loginScreen")
        .classList.remove("hidden");

    document
        .getElementById("app")
        .classList.add("hidden");

}


/* =========================================
   SHOW APP
========================================= */

async function showApp(user) {

    document
        .getElementById("loginScreen")
        .classList.add("hidden");

    document
        .getElementById("app")
        .classList.remove("hidden");

    document
        .getElementById("currentMember")
        .textContent =
        user.email;

    await loadAllMemories();

}


/* =========================================
   LOGOUT
========================================= */

async function logout() {

    await supabaseClient.auth.signOut();

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


    if (!file.type.startsWith("image/")) {

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
                        cacheControl: "3600",
                        upsert: false
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

            await supabaseClient.storage
                .from("the-w-private")
                .remove([
                    filePath
                ]);

            throw databaseError;

        }


        fileInput.value = "";
        captionInput.value = "";


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


    const card =
        document.createElement(
            "div"
        );

    card.className =
        "memory-card";


    const image =
        document.createElement(
            "img"
        );

    image.src =
        data.signedUrl;

    image.alt =
        "THE W memory";


    const info =
        document.createElement(
            "div"
        );

    info.className =
        "memory-info";


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
       ONLY OWNER CAN DELETE
    ================================= */

    const {
        data: userData
    } =
        await supabaseClient.auth.getUser();


    const user =
        userData.user;


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

        return;

    }


    await loadAllMemories();

}
