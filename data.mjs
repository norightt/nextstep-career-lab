// Curated, fictional role profiles. They are not vacancy or hiring-market data.
export const skills = [
  {id:'python',label:'Python',aliases:['python','питон']},
  {id:'sql',label:'SQL',aliases:['sql','postgresql','postgres','mysql']},
  {id:'statistics',label:'Статистика',aliases:['статистик','statistics','hypothesis testing','проверка гипотез']},
  {id:'ab',label:'A/B-тесты',aliases:['a/b','ab test','a b test','a-б тест','ab-тест','эксперименты']},
  {id:'bi',label:'BI и дашборды',aliases:['power bi','tableau','дашборд','dashboard','looker','data studio']},
  {id:'excel',label:'Excel',aliases:['excel','эксель','сводные таблицы']},
  {id:'research',label:'Исследования',aliases:['исследован','research','опрос','survey','интервью','качественн']},
  {id:'discovery',label:'Интервью с пользователями',aliases:['customer discovery','custdev','кастдев','интервью с пользователями','user interview','ux research']},
  {id:'product',label:'Продуктовый подход',aliases:['product management','продуктов','product manager','product owner','продакт','roadmap','беклог','jtbd']},
  {id:'ai',label:'AI / LLM',aliases:['ai','ии','llm','gpt','нейросет','машинное обучен','machine learning']},
  {id:'prompts',label:'Работа с промптами',aliases:['prompt','промпт','prompt engineering']},
  {id:'prototyping',label:'Прототипирование',aliases:['prototype','прототип','figma','cursor','claude code','codex','вайбкод']},
  {id:'api',label:'API / REST',aliases:['api','rest','postman','http request','интеграц']},
  {id:'git',label:'Git',aliases:['git','github','gitlab','коммит','pull request','мерж']},
  {id:'bpmn',label:'Моделирование процессов',aliases:['bpmn','uml','диаграммы процессов','моделирование процессов']},
  {id:'requirements',label:'Работа с требованиями',aliases:['требован','requirements','тз','user stories','use cases']},
  {id:'data',label:'Обработка данных',aliases:['pandas','numpy','аналитик','data analys','обработк данн','etl']},
  {id:'conversion',label:'Продуктовые метрики',aliases:['воронк','конверси','conversion','funnel','retention','ctr','cvr','метрики продукта']},
  {id:'communication',label:'Коммуникация и презентации',aliases:['презентац','коммуникац','стейкхолдер','stakeholder','public speaking','workshop','обучение']},
  {id:'ux',label:'UX и пользовательские сценарии',aliases:['ux','usability','юзабилити','пользовательск','user journey','user flow','дизайн интерфейс']},
  {id:'js',label:'JavaScript',aliases:['javascript','typescript','js','node.js','react','vue']},
  {id:'testing',label:'Тестирование',aliases:['тестирован','unit test','автотест','qa','test automation']},
];

export const roles = [
  {
    id:'data', title:'Аналитика данных', category:'Аналитика', badge:'DATA',
    summary:'Изучать данные, находить закономерности и понятно представлять результаты.',
    why:'В этой учебной модели основные опоры — SQL, Python и статистика.',
    req:[['sql',3],['python',3],['statistics',3],['data',3],['bi',2],['excel',2],['ab',2],['communication',1]],
    steps:{sql:'Решить 10 задач на JOIN, GROUP BY и оконные функции',python:'Проанализировать небольшой CSV-файл с помощью pandas',statistics:'На примере объяснить доверительный интервал и p-value',data:'Провести очистку набора данных и описать найденные ошибки',bi:'Собрать дашборд с тремя показателями',ab:'Разобрать учебный эксперимент и сформулировать выводы'}
  },
  {
    id:'systems', title:'Системный анализ', category:'Аналитика', badge:'SYSTEMS',
    summary:'Разбираться в требованиях, процессах и устройстве цифровых сервисов.',
    why:'Полезны навыки описания процессов и взаимодействия систем.',
    req:[['requirements',3],['api',3],['bpmn',3],['sql',2],['communication',2],['research',2],['git',1]],
    steps:{requirements:'Описать три user story с критериями приёмки',api:'Спроектировать небольшой REST API с обработкой ошибок',bpmn:'Построить схему процесса as-is и to-be',sql:'Сделать ER-диаграмму и пять запросов к учебной базе'}
  },
  {
    id:'product_analyst', title:'Продуктовая аналитика', category:'Аналитика', badge:'PRODUCT DATA',
    summary:'Измерять поведение пользователей и оценивать изменения в цифровых продуктах.',
    why:'Здесь важна связка данных, статистики и продуктовых метрик.',
    req:[['sql',3],['ab',3],['conversion',3],['statistics',3],['python',2],['data',2],['product',2],['bi',1]],
    steps:{conversion:'Собрать модель воронки для выбранного приложения',ab:'Сформулировать A/B-гипотезу и выбрать основную метрику',sql:'Посчитать retention на учебном наборе событий',product:'Описать продуктовую цель и две контрольные метрики'}
  },
  {
    id:'ux_research', title:'UX-исследования', category:'Исследования', badge:'RESEARCH',
    summary:'Изучать пользовательские потребности и улучшать сценарии взаимодействия.',
    why:'Акцент на исследовательских методах, интервью и интерпретации обратной связи.',
    req:[['research',3],['discovery',3],['ux',3],['communication',2],['statistics',1],['product',2],['prototyping',2]],
    steps:{research:'Составить план небольшого качественного исследования',discovery:'Подготовить сценарий интервью из 8 открытых вопросов',ux:'Проверить пользовательский сценарий на трёх участниках',product:'Связать наблюдения с конкретной проблемой пользователя',prototyping:'Нарисовать прототип улучшенного экрана в Figma'}
  },
  {
    id:'ai_dev', title:'Разработка AI-приложений', category:'Разработка', badge:'AI BUILDING',
    summary:'Превращать возможности языковых моделей в полезные инструменты.',
    why:'Важны API, код, тестирование и понимание ограничений моделей.',
    req:[['python',3],['ai',3],['api',3],['git',2],['prompts',2],['prototyping',2],['testing',2],['js',1]],
    steps:{python:'Написать Python-скрипт с обработкой ошибок и логированием',ai:'Сравнить ответы модели на пять типовых и сложных запросов',api:'Подключить открытый API в небольшом приложении',git:'Разместить проект на GitHub с понятным README',prompts:'Составить набор проверочных промптов',testing:'Добавить три автоматических теста к основному сценарию'}
  },
  {
    id:'product', title:'Продуктовый менеджмент', category:'Продукт', badge:'PRODUCT',
    summary:'Находить пользовательские проблемы и определять, что стоит создавать.',
    why:'В учебном профиле сочетаются исследования, приоритизация и измерение результата.',
    req:[['product',3],['research',3],['discovery',3],['conversion',2],['ab',2],['communication',2],['prototyping',2],['ux',1]],
    steps:{product:'Сформулировать проблему, аудиторию и JTBD одного сервиса',research:'Найти три источника о пользовательской проблеме',discovery:'Провести два коротких интервью без наводящих вопросов',conversion:'Определить основную метрику и ограничивающие показатели',ab:'Описать эксперимент для проверки одной продуктовой гипотезы',prototyping:'Сделать простой прототип одного сценария'}
  },
];

export const sampleText = `Учусь на программе анализа данных. Использую Python, pandas и SQL, строю дашборды в Power BI. Проводила исследования и интервью, презентовала результаты. Интересуюсь языковыми моделями, API и цифровыми продуктами.`;
export const studyText = `В университете делала опросы, аналитические отчёты и презентации. Хорошо владею Excel, интересуюсь UX и исследованиями пользователей. Планирую освоить Python и попробовать себя в работе с данными.`;
