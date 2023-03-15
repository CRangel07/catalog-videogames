//  VARIABLES

const cartIcon = document.querySelector(".nav__icon1");
const menuIcon = document.querySelector(".nav__icon2");
const closeMenu = document.querySelector(".nav__close");
const menu = document.querySelector(".nav__links");
const addCar = document.querySelectorAll(".card__add");
const cart = document.querySelector(".cart");
const table = cart.querySelector("tbody");
const btnCloseCar = document.querySelector(".cart-btn--close");
const btnCleanCar = document.querySelector("#cleanCart");
const cardsSection = document.querySelector(".cards");
const cards = document.querySelectorAll(".card");
const cardInfo = document.querySelectorAll(".card__info");
let shoppingCar = [];
let cartTotal = document.querySelector(".cart__total");

if (localStorage.getItem("shoppingArray") != null) {
  shoppingCar = JSON.parse(localStorage.getItem("shoppingArray"));
  createCarHTML();
}

//  EVENT LISTENERS

cardsSection.addEventListener("click", addToCar);

Array.from(cards).map((card, index) => {
  card.addEventListener("mouseover", () => {
    cardInfo[index].style.transform = "translateX(0%)";
  });
  card.addEventListener("mouseleave", () => {
    cardInfo[index].style.transform = "translateX(-100%)";
  });
});
Array.from(addCar).map((btn, index) => {
  btn.addEventListener('click', () => {showAddModal(btn, index)});
});

cartIcon.addEventListener("click", showCart);
menuIcon.addEventListener("click", showMenu);
closeMenu.addEventListener("click", showMenu);
btnCloseCar.addEventListener("click", showCart);
btnCleanCar.addEventListener("click", () => {
  cleanShoppingCar(true);
});

// FUNCTIONS

function addToCar(e) {
  console.log(e);
  if (e.target.classList.contains("card__add")) {
    const game = e.target.parentElement;
    readGame(game);
  }else if(e.target.classList.contains("fa-cart-shopping")){
    const game = e.target.parentElement.parentElement;
    readGame(game);
  }
}

function readGame(g) {
  const dataGame = {
    id: g.querySelector("button").getAttribute("data-id"),
    image: g.querySelector("img").getAttribute("src"),
    title: g.querySelector(".card__title").textContent,
    price: g.querySelector(".card__price").textContent,
    qt: 1,
  };
  console.log(dataGame);
  let exist = shoppingCar.some((g) => g.id === dataGame.id);
  if (exist) {
    const games = shoppingCar.map((game) => {
      if (game.id === dataGame.id) {
        game.qt++;
        return game;
      } else {
        return game;
      }
    });
    shoppingCar = [...games];
  } else {
    shoppingCar.push(dataGame);
  }
  createCarHTML();
}

function showCart() {
  if (cart.style.display) {
    cart.style.display = "";
  } else {
    cart.style.display = "flex";
  }
}

function createCarHTML() {
  cleanShoppingCar();
  shoppingCar.map((ele) => {
    const { image, title, price, qt } = ele;
    const row = document.createElement("TR");
    row.innerHTML = `
            <td class="cart__img"><img src="${image}" alt="gears1"></td>
            <td class="cart__info">${title}</td>
            <td class="cart__info">${price}</td>
            <td class="cart__info">${qt}</td>
            <td><i class="fa-regular fa-square-minus cart__delete"></i></td>  
        `;
    table.appendChild(row);
  });
  addDeleteListeners();
  if(shoppingCar.length){
    calcTotal(getPrices());
  }
  saveCar();
}

function getPrices() {
  return shoppingCar.map((ele) => {
    const price = parseFloat(ele.price.slice(1)) * ele.qt;
    return price;
  });
}

function calcTotal(total) {
  let netTotal = total.reduce((acm, ele) => {
    return (acm += ele);
  });
  cartTotal.innerHTML = `Total: $ ${netTotal}`;
}

function cleanShoppingCar(btn = false) {
  if (btn && shoppingCar.length != 0) {
    shoppingCar = [];
    cartTotal.removeChild(cartTotal.firstChild);
    localStorage.removeItem("shoppingArray");
  }
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

function saveCar() {
  localStorage.setItem("shoppingArray", JSON.stringify(shoppingCar));
}

function addDeleteListeners() {
  const btnDeleteGame = document.querySelectorAll(".cart__delete");
  Array.from(btnDeleteGame).map((ele) => {
    ele.addEventListener("click", (e) => deleteGame(e));
  });
  
}

function deleteGame(e) {
  let row = e.target.parentElement.parentElement;
  row = row.querySelector('.cart__info');
  const games = shoppingCar.filter(ele => {
    if(ele.title !== row.innerText){
      return ele;
    }
  })
  shoppingCar = [...games];
  cartTotal.innerHTML = '';
  createCarHTML(shoppingCar);
}

function showMenu(){
  menu.classList.toggle('nav__active');
}

function showAddModal(ele, index){
  const newModal = document.createElement('DIV');
  newModal.classList.add('card__modal');
  newModal.textContent = 'Item agregado';
  cards[index].appendChild(newModal);
}