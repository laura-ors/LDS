---
title: GitHub Actions
draft: false
tags:
updated: 2025-10-09 22:15
автор:
---
 
**GitHub Actions** — это встроенная платформа для автоматизации процессов CI/CD прямо внутри GitHub.

Если проводить аналогию с ранее рассмотренными инструментами:

- **Jenkins** — отдельный "робот-диспетчер", которого нужно устанавливать и обслуживать
- **GitLab CI/CD** — "встроенный конвейер" внутри фабрики GitLab  
- **GitHub Actions** — "умный автоматизатор" прямо внутри GitHub

---

### Что такое GitHub Actions?

**GitHub Actions** — это платформа для автоматизации рабочих процессов разработки программного обеспечения, интегрированная непосредственно в GitHub. Она позволяет создавать, тестировать и развертывать код прямо из вашего репозитория.

### Ключевые концепции

#### 1. Workflows (Рабочие процессы)

**Workflow** — это автоматизированный процесс, который вы определяете в своем репозитории. Он описывается YAML-файлом в директории `.github/workflows/`.

**Каждый workflow содержит:**
- **События** (events), которые запускают процесс
- **Задачи** (jobs), которые нужно выполнить
- **Шаги** (steps), которые выполняют команды или действия

#### 2. Events (События)

**Events** — это конкретные действия в репозитории, которые запускают workflow:

- `push` — отправка кода в репозиторий
- `pull_request` — создание или обновление pull request
- `release` — публикация релиза
- `schedule` — запуск по расписанию (cron)
- `workflow_dispatch` — ручной запуск

#### 3. Jobs (Задачи) и Steps (Шаги)

- **Job** — набор шагов, которые выполняются на одном раннере
- **Step** — отдельная задача, которая может запускать команды или действия

#### 4. Actions (Действия)

**Actions** — это повторно используемые блоки кода, которые можно включать в свои workflow. Это главная особенность GitHub Actions!

- **Предопределенные действия** из Marketplace
- **Кастомные действия**, которые вы можете написать сами

---

### Как работает GitHub Actions?

#### 1. Создание workflow файла

Вы создаете файл в директории: `.github/workflows/ci-cd.yml`

#### 2. Пример простого workflow

```yaml
name: CI Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build application
      run: npm run build
```

#### 3. Автоматический запуск

Когда вы делаете push или создаете pull request, workflow запускается автоматически.

---

### Преимущества GitHub Actions

#### 🚀 **Глубокая интеграция с GitHub**

- **Единая платформа** — код, Issues, Pull Requests и CI/CD в одном месте
- **Контекстная информация** — статус сборки прямо в Pull Request
- **Ветвление** — автоматические запуски для feature branches

#### 🛒 **Огромный Marketplace действий**

```yaml
- name: Deploy to AWS
  uses: aws-actions/configure-aws-credentials@v1
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Deploy to Firebase
  uses: FirebaseExtended/action-hosting-deploy@v0
  with:
    repoToken: '${{ secrets.GITHUB_TOKEN }}'
    firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
    channelId: live
```

#### 💰 **Бесплатно для публичных репозиториев**

- GitHub Actions бесплатен для публичных репозиториев
- Для приватных есть щедрый бесплатный лимит минут

#### 🔧 **Простота использования**

- **Нет инфраструктуры** — не нужно управлять серверами
- **YAML-конфигурация** — понятный и читаемый формат
- **Визуальный редактор** — можно редактировать workflow в браузере

---

### Примеры использования

#### 1. Полный CI/CD для Node.js приложения

```yaml
name: Node.js CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - run: npm ci
    - run: npm run lint
    - run: npm test
    - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
    
    - run: npm ci
    - run: npm run build
    
    - name: Deploy to production
      run: |
        echo "Деплой в продакшен..."
        # Ваши команды деплоя
```

#### 2. Мультиплатформенное тестирование

```yaml
name: Multi-platform Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16.x, 18.x]
    
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm ci
    - run: npm test
```

#### 3. Продвинутый workflow с кэшированием

```yaml
name: Advanced CI

on:
  push:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v4
    
    - name: Cache node modules
      uses: actions/cache@v3
      env:
        cache-name: cache-node-modules
      with:
        path: ~/.npm
        key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-build-${{ env.cache-name }}-
          ${{ runner.os }}-build-
          ${{ runner.os }}-
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests with PostgreSQL
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-output
        path: dist/
```

---

### GitHub Actions vs Другие инструменты

| Аспект | **GitHub Actions** | **Jenkins** | **GitLab CI/CD** |
|--------|-------------------|-------------|------------------|
| **Хостинг** | Полностью облачный | Сам хостинг | Встроен в GitLab |
| **Настройка** | YAML в репозитории | Web UI + Groovy | YAML в репозитории |
| **Интеграция** | Идеальная с GitHub | Через плагины | Идеальная с GitLab |
| **Экосистема** | Marketplace действий | Плагины | Встроенные функции |
| **Стоимость** | Бесплатно для публичных | Бесплатно (инфраструктура) | Зависит от тарифа |

### Ключевые особенности

1. **Матричные сборки** — запуск тестов на разных ОС, версиях языка
2. **Артефакты** — сохранение результатов сборки
3. **Секреты** — безопасное хранение чувствительных данных
4. **Кэширование** — ускорение повторных сборок
5. **Сервис-контейнеры** — запуск баз данных, кэшей и других сервисов

### Итог

**GitHub Actions** — это мощный, современный и удобный инструмент для автоматизации, который идеально подходит, если:

- ✅ **Ваш код уже на GitHub** — максимальная интеграция
- ✅ **Вы хотите быстро начать** — без настройки инфраструктуры  
- ✅ **Нужна богатая экосистема** — тысячи готовых действий
- ✅ **Важен простой UI** — интуитивный интерфейс для просмотра запусков

Это отличный выбор для большинства проектов, особенно для open-source и стартапов, где важна скорость настройки и минимальные затраты на инфраструктуру.