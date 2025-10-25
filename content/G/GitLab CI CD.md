---
title: GitLab CI/CD
draft: false
tags:
updated: 2025-10-09 22:08
автор:
---
 
**GitLab CI/CD** — это встроенный инструмент для автоматизации процессов непрерывной интеграции и доставки, который является неотъемлемой частью платформы GitLab.

Если проводить аналогию с Jenkins:

- **[[Jenkins]]** — это отдельный, самостоятельный "робот-диспетчер", которого нужно устанавливать и настраивать отдельно
- **GitLab CI/CD** — это "встроенный конвейер" прямо внутри вашей фабрики- GitLab

---

### Что такое GitLab CI/CD?

**GitLab CI/CD** — это комплексный инструмент, который позволяет автоматизировать весь процесс от написания кода до его развертывания в продакшен, используя единую платформу GitLab.

### Ключевые компоненты

#### 1. Файл `.gitlab-ci.yml`

Это сердце GitLab CI/CD. **YAML-файл**, который вы добавляете в корень вашего репозитория. В нем вы описываете весь процесс сборки, тестирования и развертывания.

**Простой пример:**
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

unit_tests:
  stage: test
  script:
    - npm install
    - npm test

build_app:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/

deploy_staging:
  stage: deploy
  script:
    - echo "Развертывание на staging-сервер..."
    - scp -r dist/* user@staging-server:/path
  only:
    - main
```

#### 2. Runner (Выполнитель)

**Runner** — это приложение, которое запускает задания, описанные в `.gitlab-ci.yml`. Бывают разных типов:

- **Shared Runners** — общие раннеры, предоставляемые GitLab
- **Specific Runners** — ваши собственные раннеры, которые вы настраиваете
- **Docker Runner** — запускает задания в [[Docker]]-контейнерах (самый популярный вариант)

#### 3. Pipeline (Конвейер)

**Pipeline** — это полный процесс выполнения, который состоит из:
- **Stages** (Этапы) — например, `test`, `build`, `deploy`
- **Jobs** (Задания) — конкретные задачи внутри этапов

### Как работает GitLab CI/CD?

1. **Разработчик** пушит код в репозиторий GitLab
2. **GitLab** автоматически обнаруживает файл `.gitlab-ci.yml` в репозитории
3. **Создается Pipeline** на основе описанного в файле процесса
4. **Runner** забирает задания и выполняет их
5. **Результаты** отображаются прямо в интерфейсе GitLab

### Преимущества GitLab CI/CD

#### 🎯 **Главное преимущество: "Всё в одном месте"**

1. **Единая платформа**
   - Код, CI/CD, Issues, Container Registry — всё в одном интерфейсе
   - Не нужно интегрировать разные инструменты

2. **Простота настройки**
   - Не нужно устанавливать и поддерживать отдельный сервер (как Jenkins)
   - Конфигурация одним YAML-файлом в репозитории

3. **Глубокая интеграция с Git**
   - Pipeline автоматически запускается при push, merge request
   - Статус pipeline виден прямо в merge request
   - Можно настроить правила: "запретить мерж, если pipeline не прошел"

4. **Встроенные возможности**
   - **Auto DevOps** — готовые шаблоны для популярных языков
   - **Container Registry** — встроенный Docker-реестр
   - **Environments** — управление разными средами (staging, production)
   - **Review Apps** — автоматическое создание тестовых окружений для каждого merge request

5. **Отличная визуализация**
   - Красивый и понятный интерфейс для просмотра пайплайнов
   - Графическое представление этапов
   - Логи выполнения в реальном времени

### Пример реального пайплайна

```yaml
image: node:16

stages:
  - install
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

install_dependencies:
  stage: install
  script:
    - npm ci

lint:
  stage: test
  script:
    - npm run lint

unit_tests:
  stage: test
  script:
    - npm run test:coverage
  artifacts:
    reports:
      cobertura: coverage/cobertura-coverage.xml

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
  only:
    - main

deploy_to_staging:
  stage: deploy
  script:
    - npm install -g firebase-tools
    - firebase deploy --project my-staging-project --token $FIREBASE_TOKEN
  environment:
    name: staging
    url: https://my-staging-project.firebaseapp.com
  only:
    - main
```

### GitLab CI/CD vs Jenkins

| Аспект | GitLab CI/CD | Jenkins |
|--------|--------------|---------|
| **Установка** | Встроен в GitLab | Отдельный сервер |
| **Конфигурация** | YAML-файл в репозитории | Web-интерфейс + Groovy |
| **Интеграция** | Глубокая с GitLab | Через плагины |
| **Обслуживание** | GitLab занимается | Вы занимаетесь |
| **Подход** | "Конфигурация как код" | Гибкий, но сложный |

### Кому подходит GitLab CI/CD?

- ✅ **Командам, уже использующим GitLab** — идеальная интеграция
- ✅ **Новичкам в CI/CD** — проще начать, чем с Jenkins
- ✅ **Проектам, где важна скорость настройки** — "из коробки"
- ✅ **Командам, ценящим единую платформу**

### Итог

**GitLab CI/CD** — это мощный, современный и удобный инструмент, который делает процессы [[CI CD|CI/CD]] доступными и простыми в использовании. Его главное преимущество — глубокая интеграция со всей экосистемой GitLab, что позволяет сосредоточиться на разработке, а не на поддержке инфраструктуры.

Если ваша команда уже использует [[GitLab]] — это естественный и эффективный выбор для автоматизации ваших процессов сборки и развертывания.