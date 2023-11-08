function toZenKaku(str) {
  // 半角数字を全角数字に変換する
  return str.replace(/[0-9]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) + 0xfee0);
  });
}

function loadCSV(event) {
  const input = event.target;
  if ("files" in input && input.files.length > 0) {
    readFileContent(input.files[0])
      .then((content) => {
        parseCSV(content);
      })
      .catch((error) => console.log(error));
  }
}

function readFileContent(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file, "UTF-8");
  });
}

function parseCSV(csvData) {
  const lines = csvData.split(/\r\n|\n/);
  const scriptContainer = document.getElementById("scriptContainer");
  const characterList = new Set(); // Use a set to avoid duplicates
  scriptContainer.innerHTML = ""; // Clear previous content

  lines.forEach((line) => {
    const charDialogueDiv = document.createElement("div");
    charDialogueDiv.className = "character-dialogue";

    if (line.trim()) {
      const [character, dialogue] = line.split(",");
      if (character) {
        characterList.add(character.replace(/"/g, "")); // Remove double quotes
        const characterSpan = document.createElement("span");
        characterSpan.className = "character-name";
        characterSpan.textContent = toZenKaku(character.replace(/"/g, ""));
        charDialogueDiv.appendChild(characterSpan);
      }

      const dialogueSpan = document.createElement("span");
      dialogueSpan.className = "dialogue";
      dialogueSpan.innerHTML = toZenKaku(
        dialogue.replace(/"/g, "").replace(/\\n/g, "<br>")
      ); // Replace escaped newlines with <br>
      charDialogueDiv.appendChild(dialogueSpan);
    }

    scriptContainer.appendChild(charDialogueDiv);
  });

  displayCharacterCheckboxes(characterList);
}

function displayCharacterCheckboxes(characterList) {
  const listContainer = document.getElementById("characterList");
  listContainer.innerHTML = ""; // Clear previous content

  characterList.forEach((character) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = character;
    checkbox.onchange = toggleCharacterHighlight;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(character));
    listContainer.appendChild(label);
  });
}

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
// トグルボタンのクリックイベントハンドラを設定
document.getElementById("toggleButton").onclick = function () {
  var checkboxesContainer = document.getElementById("checkboxesContainer");
  if (checkboxesContainer.style.display === "none") {
    checkboxesContainer.style.display = "block";
    this.textContent = "×"; // ボタンのテキストを変更
  } else {
    checkboxesContainer.style.display = "none";
    this.textContent = "≡"; // ボタンのテキストを変更
  }
};
