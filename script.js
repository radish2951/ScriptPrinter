function toZenKaku(str) {
  // 半角数字を全角数字に変換する
  return str.replace(/[0-9]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) + 0xfee0);
  });
}

// テキストファイルを読み込んで台本を表示する関数
function loadScript() {
  const input = document.getElementById("fileInput");
  if ("files" in input && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      displayScript(text);
    };

    reader.readAsText(file, "UTF-8");
  }
}

function displayScript(text) {
  const lines = text.split(/\r\n|\n/);
  const scriptContainer = document.getElementById("scriptContainer");
  const characterList = new Set(); // Use a set to avoid duplicates
  scriptContainer.innerHTML = ""; // Clear previous content

  lines.forEach((line) => {
    const charDialogueDiv = document.createElement("div");
    charDialogueDiv.className = "character-dialogue";

    const match = line.match(/^(.*?)「(.*?)」$/);
    if (match) {
      const character = match[1];
      const dialogue = match[2];
      characterList.add(character); // Add character to the list for checkboxes

      // Create and append character name span
      const characterSpan = document.createElement("span");
      characterSpan.className = "character-name";
      characterSpan.textContent = toZenKaku(character);
      charDialogueDiv.appendChild(characterSpan);

      // Create and append dialogue span
      const dialogueSpan = document.createElement("span");
      dialogueSpan.className = "dialogue";
      dialogueSpan.textContent = toZenKaku(dialogue);
      charDialogueDiv.appendChild(dialogueSpan);
    } else {
      // If the line doesn't match the expected format, treat it as a dialogue-only line
      const dialogueSpan = document.createElement("span");
      dialogueSpan.className = "dialogue";
      dialogueSpan.textContent = toZenKaku(line);
      charDialogueDiv.appendChild(dialogueSpan);
    }

    scriptContainer.appendChild(charDialogueDiv);
  });

  displayCharacterCheckboxes(characterList); // Display checkboxes after processing the script
}

// Displays checkboxes for each character in the script
function displayCharacterCheckboxes(characterList) {
  const listContainer = document.getElementById("characterList");
  listContainer.innerHTML = ""; // Clear previous content

  characterList.forEach((character) => {
    if (character.trim() !== "") {
      // Don't create a checkbox for empty character names
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = character;
      checkbox.onchange = toggleCharacterHighlight;

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(character));
      listContainer.appendChild(label);
    }
  });
}

// Toggle the highlighted class for the dialogues of the selected character
function toggleCharacterHighlight(event) {
  const character = event.target.value;
  const dialogues = document.querySelectorAll(".character-dialogue");

  dialogues.forEach((charDialogueDiv) => {
    const characterSpan = charDialogueDiv.querySelector(".character-name");
    if (characterSpan && characterSpan.textContent === character) {
      const dialogueSpan = charDialogueDiv.querySelector(".dialogue");
      if (event.target.checked) {
        dialogueSpan.classList.add("highlighted");
      } else {
        dialogueSpan.classList.remove("highlighted");
      }
    }
  });
}

// Toggle the display of the checkboxes container
document.getElementById("toggleButton").onclick = function () {
  var checkboxesContainer = document.getElementById("checkboxesContainer");
  if (checkboxesContainer.style.display === "none") {
    checkboxesContainer.style.display = "block";
    this.textContent = "×"; // Change button text
  } else {
    checkboxesContainer.style.display = "none";
    this.textContent = "≡"; // Change button text
  }
};
