---
title: LogCosh Loss
draft: false
tags:
updated: 2025-11-07 13:17
автор:
---
 
**LogCosh Loss** (логарифм гиперболического косинуса ошибки) — это гладкая функция потерь, которая приближает поведение [[MAE (Mean Absolute Error)|MAE]], но при этом является дважды дифференцируемой во всех точках. Она сочетает в себе преимущества [[RMSE (Root Mean Square Error)|MSE]] и MAE.

## Что такое LogCosh Loss?

**LogCosh Loss** вычисляет логарифм гиперболического косинуса ошибки прогноза. Это дает функцию, которая ведет себя подобно MSE для малых ошибок и подобно MAE для больших ошибок, но при этом является гладкой.

### Формула:

**L(y, ŷ) = log(cosh(ŷ - y))**

Где:
- **y** — фактическое значение
- **ŷ** — предсказанное значение
- **cosh** — гиперболический косинус: `cosh(x) = (eˣ + e⁻ˣ)/2`
- **log** — натуральный логарифм

---

## Свойства и поведение LogCosh Loss

### Аппроксимации для разных диапазонов ошибок:

- **Для малых ошибок (|x| → 0):**
  `log(cosh(x)) ≈ x²/2 - x⁴/12 + ...` → ведет себя как **MSE**

- **Для больших ошибок (|x| → ∞):**
  `log(cosh(x)) ≈ |x| - log(2)` → ведет себя как **MAE**

### Визуальное сравнение:

```
Ошибка (x) | MSE    | MAE    | LogCosh
-----------|--------|--------|---------
0.1        | 0.01   | 0.1    | 0.005
0.5        | 0.25   | 0.5    | 0.12
1.0        | 1.0    | 1.0    | 0.43
2.0        | 4.0    | 2.0    | 1.32
5.0        | 25.0   | 5.0    | 4.31
10.0       | 100.0  | 10.0   | 9.31
```

---

## Преимущества LogCosh Loss

1. **Гладкость**: Дважды дифференцируема во всех точках (в отличие от MAE)
2. **Автоматическое масштабирование**: Не требует подбора параметров (в отличие от Huber Loss)
3. **Робастность к выбросам**: Как MAE, но с лучшими свойствами оптимизации
4. **Симметричность**: Одинаково относится к положительным и отрицательным ошибкам
5. **Вычислительная стабильность**: Не подвержена численной нестабильности

---

## Сравнение с другими функциями потерь

### Градиенты функций потерь:

| Функция | Градиент | Вторая производная |
|---------|----------|-------------------|
| **MSE** | 2x | 2 (постоянная) |
| **MAE** | ±1 (не определена в 0) | 0 (не определена в 0) |
| **Huber** | { x если |x|≤δ, ±δ иначе } | { 1 если |x|≤δ, 0 иначе } |
| **LogCosh** | tanh(x) | sech²(x) |

### Ключевые отличия от Huber Loss:
- **Huber**: Требует выбора параметра δ
- **LogCosh**: Автоматически адаптируется, не требует параметров

---

## Реализация в Python

### Базовая реализация NumPy:
```python
import numpy as np

def logcosh_loss(y_true, y_pred):
    """
    Вычисляет LogCosh Loss между фактическими и предсказанными значениями
    """
    errors = y_pred - y_true
    return np.log(np.cosh(errors))

# Векторизованная версия для среднего значения
def mean_logcosh_loss(y_true, y_pred):
    errors = y_pred - y_true
    return np.mean(np.log(np.cosh(errors)))

# Пример использования
y_true = np.array([1.0, 2.0, 3.0, 4.0])
y_pred = np.array([1.1, 1.8, 3.2, 4.1])

loss = mean_logcosh_loss(y_true, y_pred)
print(f"LogCosh Loss: {loss:.4f}")
```

### Реализация для глубокого обучения:

```python
# TensorFlow/Keras
import tensorflow as tf

def logcosh_loss_tf(y_true, y_pred):
    errors = y_pred - y_true
    return tf.reduce_mean(tf.math.log(tf.math.cosh(errors)))

# PyTorch
import torch

def logcosh_loss_torch(y_true, y_pred):
    errors = y_pred - y_true
    return torch.mean(torch.log(torch.cosh(errors)))
```

### Численно стабильная реализация:
```python
def logcosh_stable(y_true, y_pred):
    """
    Численно стабильная версия LogCosh Loss
    """
    errors = y_pred - y_true
    abs_errors = np.abs(errors)
    
    # Для больших ошибок используем аппроксимацию |x| - log(2)
    large_errors = abs_errors > 20  # Эмпирический порог
    result = np.empty_like(errors)
    
    result[large_errors] = abs_errors[large_errors] - np.log(2.0)
    result[~large_errors] = np.log(np.cosh(errors[~large_errors]))
    
    return np.mean(result)
```

---

## Производные LogCosh Loss

### Первая производная (градиент):
**∂L/∂ŷ = tanh(ŷ - y)**

### Вторая производная (гессиан):
**∂²L/∂ŷ² = sech²(ŷ - y)**

### Свойства производных:
- **tanh(x)** ограничена между -1 и 1 → градиенты не взрываются
- **sech²(x)** всегда положительна → функция выпукла
- Обе производные гладкие и непрерывные

---

## Практическое применение

### 1. **Глубокое обучение**
- Замена MSE в нейронных сетях для большей робастности
- Использование в моделях с автоматическим дифференцированием

### 2. **Градиентный бустинг**
```python
# Пример с XGBoost (через пользовательскую функцию потерь)
import xgboost as xgb

def logcosh_metric(y_true, y_pred):
    errors = y_pred - y_true
    return 'logcosh', np.mean(np.log(np.cosh(errors)))

model = xgb.XGBRegressor(objective='reg:squarederror')
# Можно добавить кастомную метрику для мониторинга
```

### 3. **Финансовые модели**
- Прогнозирование волатильности
- Количественные стратегии

### 4. **Обработка сигналов**
- Шумоподавление
- Сжатие данных

---

## Сравнительный анализ

### На данных с выбросами:
```python
import matplotlib.pyplot as plt

# Данные с выбросами
y_true = np.concatenate([np.random.normal(0, 1, 100), [10, -10, 15]])
y_pred = np.concatenate([np.random.normal(0, 0.5, 100), [0, 0, 0]])

mse_loss = np.mean((y_true - y_pred)**2)
mae_loss = np.mean(np.abs(y_true - y_pred))
logcosh_loss = mean_logcosh_loss(y_true, y_pred)

print(f"MSE: {mse_loss:.2f}")        # Сильно завышена из-за выбросов
print(f"MAE: {mae_loss:.2f}")        # Устойчива к выбросам
print(f"LogCosh: {logcosh_loss:.2f}") # Устойчива и гладкая
```

---

## Преимущества перед Huber Loss

1. **Нет параметров**: Не требует выбора δ
2. **Более гладкая**: Дважды непрерывно дифференцируема
3. **Аналитическая форма**: Закрытая форма без условных операторов
4. **Теоретическая обоснованность**: Связана с гиперболическими функциями

---

## Недостатки

1. **Вычислительная стоимость**: Вычисление cosh и log дороже, чем квадрат или модуль
2. **Менее интерпретируема**: Сложнее объяснить бизнес-пользователям
3. **Меньше готовых реализаций**: Не так широко поддерживается в библиотеках

---

## Оптимизация производительности

### Быстрая аппроксимация:
```python
def fast_logcosh(y_true, y_pred, threshold=20):
    """
    Быстрая аппроксимация LogCosh Loss
    """
    errors = np.abs(y_pred - y_true)
    
    # Для малых ошибок: квадратичная аппроксимация
    small_errors = errors < 1.0
    result = np.empty_like(errors)
    result[small_errors] = 0.5 * errors[small_errors]**2
    
    # Для средних ошибок: точное вычисление
    medium_errors = (errors >= 1.0) & (errors <= threshold)
    result[medium_errors] = np.log(np.cosh(errors[medium_errors]))
    
    # Для больших ошибок: линейная аппроксимация
    large_errors = errors > threshold
    result[large_errors] = errors[large_errors] - np.log(2.0)
    
    return np.mean(result)
```

---

## Рекомендации по использованию

### Когда использовать LogCosh Loss:
- ✅ Нужна **робастность к выбросам** как у MAE
- ✅ Важна **гладкость** для оптимизации
- ✅ Используются **методы второго порядка** (Ньютон, гессианы)
- ✅ Не хотите **подбирать параметры** как в Huber Loss

### Когда выбрать другие функции:
- **MSE**: Данные чистые, нормальное распределение ошибок
- **MAE**: Максимальная робастность, можно терпеть негладкость
- **Huber**: Хотите явно контролировать переход между режимами

---

## Пример в нейронной сети

```python
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Создание модели с LogCosh Loss
model = Sequential([
    Dense(64, activation='relu', input_shape=(10,)),
    Dense(32, activation='relu'),
    Dense(1)  # Регрессия
])

model.compile(
    optimizer='adam',
    loss=logcosh_loss_tf,  # Наша кастомная функция потерь
    metrics=['mae', 'mse']
)

# Обучение
history = model.fit(
    X_train, y_train,
    validation_data=(X_test, y_test),
    epochs=100,
    verbose=1
)
```

## Резюме

**LogCosh Loss** — это элегантная функция потерь, которая:
- ✅ **Объединяет преимущества MSE и MAE**
- ✅ **Гладкая и дважды дифференцируемая** 
- ✅ **Робастная к выбросам**
- ✅ **Не требует параметров** в отличие от Huber Loss
- ✅ **Имеет ограниченные градиенты** для стабильной оптимизации

**Идеальное применение:** Когда вам нужна робастность MAE, но важна гладкость для эффективной оптимизации в градиентных методах, особенно в глубоком обучении и сложных нелинейных моделях.