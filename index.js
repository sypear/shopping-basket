// 메뉴 영역 마우스 hover 시 font color 변경
let menuList = document.getElementsByClassName('menu-list')[0];
let menuLink = document.getElementsByClassName('menu-link');

menuList.addEventListener('mouseover', function(e) {
    for (let i = 0; i < menuLink.length; i++) {
        menuLink[i].classList.remove('selected');

        if (e.target == menuLink[i]) {
            menuLink[i].classList.add('selected');
        }
    }
});

// 상품 리스트 가져와서 화면에 출력
let goodsWrapper = document.getElementsByClassName('goods-wrapper')[0];

fetch('./assets/store.json')
    .then(res => res.json())
    .then(data =>
        data.products.forEach(function(element) {
            let goods =
            `<!-- 상품마다 독립적인 의미를 갖기 때문에 article로 정의 -->
            <article class="goods">
                    <div class="goods-image">
                        <img src="./assets/${element.photo}" alt="${element.brand} ${element.title}" />
                    </div>
                    <div class="goods-contents">
                        <p id="goods-id">
                            ${element.id}
                        </p>
                        <h1 class="goods-title">
                            ${element.title}
                        </h1>
                        <p class="goods-company">
                            ${element.brand}
                        </p>
                        <p class="goods-price">
                            가격 : <span>${element.price}</span>
                        </p>
                        <button type="button" class="fill-button">
                            담기
                        </button>
                    </div>
            </article>`;

            goodsWrapper.insertAdjacentHTML('beforeend', goods);
        })
    )
    .then(any => {
        let goodsImage = document.getElementsByClassName('goods-image');

        goodsWrapper.addEventListener('mouseover', function(e) {
            if (e.target.tagName == 'IMG') {
                e.target.style.transform = 'scale(1.1)';
            }
        })

        goodsWrapper.addEventListener('mouseout', function(e) {
            if (e.target.tagName == 'IMG') {
                e.target.style.transform = 'scale(1)';
            }
        })
    })
    .catch(function(error) {
        console.log('error! 👻');
    });

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