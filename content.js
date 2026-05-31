// GitHub AI Translator - content.js
// Переводит тексты на странице GitHub с помощью DeepL AI

console.log('GitHub AI Translator с AI загружен!');

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
  'Code': 'Код'
};

// Кэш в localStorage (чтобы не запрашивать AI для одного и того же)
function getCachedTranslation(text) {
  return localStorage.getItem('translation_' + text);
}

function cacheTranslation(text, translated) {
  localStorage.setItem('translation_' + text, translated);
}

// Функция перевода через DeepL API
async function translateWithDeepL(text) {
  // Сначала проверяем кэш
  const cached = getCachedTranslation(text);
  if (cached) {
    console.log('Из кэша:', text, '→', cached);
    return cached;
  }

  // Проверяем локальный словарь
  if (localTranslations[text]) {
    cacheTranslation(text, localTranslations[text]);
    return localTranslations[text];
  }

  try {
    // Получаем API key из chrome.storage (расширение хранит его безопасно)
    const result = await chrome.storage.sync.get(['deeplApiKey']);
    const apiKey = result.deeplApiKey;

    if (!apiKey) {
      console.warn('API key не найден! Настрой его в расширении.');
      return text;
    }

    // Запрос к DeepL API
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        target_lang: 'RU'
      })
    });

    const data = await response.json();

    if (data.translations && data.translations[0]) {
      const translated = data.translations[0].text;
      cacheTranslation(text, translated);
      console.log('From DeepL:', text, '→', translated);
      return translated;
    }

    return text;
  } catch (error) {
    console.error('Ошибка перевода:', error);
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
    const translated = await translateWithDeepL(text);
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