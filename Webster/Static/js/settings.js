// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Check if user is logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        // Display user info
        document.getElementById("profile-pic").src = user.photoURL;
        document.getElementById("user-name").textContent = user.displayName;
        document.getElementById("user-email").textContent = user.email;

        // Load user details from Firestore
        const userRef = db.collection("users").doc(user.uid);
        userRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                document.getElementById("gender").value = data.gender || "";
                document.getElementById("dob").value = data.dob || "";
                document.getElementById("address").value = data.address || "";
            }
        });
    } else {
        window.location.href = "login.html"; // Redirect if not logged in
    }
});

// Handle form submission
document.getElementById("settings-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    // Get input values
    const gender = document.getElementById("gender").value;
    const dob = document.getElementById("dob").value;
    const address = document.getElementById("address").value;

    // Save to Firestore
    db.collection("users").doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        profilePic: user.photoURL,
        gender: gender,
        dob: dob,
        address: address
    }, { merge: true })
    .then(() => {
        alert("Profile updated successfully!");
    })
    .catch((error) => {
        console.error("Error updating profile:", error);
    });
});
