# language: ru

Функция: Расширение редактора для языка ФЯДОТ

    Тесты для требований из подмножества РЕДАКТОР.

    @discard_changes @ru_only
    Сценарий: РЕДАКТОР.ИНФО.НЕТ_РЕАЛ при вводе
    # Создание нового требования генерирует ошибку "Нет реализации"
    Пусть открыт файл "тесты.фядот".
    Пусть в конец файла добавлен следующий текст:
    """
    **{уникальный идентификатор}**  
    ФЯДОТ **должен** отметить идентификатор этого требования сообщением об ошибке "Нет реализации".
    """
    Тогда в список проблем редактора входит сообщение с текстом:
    """
    Требование {этот идентификатор} не имеет реализации
    """

    @ru_only
    Сценарий: РЕДАКТОР.ИНФО.НЕТ_РЕАЛ для существующего файла
    # Требование в существующем файле, не имеющее реализации, помечено ошибкой
    Пусть открыт файл "тесты.фядот" содержащий требование с идентификатором "Тест.РЕДАКТОР.НЕТ_РЕАЛ".
    Тогда в список проблем редактора входит сообщение с текстом:
    """
    Требование Тест.РЕДАКТОР.НЕТ_РЕАЛ не имеет реализации
    """

    @ru_only
    Сценарий: РЕДАКТОР.ИНФО.НЕТ_РЕАЛ_ДОК для существующего файла (негатив)
    # Заголовок существующего файла, содержащего требования с реализаций и без, не помечен ошибкой
    Пусть открыт файл "тесты.фядот".
    Тогда в список проблем редактора не входит проблема с текстом:
    """
    Ни одно требование в документе не имеет реализации
    """

    @discard_changes @ru_only
    Сценарий: РЕДАКТОР.ОШИБКА.ИМПЛ_БЕЗ_ТР при вводе
    # Ввод *утверждения о реализации* с уникальным идентификатором генерирует ошибку "Несуществующее требование"
    Пусть открыт файл "тесты.фядот".
    Пусть в конец файла добавлен следующий текст:
    """
    * Реализует **{уникальный идентификатор}**
    """
    Тогда в список проблем редактора входит ошибка с текстом:
    """
    Реализация для несуществующего требования {этот идентификатор}
    """

    @ru_only
    Сценарий: РЕДАКТОР.ИНФО.НЕТ_РЕАЛ_ДОК для существующего файла (позитив)
    Пусть открыт файл "нижн-уровень.фядот".
    Тогда в список проблем редактора входит сообщение с текстом:
    """
    Ни одно требование в документе не имеет реализации
    """

    @repeat_that_command_after_test @ru_only
    Сценарий: РЕДАКТОР.ТЕСТЫ с включенными предупреждениями
    Пусть открыт файл "тесты.фядот".
    Если выполнена команда 'Переключение предупреждений о требованиях без тестов в этом файле',
    То в список проблем редактора входит предупреждение с текстом:
    """
    Требования Тест.Синтан.ГРП_РЕАЛ.Ссылка не имеет тестов
    """

    @ru_only
    Сценарий: РЕДАКТОР.ТЕСТЫ с выключенными предупреждениями
    Пусть открыт файл "тесты.фядот".
    То в список проблем редактора не входит проблема с текстом:
    """
    Требования Тест.Синтан.ГРП_РЕАЛ.Ссылка не имеет тестов
    """

    @discard_changes
    Сценарий: РЕДАКТОР.ВВОД.ПРЕДМЕТ
    Пусть открыт файл "нижн-уровень.фядот".
    Пусть в конец файла добавлен следующий текст:
    """
    Это треб
    """
    И запрошен список вариантов ввода для текущей позиции.
    Тогда этот список включает следующий вариант:
    """
    требование нижнего уровня
    """

    @discard_changes
    Сценарий: РЕДАКТОР.ВВОД.ТРЕБОВАНИЕ для слова"Реализует"
    Пусть открыт файл "нижн-уровень.фядот".
    Пусть в конец файла добавлен следующий текст:
    """
    * Р
    """
    И запрошен список вариантов ввода для текущей позиции.
    Тогда этот список включает следующий вариант:
    """
    * Реализует
    """

    @discard_changes
    Сценарий: РЕДАКТОР.ВВОД.ТРЕБОВАНИЕ для слова"должно"
    Пусть открыт файл "нижн-уровень.фядот".
    Пусть в конец файла добавлен следующий текст:
    """
    Это требование нижнего уровня **д
    """
    И запрошен список вариантов ввода для текущей позиции.
    Тогда этот список включает следующий вариант:
    """
    **должно**
    """

    @discard_changes
    Сценарий: РЕДАКТОР.ВВОД.РЕАЛ
    Пусть открыт файл "файл-с-реализацией.txt".
    Пусть в конец файла добавлен следующий текст:
    """
    -- $$Р
    """
    И запрошен список вариантов ввода для текущей позиции.
    Тогда этот список включает следующий вариант:
    """
    $$Реализует
    """

    @discard_changes
    Сценарий:РЕДАКТОР.ВВОД.РЕАЛ.ИДЕНТ_РЕАЛ
    Пусть открыт файл "файл-с-реализацией.txt".
    Пусть в конец файла добавлен следующий текст:
    """
    -- $\$Реализует то.да.се, Т
    """
    И запрошен список вариантов ввода для текущей позиции.
    Тогда этот список включает следующие варианты:
    """
    Тест.
    Тест.РЕДАКТОР.
    Тест.Синтан.
    Тест.Синтан.ГРП_РЕАЛ.
    Тест.РЕДАКТОР.ГРП_РЕАЛ
    """

    @discard_changes
    Сценарий: РЕДАКТОР.ВВОД.РЕАЛ.ИДЕНТ_ТР
    Пусть открыт файл "нижн-уровень.фядот".
    Пусть в конец файла добавлен следующий текст:
    """
    * Реализует **то.да.се**, **Т
    """
    И запрошен список вариантов ввода для текущей позиции.
    Тогда этот список включает следующие варианты:
    """
    Тест.
    Тест.РЕДАКТОР.
    Тест.Синтан.
    Тест.Синтан.ГРП_РЕАЛ.
    Тест.РЕДАКТОР.ГРП_РЕАЛ
    """

    @discard_changes
    Сценарий: РЕДАКТОР.ВВОД.ИДЕНТИФИКАТОР в том же файле
    Пусть открыт файл "тесты.фядот".
    Пусть в конец файла добавлен следующий текст:
    """
    **Т
    """
    И запрошен список вариантов ввода для текущей позиции.
    Тогда этот список включает следующие варианты:
    """
    Тест.
    Тест.РЕДАКТОР.
    Тест.Синтан.
    Тест.Синтан.ГРП_РЕАЛ.
    Тест.РЕДАКТОР.ГРП_РЕАЛ
    """

    @discard_changes
    Сценарий: РЕДАКТОР.ВВОД.ИДЕНТИФИКАТОР в другом файле
    Пусть открыт файл "нижн-уровень.фядот".
    Пусть в конец файла добавлен следующий текст:
    """
    **Т
    """
    И запрошен список вариантов ввода для текущей позиции.
    Тогда этот список не включает следующие варианты:
    """
    Тест.
    Тест.РЕДАКТОР.
    Тест.Синтан.
    Тест.Синтан.ГРП_РЕАЛ.
    Тест.РЕДАКТОР.ГРП_РЕАЛ
    """

    @discard_changes
    Сценарий: РЕДАКТОР.ВВОД.ПОДМНОЖЕСТВА
    Пусть открыт файл "тесты.фядот".
    Пусть в конец файла добавлен следующий текст:
    """
    **Т
    """
    И запрошен список вариантов ввода для текущей позиции.
    Тогда этот список включает следующие варианты в приведенном порядке:
    """
    Тест.
    Тест.РЕДАКТОР.
    Тест.Синтан.
    Тест.Синтан.ГРП_РЕАЛ.
    Тест.РЕДАКТОР.ГРП_РЕАЛ
    """

    @discard_changes
    Сценарий: РЕДАКТОР.ВВОД.ОПР
    Пусть открыт файл "нижн-уровень.фядот".
    Пусть в конец файла добавлен следующий текст:
    """
    Пусть *Т
    """
    И запрошен список вариантов ввода для текущей позиции.
    Тогда этот список включает следующие варианты:
    """
    Термин 1
    Термин 2
    Термин 3
    """

    Сценарий: РЕДАКТОР.ПЕРЕИМЕН
    Пусть открыт файл "тесты.фядот".
    Если функция переименования активирована для замены на слово "Годный.Идентификатор" слова "Синтан" в следующем тексте:
    """
    **Тест.Синтан.ИНД_РЕАЛ**
    """
    Тогда полное число изменений равно 6:
    * список изменений содержит 1 в файле "нижн-уровень.фядот"
    * список изменений содержит 1 в файле "файл-с-реализацией.txt"
    * список изменений содержит 2 в файле "тесты.feature"
    * список изменений содержит 1 в файле "тесты.фядот"
    * список изменений содержит 1 в файле "тест-определения.фядот"

    Сценарий: РЕДАКТОР.ПЕРЕИМЕН.ПРАВ
    Пусть открыт файл "тесты.фядот".
    Если функция переименования активирована для замены на слово "Негодный.Идентификатор*&^" слова "Синтан" в следующем тексте:
    """
    **Тест.Синтан.ИНД_РЕАЛ**
    """
    Тогда полное число изменений равно 0