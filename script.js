/* =========================================
   THE W
   SUPABASE CONFIG
========================================= */

const SUPABASE_URL =
    "https://mtobiuuuvkuhyvwtcouz.supabase.co";

const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2JpdXV1dmt1d3Rjb3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MTM0OTEsImV4cCI6MjEwMjk4OTQ5MX0.osFVJGr2BiekiaQAFREZ4L1W8AqiaM7O4BcCN2_qbIw";


/* =========================================
   ACCESS REQUEST EDGE FUNCTION
========================================= */

const ACCESS_REQUEST_URL =
    `${SUPABASE_URL}/functions/v1/access-request`;


/* =========================================
   SUPABASE CLIENT
========================================= */

let supabaseClient;


/* =========================================
   MEMBERS
========================================= */

const galleries = [
    "xarif",
    "jaim",
    "marzia",
    "tahya",
    "zarir",
    "tahmid"
];


/* =========================================
   START
========================================= */

window.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (!window.supabase) {
            console.error(
                "Supabase library did not load."
            );

            return;
        }


        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        setupEventListeners();


        await checkSession();

    }
);


/* =========================================
   EVENT LISTENERS
========================================= */

function setupEventListeners() {

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


    const forgotPasswordButton =
        document.getElementById(
            "forgotPasswordButton"
        );

    if (forgotPasswordButton) {
        forgotPasswordButton.addEventListener(
            "click",
            sendPasswordReset
        );
    }


    const resetPasswordForm =
        document.getElementById(
            "resetPasswordForm"
        );

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener(
            "submit",
            updatePassword
        );
    }


    const backToLoginButton =
        document.getElementById(
            "backToLoginButton"
        );

    if (backToLoginButton) {
        backToLoginButton.addEventListener(
            "click",
            showLogin
        );
    }


    supabaseClient.auth.onAuthStateChange(
        async (event, session) => {

            if (
                event === "PASSWORD_RECOVERY"
            ) {

                showResetPassword();

                return;
            }


            if (
                event === "SIGNED_OUT"
            ) {

                showLogin();

                return;
            }


            if (
                session &&
                event === "SIGNED_IN"
            ) {

                showApp(
                    session.user
                );

            }

        }
    );

}


/* =========================================
   CHECK SESSION
========================================= */

async function checkSession() {

    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Session error:",
            error
        );

        showLogin();

        return;
    }


    if (!data.session) {

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


    const emailInput =
        document.getElementById(
            "email"
        );

    const passwordInput =
        document.getElementById(
            "password"
        );

    const errorBox =
        document.getElementById(
            "loginError"
        );


    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    errorBox.textContent =
        "Checking...";


    const {
        data,
        error
    } =
        await supabaseClient.auth.signInWithPassword({

            email,
            password

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
   FORGOT PASSWORD
========================================= */

async function sendPasswordReset() {

    const emailInput =
        document.getElementById(
            "email"
        );

    const errorBox =
        document.getElementById(
            "loginError"
        );


    const email =
        emailInput.value.trim();


    if (!email) {

        errorBox.textContent =
            "Age tomar email address dao.";

        emailInput.focus();

        return;
    }


    errorBox.textContent =
        "Sending password reset email...";


    const redirectUrl =
        `${window.location.origin}${window.location.pathname}`;


    const {
        error
    } =
        await supabaseClient.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: redirectUrl
            }
        );


    if (error) {

        console.error(
            "Password reset error:",
            error
        );


        errorBox.textContent =
            error.message;

        return;
    }


    errorBox.textContent =
        "Password reset link sent. Email check koro.";

}


/* =========================================
   SHOW RESET PASSWORD
========================================= */

function showResetPassword() {

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );

    const resetScreen =
        document.getElementById(
            "resetPasswordScreen"
        );

    const app =
        document.getElementById(
            "app"
        );


    loginScreen.classList.add(
        "hidden"
    );

    app.classList.add(
        "hidden"
    );

    resetScreen.classList.remove(
        "hidden"
    );

}


/* =========================================
   UPDATE PASSWORD
========================================= */

async function updatePassword(event) {

    event.preventDefault();


    const newPassword =
        document.getElementById(
            "newPassword"
        ).value;

    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        ).value;

    const message =
        document.getElementById(
            "resetMessage"
        );


    if (
        newPassword.length < 6
    ) {

        message.textContent =
            "Password must be at least 6 characters.";

        return;
    }


    if (
        newPassword !==
        confirmPassword
    ) {

        message.textContent =
            "Passwords do not match.";

        return;
    }


    message.textContent =
        "Updating password...";


    const {
        error
    } =
        await supabaseClient.auth.updateUser({

            password:
                newPassword

        });


    if (error) {

        console.error(
            "Update password error:",
            error
        );


        message.textContent =
            error.message;

        return;
    }


    message.textContent =
        "Password updated successfully!";


    document.getElementById(
        "newPassword"
    ).value = "";

    document.getElementById(
        "confirmPassword"
    ).value = "";


    setTimeout(
        async () => {

            await supabaseClient.auth.signOut();

            showLogin();

        },
        1500
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


    const email =
        emailInput.value.trim();


    if (!email) {

        message.textContent =
            "Gmail address dao.";

        return;
    }


    if (
        !email.includes("@") ||
        !email.includes(".")
    ) {

        message.textContent =
            "Valid email address dao.";

        return;
    }


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
                            email
                        })

                }
            );


        let result = {};

        try {

           const responseText = await response.text();

let result = {};

try {
    result = responseText
        ? JSON.parse(responseText)
        : {};
} catch {
    result = {
        error: responseText
    };
}

console.log("ACCESS REQUEST STATUS:", response.status);
console.log("ACCESS REQUEST RESPONSE:", result);

if (!response.ok) {
    throw new Error(
        result.error ||
        `Request failed (${response.status})`
    );
}

if (!response.ok) {

    throw new Error(
        result.error ||
        `Request failed (${response.status}).`
    );

}


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
            "Could not send request.";

    }


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

    const resetScreen =
        document.getElementById(
            "resetPasswordScreen"
        );

    const app =
        document.getElementById(
            "app"
        );


    loginScreen.classList.remove(
        "hidden"
    );

    resetScreen.classList.add(
        "hidden"
    );

    app.classList.add(
        "hidden"
    );

}


/* =========================================
   SHOW APP
========================================= */

async function showApp(user) {

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );

    const resetScreen =
        document.getElementById(
            "resetPasswordScreen"
        );

    const app =
        document.getElementById(
            "app"
        );


    loginScreen.classList.add(
        "hidden"
    );

    resetScreen.classList.add(
        "hidden"
    );

    app.classList.remove(
        "hidden"
    );


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
        data: userData
    } =
        await supabaseClient.auth.getUser();


    const user =
        userData.user;


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
        `${crypto.randomUUID()}.${extension}`;


    const filePath =
        `${user.id}/${fileName}`;


    try {

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
            error.message ||
            "Something went wrong. Check your Supabase setup."
        );

    }

}


/* =========================================
   LOAD ALL MEMORIES
========================================= */

async function loadAllMemories() {

    if (!supabaseClient) {
        return;
    }


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


    galleries.forEach(
        member => {

            const gallery =
                document.getElementById(
                    `gallery-${member}`
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
   RENDER MEMORY
========================================= */

async function renderMemory(memory) {

    const gallery =
        document.getElementById(
            `gallery-${memory.member_name}`
        );


    if (!gallery) {
        return;
    }


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
        !data?.signedUrl
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

    image.loading =
        "lazy";


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


    const {
        data: currentUserData
    } =
        await supabaseClient.auth.getUser();


    const currentUser =
        currentUserData.user;


    if (
        currentUser &&
        currentUser.id === memory.user_id
    ) {

        const deleteButton =
            document.createElement(
                "button"
            );

        deleteButton.className =
            "delete-memory";

        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            () => deleteMemory(memory)
        );


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
        data: userData
    } =
        await supabaseClient.auth.getUser();


    const user =
        userData.user;


    if (
        !user ||
        user.id !== memory.user_id
    ) {

        alert(
            "You can only delete your own memories."
        );

        return;
    }


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


    await loadAllMemories();

}


/* =========================================
   EXPOSE UPLOAD FUNCTION
========================================= */

window.uploadMemory =
    uploadMemory;
