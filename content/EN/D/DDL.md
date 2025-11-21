---
title: DDL
draft: false
tags:
updated: 2025-11-21 16:02
автор:
---
 
**DDL (Data Definition Language)** — это подмножество [[SQL]], которое включает команды для определения и изменения структуры базы данных. DDL-операции позволяют создавать, изменять и удалять объекты базы данных (таблицы, индексы, представления и т.д.), но не работают непосредственно с данными.

Проще говоря, DDL — это **"инструменты архитектора"** базы данных, которые определяют её "скелет" и структуру.

---

### Основные команды DDL

#### 1. **CREATE** — создание объектов
Создание новых таблиц, баз данных, индексов и других объектов.

```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    salary DECIMAL(10,2),
    hire_date DATE
);
```

#### 2. **ALTER** — изменение структуры
Изменение существующих объектов базы данных.

```sql
-- Добавление нового столбца
ALTER TABLE employees 
ADD email VARCHAR(100);

-- Изменение типа данных столбца
ALTER TABLE employees 
ALTER COLUMN department VARCHAR(100);

-- Удаление столбца
ALTER TABLE employees 
DROP COLUMN hire_date;
```

#### 3. **DROP** — удаление объектов
Полное удаление объектов базы данных.

```sql
-- Удаление таблицы
DROP TABLE employees;

-- Удаление базы данных
DROP DATABASE company_db;
```

#### 4. **TRUNCATE** — очистка таблицы
Удаление всех данных из таблицы с сохранением её структуры.

```sql
TRUNCATE TABLE employees;
```

#### 5. **RENAME** — переименование объектов
Изменение имен объектов (поддерживается не во всех СУБД).

```sql
-- В MySQL
RENAME TABLE old_employees TO new_employees;

-- В PostgreSQL
ALTER TABLE old_employees 
RENAME TO new_employees;
```

---

### Характеристики DDL

1. **Работа со структурой, а не данными**
   * Определяет схему базы данных
   * Не манипулирует непосредственно данными

2. **Auto-commit**
   * DDL-операции обычно выполняются с автоматическим подтверждением
   * Не могут быть частью транзакций в большинстве [[Реляционная СУБД|СУБД]]

1. **Влияние на [[Метаданные|метаданные]]**
   * Изменяет системные таблицы и схему данных
   * Может требовать эксклюзивных блокировок

---

### Примеры использования DDL

#### Создание сложной таблицы с ограничениями
```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10,2) CHECK (price > 0),
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_category 
    FOREIGN KEY (category) REFERENCES categories(category_name)
);
```

#### Создание индекса для оптимизации
```sql
CREATE INDEX idx_employee_department 
ON employees(department);
```

#### Создание представления (VIEW)
```sql
CREATE VIEW high_paid_employees AS
SELECT name, department, salary
FROM employees
WHERE salary > 100000;
```

---

### DDL vs [[DML]]

| Критерий | **DDL** | **DML** |
|----------|---------|---------|
| **Назначение** | Определение структуры | Манипуляция данными |
| **Основные команды** | CREATE, ALTER, DROP | SELECT, INSERT, UPDATE, DELETE |
| **Транзакции** | Обычно auto-commit | Поддерживаются транзакции |
| **Откат изменений** | Сложный или невозможный | Возможен через ROLLBACK |
| **Влияние** | Изменяет схему БД | Изменяет данные в таблицах |
| **Пример** | `CREATE TABLE employees (...)` | `INSERT INTO employees VALUES (...)` |

---

### Важные аспекты DDL

#### 1. **Ограничения целостности**
DDL позволяет определять правила для данных:

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2),
    
    -- Внешний ключ
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    
    -- Проверочное ограничение
    CHECK (total_amount >= 0),
    
    -- Уникальное ограничение
    UNIQUE (customer_id, order_date)
);
```

#### 2. **Типы данных**
DDL определяет типы данных для столбцов:

```sql
CREATE TABLE example_types (
    id INT,                    -- Целое число
    name VARCHAR(100),         -- Строка переменной длины
    price DECIMAL(8,2),        -- Число с фиксированной точностью
    created_date DATE,         -- Дата
    is_active BOOLEAN,         -- Логический тип
    data_json JSON,            -- JSON данные
    binary_data BLOB           -- Бинарные данные
);
```

---

### Расширенные возможности DDL

#### Создание составных объектов
```sql
-- Создание схемы
CREATE SCHEMA hr_department;

-- Создание последовательности
CREATE SEQUENCE employee_id_seq START WITH 1000;

-- Создание синонима
CREATE SYNONYM emp FOR employees;
```

#### Условное создание объектов
```sql
-- Создать только если не существует
CREATE TABLE IF NOT EXISTS temporary_data (
    id INT,
    data TEXT
);
```

---

### Безопасность DDL-операций

#### 1. **Резервное копирование**
Всегда делайте бэкап перед выполнением DDL:

```sql
-- Перед опасной операцией
BACKUP DATABASE company_db TO DISK = 'backup.bak';

-- Затем выполняем DDL
DROP TABLE old_data;
```

#### 2. **Проверка воздействия**
Анализируйте влияние перед выполнением:

```sql
-- Посмотреть зависимости
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'employees';
```

---

### Лучшие практики DDL

1. **Используйте понятные имена**
   ```sql
   -- ХОРОШО
   CREATE TABLE customer_orders (...);
   
   -- ПЛОХО
   CREATE TABLE tbl1 (...);
   ```

2. **Определяйте ограничения на уровне таблицы**
   ```sql
   -- ЛУЧШЕ
   CREATE TABLE employees (
       id INT,
       name VARCHAR(100),
       CONSTRAINT pk_employees PRIMARY KEY (id)
   );
   
   -- ХУЖЕ
   CREATE TABLE employees (
       id INT PRIMARY KEY,
       name VARCHAR(100)
   );
   ```

3. **Используйте комментарии**
   ```sql
   COMMENT ON TABLE employees IS 'Таблица сотрудников компании';
   COMMENT ON COLUMN employees.salary IS 'Зарплата в рублях';
   ```

4. **Тестируйте на development-окружении**
   * Всегда тестируйте DDL-изменения перед применением в production
   * Используйте миграции для управления изменениями схемы

---

### Особенности в разных СУБД

#### PostgreSQL
```sql
-- Добавление столбца с условием
ALTER TABLE employees 
ADD COLUMN retirement_date DATE 
CHECK (retirement_date > hire_date);
```

#### MySQL
```sql
-- Изменение движка таблицы
ALTER TABLE employees 
ENGINE = InnoDB;
```

#### Oracle
```sql
-- Создание таблицы с табличным пространством
CREATE TABLE employees (
    id NUMBER PRIMARY KEY
) TABLESPACE users;
```

---

### Итог

**DDL** — это мощный инструмент для управления структурой базы данных. В отличие от DML, который работает с данными, DDL определяет "правила игры" — создает таблицы, устанавливает связи между ними, определяет ограничения целостности и создает индексы для оптимизации.

**Ключевые моменты:**
- DDL-операции обычно необратимы
- Требуют осторожности при выполнении в production
- Являются основой для проектирования любой базы данных
- Определяют производительность и целостность данных на многие годы вперед

Правильное использование DDL — это искусство, которое требует глубокого понимания как бизнес-требований, так и технических возможностей выбранной СУБД.