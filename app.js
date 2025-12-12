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

// Update overlay visibility based on Firebase statuses
function updateOverlays(statuses) {
  const inventoryItems = document.querySelectorAll('.inventory-item');
  const overlayItems = document.querySelectorAll('.overlay-item');

  inventoryItems.forEach((item, index) => {
    const overlay = overlayItems[index];

    if (overlay) {
      // Check the status (enabled or disabled) from Firebase and set overlay visibility
      if (statuses[index] === "enabled") {
        overlay.style.display = 'block';
      } else {
        overlay.style.display = 'none';
      }
    } else {
      console.error(`Overlay item at index ${index} not found.`);
    }
  });
}

// Update the overlay status in Firebase when a user clicks an item
function updateFirebaseStatus(index, status) {
  const statusRef = ref(db, `overlayStatus/${index}`);
  set(statusRef, status)
    .then(() => {
      console.log(`Overlay status for item ${index + 1} updated to ${status}`);
    })
    .catch((error) => {
      console.error("Error updating overlay status:", error);
    });
}

// Handle click event on inventory items
function handleItemClick(event) {
  const itemIndex = event.target.dataset.index;  // Assuming each inventory item has a data-index attribute
  const overlay = document.querySelector(`.overlay-item[data-index="${itemIndex}"]`);
  
  if (overlay) {
    // Toggle the visibility of the overlay
    if (overlay.style.display === 'none' || overlay.style.display === '') {
      overlay.style.display = 'block';
      updateFirebaseStatus(itemIndex, 'enabled');  // Update Firebase with the new status
    } else {
      overlay.style.display = 'none';
      updateFirebaseStatus(itemIndex, 'disabled');  // Update Firebase with the new status
    }
  } else {
    console.error(`Overlay for item ${itemIndex} not found.`);
  }
}

// Add event listeners to inventory items after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const inventoryItems = document.querySelectorAll('.inventory-item');
  const overlayItems = document.querySelectorAll('.overlay-item');

  console.log("DOM fully loaded and parsed!");

  // Log the inventory items
  console.log("Found", inventoryItems.length, "inventory items.");

  // Add click event listener to each inventory item
  inventoryItems.forEach((item, index) => {
    item.addEventListener('click', handleItemClick);
    item.dataset.index = index;  // Add an index to each inventory item for reference
    console.log(`Adding click event listener to item #${index + 1}`);
  });

  // Log the overlay items
  console.log("Found", overlayItems.length, "overlay items.");

  // Set up Firebase listener to update the overlays in real-time
  const statusRef = ref(db, 'overlayStatus/');
  onValue(statusRef, (snapshot) => {
    if (snapshot.exists()) {
      const statuses = snapshot.val();
      console.log('Realtime overlay statuses:', statuses);
      updateOverlays(statuses);  // Update the overlay visibility in real-time
    } else {
      console.log('No overlay statuses found in Firebase.');
    }
  });

  // Fetch initial statuses from Firebase when the page loads
  fetchInitialStatuses();
});