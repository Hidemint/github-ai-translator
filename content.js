// GitHub AI Translator - content.js
// Переводит ТОЛЬКО текстовые узлы (не ломает кнопки и ссылки)

console.log('GitHub AI Translator исправлен и загружен!');

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
  'Forks': 'Форки',
  'Pull requests': 'Запросы на внесение изменений',
  'Actions': 'Действия',
  'Projects': 'Проекты',
  'Security': 'Безопасность',
  'Settings': 'Настройки',
  'Dashboard': 'Панель управления',
  'Notifications': 'Уведомления',
  'Profile': 'Профиль',
  'Cancel': 'Отмена',
  'Save': 'Сохранить',
  'Delete': 'Удалить',
  'Edit': 'Редактировать',
  'New': 'Новый',
  'Open': 'Открыть',
  'Close': 'Закрыть'
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
      request.onerror = () => resolve(null);
    });
  } catch (error) {
    console.warn('Ошибка чтения кэша:', error);
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

// Функция перевода через Ollama API
async function translateWithOllama(text) {
  // Проверяем кэш
  const cached = await getCachedTranslation(text);
  if (cached) {
    console.log('Из кэша:', text, '→', cached);
    return cached;
  }

  // Проверяем локальный словарь
  if (localTranslations[text]) {
    await cacheTranslation(text, localTranslations[text]);
    return localTranslations[text];
  }

  // Проверяем, что Ollama запущен
  try {
    const testResponse = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      timeout: 2000
    });
    
    if (!testResponse.ok) {
      console.warn('Ollama не запущен! Запусти: ollama run llama3.1');
      return text;
    }
  } catch (error) {
    console.warn('Ollama не доступен. Запусти: ollama run llama3.1');
    return text;
  }

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3.1',
        prompt: `Переведи этот текст с английского на русский. Только перевод, без объяснений, без кавычек.

Текст: ${text}

Перевод:`,
        stream: false
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    let translated = data.response.trim();

    // Очистка перевода
    translated = translated
      .replace(/^переведи|^перевод:|^текст:|^ответ:/i, '')
      .replace(/^["']|["']$/g, '')
      .trim();

    await cacheTranslation(text, translated);
    console.log('From Ollama AI:', text, '→', translated);
    return translated;

  } catch (error) {
    console.error('Ошибка перевода через Ollama:', error);
    return text;
  }
}

// ИСПРАВЛЕНО: Переводим ТОЛЬКО текстовые узлы, не ломая HTML
async function translateTextNode(node) {
  const text = node.textContent.trim();
  
  // Пропускаем пустые тексты и длинные тексты
  if (!text || text.length < 2 || text.length > 200) {
    return;
  }

  // Пропускаем элементы, которые не нужно переводить
  const parent = node.parentElement;
  if (parent) {
    const tagName = parent.tagName.toLowerCase();
    const skipTags = ['script', 'style', 'code', 'pre', 'textarea', 'input', 'button'];
    if (skipTags.includes(tagName)) {
      return;
    }
    
    // Пропускаем элементы внутри кнопок и ссылок (чтобы не ломать)
    if (parent.closest('button, a, [role="button"]')) {
      return;
    }
  }

  // Переводим текст
  const translated = await translateWithOllama(text);
  
  if (translated !== text) {
    // Заменяем ТОЛЬКО текстовый узел, не трогая HTML
    node.textContent = node.textContent.replace(text, translated);
    node.parentElement.classList.add('translated');
  }
}

// ИСПРАВЛЕНО: Переводим только текстовые узлы
async function translatePage() {
  const textNodes = [];
  
  // Найти все текстовые узлы на странице
  function findTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      // Пропускаем скрипты и стили
      if (!['script', 'style', 'code', 'pre'].includes(tagName)) {
        for (const child of node.childNodes) {
          findTextNodes(child);
        }
      }
    }
  }

  findTextNodes(document.body);

  // Перевести каждый текстовый узел
  for (const node of textNodes) {
    await translateTextNode(node);
  }
}

// Запустить перевод после загрузки страницы
setTimeout(translatePage, 2000);

// Переводить при изменениях на странице (с ограничением частоты)
let debounceTimer = null;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(translatePage, 1000);
});
observer.observe(document.body, { childList: true, subtree: true });