from pathlib import Path
import os
from django.utils.translation import gettext_lazy as _

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-!4-aziegqq)3j$l&+3ayomdq0!tp=f-sx2q-rel8h#0#ky0)nm'
DEBUG = True

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    # admin panel custom
    'mptt',
    # 'mptt_admin',
    'grappelli',
    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # rest_framework
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework.authtoken',

    # Dependencies
    'django_filters',
    'corsheaders',
    'treebeard',
    'channels',

    # Apps    
    'apps.buyers',
    'apps.store',
    'apps.sellers',
    'apps.orders',


]

# Middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',

    'corsheaders.middleware.CorsMiddleware',   # Header

    'django.middleware.locale.LocaleMiddleware',  # language

    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware', # CSRF 

    'django.contrib.auth.middleware.AuthenticationMiddleware',

    'django.contrib.messages.middleware.MessageMiddleware',

    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Url root path
ROOT_URLCONF = 'rango_boom.urls'

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Wsgi and Asgi
WSGI_APPLICATION = 'rango_boom.wsgi.application'
ASGI_APPLICATION = 'rango_boom.asgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Pass security
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Django Rest Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User
AUTH_USER_MODEL = 'sellers.CustomUser'

# Region and location
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Media and static
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# CORS hEADERS
CORS_ALLOW_ALL_ORIGINS = True

# Admin panel
MPTT_ADMIN_LEVEL_INDENT = 20 

LANGUAGE_CODE = 'fa'
LANGUAGES = [
    ('en', _('English')),
    ('fa', _('Persian')),
]