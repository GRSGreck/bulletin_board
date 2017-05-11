'use strict';

let errors = {
    "forms": {
        "required": "Поле обязательное к заполнению",
        "pattern_email": "Неверный email. Email адресс должен быть в формате «myemail@gmail.com»",
        "pattern_phone": "Неверный номер телефона",
        "minlength": "Введено слишком мало символов",
        "maxlength": "Привышен лимит символов",
        "password": "Введен неверный пароль",
        "incorrect_password": "Введен неверный пароль",
        "wrong_password": "Введен неверный пароль",
        "passwords_not_match": "Введеные пароли не совпадают",
        "not_equal": "Введеные пароли не совпадают",
        "upload": "Произошла ошибка при загрузке файла",
        "wrong_email_or_password": "Неверный email или пароль",
        "wrong_email": "Неверный email",
        "not_found": "Пользователь с таким email адресом не зарегестрирован",
        "duplicate_email": "Пользователь с таким email адресом уже существует",
        "default": "В поле введено не корректное значение"
    }
};

export default errors;