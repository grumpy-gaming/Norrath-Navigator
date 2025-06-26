// D:\Norrath-navigator\js\character_detail.js

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const characterId = urlParams.get('id');

    const characterNameDisplay = document.getElementById('character-name-display');
    const charLevelDisplay = document.getElementById('char-level');
    const charAccountDisplay = document.getElementById('char-account');
    const charClassesDisplay = document.getElementById('char-classes');
    const charGroupDisplay = document.getElementById('char-group');
    
    // Inventory display sections
    const equippedSlotsDiv = document.getElementById('equipped-slots');
    const mainInventorySlotsDiv = document.getElementById('main-inventory-slots');
    const bankSlotsDiv = document.getElementById('bank-slots');
	// Mapping for class abbreviations to full names for tooltips
        const classFullNames = {
            'RNG': 'Ranger', 'SHD': 'Shadow Knight', 'WIZ': 'Wizard', 'PAL': 'Paladin',
            'CLR': 'Cleric', 'SHM': 'Shaman', 'MAG': 'Magician', 'ENC': 'Enchanter',
            'WAR': 'Warrior', 'ROG': 'Rogue', 'BRD': 'Bard', 'MNK': 'Monk',
            'DRU': 'Druid', 'NEC': 'Necromancer', 'BST': 'Beastlord', 'BER': 'Berserker',
            // Add any other class abbreviations you need here
        };

        // FIXED: getClassIconPath - ensure classNameAbbr is a string before operations
        function getClassIconPath(classNameAbbr) {
            if (typeof classNameAbbr !== 'string' || !classNameAbbr.trim()) return '';
            const filename = classNameAbbr.toLowerCase().trim() + '.png';
            return `../assets/class_icons/${filename}`;
        }
		// Helper to get item icon path (Placeholder for now)
        function getItemIconPath(itemName) {
            // For now, let's use dummy icons, or a default icon.
            // You'll eventually replace this with actual item icons if you have them.
            const filename = itemName.toLowerCase().replace(/ /g, '_') + '.png'; // e.g., "Rusty Long Sword" -> "rusty_long_sword.png"
            return `../assets/item_icons/${filename}`; // Assume item icons are in assets/item_icons/
        }

        // Function to create an item slot HTML element
        function createItemSlotHtml(itemInstance) {
            // itemInstance is a CharacterItem object from backend
            // It has item.name, item.slotType, locationType, slotName
            const itemName = itemInstance.item ? itemInstance.item.name : 'Unknown Item';
            const itemIconSrc = getItemIconPath(itemName);
            const slotName = itemInstance.slotName || '';

            return `
                <div class="inventory-slot ${itemInstance.locationType.toLowerCase()}">
                    <img src="${itemIconSrc}" alt="${itemName}" title="${itemName} (${slotName})">
                    <span class="slot-text">${slotName}</span>
                </div>
            `;
        }
		// Helper to get item icon path (Placeholder for now)
        function getItemIconPath(itemName) {
            // For now, let's use dummy icons, or a default icon.
            // You'll eventually replace this with actual item icons if you have them.
            const filename = itemName.toLowerCase().replace(/ /g, '_') + '.png'; // e.g., "Rusty Long Sword" -> "rusty_long_sword.png"
            return `../assets/item_icons/${filename}`; // Assume item icons are in assets/item_icons/
        }

        // Function to create an item slot HTML element
        function createItemSlotHtml(itemInstance) {
            // itemInstance is a CharacterItem object from backend
            // It has item.name, item.slotType, locationType, slotName
            const itemName = itemInstance.item ? itemInstance.item.name : 'Unknown Item';
            const itemIconSrc = getItemIconPath(itemName);
            const slotName = itemInstance.slotName || '';

            return `
                <div class="inventory-slot ${itemInstance.locationType.toLowerCase()}">
                    <img src="${itemIconSrc}" alt="${itemName}" title="${itemName} (${slotName})">
                    <span class="slot-text">${slotName}</span>
                </div>
            `;
        }
		async function fetchAndDisplayCharacterDetails(id) {
            try {
                const response = await fetch(`http://localhost:8080/api/characters/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const character = await response.json();

                characterNameDisplay.textContent = character.name;
                charLevelDisplay.textContent = character.level;
                charAccountDisplay.textContent = character.accountName;
                charGroupDisplay.textContent = character.groupType;

                let classesHtml = '';
                const classAbbrs = [
                    character.class1,
                    character.class2,
                    character.class3
                ].filter(Boolean).map(c => c.toUpperCase()); // Filter out nulls and convert to uppercase

                if (classAbbrs.length === 0) {
                    charClassesDisplay.textContent = 'N/A'; // If no classes, display N/A
                } else {
                    classAbbrs.forEach(abbr => {
                        const img = document.createElement('img');
                        img.src = getClassIconPath(abbr);
                        img.alt = abbr;
                        img.title = classFullNames[abbr] || abbr; // Get full name or use abbr
                        img.classList.add('class-icon'); // Add class for styling

                        charClassesDisplay.appendChild(img); // Append the image element
                    });
                }

            } catch (error) {
                console.error('Error fetching character details:', error);
                characterNameDisplay.textContent = 'Error loading character';
                alert(`Error loading character details: ${error.message}`);
            }
        }
		async function fetchAndDisplayInventory(id) {
            try {
                const response = await fetch(`http://localhost:8080/api/inventory/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const inventoryItems = await response.json();

                // Clear existing placeholder slots (if any) and actual items
                equippedSlotsDiv.innerHTML = '<h3>Equipped Items</h3>'; // Keep heading
                mainInventorySlotsDiv.innerHTML = '<h3>Main Inventory & Bags</h3>'; // Keep heading
                bankSlotsDiv.innerHTML = '<h3>Bank & Shared Bank</h3>'; // Keep heading

                if (inventoryItems.length === 0) {
                    equippedSlotsDiv.innerHTML += '<p>No equipped items.</p>';
                    mainInventorySlotsDiv.innerHTML += '<p>Empty inventory.</p>';
                    bankSlotsDiv.innerHTML += '<p>Empty bank.</p>';
                } else {
                    inventoryItems.forEach(itemInstance => {
                        const itemHtml = createItemSlotHtml(itemInstance);
                        
                        // Append to correct section based on locationType
                        if (itemInstance.locationType === 'EQUIPPED') {
                            equippedSlotsDiv.innerHTML += itemHtml;
                        } else if (itemInstance.locationType === 'INVENTORY') {
                            mainInventorySlotsDiv.innerHTML += itemHtml;
                        } else if (itemInstance.locationType === 'BANK' || itemInstance.locationType === 'SHARED_BANK') {
                            bankSlotsDiv.innerHTML += itemHtml;
                        }
                    });
                    // Re-add default empty slots if no items of that type are found
                    // These loops check if any item in the inventoryItems array matches the location type
                    if (!inventoryItems.some(item => item.locationType === 'EQUIPPED')) equippedSlotsDiv.innerHTML += '<p>No equipped items.</p>';
                    if (!inventoryItems.some(item => item.locationType === 'INVENTORY')) mainInventorySlotsDiv.innerHTML += '<p>Empty inventory.</p>';
                    if (!inventoryItems.some(item => item.locationType === 'BANK' || item.locationType === 'SHARED_BANK')) bankSlotsDiv.innerHTML += '<p>Empty bank.</p>';

                }
            } catch (error) {
                console.error('Error fetching inventory:', error);
                equippedSlotsDiv.innerHTML += `<p style="color: red;">Error loading inventory: ${error.message}</p>`;
                mainInventorySlotsDiv.innerHTML = '<h3>Main Inventory & Bags</h3>'; // Reset in case of error
                bankSlotsDiv.innerHTML = '<h3>Bank & Shared Bank</h3>'; // Reset in case of error
            }
        }
		// --- Main Execution ---
        if (characterId) {
            await fetchAndDisplayCharacterDetails(characterId); // First, load character details
            await fetchAndDisplayInventory(characterId);       // Then, load and display inventory
        } else {
            characterNameDisplay.textContent = 'No Character Selected';
            alert('No character ID provided in URL.');
        }
		// --- Inventory Drop Zone Logic ---
        const inventoryDropZone = document.getElementById('inventory-drop-zone');

        inventoryDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            inventoryDropZone.classList.add('dragover');
        });

        inventoryDropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            inventoryDropZone.classList.remove('dragover');
        });

        inventoryDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            inventoryDropZone.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type === 'text/plain') { // Ensure it's a text file
                    const reader = new FileReader();
                    reader.onload = async (event) => { // Made onload async
                        const fileContent = event.target.result;
                        console.log("File content loaded:", file.name, fileContent.substring(0, Math.min(fileContent.length, 200)) + '...'); // Log snippet

                        try {
                            const response = await fetch(`http://localhost:8080/api/inventory/${characterId}/upload`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'text/plain' // Send as plain text
                                },
                                body: fileContent
                            });

                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }

                            const result = await response.text(); // Get response as text
                            alert(result); // Show backend message
                            fetchAndDisplayInventory(characterId); // Refresh inventory after upload

                        } catch (error) {
                            console.error('Error uploading inventory log:', error);
                            alert(`Error uploading inventory log: ${error.message}`);
                        }
                    };
                    reader.readAsText(file);
                } else {
                    alert('Please drop a plain text (.txt) file.');
                }
            }
        });
	}); // CLOSING BRACE FOR document.addEventListener('DOMContentLoaded', async () => {