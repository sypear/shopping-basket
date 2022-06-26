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

// 상품 리스트 출력 함수
function showGoodsList(element) {
    // 검색어 하이라이트
    let title = element.title;

    if (searchGoods.value.length > 0) {
        let regex = new RegExp(searchGoods.value, 'g');
        title = title.replace(regex, `<span class='highlight'>${searchGoods.value}</span>`);
    }

    // HTML 작성
    return `<article class="goods" draggable="true">
                <div class="goods-image">
                    <img src="./assets/${element.photo}" alt="${element.brand} ${element.title}" />
                </div>
                <div class="goods-contents">
                    <p id="goods-id">
                        ${element.id}
                    </p>
                    <h1 class="goods-title">
                        ${title}
                    </h1>
                    <p class="goods-company">
                        ${element.brand}
                    </p>
                    <p class="goods-price">
                        가격 : <span>${element.price}</span>
                    </p>
                    <button type="button" class="fill-button">
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

function dataFetch() {
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
    dataFetch();
});

window.onload = function() {
    dataFetch();
}