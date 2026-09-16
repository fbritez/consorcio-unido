# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules and Constraints

- **No summary or explanations**: Never respond with an explanatory summary of applied changes, unless explicitly requested to provide details about a change or how a code block works.
- **No preambles or pleasantries**: Avoid greetings, intros, conversational filler, or fluff. Deliver the direct result only.
- **Do not write unit tests**: Do not write unit tests (or any other automated tests) for any block of code unless explicitly requested.
- **Do not execute tests**: Do not run unit tests (or any other automated tests) unless explicitly asked to do so.

## Project Overview

**United Consortium Backend** is a Flask-based REST API for managing consortiums, users, expenses, claims, and notifications. The API serves as the backend for a consortium expense management application.

## Architecture

The codebase follows a **layered architecture** with clear separation of concerns:

### Layer Structure
- **`src/app.py`**: Flask application entry point. Registers all API blueprints and Swagger configuration.
- **`src/API/`**: HTTP route handlers (Flask blueprints). Each module has its own API file (e.g., `login_api.py`, `consortium_api.py`). All APIs are registered as blueprints in `app.py`.
- **`src/service/`**: Business logic layer. Services contain domain-specific logic and orchestrate DAO calls. Each service corresponds to a domain entity (e.g., `LoginService`, `ConsortiumService`).
- **`src/DAO/`**: Data Access Object layer providing database abstraction. Supports multiple backends (MongoDB, PostgreSQL, SQLite).
- **`src/model/`**: Entity definitions (User, Consortium, Claim, ExpensesReceipt, etc.).
- **`src/notifications/`**: Email notification handling.
- **`src/utils/`**: Utility functions and error handling decorators.

### Database Abstraction Pattern

The **DAO Factory Pattern** (`src/DAO/dao_factory.py`) abstracts database operations:
- **Backend Selection**: Controlled via `DB_BACKEND` environment variable (`mongo`, `postgres`, or `sqlite`). Defaults to `sqlite`.
- **Available Backends**: 
  - `MongoBackend` - MongoDB support
  - `PostgresBackend` - PostgreSQL with SQLAlchemy ORM
  - `SQLiteBackend` - SQLite (file-based, good for testing/local development)
- **Usage in Services**: Services call `DAOFactory.create_dao('entity_name')` to get the appropriate DAO implementation.

### Environment Configuration

- **`DB_BACKEND`**: Database backend selection (`sqlite`, `postgres`, `mongo`). Defaults to `sqlite`.
- **`DB_ENV`**: Environment mode (`tests`, `uat`, `prod`). Used for data directory organization. Default is `uat`.
- **Virtual Environment**: `.venv-1/` (Python 3.9)

## Development Setup

### Prerequisites
- Python 3.9
- pip

### Initial Setup
```bash
# Create and activate virtual environment
python -m venv .venv-1
.\.venv-1\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Key Dependencies
- **Flask** (`~=1.1.2`): Web framework
- **Flask-CORS** (`flask_cors`): Cross-origin support
- **Flasgger** (`~=0.9.7.1`): Swagger/OpenAPI documentation
- **SQLAlchemy** (`>=2.0.0`): ORM for relational databases
- **pymongo** (`~=3.11.3`): MongoDB driver
- **psycopg2-binary** (`>=2.9.0`): PostgreSQL driver
- **pytest**: Testing framework
- **yagmail** (`~=0.14.256`): Email sending

## Common Development Commands

### Running the Application
```bash
# Run on http://localhost:5000
python -m src.app

# Run with specific database backend
set DB_BACKEND=postgres
python -m src.app

# Access Swagger UI: http://localhost:5000/apidocs/
```

### Testing
```bash
# Run all tests
pytest

# Run tests for a specific module
pytest tests/service/login_service_test.py

# Run tests with verbose output
pytest -v

# Run tests in a specific test class
pytest tests/service/login_service_test.py::TestClassName

# Run a single test function
pytest tests/service/login_service_test.py::test_function_name
```

### Database Management
```bash
# Switch to PostgreSQL for a run
set DB_BACKEND=postgres
python -m src.app

# Switch to MongoDB
set DB_BACKEND=mongo
python -m src.app

# SQLite (default) - uses data/UAT/united_consortium.db or data/TESTS/united_consortium.db
set DB_BACKEND=sqlite
python -m src.app
```

## Code Patterns & Conventions

### Service Class Pattern
Services take optional dependencies for testing:
```python
class MyService:
    def __init__(self, dao=None):
        self.dao = dao or DAOFactory.create_dao('entity_name')
```

This allows for easy mocking in tests.

### API Handler Pattern
API handlers use the `@handle_errors` decorator for automatic error handling:
```python
@handle_errors(return_error_code=401)
def handler():
    # route logic
```

### Blueprint Registration
All API modules are Flask Blueprints registered in `app.py`:
```python
app.register_blueprint(login_api)
app.register_blueprint(consortium_api)
# ... etc
```

## Data Organization

**Data storage locations** (organized by environment):
- `data/TESTS/` - Test database
- `data/UAT/` - User Acceptance Testing database
- `data/PROD/` - Production database

The environment is controlled by the `DB_ENV` variable (set in `.vscode/settings.json` for local development).

## API Documentation

- **Swagger/OpenAPI**: Automatically generated from decorators
- **Location**: `http://localhost:5000/apidocs/` (when running locally)
- **Configuration**: `src/swagger_config.py` defines the OpenAPI schema

## Testing Strategy

- **Framework**: pytest
- **Test Location**: `tests/` directory mirrors `src/` structure
- **Test Environment**: Uses SQLite by default with `DB_ENV=tests`
- **Fixtures**: Common test setup in `tests/conftest.py`
- **DAO Testing**: Includes specific tests for DAO factory and backend implementations

## File I/O

- **Images/Tickets**: Stored via `ImageDAO` (supports multiple backends)
- **Data Location**: Database files stored in `data/` organized by environment

## Adding New Features

1. **Create Model**: Add entity class in `src/model/`
2. **Create DAOs**: Implement in `src/DAO/mongo_DAO.py`, `src/DAO/postgres_DAO.py`, `src/DAO/sqlite_DAO.py`
3. **Register DAOs**: Add to factory in `src/DAO/dao_factory.py`
4. **Create Service**: Add business logic in `src/service/`
5. **Create API**: Add routes in `src/API/` and register blueprint in `app.py`
6. **Add Tests**: Mirror the structure in `tests/`
