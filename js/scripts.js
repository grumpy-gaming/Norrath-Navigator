document.addEventListener("DOMContentLoaded", function() {
    fetch("../db/quests/quests.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load quest data");
            }
            return response.json();
        })
        .then(data => {
            const questSection = document.getElementById("quests");
            let questList = "<ul>";

            data.forEach(quest => {
                questList += `<li><strong>${quest.name}</strong>: ${quest.description}</li>`;
            });

            questList += "</ul>";
            questSection.innerHTML += questList;
        })
        .catch(error => {
            console.error("Error loading quest data:", error);
            document.getElementById("quests").innerHTML = "<p>Failed to load quest data.</p>";
        });
});
