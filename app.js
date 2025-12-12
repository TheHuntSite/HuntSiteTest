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
const db = getDatabase(app);

// Fetch initial overlay statuses from Firebase
function fetchInitialStatuses() {
  const statusRef = ref(db, 'overlayStatus/');
  get(statusRef)
    .then(snapshot => {
      if (snapshot.exists()) {
        const statuses = snapshot.val();
        console.log("Initial overlay statuses fetched from Firebase:", statuses);
        updateOverlays(statuses);  // Update overlays based on fetched data
      } else {
        console.log("No overlay statuses found in Firebase.");
      }
    })
    .catch(error => {
      console.error("Error fetching overlay statuses:", error);
    });
}

// Update overlays based on fetched statuses
function updateOverlays(statuses) {
  const overlayItems = document.querySelectorAll('.overlay-item');
  console.log("Updating overlays based on statuses");

  overlayItems.forEach((overlay, index) => {
    const status = statuses[index];
    // Convert 1 to 'enabled' and 0 to 'disabled'
    if (status === 1) {
      overlay.style.display = 'block'; // Show overlay
    } else {
      overlay.style.display = 'none'; // Hide overlay
    }
    console.log(`Overlay #${index} set to ${status === 1 ? 'enabled' : 'disabled'}`);
  });
}

// Send updated status to Firebase
function updateStatusInFirebase(index, newStatus) {
  const statusRef = ref(db, `overlayStatus/${index}`);
  set(statusRef, newStatus)
    .then(() => {
      console.log(`Overlay status for item #${index} updated to ${newStatus === 1 ? 'enabled' : 'disabled'}`);
    })
    .catch((error) => {
      console.error(`Error updating status for item #${index}:`, error);
    });
}

// Add click listener to inventory items
function addItemClickListeners() {
  const inventoryItems = document.querySelectorAll('.inventory-item');
  const overlayItems = document.querySelectorAll('.overlay-item');

  console.log("Inventory items found:", inventoryItems.length);
  console.log("Overlay items found:", overlayItems.length);

  inventoryItems.forEach((item, index) => {
    console.log(`Adding click event listener to item #${index + 1}`);
    item.addEventListener('click', () => {
      const overlay = document.querySelector(`.overlay-item[data-index="${index}"]`);
      if (overlay) {
        // Toggle overlay display
        const currentStatus = overlay.style.display === 'none' ? 1 : 0; // Use 1 for enabled, 0 for disabled
        overlay.style.display = currentStatus === 1 ? 'block' : 'none';

        // Update status in Firebase
        updateStatusInFirebase(index, currentStatus);
      } else {
        console.error(`Overlay for item #${index} not found!`);
      }
    });
  });
}

// Initialize app and listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded and parsed!");

  // Fetch overlay statuses from Firebase when the page loads
  fetchInitialStatuses();

  // Add event listeners to inventory items
  addItemClickListeners();
});