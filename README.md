# Naga — сайт-портфолио

Статический сайт (HTML/CSS/JS) без сборки и без внешних CDN: шрифты и библиотеки (GSAP, Lenis, Three.js) лежат в папке `assets/`. Сайт работает и в корне домена, и в подпапке вида `https://<username>.github.io/<repo>/`.

## Структура

```
index.html          — главная страница
404.html            — страница «не найдено»
works/              — живые версии работ из портфолио
assets/css/         — стили (style.css) и локальные шрифты (fonts.css)
assets/fonts/       — файлы шрифтов .woff2
assets/js/          — скрипты сайта
assets/img/         — скриншоты работ
assets/vendor/      — GSAP, Lenis, Three.js (для works/sochno-burgers.html)
.nojekyll           — отключает обработку Jekyll на GitHub Pages
robots.txt
```

## Публикация на GitHub Pages (через сайт github.com)

> ⚠️ Загружайте **распакованные** файлы, а не zip-архив. GitHub Pages не открывает архивы.

1. **Распакуйте архив** на компьютере. Внутри должны быть `index.html`, `404.html`, папки `assets` и `works`.
2. Войдите на [github.com](https://github.com) и нажмите **New repository** (кнопка «+» вверху справа → *New repository*).
3. Введите имя репозитория (например, `portfolio`), выберите **Public** и нажмите **Create repository**.
4. На странице нового репозитория нажмите ссылку **uploading an existing file** (или **Add file → Upload files**).
5. **Перетащите в окно браузера всё содержимое распакованной папки** — файлы `index.html`, `404.html`, `README.md`, `robots.txt` и папки `assets` и `works` целиком. Структура папок должна сохраниться, а `index.html` должен оказаться в **корне** репозитория (не внутри ещё одной папки).
   - Файл `.nojekyll` скрытый: если система его не показывает, включите показ скрытых файлов или создайте его в GitHub вручную: **Add file → Create new file**, имя `.nojekyll`, содержимое пустое → **Commit changes**. (Сайт работает и без него, но с ним надёжнее.)
6. Внизу нажмите **Commit changes**.
7. Откройте **Settings → Pages**. В блоке *Build and deployment* выберите:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main`, папка `/ (root)` → **Save**.
8. Подождите 1–3 минуты (ход публикации виден во вкладке **Actions**). Обновите страницу **Settings → Pages** — вверху появится ссылка вида
   **`https://<username>.github.io/<repo>/`** — это и есть адрес сайта.

**Собственный домен (необязательно).** В **Settings → Pages → Custom domain** укажите домен (например, `naga.dev`) и настройте DNS у регистратора по [инструкции GitHub](https://docs.github.com/ru/pages/configuring-a-custom-domain-for-your-github-pages-site). После проверки включите **Enforce HTTPS**.

**Как обновить сайт.** Снова **Add file → Upload files**, загрузите изменённые файлы с теми же именами и путями → **Commit changes**. Через минуту-две изменения появятся на сайте.

## Что заменить перед публикацией

- **Ссылка на Telegram-группу** — в `index.html` найдите комментарий `<!-- TODO: telegram group link -->` (раздел «Контакты»). Сразу под ним в теге `<a href="#" …>` замените `#` на ссылку на группу, например `https://t.me/your_group`, а текст «Ссылка скоро появится» — на название группы.
- Личный контакт уже ведёт на `https://t.me/galvctic`.

Редактировать файлы можно прямо на GitHub: откройте файл → значок карандаша (**Edit**) → внесите правку → **Commit changes**.

## Важно

- Имена файлов чувствительны к регистру: `works/sochno-burgers.html` и `Works/Sochno-Burgers.html` для GitHub Pages — разные файлы. Не переименовывайте файлы и папки.
- Все пути на сайте относительные, поэтому сайт работает в любой подпапке.
- Чтобы посмотреть сайт локально, лучше запустить простой сервер в папке сайта: `python3 -m http.server 8000` и открыть `http://localhost:8000/` (3D-сцена в `works/sochno-burgers.html` использует ES-модули, которые браузеры не всегда загружают с `file://`).
