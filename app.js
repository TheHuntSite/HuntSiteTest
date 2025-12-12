// Import necessary Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, set, onValue, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

 // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNSd6smxpEtppVuEhtRaC-19XcyPNglP0",
  authDomain: "huntsite-64e23.firebaseapp.com",
  databaseURL: "https://huntsite-64e23-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "huntsite-64e23",
  storageBucket: "huntsite-64e23.firebasestorage.app",
  messagingSenderId: "1063124348808",
  appId: "1:1063124348808:web:c9e835ad82edada18c143d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed!');

    // Get all inventory items and overlay items
    const inventoryItems = document.querySelectorAll('.inventory-item');
    const overlayItems = document.querySelectorAll('.overlay-item');

    console.log('Found inventory items:', inventoryItems);
    console.log('Found overlay items:', overlayItems);

    // Add event listeners to inventory items
    inventoryItems.forEach((item, index) => {
        console.log(`Adding click event listener to item #${index + 1}`);
        item.addEventListener('click', () => {
            console.log(`Item #${index + 1} clicked!`);
            toggleOverlay(index + 1); // Toggle overlay for the clicked item
        });
    });

    // Add event listeners to overlay items (to hide them on click)
    overlayItems.forEach((overlay, index) => {
        console.log(`Adding click event listener to overlay #${index + 1}`);
        overlay.addEventListener('click', () => {
            console.log(`Overlay #${index + 1} clicked!`);
            toggleOverlay(index + 1); // Toggle overlay for the clicked item
        });
    });

    // Set up initial overlay state from Firebase
    setUpOverlays();
});

// Set up overlays by reading the data from Firebase
function setUpOverlays() {
    const overlaysRef = ref(database, 'overlays');
    onValue(overlaysRef, (snapshot) => {
        const overlays = snapshot.val();
        console.log('Current overlay statuses:', overlays);

        document.querySelectorAll('.inventory-item').forEach((item, index) => {
            const overlayItem = document.querySelector(`#overlay-${index + 1}`);

            // Show or hide the overlay based on Firebase data
            if (overlays && overlays[index + 1]) {
                overlayItem.style.display = 'block';  // Show overlay
            } else {
                overlayItem.style.display = 'none';  // Hide overlay
            }
        });
    });
}

// Toggle the overlay (show/hide) when clicked
function toggleOverlay(index) {
    const overlayRef = ref(database, `overlays/${index}`);
    get(overlayRef).then((snapshot) => {
        const currentStatus = snapshot.val();
        const newStatus = !currentStatus;  // Toggle the current status
        set(overlayRef, newStatus); // Update the status in Firebase
    });
}