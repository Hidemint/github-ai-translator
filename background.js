// GitHub AI Translator - background.js
// Обрабатывает запросы к Ollama и обходит CORS

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    translateWithOllama(request.text)
      .then(result => sendResponse({ success: true, translated: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Обязательно для async sendResponse
  }
});

// Функция перевода через Ollama (здесь работает без CORS ограничений)
async function translateWithOllama(text) {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
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
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response.trim();

  } catch (error) {
    console.error('Ошибка Ollama в background:', error);
    throw error;
  }
}