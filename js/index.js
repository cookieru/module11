// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

const fruitItemColors = {
  values: [
    "fruit_violet",
    "fruit_green",
    "fruit_carmazin",
    "fruit_yellow",
    "fruit_lightbrown"
  ],
  counter: 0,
  getNext: function () {
    if (this.counter >= this.values.length) this.counter = 0;
    return this.values[this.counter++];
  }
};


// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = (list) => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  while (fruitsList.firstChild) {
    fruitsList.removeChild(fruitsList.firstChild);
  }

  for (let i = 0; i < list.length; i++) {
    const fruitItem = createFruitItem(list[i], i);
    fruitsList.appendChild(fruitItem);
  }
};

// Создание узла-элемента карточки
function createFruitItem(fruit, index = 0) {
  let listItem = document.createElement("li");
  listItem.className = `fruit__item ${fruitItemColors.getNext()}`;

  listItem.innerHTML = `
    <div class="fruit__info">
      <div>index: ${index}</div>
      <div>kind: ${fruit.kind}</div>
      <div>color: ${fruit.color}</div>
      <div>weight (кг): ${fruit.weight}</div>
    </div>
  `;

  return listItem;
}

// Первое отображение 
display(fruits);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let snapshot = Array(...fruits);
  let result = [];

  while (fruits.length > 0) {
    let i = getRandomInt(0, fruits.length - 1);
    result.push(fruits[i]);
    fruits.splice(i, 1);
  }

  let isEqual = result.every((value, index) => value === snapshot[index]);
  if (isEqual) window.alert("Порядок в списке фруктов не изменился.");

  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display(fruits);
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  fruits.filter((item) => {
    // TODO: допишите функцию
  });
};

filterButton.addEventListener('click', () => {
  const link = filterFruits();
  display(link);
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const colorDict = new Map([
  ["красный", { H: 0, S: 100, B: 100 }],
  ["оранжевый", { H: 45, S: 100, B: 100 }],
  ["желтый", { H: 68, S: 100, B: 100 }],
  ["зеленый", { H: 135, S: 100, B: 100 }],
  ["голубой", { H: 180, S: 100, B: 100 }],
  ["синий", { H: 225, S: 100, B: 100 }],
  ["фиолетовый", { H: 270, S: 100, B: 100 }],
  ["черный", { H: Math.random() * 360, S: Math.random() * 100, B: 0 }],
  ["белый", { H: Math.random() * 360, S: 0, B: 100 }],
  ["серый", { H: Math.random() * 360, S: 0, B: 50 }],
  ["розово-красный", { H: 348, S: 91, B: 86 }]
]
)

function getColorPriority(colorName) {
  
  if (!colorDict.has(colorName))
  {
    //colorDictAddNew();
  }
  
  const hsb = colorDict.get(colorName);

  // Сдвигаем спектр на 45 грудаусов, чтобы оттенки красного 
  // ниже 360 не считались в более высоком приоритете
  let hue = hsb.H + 45 > 360 ? hsb.H - 315 : hsb.H + 45;
  // Считаем, на сколько нужно повысить приоритет, в зависимости на
  // сколько процентов цвет белый.
  let sat = (360 - hue + 180) * ((100 - hsb.S) / 100) ** 2;
  // Предварительный приоритет
  let result = 180 + hue + sat;
  // Считаем, на сколько нужно изменить приоритет, в зависимости на
  // сколько процентов цвет черный.
  result = result * (1 - ((100 - hsb.B) / 100) ** 2);

  return Math.round(result);
}

function testPriority() {
  Array(...colorDict.keys()).forEach(element => {
    console.log(`${element} ${getColorPriority(element)}`);
  });
}

testPriority();

const comparationColor = (a, b) => {
  // TODO: допишите функцию сравнения двух элементов по цвету
  // Будем сортировать цвета по цветам радуги с помощью цветовой модели HSB
  // при этом постараемя добится чтобы черный цвет был самым низким по значению,
  // а белый самый высоким
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком
  },

  quickSort(arr, comparation) {
    // TODO: допишите функцию быстрой сортировки
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display(fruitsList);
  // TODO: вывести в sortTimeLabel значение sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  display(fruitsList);
});


