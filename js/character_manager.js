// D:\Norrath-navigator\js\character_manager.js

document.addEventListener('DOMContentLoaded', () => {
    // Group list containers
    const mainCharListDiv = document.getElementById('main-characters-list');
    const altCharListDiv = document.getElementById('alt-characters-list');
    const traderBufferCharListDiv = document.getElementById('trader-buffer-characters-list');

    // Form elements
    const toggleAddCharacterFormBtn = document.getElementById('toggleAddCharacterFormBtn');
    const characterFormContainer = document.getElementById('characterFormContainer');
    const saveCharacterBtn = document.getElementById('saveCharacterBtn');
    const cancelCharacterBtn = document.getElementById('cancelCharacterBtn');

    // Input fields for the form
    const charNameInput = document.getElementById('charName');
    const charLevelInput = document.getElementById('charLevel');
    const charClass1Input = document.getElementById('charClass1');
    const charClass2Input = document.getElementById('charClass2');
    const charClass3Input = document.getElementById('charClass3');
    const charAccountNameInput = document.getElementById('charAccountName');
    const charGroupTypeSelect = document.getElementById('charGroupType');

    // State variable for editing: Stores the ID of the character being edited
    let editingCharacterId = null; 
    const formTitle = characterFormContainer.querySelector('h3'); // Reference to the form title

    // Mapping for class abbreviations to full names for tooltips
    const classFullNames = {
        'RNG': 'Ranger', 'SHD': 'Shadow Knight', 'WIZ': 'Wizard', 'PAL': 'Paladin',
        'CLR': 'Cleric', 'SHM': 'Shaman', 'MAG': 'Magician', 'ENC': 'Enchanter',
        'WAR': 'Warrior', 'ROG': 'Rogue', 'BRD': 'Bard', 'MNK': 'Monk',
        'DRU': 'Druid', 'NEC': 'Necromancer', 'BST': 'Beastlord', 'BER': 'Berserker',
        // Add any other class abbreviations you need here
    };

    // Helper function to get class icon path
    function getClassIconPath(classNameAbbr) {
        if (!classNameAbbr) return '';
        const filename = classNameAbbr.toLowerCase().trim() + '.png';
        return `../assets/class_icons/${filename}`; 
    }
	// Function to handle deleting a character
        async function deleteCharacter(charId) {
            if (!confirm('Are you sure you want to delete this character? This cannot be undone.')) {
                return; // User cancelled
            }

            try {
                const response = await fetch(`http://localhost:8080/api/characters/${charId}`, {
                    method: 'DELETE'
                });

                if (response.status === 204) { // 204 No Content is successful for DELETE
                    console.log(`Character ${charId} deleted successfully.`);
                    fetchCharacters(); // Refresh the list
                } else if (response.status === 404) {
                    alert('Character not found. It might have already been deleted.');
                    fetchCharacters(); // Still refresh in case it was a display issue
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error deleting character:', error);
                alert(`Could not delete character: ${error.message}`);
            }
        }
		// Function to handle editing a character: now navigates to detail page
		async function editCharacter(charId) {
			// Redirect to the new character_detail.html page, passing the character ID
			window.location.href = `character_detail.html?id=${charId}`; // FIXED: Removed 'html/' prefix
		}
		// Function to create and return a character card HTML element
        function createCharacterCard(char) {
            const charCard = document.createElement('div');
            charCard.className = 'character-card';

            let classIconsHtml = '';
            const class1Abbr = char.class1 ? char.class1.toUpperCase() : '';
            const class2Abbr = char.class2 ? char.class2.toUpperCase() : '';
            const class3Abbr = char.class3 ? char.class3.toUpperCase() : '';

            if (class1Abbr) classIconsHtml += `<img src="${getClassIconPath(class1Abbr)}" alt="${class1Abbr}" title="${classFullNames[class1Abbr] || class1Abbr}" class="class-icon">`;
            if (class2Abbr) classIconsHtml += `<img src="${getClassIconPath(class2Abbr)}" alt="${class2Abbr}" title="${classFullNames[class2Abbr] || class2Abbr}" class="class-icon">`;
            if (class3Abbr) classIconsHtml += `<img src="${getClassIconPath(class3Abbr)}" alt="${class3Abbr}" title="${classFullNames[class3Abbr] || class3Abbr}" class="class-icon">`;

            charCard.innerHTML = `
                <h3>${char.name} ${char.level} ${classIconsHtml} ${char.accountName}</h3>
                <div class="button-group">
                    <button class="edit-char-btn" data-id="${char.id}">Edit</button>
                    <button class="delete-char-btn" data-id="${char.id}">Delete</button>
                </div>
            `;
            return charCard;
        }
		async function fetchCharacters() {
            try {
                const response = await fetch('http://localhost:8080/api/characters');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const characters = await response.json();

                mainCharListDiv.innerHTML = '';
                altCharListDiv.innerHTML = '';
                traderBufferCharListDiv.innerHTML = '';

                let hasMain = false;
                let hasAlt = false;
                let hasTraderBuffer = false;

                characters.forEach(char => {
                    const charCard = createCharacterCard(char);

                    // Attach click listener to the DELETE button
                    const deleteButton = charCard.querySelector('.delete-char-btn');
                    if (deleteButton) {
                        deleteButton.addEventListener('click', () => deleteCharacter(char.id));
                    }
                    
                    // Attach click listener to the EDIT button
                    const editButton = charCard.querySelector('.edit-char-btn');
                    if (editButton) {
                        editButton.addEventListener('click', () => editCharacter(char.id));
                    }

                    switch (char.groupType) {
                        case 'main':
                            mainCharListDiv.appendChild(charCard);
                            hasMain = true;
                            break;
                        case 'alt':
                            altCharListDiv.appendChild(charCard);
                            hasAlt = true;
                            break;
                        case 'trader/buffer':
                            traderBufferCharListDiv.appendChild(charCard);
                            hasTraderBuffer = true;
                            break;
                        default:
                            console.warn(`Character ${char.name} has unrecognized group type: ${char.groupType}. Defaulting to main.`);
                            mainCharListDiv.appendChild(charCard);
                            hasMain = true;
                            break;
                    }
                });

                if (!hasMain) {
                    mainCharListDiv.innerHTML = '<p>No main characters found.</p>';
                }
                if (!hasAlt) {
                    altCharListDiv.innerHTML = '<p>No alt characters found.</p>';
                }
                if (!hasTraderBuffer) {
                    traderBufferCharListDiv.innerHTML = '<p>No trader/buffer characters found.</p>';
                }

            } catch (error) {
                console.error('Error fetching characters:', error);
                mainCharListDiv.innerHTML = `<p style="color: red;">Error loading characters: ${error.message}</p>`;
                altCharListDiv.innerHTML = '';
                traderBufferCharListDiv.innerHTML = '';
            }
        }
		// Toggle form visibility
        toggleAddCharacterFormBtn.addEventListener('click', () => {
            characterFormContainer.classList.toggle('hidden');
            if (!characterFormContainer.classList.contains('hidden')) {
                // Clear form for new entry
                formTitle.textContent = 'Add New Character Details'; // Set title to Add
                charNameInput.value = '';
                charLevelInput.value = '';
                charClass1Input.value = '';
                charClass2Input.value = '';
                charClass3Input.value = '';
                charAccountNameInput.value = '';
                charGroupTypeSelect.value = 'main';
                editingCharacterId = null; // Clear editing state
            }
        });

        cancelCharacterBtn.addEventListener('click', () => {
            characterFormContainer.classList.add('hidden'); // Hide the form
            editingCharacterId = null; // Clear editing state on cancel
            formTitle.textContent = 'Add New Character Details'; // Reset title
        });


        // Save Character (Handles both Add and Edit based on editingCharacterId)
        saveCharacterBtn.addEventListener('click', async () => {
            const charData = {
                name: charNameInput.value.trim(),
                level: parseInt(charLevelInput.value.trim(), 10),
                class1: charClass1Input.value.trim(),
                class2: charClass2Input.value.trim(),
                class3: charClass3Input.value.trim(),
                accountName: charAccountNameInput.value.trim(),
                groupType: charGroupTypeSelect.value
            };

            // Basic validation
            if (!charData.name || isNaN(charData.level) || !charData.accountName || !charData.groupType) {
                alert('Please fill in Name, Level, Account Name, and Group Type.');
                return;
            }

            const method = editingCharacterId ? 'PUT' : 'POST';
            const url = editingCharacterId ? `http://localhost:8080/api/characters/${editingCharacterId}` : 'http://localhost:8080/api/characters';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(charData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const resultChar = await response.json();
                console.log('Character saved:', resultChar);
                
                characterFormContainer.classList.add('hidden'); // Hide form after saving
                editingCharacterId = null; // Clear editing state
                formTitle.textContent = 'Add New Character Details'; // Reset title
                fetchCharacters(); // Refresh the list
            } catch (error) {
                console.error('Error saving character:', error);
                alert(`Could not save character: ${error.message}`);
            }
        });

        // Initial fetch when the page loads
        fetchCharacters();
    }); // CLOSING BRACE FOR document.addEventListener('DOMContentLoaded', () => {