---
title: Взаимодействие Git и GitLab CI/CD
draft: false
tags:
updated: 2025-10-09 21:38
автор:
---
## Основная концепция: Git как триггер, [[CI CD|CI/CD]] как исполнитель

**Git** управляет вашим кодом и его историей.
**CI/CD** автоматически реагирует на события в Git и выполняет predefined workflows (пайплайны).

---

## Как они взаимодействуют: механизм триггеров

### 1. События Git, которые запускают пайплайны:

- **Push** в любую ветку
- **Merge Request** (создание, обновление, закрытие)
- **Tag** создание
- **Комментарий** в MR с определенной командой
- **API вызов**

### 2. Runner — связующее звено

```
Git событие → CI/CD → Runner → Выполнение jobs → Отчет в GitLab
```

Runner — это агент, который устанавливается отдельно и выполняет ваши задания. Он постоянно "опрашивает" GitLab: "Есть ли работа для меня?"

---

## Практическая интеграция: что куда передается

### Ключевые переменные окружения, которые Git передает в CI/CD:

| Переменная | Описание | Пример |
|------------|----------|---------|
| `CI_COMMIT_SHA` | Хеш коммита, который запустил пайплайн | `a1b2c3d4...` |
| `CI_COMMIT_REF_NAME` | Имя ветки или тега | `feature/new-auth` |
| `CI_COMMIT_BRANCH` | Имя ветки (только для веток) | `main` |
| `CI_MERGE_REQUEST_SOURCE_BRANCH_NAME` | Исходная ветка MR | `feature/login-fix` |
| `CI_MERGE_REQUEST_TARGET_BRANCH_NAME` | Целевая ветка MR | `develop` |

### Пример пайплайна, использующего Git-информацию:

```yaml
stages:
  - test
  - deploy

unit_tests:
  stage: test
  script:
    - echo "Тестируем коммит $CI_COMMIT_SHA в ветке $CI_COMMIT_BRANCH"
    - npm test

deploy_to_staging:
  stage: deploy
  script:
    - echo "Деплой на staging..."
    - ./deploy.sh staging
  only:
    - develop  # Запускается ТОЛЬКО для ветки develop

deploy_to_prod:
  stage: deploy
  script:
    - echo "Деплой в production..."
    - ./deploy.sh production
  only:
    - main    # Запускается ТОЛЬКО для ветки main
  when: manual  # Требует ручного запуска
```

---

## Продвинутые сценарии взаимодействия

### 1. Стратегии ветвления и пайплайны

**Git Flow:**
```yaml
deploy_to_prod:
  only:
    - main
  except:
    - tags
```

**Feature Branches:**
```yaml
test_feature:
  except:
    - main
    - develop
```

### 2. Условные выполнения на основе Git-атрибутов

```yaml
deploy_if_changed:
  script: 
    - ./deploy.sh
  only:
    changes:
      - "src/database/**/*"  # Запускать только если менялись SQL-файлы
      - "package.json"       # или package.json
```

### 3. Работа с Merge Requests

```yaml
mr_checks:
  stage: test
  script:
    - echo "Проверяем MR из $CI_MERGE_REQUEST_SOURCE_BRANCH_NAME в $CI_MERGE_REQUEST_TARGET_BRANCH_NAME"
    - sonar-scanner
  only:
    - merge_requests  # Специальный контекст только для MR
```

### 4. Git Tags для релизов

```yaml
create_release:
  stage: deploy
  script:
    - git tag v1.0.$CI_PIPELINE_ID
    - git push origin v1.0.$CI_PIPELINE_ID
  only:
    - tags
    - /^v\d+\.\d+\.\d+/  # Регулярка для тегов версий
```

---

## Реальный пример: SQL-миграции в GitLab CI/CD

```yaml
stages:
  - test
  - deploy_migrations

lint_sql:
  stage: test
  script:
    - sqlfluff lint migrations/
  only:
    changes:
      - "migrations/*.sql"  # Запускаем линтер только если менялись SQL-файлы

test_migrations:
  stage: test
  script:
    - echo "Применяем миграции к тестовой БД"
    - for file in migrations/*.sql; do
        psql $TEST_DB_URL -f $file || exit 1;
      done
  only:
    - merge_requests  # Проверяем миграции в каждом MR

deploy_migrations_prod:
  stage: deploy_migrations
  script:
    - echo "Применяем миграции к продовой БД"
    - for file in migrations/*.sql; do
        psql $PROD_DB_URL -f $file;
      done
  only:
    - main  # Только при мердже в main
  when: manual  # Ручной запуск для безопасности
```

---

## Best Practices для интеграции

1. **`.gitlab-ci.yml` в корне репозитория** — GitLab автоматически его находит
2. **Используйте `only`/`except` разумно** — не запускайте все для всех веток
3. **Кэшируйте зависимости** между пайплайнами для ускорения
4. **Артефакты** — передавайте результаты между стадиями
5. **Git Submodules** — если используете, настройте корректно в CI

### Пример с кэшированием и артефактами:

```yaml
cache:
  paths:
    - node_modules/
    - .gradle/cache

build:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/  # Передаем собранные файлы в следующую стадию
```

---

## Отладка взаимодействия

1. **Просмотр переменных в пайплайне:**
```yaml
debug_vars:
  stage: test
  script:
    - env | grep CI_  # Показывает все CI-переменные
```

2. **Проверка Git-контекста:**
```bash
git log --oneline -5  # В job-е покажет историю коммитов
git branch -a         # Покажет все ветки
```

**Ключевая мысль:** Git предоставляет контекст (кто, что, куда), а GitLab CI/CD использует этот контекст для выполнения соответствующего workflow.