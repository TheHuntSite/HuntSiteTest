// This script manages the click interaction to change images in inventory slots

// Initialize the inventory state (using placeholder images)
const inventory = Array(28).fill("placeholder.png"); // 28 slots, all empty initially

// Fetch the inventory grid elements
const inventorySlots = document.querySelectorAll('.inventory-slot');

// Function to change the image on click
function changeImage(slotIndex) {
    // Toggle between a placeholder and an actual item image (for now, we use placeholder)
    const currentImage = inventory[slotIndex];
    inventory[slotIndex] = currentImage === "placeholder.png" ? "item.png" : "placeholder.png";

    // Update the image in the corresponding slot
    const slot = inventorySlots[slotIndex];
    const imgElement = slot.querySelector('img');
    imgElement.src = inventory[slotIndex];
    imgElement.alt = inventory[slotIndex] === "placeholder.png" ? "Empty Slot" : "Item Slot";
}

// Add event listeners for each slot
inventorySlots.forEach((slot, index) => {
    slot.addEventListener('click', () => changeImage(index));
});