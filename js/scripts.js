document.addEventListener("DOMContentLoaded", function() {
    fetch("../db/quests/epic_1.0/BER_epic.json")
        .then(response => response.json())
        .then(data => {
            const questSection = document.getElementById("quests");
            let questList = "<ul>";

            data.steps.forEach((step, index) => {
                let status = step.completed ? "✅ Completed" : "❌ Not Completed";
                questList += `<li>
                    <strong>Step ${step.step_number}:</strong> ${step.description} <br>
                    <em>Location:</em> ${step.location} <br>
                    <em>NPC:</em> ${step.npc} <br>
                    <button onclick="toggleCompletion(${index})">${status}</button>
                </li>`;
            });

            questList += "</ul>";
            questSection.innerHTML = questList;
        })
        .catch(error => {
            console.error("Error loading quest data:", error);
            document.getElementById("quests").innerHTML = "<p>Failed to load quest data.</p>";
        });
});

function toggleCompletion(index) {
    fetch("../db/quests/epic_1.0/BER_epic.json")
        .then(response => response.json())
        .then(data => {
            data.steps[index].completed = !data.steps[index].completed;
            localStorage.setItem("questProgress", JSON.stringify(data));
            location.reload();
        });
}
