document.getElementById('menu-button').addEventListener('click', function () {
  var menuList = document.getElementById('menu-list');
  if (menuList.style.display === 'none') {
    menuList.style.display = 'block';
  } else {
    menuList.style.display = 'none';
  }
});

// Переход по ссылкам в списке
document.getElementById('menu-list').addEventListener('click', function (event) {
  if (event.target.tagName === 'A') {
    event.preventDefault();
    var targetId = event.target.getAttribute('href');
    event.target.getAttribute('href');
    window.scrollTo({ top: document.querySelector(targetId).offsetTop, behavior: 'smooth' });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', () => {
    let elements = document.querySelectorAll('.about-item, .about-item img, .about-item p');
    elements.forEach(element => {
      if (isInViewport(element)) {
        element.classList.add('animate__fadeIn'); /* Добавление анимации для отображения элементов */
      }
    });
  });

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
});

function start() {

  let reqAnimFrame = (function () {
    return requestAnimationFrame ||
      mozRequestAnimationFrame ||
      webkitRequestAnimationFrame ||
      oRequestAnimationFrame ||
      msRequestAnimationFrame ||
      function (callback) {
        setTimeout(callback, 1000 / 60);
      };
  })();

  let dataCircle = document.querySelectorAll('.progressbar__thumb');

  function setProgress(percent, selector) {
    let circle = selector.querySelector('.progressbar__thumb');
    let total = Math.PI * circle.r.baseVal.value;
    circle.style.strokeDasharray = `${total * percent / 100} ${total * (1 - percent / 100) * 2}`;
    selector.querySelector('text').innerHTML = '<tspan>' + percent.toFixed(0) + '</tspan>%';
  }

  function circle(final, i) {
    let number = -1;
    i++;
    let selector = '.progress__container:nth-child(' + i + ')';
    let mainSelector = document.querySelector(selector);
    let myReq = null;

    function circleStep() {
      myReq = reqAnimFrame(circleStep);
      setProgress(number, mainSelector);
      if (number >= final) {
        cancelAnimationFrame(myReq);
      }
      number++;
    }
    circleStep();
  }

  for (let i = 0; i < dataCircle.length; i++) {
    let num = dataCircle[i].getAttribute('data-circle');
    circle(num, i);
  }

}

document.addEventListener('DOMContentLoaded', () => {
  start();
});

// Получаем все прогресс-бары
const progressBars = document.querySelectorAll('.progressbar');

// Функция для анимации прогресс-бара
function animateProgressBar(progressBar) {
  const circle = progressBar.querySelector('.progressbar__thumb');
  const percent = circle.dataset.circle;
  const progressText = progressBar.querySelector('.progress-text');
  const circumference = circle.getTotalLength(); // Получаем длину окружности

  // Настройка анимации
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;
  progressText.textContent = `0%`; // Начальное значение

  // Анимация
  const animation = circle.animate([
    { strokeDashoffset: circumference },
    { strokeDashoffset: 0 }
  ], {
    duration: 1500, //  Длительность анимации в миллисекундах
    easing: 'ease-in-out'
  });

  // Обновление текста прогресса во время анимации
  animation.onplay = () => {
    progressText.textContent = `${Math.round((circumference - animation.effect.getComputedTiming().currentTime * (circumference / 1500)) / circumference * 100)}%`;
  };

  // Окончание анимации
  animation.onfinish = () => {
    progressText.textContent = `${percent}%`; //  Окончательное значение
  };
}

// Проверяем, виден ли элемент на странице
const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Запускаем анимацию при появлении раздела
window.addEventListener('scroll', () => {
  progressBars.forEach(progressBar => {
    if (isElementInViewport(progressBar)) {
      animateProgressBar(progressBar);
    }
  });
});

// Получаем все кнопки и элементы портфолио
const portfolioButtons = document.querySelectorAll('.portfolio-button');
const portfolioItems = document.querySelectorAll('.portfolio__item');

// Функция для фильтрации элементов портфолио
function filterPortfolio(filterValue) {
  // Сбрасываем активный класс у всех кнопок
  portfolioButtons.forEach(button => button.classList.remove('active'));
  // Устанавливаем активный класс для выбранной кнопки
  const activeButton = document.querySelector(`.portfolio-button[data-filter="${filterValue}"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }

  // Фильтруем элементы портфолио
  portfolioItems.forEach(item => {
    if (filterValue === 'all' || item.classList.contains(filterValue)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Добавляем обработчик событий для кнопок
portfolioButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filterValue = button.dataset.filter;
    filterPortfolio(filterValue);
  });
});

// Инициализируем фильтр по умолчанию (отображаем все работы)
filterPortfolio('all');
