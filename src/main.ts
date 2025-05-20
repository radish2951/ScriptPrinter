import './style.css';

function toZenKaku(str: string): string {
  // 半角数字を全角数字に変換する
  return str.replace(/[A-Za-z0-9]/g, s => String.fromCharCode(s.charCodeAt(0) + 0xfee0));
}

function preprocessText(text: string): string {
  return text.split(/\r\n|\r|\n/g).map(line => line.trim()).join("\n");
}

// テキストファイルを読み込んで台本を表示する関数
function loadScript(): void {
  const input = document.getElementById("fileInput") as HTMLInputElement;
  const title = document.getElementById("fileTitle") as HTMLTextAreaElement;
  if (input && input.files && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      if (text) {
        displayScript(preprocessText(text));
      }
    };

    reader.readAsText(file, "UTF-8");
    document.title = title.value = file.name;
    input.style.display = "none";
    title.removeAttribute("style");
    title.style.width = "0";
    title.style.width = `${title.scrollWidth}px`;

    title.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLTextAreaElement;
      document.title = target.value;
      target.style.width = "0";
      target.style.width = `${target.scrollWidth}px`;
    });
  }
}

function displayScript(text: string): void {
  // HTML要素をクリア
  const scriptContainer = document.getElementById("scriptContainer") as HTMLDivElement;
  const characterList = new Set<string>();
  scriptContainer.innerHTML = "";

  // 正規表現パターンを個別に定義
  const patterns: { [key: string]: RegExp } = {
    pattern1: /^(.+?)「(.+?)」$/gm,
    pattern2: /^【(.+?)】\s+?((?:.+?\n){1,}\n+^)/gm,
  };

  const pattern = patterns.pattern1;
  let lastIndex = 0; // マッチングの開始位置を追跡

  let match = pattern.exec(text);
  while (match !== null) {
    // マッチする前のテキストを追加
    if (lastIndex < match.index) {
      const textBeforeMatch = text.slice(lastIndex, match.index - 1);
      for (const line of textBeforeMatch.split("\n")) {
        addDialogueToContainer("", line, scriptContainer);
      }
    }

    // マッチしたテキストを追加
    const characterName = match[1].trim();
    const dialogue = match[2].trim();
    addDialogueToContainer(characterName, dialogue, scriptContainer);
    characterList.add(toZenKaku(characterName));

    lastIndex = pattern.lastIndex + 1;
    match = pattern.exec(text);
  }

  // 最後のマッチ後のテキストを追加
  const textAfterLastMatch = text.slice(lastIndex);
  for (const line of textAfterLastMatch.split("\n")) {
    addDialogueToContainer("", line, scriptContainer);
  }

  displayCharacterCheckboxes(characterList);
}

function addDialogueToContainer(character: string, dialogue: string, container: HTMLDivElement): void {
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
function displayCharacterCheckboxes(characterList: Set<string>): void {
  const listContainer = document.getElementById("characterList") as HTMLParagraphElement;
  listContainer.innerHTML = "キャラクターリスト "; // Clear previous content

  Array.from(characterList).forEach((character, index) => {
    if (character.trim() !== "") {
      // Don't create a checkbox for empty character names
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = character;
      checkbox.onchange = (event: Event) => {
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
function toggleCharacterHighlight(event: Event): void {
  const target = event.target as HTMLInputElement;
  const character = target.value;
  const isChecked = target.checked;

  // 対象のキャラクター名を含む全てのチェックボックスを操作
  const checkboxes = document.querySelectorAll<HTMLInputElement>('#characterList input[type="checkbox"]');
  for (const checkbox of checkboxes) {
    if (checkbox.value.includes(character)) {
      checkbox.checked = isChecked;
    }
  }

  // 元々あったダイアログのハイライト更新処理
  const charDialogueDivs = document.querySelectorAll<HTMLDivElement>(".character-dialogue");
  for (const charDialogueDiv of charDialogueDivs) {
    const characterSpan = charDialogueDiv.querySelector<HTMLSpanElement>(".character-name");
    if (characterSpan?.textContent?.includes(character)) {
      if (isChecked) {
        charDialogueDiv.classList.add("highlighted");
        charDialogueDiv.addEventListener("click", toggleHighlight);
      } else {
        charDialogueDiv.classList.remove("highlighted");
        charDialogueDiv.removeEventListener("click", toggleHighlight);
      }
    }
  }
}

// ハイライトのクラスを切り替え、"ボイスなし"のテキストを追加/削除する関数
function toggleHighlight(e: MouseEvent): void {
  const dialogue = e.currentTarget as HTMLDivElement;
  const isHighlighted = dialogue.classList.contains("highlighted");

  // "ボイスなし"を示す要素が既に存在するかチェック
  let noVoiceElement = dialogue.querySelector<HTMLSpanElement>(".no-voice");

  if (isHighlighted && !noVoiceElement) {
    noVoiceElement = document.createElement("span");
    noVoiceElement.classList.add("no-voice");
    noVoiceElement.textContent = "【ボイス不要】";
    dialogue.querySelector<HTMLSpanElement>(".character-name")?.prepend(noVoiceElement);
  } else if (noVoiceElement) {
    noVoiceElement.remove();
  }

  dialogue.classList.toggle("highlighted");

  calculateSelectedCharactersDialogues();
}

// 選択されたキャラクターのセリフに番号をつける関数
function calculateSelectedCharactersDialogues(): void {
  const selectedCharacters = new Set<string>();
  for (const checkbox of document.querySelectorAll<HTMLInputElement>('#characterList input[type="checkbox"]:checked')) {
    selectedCharacters.add(checkbox.value);
  }

  let dialogueNumber = 0;
  const dialogueDivs = document.querySelectorAll<HTMLDivElement>(".character-dialogue");
  for (const dialogueDiv of dialogueDivs) {
    const characterSpan = dialogueDiv.querySelector<HTMLSpanElement>(".character-name");
    let dialogueIndex = dialogueDiv.querySelector<HTMLSpanElement>(".dialogue-index");

    if (characterSpan && selectedCharacters.has(characterSpan.textContent!) && dialogueDiv.classList.contains("highlighted")) {
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
  }

  // 結果を表示する要素を更新
  const resultDisplay = document.getElementById("dialogueCountResult") as HTMLParagraphElement;
  if (resultDisplay) {
    resultDisplay.textContent = dialogueNumber > 0 ? `ワード数 ${toZenKaku(String(dialogueNumber))}` : "";
  }
}

// Make functions available globally on the window object for HTML event handlers
declare global {
  interface Window {
    loadScript: () => void;
    toggleCharacterHighlight: (event: Event) => void;
    calculateSelectedCharactersDialogues: () => void;
    toggleHighlight: (event: MouseEvent) => void;
  }
}

window.loadScript = loadScript;
// toggleCharacterHighlight, calculateSelectedCharactersDialogues, and toggleHighlight are called by other functions,
// or as event handlers assigned directly in JS, not from HTML, so they don't strictly need to be on window.
// However, if any are dynamically assigned or might be called from a string context, it's safer.
// For now, only loadScript is essential for the onchange attribute in index.html.
// displayCharacterCheckboxes and addDialogueToContainer are internal.
