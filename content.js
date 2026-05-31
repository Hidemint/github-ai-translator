// GitHub AI Translator - content.js
// Переводит тексты на странице GitHub через background.js (обходит CORS)

console.log('GitHub AI Translator с Ollama AI загружен!');

// Локальный словарь (для часто встречающихся слов)
const localTranslations = {
  'Sign up': 'Зарегистрироваться',
  'Log in': 'Войти',
  'Repository': 'Репозиторий',
  'Commit': 'Коммит',
  'Branch': 'Ветка',
  'Pull Request': 'Запрос на внесение изменений',
  'Issues': 'Проблемы',
  'Projects': 'Проекты',
  'Readme': 'Читай меня',
  'Create new file': 'Создать новый файл',
  'Commit changes': 'Внести изменения',
  'Sign in': 'Войти',
  'Add a file': 'Добавить файл',
  'Code': 'Код',
  'Overview': 'Обзор',
  'Contributors': 'Контрибьюторы',
  'Stars': 'Звёзды',
  'Forks': 'Форки'
};

// Кэш в IndexedDB
const DB_NAME = 'GitHubTranslatorCache';
const DB_VERSION = 1;
const STORE_NAME = 'translations';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'original' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getCachedTranslation(text) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const request = transaction.objectStore(STORE_NAME).get(text);
      request.onsuccess = () => resolve(request.result?.translated);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    return null;
  }
}

async function cacheTranslation(text, translated) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const request = transaction.objectStore(STORE_NAME).put({ original: text, translated, timestamp: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Ошибка сохранения в кэш:', error);
  }
}

// Функция перевода через background.js (обходит CORS)
async function translateWithOllama(text) {
  // Сначала проверяем кэш
  const cached = await getCachedTranslation(text);
  if (cached) {
    console.log('Из кэша (IndexedDB):', text, '→', cached);
    return cached;
  }

  // Проверяем локальный словарь
  if (localTranslations[text]) {
    await cacheTranslation(text, localTranslations[text]);
    return localTranslations[text];
  }

  try {
    // Отправляем запрос в background.js
    const response = await chrome.runtime.sendMessage({ action: 'translate', text: text });

    if (response.success) {
      const cleanTranslation = response.translated.replace(/^переведи|^перевод:|^текст:/i, '').trim();
      await cacheTranslation(text, cleanTranslation);
      console.log('From Ollama AI (background):', text, '→', cleanTranslation);
      return cleanTranslation;
    } else {
      throw new Error(response.error);
    }

  } catch (error) {
    console.error('Ошибка перевода через Ollama:', error);
    console.warn('Используем текст как есть (Ollama не запущен?)');
    return text;
  }
}

// Перевести все тексты на странице
async function translatePage() {
  const elements = document.querySelectorAll('*');
  const textsToTranslate = [];

  // Собрать все уникальные тексты
  elements.forEach(element => {
    const text = element.textContent.trim();
    if (text && text.length > 1 && text.length < 200 && !textsToTranslate.includes(text)) {
      textsToTranslate.push(text);
    }
  });

  // Перевести каждый текст
  for (const text of textsToTranslate) {
    const translated = await translateWithOllama(text);
    if (translated !== text) {
      // Найти элементы с этим текстом и заменить
      elements.forEach(element => {
        if (element.textContent.trim() === text) {
          element.textContent = element.textContent.replace(text, translated);
          element.classList.add('translated');
        }
      });
    }
  }
}

// Запустить перевод после загрузки страницы
setTimeout(translatePage, 2000);

// Переводить при изменениях на странице
const observer = new MutationObserver(translatePage);
observer.observe(document.body, { childList: true, subtree: true });