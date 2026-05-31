// background.js - фоновый процесс для обхода CORS

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translateWithOllama') {
    const text = request.text;

    fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3.1',
        prompt: `Переведи этот текст с английского на русский. Только перевод, без объяснений.

Текст: ${text}

Перевод:`,
        stream: false
      })
    })
    .then(response => response.json())
    .then(data => {
      const translated = data.response.trim();
      const cleanTranslation = translated.replace(/^переведи|^перевод:|^текст:/i, '').trim();
      sendResponse({ success: true, translated: cleanTranslation });
    })
    .catch(error => {
      console.error('Ошибка Ollama в background:', error);
      sendResponse({ success: false, error: error.message });
    });

    return true; // Асинхронный ответ
  }
});