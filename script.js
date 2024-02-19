function toZenKaku(str) {
  // 半角数字を全角数字に変換する
  return str.replace(/[A-Za-z0-9]/g, function (s) {
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
      displayScript(text.replace(/\r\n|\r|\n/g, "\n"));
    };

    reader.readAsText(file, "UTF-8");
    document.title = file.name;
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

  const selectedPattern = patterns.pattern1;
  let lastIndex = -1; // マッチングの開始位置を追跡

  let match;
  while ((match = selectedPattern.exec(text)) !== null) {
    // マッチする前のテキストを追加
    const textBeforeMatch = text.slice(lastIndex + 1, match.index - 1);
    if (lastIndex + 1 < match.index) {
      textBeforeMatch.split("\n").forEach((line) => {
        addDialogueToContainer("", line, scriptContainer);
      });
    }

    // マッチしたテキストを追加
    const characterName = match[1].trim();
    const dialogue = match[2].trim();
    addDialogueToContainer(characterName, dialogue, scriptContainer);
    characterList.add(toZenKaku(characterName));

    lastIndex = selectedPattern.lastIndex;
  }

  // 最後のマッチ後のテキストを追加
  const textAfterLastMatch = text.slice(lastIndex + 1);
  textAfterLastMatch.split("\n").forEach((line) => {
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
      checkbox.onchange = toggleCharacterHighlight;

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
  const isChecked = event.target.checked; // チェック状態を取得

  // 対象のキャラクター名を含む全てのチェックボックスを操作
  document.querySelectorAll('#characterList input[type="checkbox"]').forEach(checkbox => {
    if (checkbox.value.includes(character)) {
      checkbox.checked = isChecked; // 条件に一致するチェックボックスを更新
    }
  });

  // 元々あったダイアログのハイライト更新処理
  document.querySelectorAll(".character-dialogue").forEach((charDialogueDiv) => {
    const characterSpan = charDialogueDiv.querySelector(".character-name");
    if (characterSpan && characterSpan.textContent.includes(character)) {
      if (isChecked) {
        charDialogueDiv.classList.add("highlighted");
        charDialogueDiv.addEventListener("click", toggleHighlight); // クリックイベントを追加
      } else {
        charDialogueDiv.classList.remove("highlighted");
        charDialogueDiv.removeEventListener("click", toggleHighlight);
      }
    }
  });
}

// ハイライトのクラスを切り替え、"ボイスなし"のテキストを追加/削除する関数
function toggleHighlight(event) {
  const dialogue = event.currentTarget; // クリックされたセリフの要素
  dialogue.classList.toggle("highlighted");

  // "ボイスなし"を示す要素が既に存在するかチェック
  let noVoiceElement = dialogue.querySelector(".no-voice");

  if (!dialogue.classList.contains("highlighted")) {
    // ハイライトがない場合は、"ボイスなし"を追加
    if (!noVoiceElement) {
      noVoiceElement = document.createElement("span");
      noVoiceElement.classList.add("no-voice");
      noVoiceElement.textContent = "【ボイス不要】";
      dialogue.querySelector(".dialogue").appendChild(noVoiceElement);
    }
  } else {
    // ハイライトがある場合は、"ボイスなし"を削除
    if (noVoiceElement) {
      noVoiceElement.remove();
    }
  }
}
