// GitHub AI Translator - content.js
// Переводит тексты на странице GitHub

console.log('GitHub AI Translator загружен!');

// Полный словарь переводов для GitHub (меню, панели, кнопки)
const translations = {
  // Верхнее меню
  'Code': 'Код',
  'Issues': 'Проблемы',
  'Pull requests': 'Запросы на изменение',
  'Actions': 'Действия',
  'Projects': 'Проекты',
  'Security': 'Безопасность',
  'Insights': 'Аналитика',
  'Sponsor': 'Спонсор',
  'Settings': 'Настройки',
  
  // Основные действия
  'Sign in': 'Войти',
  'Sign up': 'Зарегистрироваться',
  'Log in': 'Войти',
  'Log out': 'Выйти',
  'Logout': 'Выйти',
  'New': 'Новый',
  'Create': 'Создать',
  'Add': 'Добавить',
  'Edit': 'Изменить',
  'Save': 'Сохранить',
  'Cancel': 'Отмена',
  'Delete': 'Удалить',
  'Remove': 'Удалить',
  'Close': 'Закрыть',
  'Open': 'Открыть',
  'View': 'Просмотр',
  'Show': 'Показать',
  'Hide': 'Скрыть',
  'Search': 'Поиск',
  'Find': 'Найти',
  
  // Репозитории
  'Repository': 'Репозиторий',
  'Repositories': 'Репозитории',
  'My repositories': 'Мои репозитории',
  'Your repositories': 'Ваши репозитории',
  'Public': 'Публичный',
  'Private': 'Частный',
  'Fork': 'Форк',
  'Forks': 'Форки',
  'Star': 'Звезда',
  'Stars': 'Звёзды',
  'Watch': 'Слежу',
  'Watching': 'Слежу',
  'Unwatch': 'Перестать следить',
  'Clone': 'Клонировать',
  'Download': 'Скачать',
  'Source': 'Исходный код',
  'Branch': 'Ветка',
  'Branches': 'Ветви',
  'Main': 'Основная',
  'Master': 'Мастер',
  'Tag': 'Тег',
  'Tags': 'Теги',
  'Release': 'Релиз',
  'Releases': 'Релизы',
  'Commit': 'Коммит',
  'Commits': 'Коммиты',
  'Merge': 'Слить',
  'Rebase': 'Перебазирование',
  
  // Файлы
  'File': 'Файл',
  'Files': 'Файлы',
  'Folder': 'Папка',
  'Folders': 'Папки',
  'Readme': 'Читай меня',
  'README': 'Читай меня',
  'License': 'Лицензия',
  'Culture': 'Культура',
  'Create new file': 'Создать новый файл',
  'New file': 'Новый файл',
  'New folder': 'Новая папка',
  'Upload files': 'Загрузить файлы',
  'Upload': 'Загрузить',
  'Commit changes': 'Внести изменения',
  'Commit message': 'Сообщение коммита',
  'Description': 'Описание',
  'Name': 'Имя',
  'Size': 'Размер',
  'Last commit': 'Последний коммит',
  'Age': 'Возраст',
  
  // Профиль
  'Your profile': 'Ваш профиль',
  'Your repositories': 'Ваши репозитории',
  'Your projects': 'Ваши проекты',
  'Your packages': 'Ваши пакеты',
  'Your gists': 'Ваши гисты',
  'Your stars': 'Ваши звёзды',
  'Your work': 'Ваша работа',
  'Profile': 'Профиль',
  'Account': 'Аккаунт',
  'Overview': 'Обзор',
  'Dashboard': 'Панель управления',
  'Explore': 'Исследовать',
  'Marketplace': 'Маркетплейс',
  'Gists': 'Гисты',
  'Stars': 'Звёзды',
  'Watching': 'Слежу',
  'Notifications': 'Уведомления',
  'Sponsorships': 'Спонсорство',
  
  // Страница репозитория
  'About': 'О проекте',
  'Readme': 'Читай меня',
  'Contributors': 'Контрибьюторы',
  'Pull': 'Втянуть',
  'Push': 'Отправить',
  'Pushed': 'Отправлено',
  'Created': 'Создано',
  'Updated': 'Обновлено',
  'Languages': 'Языки',
  'License': 'Лицензия',
  'Released': 'Выпущено',
  'Latest': 'Последний',
  'Version': 'Версия',
  
  // Проблемы и запросы
  'Issue': 'Проблема',
  'Issues': 'Проблемы',
  'Open issues': 'Открытые проблемы',
  'Closed issues': 'Закрытые проблемы',
  'Open': 'Открыть',
  'Closed': 'Закрыт',
  'Open pull requests': 'Открытые запросы',
  'Closed pull requests': 'Закрытые запросы',
  'Draft': 'Черновик',
  'Merged': 'Слит',
  'Pending': 'Ожидание',
  
  // Кнопки действий
  'Subscribe': 'Подписаться',
  'Unsubscribe': 'Отписаться',
  'Comment': 'Комментарий',
  'Comments': 'Комментарии',
  'Review': 'Обзор',
  'Reviews': 'Обзоры',
  'Approve': 'Одобрить',
  'Request changes': 'Запросить изменения',
  'Comment': 'Комментировать',
  'Reply': 'Ответить',
  'Edit': 'Изменить',
  'Delete': 'Удалить',
  
  // Прочее
  'Owner': 'Владелец',
  'Organization': 'Организация',
  'Team': 'Команда',
  'Members': 'Участники',
  'Member': 'Участник',
  'Admin': 'Админ',
  'Owner': 'Владелец',
  'Collaborators': 'Коллабораторы',
  'Contributing': 'Вклад',
  'Code of conduct': 'Кодекс поведения',
  'Security': 'Безопасность',
  'Audit log': 'Журнал аудита',
  'People': 'Люди',
  'Topology': 'Топология',
  'Dependabot': 'Депендабот',
  'Packages': 'Пакеты',
  'Pages': 'Страницы',
  'Environments': 'Среды',
  'CICD': 'CI/CD',
  'Workflows': 'Рабочие процессы',
  'Actions': 'Действия',
  'Cache': 'Кэш',
  'Dependencies': 'Зависимости',
  'Vulnerabilities': 'Уязвимости',
  'Alerts': 'Предупреждения',
  'Graphs': 'Графики',
  'Network': 'Сеть',
  'Activity': 'Активность',
  'Traffic': 'Трафик',
  'Caches': 'Кэши',
  'Versions': 'Версии',
  
  // Грамматические формы
  'of': 'из',
  'and': 'и',
  'or': 'или',
  'with': 'с',
  'for': 'для',
  'on': 'на',
  'in': 'в',
  'to': 'к',
  'from': 'от',
  'by': 'от',
  'at': 'в',
  'is': 'есть',
  'are': 'являются',
  'was': 'был',
  'were': 'были',
  'be': 'быть',
  'been': 'был',
  'have': 'иметь',
  'has': 'имеет',
  'had': 'имел',
  'do': 'делать',
  'does': 'делает',
  'did': 'сделал',
  'will': 'будет',
  'would': 'бы',
  'could': 'мог',
  'should': 'должен',
  'may': 'может',
  'might': 'мог бы',
  'must': 'должен',
  'can': 'может',
  'need': 'нужно',
  'want': 'хочу',
  'like': 'нравится',
  'love': 'люблю',
  'help': 'помощь',
  'more': 'ещё',
  'less': 'меньше',
  'new': 'новый',
  'old': 'старый',
  'first': 'первый',
  'last': 'последний',
  'next': 'следующий',
  'previous': 'предыдущий',
  'today': 'сегодня',
  'yesterday': 'вчера',
  'week': 'неделя',
  'month': 'месяц',
  'year': 'год',
  'days': 'дней',
  'hours': 'часов',
  'minutes': 'минут',
  'seconds': 'секунд'
};

// Функция перевода текста
function translateText(text) {
  return translations[text] || text;
}

// Найти все тексты на странице и перевести
function translatePage() {
  const elements = document.querySelectorAll('*');
  
  elements.forEach(element => {
    // Пропускаем скрипты, стили и خود расширение
    if (element.tagName === 'SCRIPT' || 
        element.tagName === 'STYLE' || 
        element.closest('[data-translator-ignored]')) {
      return;
    }
    
    const text = element.textContent.trim();
    
    // Если текст есть и он есть в словаре — переводим
    if (text && translations[text]) {
      const originalText = element.textContent;
      element.textContent = originalText.replace(text, translations[text]);
      
      // Добавляем класс для отладки (можно убрать)
      element.classList.add('translated');
    }
  });
}

// Запустить перевод после загрузки страницы
setTimeout(translatePage, 1000);

// Переводить при изменениях на странице
const observer = new MutationObserver(translatePage);
observer.observe(document.body, { childList: true, subtree: true });