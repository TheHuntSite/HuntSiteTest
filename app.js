document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed!");

    // Select all the inventory item images
    const inventoryItems = document.querySelectorAll('.inventory-item');
    console.log(`Found ${inventoryItems.length} inventory items.`);
    console.log(inventoryItems); // Verify that elements are being selected correctly

    // Add click event listeners to each inventory item
    inventoryItems.forEach((item, index) => {
        console.log(`Adding click event listener to item #${index + 1}`);
        
        item.addEventListener('click', (e) => {
            console.log(`Inventory item #${index + 1} clicked!`);

            const currentItem = e.target; // The clicked inventory item
            const overlay = currentItem.nextElementSibling; // The overlay image (next sibling)

            // Log to check the overlay's initial state before toggling
            console.log(`Overlay initial display state: ${overlay.style.display}`);

            // Toggle overlay visibility
            if (overlay.style.display === 'none' || overlay.style.display === '') {
                console.log('Showing overlay');
                overlay.style.display = 'block'; // Show the overlay
            } else {
                console.log('Hiding overlay');
                overlay.style.display = 'none'; // Hide the overlay
            }

            // Check if the overlay is actually displayed after the toggle
            console.log(`Overlay new display state: ${overlay.style.display}`);
        });
    });

    // Add click event listener to overlay items to hide them when clicked
    const overlays = document.querySelectorAll('.overlay-item');
    console.log(`Found ${overlays.length} overlay items.`);
    overlays.forEach((overlay, index) => {
        console.log(`Adding click event listener to overlay #${index + 1}`);
        
        overlay.addEventListener('click', (e) => {
            console.log(`Overlay #${index + 1} clicked!`);
            overlay.style.display = 'none'; // Hide the overlay when clicked
            console.log(`Overlay #${index + 1} hidden: ${overlay.style.display}`);
        });
    });

    // Log when the page is ready and event listeners are attached
    console.log("Event listeners are now attached to all inventory items and overlays.");
});