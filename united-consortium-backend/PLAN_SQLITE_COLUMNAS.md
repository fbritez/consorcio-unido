# Persistencia SQLite por columnas con SQLAlchemy — implementado

Objetivo: reemplazar la persistencia de SQLite (un JSON completo en la columna `document` de una
única tabla por entidad) por un esquema normalizado con **una columna por property**, usando
SQLAlchemy como ORM para que SQLite y PostgreSQL compartan exactamente la misma implementación.

Estado: **hecho y verificado**. 68 tests de persistencia en verde.

---

## 1. Arquitectura

La decisión central: no hay un DAO de SQLite y otro de Postgres. Hay **un solo DAO** sobre
SQLAlchemy y lo único que cambia entre backends es el engine.

```
src/DAO/orm_db.py        engine + session + Base, resuelve la URL por backend
src/DAO/orm_models.py    el mapeo: 14 tablas, una columna por property
src/DAO/orm_DAO.py       los DAO (traducción de queries + mapeo a modelos de dominio)
src/DAO/sqlite_DAO.py    los mismos DAO atados al engine SQLite
src/DAO/postgres_DAO.py  los mismos DAO atados al engine PostgreSQL
```

`postgres_db.py` y `postgres_models.py` quedaron como shims que reexportan de `orm_db` /
`orm_models`, así no se rompe nada que los importe.

Antes, `postgres_DAO.py` declaraba `model = User` y `model = Consortium`, es decir, consultaba
**clases de dominio que nunca estuvieron mapeadas**, mientras los modelos ORM reales de
`postgres_models.py` no los usaba nadie. Esa implementación no podía funcionar. Ahora los DAO
apuntan a los modelos ORM de verdad, con lo cual el backend Postgres queda funcional de paso.

El engine se cachea por URL. Para SQLite se hace `create_all` al crearlo; para PostgreSQL no se
toca el esquema, que se administra por fuera (y así el factory sigue pudiendo instanciar DAOs de
Postgres sin que haya un servidor levantado, como en `test_strategy_factory`).

---

## 2. Esquema generado

14 tablas, todas con columnas tipadas y sin una sola columna JSON de documento:

| Tabla | Columnas |
| --- | --- |
| `users` | `id`, `email` (UNIQUE), `name` |
| `login` | `id`, `user_email` (UNIQUE), `password` |
| `consortiums` | `id` (PK texto, uuid del servicio), `name`, `address`, `disabled` |
| `consortium_members` | `id`, `consortium_id` FK, `user_email`, `member_name`, `secondary_email`, `notes` |
| `consortium_administrators` | `id`, `consortium_id` FK, `user_email` |
| `expenses_receipts` | `id`, `consortium_id`, `month`, `year`, `is_open`, `payment_processed` |
| `member_expenses_receipts` | `id`, `expenses_receipt_id` FK, datos del member, `paid`, `paid_amount`, `filename` |
| `expense_items` | `id`, `expenses_receipt_id` FK, `member_expenses_receipt_id` FK, `title`, `description`, `amount`, `ticket` |
| `expense_item_members` | `id`, `expense_item_id` FK, datos del member |
| `claims` | `id`, `identifier` (UNIQUE), `consortium_id`, `owner`, `title`, `state`, `creation_date` |
| `claim_messages` | `id`, `claim_id` FK, `owner`, `message`, `filename` |
| `notifications` | `id`, `consortium_id`, `message`, `publishDate`, `extra_properties` |
| `settings` | `id`, `type`, `setting_id`, `extra_properties` |
| `images` | `id`, `file_id` (UNIQUE), `data` BLOB |

Un `ExpenseItem` cuelga del receipt **o** de un member receipt: dos FK nullables, nunca las dos.
Se resuelve con dos `relationship` sobre la misma tabla, cada una con su `primaryjoin` y sus
`foreign_keys`.

Todas las colecciones usan `cascade='all, delete-orphan'`: al reasignar `row.members = [...]` en
un update, el ORM borra los hijos viejos solo. No hay DELETE manuales.

`notifications` y `settings` no tienen modelo de dominio y el front manda diccionarios de forma
libre. Las properties conocidas van a columnas y el resto sobrevive en `extra_properties` (JSON).
Es la única concesión al JSON y es deliberada.

---

## 3. Traducción de queries

Los servicios siguen armando queries con forma Mongo (`{'campo': valor}` más `$or`). Ese contrato
**no se tocó**; `ORMBaseDAO._criterion` lo traduce a filtros del ORM:

- clave mapeada a columna → `Model.columna == valor`
- clave de relación → `Model.members.any(MemberModel.user_email == valor)`, y lo mismo para
  `members.secondary_email` y `administrators`
- `$or` → `or_(...)`, recursivo
- clave **no mapeada** → `false()`, nunca matchea. Preserva el comportamiento previo: por
  ejemplo `login_service.validate_user_email` consulta `secondary_email`, que no existe en
  `login`

Cada DAO expone `create_model(dict)` igual que antes, porque las APIs lo usan para construir
modelos de dominio desde el JSON del request. Los `_document()` arman ese mismo diccionario desde
las filas, así la lectura por DB y la lectura por HTTP comparten un solo camino.

---

## 4. Dos bugs corregidos de paso

1. `ExpensesReceiptDAO.create_model` descartaba los `expenses_items` de cada member receipt (los
   pasaba como `[]`), lo que dejaba `total_amount()` en 0 y rompía `get_non_payment_receipts()` y
   el cálculo de deuda acumulada. Ahora se hidratan, como ya hacía Mongo.
2. `ExpensesReceiptService.get_expenses_receipt` llamaba `ObjectId(receipt_id)` sin importar
   `ObjectId`: `NameError` garantizado en los tres backends. Ahora resuelve el id según el
   backend activo e importa `bson` solo en el camino Mongo.

---

## 5. Tests

**`tests/DAO/sqlite_DAO_test.py`** — 51 tests unitarios, uno por DAO. Cada bloque cubre:

- que las properties caen en las columnas esperadas. Se inspecciona `PRAGMA table_info` y las
  filas crudas con una conexión `sqlite3` aparte, **no** a través del DAO: si mañana alguien
  vuelve a meter un JSON en una columna, estos tests se caen
- lectura de vuelta como modelo de dominio, con el grafo completo
- cada query que usan los servicios (por member, por `secondary_email`, por administrator, por
  `is_open`, por `payment_processed`, por `owner`, `$or`)
- update sin duplicar filas ni dejar hijos huérfanos
- update de algo inexistente → inserta
- persistencia real: cerrar la conexión, abrir un DAO nuevo, volver a leer

**`tests/DAO/sqlite_persistence_integration_test.py`** — 17 tests de integración que manejan los
servicios contra un archivo SQLite real vía `DAOFactory`, mockeando solo el envío de mails.
Cubren alta y actualización de consorcio, registro automático de usuarios, login, receipts
abiertos/cerrados según rol, `generate_receipt` con member receipts, claims con identificador
autogenerado, settings, notificaciones, y un test final que reconstruye todos los servicios desde
cero para confirmar que lo escrito sobrevive.

En Windows el `tearDown` **debe** cerrar todas las sessions primero y recién después hacer
`dispose_engine(url)`, o el pool de SQLAlchemy deja el archivo tomado y
`TemporaryDirectory.cleanup()` falla.

---

## 6. Verificación

```bash
python -m pytest tests/DAO -q     # 68 passed
python -m pytest -q               # 100 passed, 4 failed
```

Los 4 fallos son **preexistentes** y ajenos a la persistencia: tests desactualizados contra
métodos que no existen.

- `tests/model/expeses_receipt_test.py::test_initialization` — llama `get_expeses_items()`, con
  el typo; el modelo expone `get_expenses_items()`
- `tests/service/consortium_service_test.py::test_consortiums_for` — el target del `patch()`
  nunca fue válido (`'src.service.consorsium_service.ConsortiumDAO'` no es un módulo)
- `tests/service/expense_receipt_service_test.py::test_expenses_for` — llama `get_expenses_for`
  con un solo argumento
- `tests/service/expense_receipt_service_test.py::test_update_expense` — llama `update_expense`,
  método inexistente

Quedan fuera de alcance: hay que decidir si se actualizan o se borran.

---

## 7. Pendiente: migración de datos existentes

No hay script de migración. Las bases viejas en `data/UAT/` y `data/PROD/` tienen las tablas con
la columna `document`; el código nuevo crea las tablas nuevas al lado y **no lee las viejas**.
Opciones:

- **A** — descartar los datos de UAT y recrear (viable si UAT es descartable).
- **B** — script one-shot que lea las filas `document`, las pase por el `create_model` viejo y
  las reinserte con los DAO nuevos. Es el camino obligado si `data/PROD/` tiene datos reales.

**Hasta resolver esto, no desplegar a PROD.**

## 8. Recomendación de higiene del repo

`env/` (un virtualenv completo) está versionado. Eso hace que cualquier `git stash -u` sea
peligroso: en esta sesión un `stash`/`pop` se rompió por esa razón. Agregar `env/`, `.venv-1/`,
`__pycache__/`, `*.pyc` y `data/` al `.gitignore`.
