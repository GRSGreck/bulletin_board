'use strict';

process.env.PORT = 3030;
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = 27017;
process.env.DB_NAME = 'bb';
process.env.DB_USER = 'root';
process.env.DB_PASS = '12345678910goooooogle';
process.env.SECRET = 'iloveorange';
process.env.DEFAULT_IMG = '/img/default.png';
process.env.SMTP_USER = process.env.SMTP_USER || 'user';
process.env.SMTP_PASS = process.env.SMTP_PASS || 'pass';
process.env.BASE_URL = 'http://localhost:3030';
process.env.FRONT_URL = 'http://localhost:8080';
process.env.SALT_WORK_FACTOR = 10;
process.env.MIN_LENGTH_PWD = 6;
process.env.MAX_LENGTH_PWD = 24;