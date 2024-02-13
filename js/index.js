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
const minWeightInput = document.querySelector('.minweight__input'); // поле с названием вида
const maxWeightInput = document.querySelector('.maxweight__input'); // поле с названием вида
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
  const [min, max] = [
    parseInt(minWeightInput.value) || 0,
    parseInt(maxWeightInput.value) || Infinity
  ];

  const result = fruits.filter((item) => {
    return (item.weight >= min) && (item.weight <= max);
  });
  return result;
};

filterButton.addEventListener('click', () => {
  display(filterFruits());
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
  ["розово-красный", { H: 348, S: 91, B: 86 }],
  ["светло-коричневый", { H: 30, S: 69, B: 81 }]
]);

function getColorPriority(color) {

  let hsb;
  if (("H" in color) && ("S" in color) && ("B" in color)) {
    hsb = color
  }
  else {
    if (!colorDict.has(color)) {
      //colorDictAddNew();
    }

    hsb = colorDict.get(color);
  }


  // Сдвигаем спектр на 45 грудаусов, чтобы оттенки красного 
  // ниже 360 не считались в более высоком приоритете
  let hue = hsb.H + 45 > 360 ? hsb.H - 315 : hsb.H + 45;
  hue = hue / 360 * 540;
  // Считаем, на сколько нужно повысить приоритет, в зависимости на
  // сколько процентов цвет белый.
  let sat = (540 - hue + 90) * (1 / (hsb.S / 100 + 1)) ** 7;
  // Предварительный приоритет
  let result = 90 + hue + sat;
  // Считаем, на сколько нужно изменить приоритет, в зависимости на
  // сколько процентов цвет черный.
  result = result * (1 + (hsb.B / 100 - 1) ** 7);

  return Math.round(result);
}

function testPriority() {
  //Array(...colorDict.keys()).forEach(element => {
  //  console.log(`${element} ${getColorPriority(element)}`);
  //});

  const arr1 = [];
  for (let h = 0; h < 360; h = h + 45) {
    for (let s = 20; s <= 100; s = s + 20) {
      for (let b = 20; b <= 100; b = b + 20) {
        arr1.push({ H: h, S: s, B: b });
      }
    }
  }

  const arr2 = arr1.map(item => { return { hsb: item, priority: getColorPriority(item) }; });

  sortAPI.quickSort(arr2, (a, b) => a.priority > b.priority);

  arr2.forEach((item) => console.log(`hsb(${item.hsb.H},${item.hsb.S},${item.hsb.B})`, item.priority));
}

const comparationColor = (a, b) => {
  // TODO: допишите функцию сравнения двух элементов по цвету
  // Будем сортировать цвета по цветам радуги с помощью цветовой модели HSB
  // при этом постараемя добится чтобы черный цвет был самым низким по значению,
  // а белый самый высоким

  return getColorPriority(a.color) > getColorPriority(b.color);
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - 1; j++) {
        if (comparation(arr[j], arr[j + 1]))
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  },

  quickSort(arr, comparation) {
    const stack = [[0, arr.length - 1]];
    
    const partition = (array, low, high) => {
      const pivot = array[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (!comparation(array[j], pivot)) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
        }
      }

      [array[i + 1], array[high]] = [array[high], array[i + 1]];

      return i + 1;
    }

    while (stack.length > 0) {
      const [low, high] = stack.pop();

      if (low < high) {
        const pivotIndex = partition(arr, low, high);

        stack.push([low, pivotIndex - 1]);
        stack.push([pivotIndex + 1, high]);
      }
    }
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

function testSort() {
  const arr1 = [];
  for (let i = 0; i < 20; i++) {
    arr1.push(getRandomInt(1, 100));
  }
  console.log(...arr1);
  sortAPI.bubbleSort(arr1, (a, b) => a > b);
  console.log(...arr1);

  const arr2 = [];
  for (let i = 0; i < 20; i++) {
    arr2.push(getRandomInt(1, 100));
  }
  console.log(...arr2);
  sortAPI.bubbleSort(arr2, (a, b) => a < b);
  console.log(...arr2);
}
//testSort();

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
  display(fruits);
  // TODO: вывести в sortTimeLabel значение sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  display(fruits);
});

//testPriority();
