function toZenKaku(str) {
  // 半角数字を全角数字に変換する
  return str.replace(/[A-Za-z0-9]/g, s => String.fromCharCode(s.charCodeAt(0) + 0xfee0));
}

function preprocessText(text) {
  return text.split(/\r\n|\r|\n/g).map(line => line.trim()).join("\n");
}

// テキストファイルを読み込んで台本を表示する関数
function loadScript() {
  const input = document.getElementById("fileInput");
  const title = document.getElementById("fileTitle");
  if ("files" in input && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = e => {
      const text = e.target.result;
      displayScript(preprocessText(text));
    };

    reader.readAsText(file, "UTF-8");
    document.title = title.value = file.name;
    input.style.display = "none";
    title.removeAttribute("style");
    title.style.width = 0;
    title.style.width = title.scrollWidth + "px";

    title.addEventListener("input", e => {
      const title = e.target;
      document.title = title.value;
      title.style.width = 0;
      title.style.width = title.scrollWidth + "px";
    });
  }
}

function displayScript(text) {
  // HTML要素をクリア
  const scriptContainer = document.getElementById("scriptContainer");
  const characterList = new Set();
  scriptContainer.innerHTML = "";

  // 正規表現パターンを個別に定義
  const patterns = {
    pattern1: /^(.+?)「(.+?)」$/gm,
    pattern2: /^【(.+?)】\s+?((?:.+?\n){1,}\n+^)/gm,
  };

  const pattern = patterns.pattern1;
  let lastIndex = 0; // マッチングの開始位置を追跡

  let match;
  while ((match = pattern.exec(text)) !== null) {
    // マッチする前のテキストを追加
    if (lastIndex < match.index) {
      const textBeforeMatch = text.slice(lastIndex, match.index - 1);
      textBeforeMatch.split("\n").forEach(line => {
        addDialogueToContainer("", line, scriptContainer);
      });
    }

    // マッチしたテキストを追加
    const characterName = match[1].trim();
    const dialogue = match[2].trim();
    addDialogueToContainer(characterName, dialogue, scriptContainer);
    characterList.add(toZenKaku(characterName));

    lastIndex = pattern.lastIndex + 1;
  }

  // 最後のマッチ後のテキストを追加
  const textAfterLastMatch = text.slice(lastIndex);
  textAfterLastMatch.split("\n").forEach(line => {
    addDialogueToContainer("", line, scriptContainer);
  });

  displayCharacterCheckboxes(characterList);
}

function addDialogueToContainer(character, dialogue, container) {
  const charDialogueDiv = document.createElement("div");
  charDialogueDiv.className = "character-dialogue";

  const characterSpan = document.createElement("span");
  characterSpan.className = "character-name";
  characterSpan.textContent = toZenKaku(character);

  const dialogueSpan = document.createElement("span");
  dialogueSpan.className = "dialogue";
  dialogueSpan.textContent = toZenKaku(dialogue);

  charDialogueDiv.appendChild(characterSpan);
  charDialogueDiv.appendChild(dialogueSpan);
  container.appendChild(charDialogueDiv);
}

// Displays checkboxes for each character in the script
function displayCharacterCheckboxes(characterList) {
  const listContainer = document.getElementById("characterList");
  listContainer.innerHTML = "キャラクターリスト "; // Clear previous content

  Array.from(characterList).forEach((character, index) => {
    if (character.trim() !== "") {
      // Don't create a checkbox for empty character names
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = character;
      checkbox.onchange = function(event) {
        toggleCharacterHighlight(event);
        calculateSelectedCharactersDialogues();
      };

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(character));
      listContainer.appendChild(label);

      if (index < characterList.size - 1) {
        listContainer.appendChild(document.createTextNode("、"));
      }
    }
  });
}

// Toggle the highlighted class for the dialogues of the selected character
function toggleCharacterHighlight(event) {
  const character = event.target.value;
  const isChecked = event.target.checked;

  // 対象のキャラクター名を含む全てのチェックボックスを操作
  document.querySelectorAll('#characterList input[type="checkbox"]').forEach(checkbox => {
    if (checkbox.value.includes(character)) {
      checkbox.checked = isChecked;
    }
  });

  // 元々あったダイアログのハイライト更新処理
  document.querySelectorAll(".character-dialogue").forEach(charDialogueDiv => {
    const characterSpan = charDialogueDiv.querySelector(".character-name");
    if (characterSpan && characterSpan.textContent.includes(character)) {
      if (isChecked) {
        charDialogueDiv.classList.add("highlighted");
        charDialogueDiv.addEventListener("click", toggleHighlight);
      } else {
        charDialogueDiv.classList.remove("highlighted");
        charDialogueDiv.removeEventListener("click", toggleHighlight);
      }
    }
  });
}

// ハイライトのクラスを切り替え、"ボイスなし"のテキストを追加/削除する関数
function toggleHighlight(e) {
  const dialogue = e.currentTarget;
  const isHighlighted = dialogue.classList.contains("highlighted");

  // "ボイスなし"を示す要素が既に存在するかチェック
  let noVoiceElement = dialogue.querySelector(".no-voice");

  if (isHighlighted && !noVoiceElement) {
    noVoiceElement = document.createElement("span");
    noVoiceElement.classList.add("no-voice");
    noVoiceElement.textContent = "【ボイス不要】";
    dialogue.querySelector(".character-name").prepend(noVoiceElement);
  } else if (noVoiceElement) {
      noVoiceElement.remove();
  }

  dialogue.classList.toggle("highlighted");

  calculateSelectedCharactersDialogues();
}

// 選択されたキャラクターのセリフに番号をつける関数
function calculateSelectedCharactersDialogues() {
  const selectedCharacters = new Set();
  document.querySelectorAll('#characterList input[type="checkbox"]:checked').forEach(checkbox => {
    selectedCharacters.add(checkbox.value);
  });

  let dialogueNumber = 0;
  document.querySelectorAll(".character-dialogue").forEach(dialogueDiv => {
    const characterSpan = dialogueDiv.querySelector(".character-name");
    let dialogueIndex = dialogueDiv.querySelector(".dialogue-index");
    
    if (selectedCharacters.has(characterSpan.textContent) && dialogueDiv.classList.contains("highlighted")) {
      dialogueNumber++;
      // 既存の番号があれば更新、なければ新しく追加
      if (!dialogueIndex) {
        dialogueIndex = document.createElement("span");
        dialogueIndex.classList.add("dialogue-index");
        dialogueDiv.appendChild(dialogueIndex);
      }
      dialogueIndex.textContent = dialogueNumber.toString().padStart(4, "0");
    } else {
      // 選択されていないキャラクターのセリフ番号を削除
      if (dialogueIndex) dialogueIndex.remove();
    }
  });

  // 結果を表示する要素を更新
  const resultDisplay = document.getElementById("dialogueCountResult");
  resultDisplay.textContent = dialogueNumber > 0 ? "ワード数 " + toZenKaku(String(dialogueNumber)) : "";
}
