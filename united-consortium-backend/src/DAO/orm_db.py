import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


DATABASE_ROOT = Path(__file__).resolve().parents[2] / 'data'
DATABASE_ENVIRONMENTS = {
    'uat': 'UAT',
    'tests': 'TESTS',
    'prod': 'PROD',
}

Base = declarative_base()

_engines = {}
_session_factories = {}


def sqlite_database_path():
    configured_path = os.environ.get('SQLITE_DATABASE_PATH')
    if configured_path:
        path = Path(configured_path)
    else:
        database_environment = os.environ.get('DB_ENV', 'uat').strip().lower()
        directory_name = DATABASE_ENVIRONMENTS.get(database_environment, 'UAT')
        path = DATABASE_ROOT / directory_name / 'united_consortium.db'
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def postgres_database_url():
    return os.getenv(
        'DATABASE_URL',
        'postgresql+psycopg2://postgres:postgres@localhost:5432/united_consortium'
    )


def database_url(backend_name='sqlite', database_path=None):
    if backend_name == 'postgres':
        return postgres_database_url()
    return 'sqlite:///' + str(database_path or sqlite_database_path())


def get_engine(url):
    """Engines are cached per URL so every DAO of a run shares one pool."""
    engine = _engines.get(url)
    if engine is None:
        options = {'pool_pre_ping': True}
        if url.startswith('sqlite'):
            options = {'connect_args': {'check_same_thread': False}}
        engine = create_engine(url, **options)
        _engines[url] = engine
        _session_factories[url] = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        if url.startswith('sqlite'):
            # The SQLite file is created and owned by the app; a PostgreSQL schema
            # is managed outside of it, so we never touch it on connect.
            create_schema(engine)
    return engine


def get_session(url):
    get_engine(url)
    return _session_factories[url]()


def create_schema(engine):
    from src.DAO import orm_models  # noqa: F401  (registers the mappings)
    Base.metadata.create_all(engine)


def dispose_engine(url):
    engine = _engines.pop(url, None)
    _session_factories.pop(url, None)
    if engine is not None:
        engine.dispose()


def get_db_session():
    session = get_session(database_url('postgres'))
    try:
        yield session
    finally:
        session.close()
