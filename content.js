// GitHub AI Translator - content.js
// Переводит тексты на странице GitHub

console.log('GitHub AI Translator загружен!');

// Простой словарь переводов (в будущем заменим на AI)
const translations = {
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
  'Sign up': 'Зарегистрироваться'
};

// Функция перевода текста
function translateText(text) {
  return translations[text] || text;
}

// Найти все тексты на странице и перевести
function translatePage() {
  const elements = document.querySelectorAll('*');
  
  elements.forEach(element => {
    const text = element.textContent.trim();
    if (text && translations[text]) {
      element.textContent = element.textContent.replace(text, translateText(text));
    }
  });
}

// Запустить перевод после загрузки страницы
setTimeout(translatePage, 1000);

// Переводить при изменениях на странице
const observer = new MutationObserver(translatePage);
observer.observe(document.body, { childList: true, subtree: true });