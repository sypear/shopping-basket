// 메뉴 영역 마우스 hover 시 font color 변경
let menuList = document.getElementsByClassName('menu-list')[0];
let menuLink = document.getElementsByClassName('menu-link');

menuList.addEventListener('mouseover', function(e) {
    for(let i = 0; i < menuLink.length; i++) {
        menuLink[i].classList.remove('selected');

        if (e.target == menuLink[i]) {
            menuLink[i].classList.add('selected');
        }
    }
});

// 검색어 하이라이트 함수
function SearchWordHighlights(title) {
    let regex = new RegExp(searchGoods.value, 'g');
        title = title.replace(regex, `<span class='highlight'>${searchGoods.value}</span>`);

    return title;
}


// 상품 리스트 출력 함수
function showGoodsList(element) {
    let title = element.title;

    if (searchGoods.value.length > 0) {
        title = SearchWordHighlights(title);
    }

    // HTML 작성
    return `<article class="goods" draggable="true" ondragstart="drag(event)" data-id="${element.id}">
                <div class="goods-photo">
                    <img src="./assets/${element.photo}" alt="${element.brand} ${element.title}" />
                </div>
                <div class="goods-contents">
                    <h1 class="goods-title">
                        ${title}
                    </h1>
                    <p class="goods-brand">
                        ${element.brand}
                    </p>
                    <p class="goods-price">
                        가격 : <span>${element.price}</span>
                    </p>
                    <button type="button" class="fill-button add-cart">
                        장바구니 담기
                    </button>
                </div>
            </article>`;
}

// 상품 리스트 리셋 함수
function resetGoodsList() {
    goodsWrapper.innerHTML = '';
}

// 상품 리스트 가져와서 화면에 출력
let goodsWrapper = document.getElementsByClassName('goods-wrapper')[0];
let goods = document.getElementsByClassName('goods');
let goodsData = '';

function fetchGoodsList() {
    let searchGoods = document.getElementById('search-goods');

    fetch('./assets/store.json')
        .then(res => res.json())
        .then(data =>
            data.products.forEach(function(element) {
                let title = element.title;
                
                if (!title.includes(searchGoods.value)) {
                    return;
                }

                let goodsHTML = showGoodsList(element);
                goodsWrapper.insertAdjacentHTML('beforeend', goodsHTML);
            })
        )
        .catch(function(error) {
            console.log(error);
        });
}

// 구매 버튼 클릭 시 상품 구매 모달 창 출력
let buyButton = document.getElementsByClassName('buy-button')[0];
let buyGoodsModal = document.getElementsByClassName('buy-goods')[0];

buyButton.addEventListener('click', function() {
    buyGoodsModal.classList.add('show');
});

// 상품 구매 모달 창 조작
let buyGoodsCloseButton = document.getElementById('buy-goods-close-button');

buyGoodsModal.addEventListener('click', function(e) {
    // 클릭한 요소가 닫기 버튼일 때 모달 창 닫도록 구현 (이벤트 버블링 이용)
    if (e.target == buyGoodsCloseButton) {
        buyGoodsModal.classList.remove('show');
    }
});

// 상품 검색 기능 추가
// 1. input에 입력값이 바뀔때마다 텍스트 가져오기
// 2. 가져온 텍스트에 맞는 상품만 출력
let searchGoods = document.getElementById('search-goods');

searchGoods.addEventListener('change', function() {
    resetGoodsList();
    fetchGoodsList();
});

window.onload = function() {
    // 상품 목록 출력
    fetchGoodsList();

    // 장바구니 목록 출력
    if (localStorage.getItem('shoppingCart') != null) {
        let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));

        resetCart();
        shoppingCart.forEach(function(element) {
            let goodsInCartHTML = showCart(element);
            cart.insertAdjacentHTML('beforeend', goodsInCartHTML);
        });
    }
}

// 장바구니 담기 기능
// 1. 장바구니 담기 버튼 클릭하여 담기
//  1) 장바구니 담기 버튼을 클릭하면
//  2) 로컬스토리지에 추가하고
//  3) 장바구니 화면에 출력
goodsWrapper.addEventListener('click', function(e) {
    if (e.target.getAttribute('class').includes('add-cart')) {
        // 클릭한 상품 정보 찾기
        let id = e.target.parentNode.parentNode.getAttribute('data-id');
        let photo = e.target.parentNode.parentNode.childNodes[1].childNodes[1].getAttribute('src');
        let title = e.target.parentNode.childNodes[1].innerText;
        let brand = e.target.parentNode.childNodes[3].innerText;
        let price = e.target.parentNode.childNodes[5].childNodes[1].innerText;
        let shoppingCart = new Array();
        
        // 등록된 상품이 있는 경우
        if (localStorage.getItem('shoppingCart') != null) {
            shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
            let isDuplicateAddCart = false;

            // 중복 클릭인 경우
            for (let i = 0; i < shoppingCart.length; i++) {
                if (id == shoppingCart[i].id) {
                    shoppingCart[i].quantity = shoppingCart[i].quantity + 1;
                    isDuplicateAddCart = true;
                    break;
                }
            }

            if (isDuplicateAddCart == false) {
                shoppingCart.push({
                    'id': id,
                    'photo': photo,
                    'title': title,
                    'brand': brand,
                    'price': price,
                    'quantity': 1
                });
            }

            localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
        } else {
            // 로컬스토리지에 상품 정보 최초 추가 하기
            localStorage.setItem(
                'shoppingCart',
                JSON.stringify([
                    {
                        'id': id,
                        'photo': photo,
                        'title': title,
                        'brand': brand,
                        'price': price,
                        'quantity': 1
                    }
                ])
            );

            shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
            cart.classList.add('haveGoods');
        }

        resetCart();
        shoppingCart.forEach(function(element) {
            let goodsInCartHTML = showCart(element);
            cart.insertAdjacentHTML('beforeend', goodsInCartHTML);
        });
    }
});

// 장바구니 담기 기능
// 2. 드래그 앤 드롭 이용하여 담기
//  1) 상품 드래그해서 장바구니 근처로 오면
//  2) 장바구니 목록에 추가
//  3) 장바구니 목록에 추가 시 장바구니 담기 버튼을 수량 출력 text로 변경
//     - 이미 있는 상품인 경우 수량++
let cart = document.getElementsByClassName('cart')[0];

function drag(ev) {
    ev.dataTransfer.setData('target-class', ev.target.className);
    ev.dataTransfer.setData('target-id', ev.target.dataset.id);
}

function dragEnter(ev) {
    ev.preventDefault(); // 이벤트의 기본값을 최소화
}

function drop(ev) {
    ev.preventDefault(); // 이벤트의 기본값을 최소화

    let targetClass = ev.dataTransfer.getData('target-class'); // 드롭 이벤트 대상의 class name 가져옴
    let targetId = ev.dataTransfer.getData('target-id'); // 드롭 이벤트 대상의 id 가져옴

    // 드롭 이벤트 대상 clone
    let targetHTML = document.getElementsByClassName(targetClass)[targetId].cloneNode(true);

    // 드롭 이벤트 대상을 장바구니에 추가하는 함수 호출
    targetHTML = addShopingCartByDropItem(targetHTML);
}

// 드롭 이벤트 대상을 장바구니에 추가하는 함수
function addShopingCartByDropItem(target) {
    console.log(target);

     // 드롭 이벤트 대상의 상품 정보 찾기
     let id = target.getAttribute('data-id');
     let photo = target.childNodes[1].childNodes[1].getAttribute('src');
     let title = (target.childNodes[3].childNodes[1].innerText).trim();
     let brand = (target.childNodes[3].childNodes[3].innerText).trim();
     let price = target.childNodes[3].childNodes[5].childNodes[1].innerText;
     let shoppingCart = new Array();

     // 등록된 상품이 있는 경우
     if (localStorage.getItem('shoppingCart') != null) {
        shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
        let isDuplicateAddCart = false;

        // 중복 클릭인 경우
        for (let i = 0; i < shoppingCart.length; i++) {
            if (id == shoppingCart[i].id) {
                shoppingCart[i].quantity = shoppingCart[i].quantity + 1;
                isDuplicateAddCart = true;
                break;
            }
        }

        if (isDuplicateAddCart == false) {
            shoppingCart.push({
                'id': id,
                'photo': photo,
                'title': title,
                'brand': brand,
                'price': price,
                'quantity': 1
            });
        }

        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    } else {
        // 로컬스토리지에 상품 정보 최초 추가 하기
        localStorage.setItem(
            'shoppingCart',
            JSON.stringify([
                {
                    'id': id,
                    'photo': photo,
                    'title': title,
                    'brand': brand,
                    'price': price,
                    'quantity': 1
                }
            ])
        );

        shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
        cart.classList.add('haveGoods');
    }

    resetCart();
    shoppingCart.forEach(function(element) {
        let goodsInCartHTML = showCart(element);
        cart.insertAdjacentHTML('beforeend', goodsInCartHTML);
    });
}

// 장바구니 제거 기능
cart.addEventListener('click', function(e) {
    if (e.target.getAttribute('class').includes('delete-cart')) {
        let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
        let removeGoodsId = e.target.parentNode.parentNode.getAttribute('data-id');

        // 삭제한 상품 array에서 제외
        shoppingCart = shoppingCart.filter(element => {
            return element.id !== removeGoodsId;
        });
        
        // 상품이 0개면 array 자체를 삭제한 후 화면 초기화
        if (shoppingCart.length == 0) {
            localStorage.removeItem('shoppingCart');
            cart.innerHTML = `<span>원하는 상품을 여기로 드래그 하세요 💚</span>`;
            cart.classList.remove('haveGoods');

            return;
        }
        
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

        resetCart();
        shoppingCart.forEach(function(element) {
            let goodsInCartHTML = showCart(element);
            cart.insertAdjacentHTML('beforeend', goodsInCartHTML);
        });
    }
});

// 장바구니 화면 추가 함수
function showCart(element) {
    return `<article class="goods" data-id="${element.id}">
        <div class="goods-photo">
            <img src="${element.photo}" alt="${element.brand} ${element.title}" />
        </div>
        <div class="goods-contents">
            <h1 class="goods-title">
                ${element.title}
            </h1>
            <p class="goods-brand">
                ${element.brand}
            </p>
            <p class="goods-price">
                가격 : <span>${element.price}</span>
            </p>
            <p class="goods-quantity">
                ${element.quantity}
            </p>
            <button type="button" class="fill-button delete-cart">
                제거
            </button>
        </div>
    </article>`;
}

// 장바구니 화면 리셋 함수
function resetCart() {
    cart.innerHTML = '';
}