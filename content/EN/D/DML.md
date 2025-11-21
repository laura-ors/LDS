---
title: DML
draft: false
tags:
updated: 2025-11-21 16:02
автор:
---
 **DML (Data Manipulation Language)** — это подмножество [[SQL]], которое включает команды для работы с данными в базе данных. DML-операции позволяют манипулировать данными: добавлять, читать, изменять и удалять записи в таблицах.

Проще говоря, DML — это **"инструменты для работы с содержимым"** базы данных, в то время как [[DDL]] работает со структурой.

---

### Основные команды DML

#### 1. **SELECT** — выборка данных
Чтение данных из таблиц.

```sql
SELECT * FROM employees;
SELECT name, salary FROM employees WHERE department = 'IT';
```

#### 2. **INSERT** — вставка данных
Добавление новых записей в таблицу.

```sql
INSERT INTO employees (name, department, salary) 
VALUES ('Иван Иванов', 'IT', 75000);
```

#### 3. **UPDATE** — обновление данных
Изменение существующих записей.

```sql
UPDATE employees 
SET salary = 80000 
WHERE name = 'Иван Иванов';
```

#### 4. **DELETE** — удаление данных
Удаление записей из таблицы.

```sql
DELETE FROM employees 
WHERE department = 'HR';
```

---

### Характеристики DML

1. **Работа с данными, а не структурой**
   * DML манипулирует содержимым таблиц
   * Не изменяет саму структуру базы данных

2. **Поддержка транзакций**
   * DML-операции могут быть частью транзакций
   * Можно откатывать (ROLLBACK) или подтверждать (COMMIT)

3. **Влияние на целостность данных**
   * DML-операции проверяют ограничения целостности
   * Могут активировать триггеры

---

### Примеры использования DML

#### Сценарий 1: Добавление нового сотрудника
```sql
INSERT INTO employees (id, name, department, salary, hire_date)
VALUES (101, 'Мария Петрова', 'Marketing', 60000, '2024-01-15');
```

#### Сценарий 2: Повышение зарплаты отделу
```sql
UPDATE employees 
SET salary = salary * 1.1 
WHERE department = 'IT';
```

#### Сценарий 3: Увольнение сотрудника
```sql
DELETE FROM employees 
WHERE id = 100 AND name = 'Иван Сидоров';
```

#### Сценарий 4: Получение аналитики
```sql
SELECT department, COUNT(*) as emp_count, AVG(salary) as avg_salary
FROM employees 
GROUP BY department 
HAVING AVG(salary) > 50000;
```

---

### DML vs DDL

| Критерий | **DML** | **DDL** |
|----------|---------|---------|
| **Назначение** | Работа с данными | Работа со структурой |
| **Основные команды** | SELECT, INSERT, UPDATE, DELETE | CREATE, ALTER, DROP |
| **Транзакции** | Поддерживаются | Обычно auto-commit |
| **Откат изменений** | Возможен через ROLLBACK | Сложнее или невозможен |
| **Пример** | `UPDATE employees SET salary = 1000` | `CREATE TABLE employees (...)` |

---

### Расширенные возможности DML

#### MERGE (UPSERT)
Объединение INSERT и UPDATE в одной операции:

```sql
MERGE INTO employees AS target
USING new_employees AS source
ON target.id = source.id
WHEN MATCHED THEN
    UPDATE SET target.salary = source.salary
WHEN NOT MATCHED THEN
    INSERT (id, name, salary) 
    VALUES (source.id, source.name, source.salary);
```

#### CALL
Вызов хранимых процедур:

```sql
CALL calculate_year_end_bonus();
```

---

### Важные аспекты DML

1. **Производительность**
   * Операции UPDATE и DELETE без WHERE могут быть медленными
   * Индексы ускоряют SELECT, но замедляют INSERT/UPDATE

2. **Блокировки**
   * DML-операции могут блокировать данные
   * Длительные операции могут влиять на других пользователей

3. **Журналирование**
   * Большинство СУБД ведет журнал DML-операций
   * Позволяет восстанавливать данные после сбоев

---

### Лучшие практики DML

1. **Всегда используйте WHERE в UPDATE/DELETE**
   ```sql
   -- ОПАСНО!
   DELETE FROM employees;
   
   -- ПРАВИЛЬНО
   DELETE FROM employees WHERE id = 100;
   ```

2. **Используйте транзакции для групп операций**
   ```sql
   BEGIN TRANSACTION;
   UPDATE accounts SET balance = balance - 100 WHERE id = 1;
   UPDATE accounts SET balance = balance + 100 WHERE id = 2;
   COMMIT;
   ```

3. **Проверяйте влияние операций**
   ```sql
   -- Сначала посмотреть, что будет затронуто
   SELECT COUNT(*) FROM employees WHERE department = 'HR';
   
   -- Затем выполнять удаление
   DELETE FROM employees WHERE department = 'HR';
   ```

---

### Итог

**DML** — это фундаментальная часть SQL, которая обеспечивает всю основную работу с данными: чтение, добавление, изменение и удаление. Понимание DML критически важно для любого разработчика, аналитика или администратора баз данных, поскольку эти операции составляют основу повседневной работы с базами данных.
