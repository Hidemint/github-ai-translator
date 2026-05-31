// Функция перевода через Ollama API (через background.js)
async function translateWithOllama(text) {
  // Сначала проверяем кэш
  try {
    const cached = await getCachedTranslation(text);
    if (cached) {
      console.log('Из кэша (IndexedDB):', text, '→', cached);
      return cached;
    }
  } catch (error) {
    console.warn('Ошибка чтения кэша:', error);
  }

  // Проверяем локальный словарь
  if (localTranslations[text]) {
    try {
      await cacheTranslation(text, localTranslations[text]);
    } catch (error) {
      console.warn('Ошибка сохранения в кэш:', error);
    }
    return localTranslations[text];
  }

  try {
    // Отправляем запрос через background.js (обходит CORS)
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'translateWithOllama', text: text },
        (response) => {
          if (response && response.success) {
            const cleanTranslation = response.translated;
            
            cacheTranslation(text, cleanTranslation).catch(err => {
              console.warn('Ошибка сохранения в кэш:', err);
            });
            
            console.log('From Ollama AI (background):', text, '→', cleanTranslation);
            resolve(cleanTranslation);
          } else {
            console.error('Ошибка от background:', response?.error);
            resolve(text);
          }
        }
      );
    });

  } catch (error) {
    console.error('Ошибка перевода через Ollama:', error);
    console.warn('Используем текст как есть (Ollama не работает?)');
    return text;
  }
}