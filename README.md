# Task Manager Frontend

Это фронтенд-часть приложения Task Manager, построенная на Next.js, TypeScript и Tailwind CSS.

## Возможности

- Аутентификация пользователей (вход, регистрация, сброс пароля)
- Управление задачами (создание, просмотр, обновление, удаление задач)
- Чат в реальном времени через WebSockets
- Адаптивный дизайн для десктопа и мобильных устройств
- Поддержка светлой и тёмной темы
- Redux для управления состоянием

## Технологический стек

- **Фреймворк**: Next.js с App Router
- **Язык**: TypeScript
- **Стилизация**: Tailwind CSS
- **Управление состоянием**: Redux с Redux Toolkit
- **HTTP-клиент**: Axios
- **WebSockets**: Socket.IO Client
- **Контейнеризация**: Docker

## Начало работы

### Необходимые инструменты

- Node.js 18+ и npm
- Docker и Docker Compose (для контейнеризации)

### Запуск в режиме разработки

1. Клонируйте репозиторий:

   ```bash
   git clone <repository-url>
   cd task-manager-frontend
   ```

2. Установите зависимости:

   ```bash
   npm install
   ```

3. Настройте переменные окружения:
   Создайте файл `.env.local` в корне проекта со следующими переменными:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   NEXT_PUBLIC_WS_URL=ws://localhost:8080
   ```

4. Запустите сервер разработки:

   ```bash
   npm run dev
   ```

5. Откройте [http://localhost:3000](http://localhost:3000) в браузере для просмотра приложения.

### Сборка для продакшена

1. Соберите приложение:

   ```bash
   npm run build
   ```

2. Запустите сервер в режиме продакшена:
   ```bash
   npm start
   ```

### Запуск через Docker

1. Убедитесь, что Docker и Docker Compose установлены на вашем компьютере.

2. Соберите и запустите все сервисы:

   ```bash
   docker-compose up -d
   ```

3. Откройте приложение по адресу [http://localhost:3000](http://localhost:3000).

## Структура проекта

```
task-manager-frontend/
├── app/                   # App Router Next.js
│   ├── (auth)/            # Страницы аутентификации
│   ├── (dashboard)/       # Страницы дашборда
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Корневой layout
│   ├── page.tsx           # Главная страница
│   └── providers.tsx      # Провайдеры
├── components/            # React-компоненты
│   ├── auth/              # Компоненты аутентификации
│   ├── chat/              # Компоненты чата
│   ├── tasks/             # Компоненты задач
│   └── ui/                # Переиспользуемые UI-компоненты
├── hooks/                 # Кастомные React-хуки
├── lib/                   # Утилиты и сервисы
│   └── services/          # Модули сервисов
├── public/                # Статические ресурсы
├── store/                 # Redux store
│   └── slices/            # Redux-слайсы
├── types/                 # Типы TypeScript
├── .dockerignore          # Docker ignore файл
├── .env.example           # Пример переменных окружения
├── .gitignore             # Git ignore файл
├── Dockerfile             # Docker-конфигурация
├── docker-compose.yml     # Docker Compose-конфигурация
├── next.config.js         # Конфигурация Next.js
├── package.json           # Зависимости проекта
├── postcss.config.js      # Конфигурация PostCSS
├── README.md              # Документация проекта
├── tailwind.config.js     # Конфигурация Tailwind CSS
└── tsconfig.json          # Конфигурация TypeScript
```

## Интеграция с бэкендом

Этот фронтенд предназначен для работы с бэкенд-сервисами Task Manager:

- **PHP Backend**: обработка аутентификации и управления задачами
- **Golang Backend**: обработка чата в реальном времени
- **PostgreSQL**: хранение данных пользователей и задач
- **MongoDB**: хранение сообщений чата
- **Nginx**: API-шлюз

Перед запуском фронтенда убедитесь, что все бэкенд-сервисы работают.

## Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции: `git checkout -b feature/your-feature-name`
3. Зафиксируйте изменения: `git commit -m 'Добавить новую функцию'`
4. Отправьте ветку на сервер: `git push origin feature/your-feature-name`
5. Откройте pull request

## Лицензия

Этот проект распространяется под лицензией MIT.
