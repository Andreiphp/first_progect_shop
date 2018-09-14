'use strict';

class Cart extends Goods {
    constructor() {
        super();
        this.count = 0;
        this.totalQty = 0;
        this.totalMoney = 0;
        this.cauntCartElement = document.querySelectorAll('.count_cart');
        this.totalCartElement = document.querySelectorAll('.total_price');
        this.products = document.getElementById('products_content');
        this.main_products = document.querySelector('.main_specials');
        this.cartBlock = document.querySelector('.header_cart2');
        this.orderBtn = document.querySelector('.order_btn');
        // this.hideCartBox = document.getElementById('cart_box');
        this.productInfo = {
            img: '',
            title: '',
            price: '',
            count: 1,
            total: ''
        };
        this.flag = false;
        this.totalPrice();
        this.cartInner();
        this.moveProductToCart();
        this.createHideBasket();
    }

    showCardBlock() {
        if (window.scrollY > 250) {
            this.cartBlock.style.display = 'flex';
        } else {
            this.cartBlock.style.display = 'none';
        }
        let self = this;
        window.onscroll = () => {
            if (window.scrollY > 250) {

                self.cartBlock.style.display = 'flex';

            } else {
                self.cartBlock.style.display = 'none';
            }
        };
    }

    hideCardBlock() {
        let self = this;
        this.cartBlock.style.display = 'none';
        window.onscroll = () => {
            self.cartBlock.style.display = 'none';

        };
    }

    addToCartOneProduct() {
        let self = this;
        document.getElementById('toCart').addEventListener('click', function (event) {
            let id = event.target.getAttribute('data-tocart');
            self.getProductInfo(id);
        });
    }

    addToCart() {
        let self = this;
        let listeners;
        if (!this.products) {
            listeners = this.main_products;
        } else {
            listeners = this.products;
        }
        listeners.addEventListener('click', function (event) {
            let id = event.target.id;
            if (event.target.className === 'cart') {
                setTimeout(() => {
                    self.getProductInfo(id);
                }, 500);
                self.flyImage(id, event);
            }
        })
    }

    getProductInfo(id) {
        let self = this;
        let id_product = "id_product=" + id;
        this.getDAta('singleProduct.php?' + id_product).then(product => {
            let {title, img, price, ...rest} = JSON.parse(product);
            this.productInfo.title = title;
            this.productInfo.img = img;
            this.productInfo.price = price;
            this.productInfo.total = (price * this.productInfo.count).toFixed(2);
        }).then(() => {
            if (!localStorage.getItem('cart')) {
                localStorage.setItem('cart', JSON.stringify({}));
            }
            let t = JSON.parse(localStorage.getItem('cart'));
            if (!t.hasOwnProperty(id)) {
                t[id] = self.productInfo;
                localStorage.setItem('cart', JSON.stringify(t));
            } else {
                t[id].count++;
                t[id].total = (t[id].count * t[id].price).toFixed(2);
                localStorage.setItem('cart', JSON.stringify(t));
            }
        }).then(() => {
            this.totalPrice();
            this.cartInner();
            this.createHideBasket();
        })
    }


    flyImage(id, event) {
        let self = this;
        let cartPosition;
        this.insertClone(id).then(clone => {
            event.target.setAttribute('disabled', 'disabled');

            if (window.scrollY > 250) {
                cartPosition = document.querySelector('.header_cart2').getBoundingClientRect();
                clone.style.transform = "translate3d(" + (cartPosition.left + cartPosition.width / 4) + 'px,' + (window.scrollY + cartPosition.height) + 'px,' + 100 + 'px' + ")";
            } else {
                cartPosition = document.querySelector('.wrap_contact').getBoundingClientRect();
                let y = 0;
                if (window.scrollY === 0) {
                    y = window.scrollY + cartPosition.height + 50;
                } else {
                    y = window.scrollY - cartPosition.height;
                }
                clone.style.transform = "translate3d(" + (cartPosition.left + cartPosition.width + 50) + 'px,' + y + 'px,' + 100 + 'px' + ")";
            }
            return clone;
        }).then(cloneImg => {
            cloneImg.style.width = 50 + 'px';
            cloneImg.style.height = 50 + 'px';
            cloneImg.style.transitionDelay = '0.5s';
            cloneImg.style.transition = '1s';
            cloneImg.style.transitionTimingFunction = 'ease-out';
            cloneImg.style.opacity = '0.2';
            cloneImg.style.zIndex = 500;
            return cloneImg;
        })
            .then(cloneImg => {
                let self = this;
                cloneImg.addEventListener('transitionend', function () {
                    event.target.removeAttribute('disabled');
                    cloneImg.remove();
                })
            })
    }

    insertClone(id) {
        return new Promise(resolve => {
            let parentImg = document.querySelector("img[data-image='" + id + "']");
            let position = parentImg.getBoundingClientRect();
            let cloneImg = parentImg.cloneNode(true);
            cloneImg.classList.add('cloneImg');
            cloneImg.style.width = position.width + 40 + 'px';
            cloneImg.style.height = position.height + 40 + 'px';
            cloneImg.style.transform = "translate3d(" + (position.left - 20) + 'px,' + (window.scrollY + position.top) + 'px,' + 500 + 'px' + ")";
            document.body.insertBefore(cloneImg, document.body.firstChild);
            resolve(cloneImg);
        })
    }

    totalPrice() {
        this.totalQty = 0;
        this.totalMoney = 0;
        let cart = JSON.parse(localStorage.getItem('cart'));
        for (let key in cart) {
            this.totalQty += parseInt(cart[key].count);
            this.totalMoney += (cart[key].price * cart[key].count);
        }
    }

    cartInner() {
        if (document.getElementById('count_cart')) {
            document.getElementById('count_cart').textContent = this.totalQty + 'ITEMS';
        }
        for (let i = 0; i < this.totalCartElement.length; i++) {
            this.totalCartElement[i].textContent = this.totalMoney.toFixed(2) + '$'
        }
        for (let i = 0; i < this.cauntCartElement.length; i++) {
            this.cauntCartElement[i].textContent = this.totalQty + 'ITEMS';
        }
    }

    moveProductToCart() {
        let self = this;
        let dragObject = {};
        let positionCartBox = self.cartBlock.getBoundingClientRect();
        document.onmousedown = function (event) {
            if (event.target.className === 'product_img') {
                dragObject.element = event.target;
                dragObject.downX = event.pageX;
                dragObject.downY = event.pageY;


            }
        };
        document.onmousemove = function (event) {

            let positionClone = event.target.getBoundingClientRect();
            let positionCartBox = self.cartBlock.getBoundingClientRect();
            dragObject.positonCardBlock = {
                left: positionCartBox.left,
                width: positionCartBox.width,
                top: positionCartBox.top,
                height: positionCartBox.height
            };
            if (!dragObject.element) {
                return;
            }
            if (!dragObject.clone) {
                let moveX = event.pageX - dragObject.downX;
                let moveY = event.pageY - dragObject.downY;
                if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
                    return;
                }
                dragObject.clone = createClone(event);
                if (!dragObject.clone) {
                    dragObject = {};
                    return;
                }
                startDrag(event);
                let coords = getCoords(dragObject.clone);
                dragObject.shiftX = dragObject.downX - coords.left;
                dragObject.shiftY = dragObject.downY - coords.top;
            }

            dragObject.clone.style.transform = "translate3d(" + (event.pageX - dragObject.shiftX) + 'px,' + (event.pageY - dragObject.shiftY) + 'px,' + 20 + 'px' + ")";

            if (event.pageX + positionClone.width >= dragObject.positonCardBlock.left + dragObject.positonCardBlock.width / 2 && event.clientY > 0 && event.clientY <= (dragObject.positonCardBlock.top + 250)) {
                fncardBlock(event);
            } else {
                fncardBlock();
            }

            return false;

        };
        document.onmouseup = function (e) {
            let flag = false;
            let positionClone = e.target.getBoundingClientRect();
            let positionCartBlock = self.cartBlock.getBoundingClientRect();
            if (dragObject.clone) {
                if (dragObject.positonCardBlock.left !== 0) {
                    if (e.pageX + positionClone.width >= dragObject.positonCardBlock.left + dragObject.positonCardBlock.width / 2 && event.clientY > 0 && event.clientY <= (dragObject.positonCardBlock.top + 250)) {
                        dragObject.clone.style.transition = '0.5s';
                        dragObject.clone.style.borderRadius = '16%';
                        dragObject.clone.style.transform = "translate3d(" + (positionCartBlock.left - 10) + 'px,' + (positionCartBlock.top + window.scrollY) + 'px,' + 20 + 'px' + ")";
                        setTimeout(() => {
                            fncardBlock();
                        }, 500);
                        removeClone(dragObject.clone);
                        flag = true;
                    } else {
                        dragObject.clone.rollback();
                        removeClone(dragObject.clone);
                    }
                } else {
                    fncardBlock();
                    dragObject.clone.rollback();
                    removeClone(dragObject.clone);
                }
            }

            dragObject = {};
            if (flag) {
                setTimeout(() => {
                    self.getProductInfo(e.target.getAttribute('data-image'));
                }, 800);
            }


        };


        function fncardBlock(el) {
            if (el) {
                self.cartBlock.classList.add('header_cart2_large');
            } else {
                self.cartBlock.classList.remove('header_cart2_large');
            }
        }

        function removeClone(e) {
            e.addEventListener('transitionend', function (e) {
                e.target.remove();
            });
        }


        function createClone(event) {
            let parentImg = dragObject.element.getBoundingClientRect();
            let clone = dragObject.element.cloneNode(true);
            clone.style.transform = "translate3d(" + (parentImg.left + window.scrollX) + 'px,' + (parentImg.top + window.scrollY) + 'px,' + 500 + 'px' + ")";

            clone.rollback = function () {
                clone.style.transition = '0.5s';
                clone.style.transform = "translate3d(" + (parentImg.left + window.scrollX) + 'px,' + (parentImg.top + window.scrollY) + 'px,' + 500 + 'px' + ")";

            };

            return clone;
        }

        function startDrag(e) {
            let parentImg = dragObject.element.getBoundingClientRect();
            let clone = dragObject.clone;
            clone.style.zIndex = 9999;
            clone.style.position = 'absolute';
            clone.style.boxShadow = '0 0 1px 2px red';
            document.body.insertBefore(clone, document.body.firstChild);
            clone.style.width = parentImg.width + 'px';
            clone.style.height = parentImg.height + 'px';
        }

        function getCoords(elem) {
            let position = elem.getBoundingClientRect();
            return {
                top: position.top + pageYOffset,
                left: position.left + pageXOffset
            };
        }

    }

    createHideBasket() {
        let box = document.getElementById('cart_items');
        let products = JSON.parse(localStorage.getItem('cart'));
        let keyProducts = [];
        let keyLi = [];
        let fragment = document.createDocumentFragment();
        if (box.children.length > 0) {
            for (let key in products) {
                keyProducts.push(key);
            }
            for (let i = 0; i < box.children.length; i++) {
                keyLi.push(box.children[i].getAttribute('data-cart'));
            }
            if (box.children.length === keyProducts.length) {
                for (let i = 0; i < box.children.length; i++) {
                    box.children[i].childNodes[3].textContent = products[box.children[i].getAttribute('data-cart')].count;
                    box.children[i].childNodes[4].firstChild.value = products[box.children[i].getAttribute('data-cart')].count;
                }
            }
            if (box.children.length < keyProducts.length) {
                for (let i = 0; i < keyProducts.length; i++) {
                    let y = keyLi.indexOf(keyProducts[i], 0);
                    if (y === -1) {
                        this.createElementForHideBasket(box, products, keyProducts[i]);

                    }
                }
            }
        } else {
            if (localStorage.getItem('cart')) {
                for (let key in products) {
                    this.createElementForHideBasket(box, products, key);
                }
            }

        }
    }

    createElementForHideBasket(box, products, param) {
        let li = document.createElement('li');
        li.setAttribute('data-cart', param);
        let img = new Image();
        img.src = 'app/img/content/small_img/' + products[param].img;
        let title = document.createElement('span');
        title.textContent = products[param].title;
        let price = document.createElement('span');
        price.textContent = products[param].price;
        let count = document.createElement('span');
        count.textContent = products[param].count;
        let update = document.createElement('input');
        update.type = 'number';
        update.min = 1;
        update.value = products[param].count;
        update.className = 'update_small_cart';
        let remove = document.createElement('button');
        remove.textContent = 'delete';
        remove.className = 'remove_small_cart';
        let span = document.createElement('span');
        span.className = 'change_cart';
        span.setAttribute('data-cart', param);
        span.appendChild(update);
        span.appendChild(remove);
        li.appendChild(img);
        li.appendChild(title);
        li.appendChild(price);
        li.appendChild(count);
        li.appendChild(span);
        box.appendChild(li);
    }

    updateSmallCart() {
        let self = this;
        document.getElementById('cart_items').addEventListener('click', function (event) {
            let id = event.target.parentNode.getAttribute('data-cart');
            if (event.target.className === 'update_small_cart') {
                upd(event);
            }

            if (event.target.className === 'remove_small_cart') {

                self.removeLargeCart(id, event);
            }

        });

        function upd(event) {
            let id = event.target.parentNode.getAttribute('data-cart');
            let value = event.target.value;
            let productCart = JSON.parse(localStorage.getItem('cart'));
            productCart[id].count = value;
            productCart[id].total = (productCart[id].count * productCart[id].price).toFixed(2);
            localStorage.setItem('cart', JSON.stringify(productCart));
            self.totalPrice();
            self.cartInner();
            self.createHideBasket();
        }

    }


    fillBasket() {
        let products = JSON.parse(localStorage.getItem('cart'));
        for (let key in products) {
            let tr = document.createElement('tr');
            tr.setAttribute('data-cart', key);
            for (let prop in products[key]) {
                let td = document.createElement('td');
                if (prop === 'img') {
                    let img = new Image();
                    img.src = 'app/img/content/small_img/' + products[key].img;
                    td.appendChild(img);
                } else if (prop === 'count') {
                    let spanMinus = document.createElement('span');
                    spanMinus.className = 'basket_minus';
                    let input = document.createElement('input');
                    input.min = 1;
                    input.value = products[key].count;
                    input.type = 'text';
                    input.readOnly = true;
                    let spanPlus = document.createElement('span');
                    spanPlus.className = 'basket_plus';
                    td.appendChild(spanMinus);
                    td.appendChild(input);
                    td.appendChild(spanPlus);
                } else {
                    td.textContent = products[key][prop];
                }
                tr.appendChild(td);
            }
            document.getElementById('basket_body').appendChild(tr);
            this.createElementDeleteProductsFromBasket();
        }
    }

    createElementDeleteProductsFromBasket() {
        let td = document.createElement('td');
        td.className = 'remove_large_cart';
        let span = document.createElement('span');
        span.className = 'remove_large_cart';
        td.appendChild(span);
        let collection = document.getElementById('basket_body').querySelectorAll('tr');
        for (let i = 0; i < collection.length; i++) {
            collection[i].appendChild(td);
        }
    }

    updateMainBasket() {
        let product = JSON.parse(localStorage.getItem('cart'));
        let self = this;
        document.getElementById('basket_body').addEventListener('click', function (event) {
            let id = event.target.parentNode.parentNode.getAttribute('data-cart');

            switch (event.target.className) {
                case 'basket_minus':
                    updateMinus(id, event);
                    break;
                case  'basket_plus':
                    updatePlus(id, event);
                    break;
                case 'remove_large_cart':
                    self.removeLargeCart(id, event);
                    break;
            }
        });

        function updateMinus(id, event) {
            product[id].count--;
            if (product[id].count <= 0) {
                product[id].count = 1;
            }
            product[id].total = (product[id].count * product[id].price).toFixed(2);
            localStorage.setItem('cart', JSON.stringify(product));
            event.target.nextElementSibling.value = product[id].count;
            event.target.parentNode.nextSibling.textContent = product[id].total;
            self.totalPrice();
            self.cartInner();


        }

        function updatePlus(id, event) {
            product[id].count++;
            product[id].total = (product[id].count * product[id].price).toFixed(2);
            localStorage.setItem('cart', JSON.stringify(product));
            event.target.previousSibling.value = product[id].count;
            event.target.parentNode.nextSibling.textContent = product[id].total;
            self.totalPrice();
            self.cartInner();
        }
    }

    redirectToShop() {
        let cart = JSON.parse(localStorage.getItem('cart'));
        if (!cart) {
            window.location.href = '#shop/';
        } else {
            if (Object.keys(cart).length === 0) {
                window.location.href = '#shop/';
            }
        }
    }

    removeLargeCart(id, event) {
        let product = JSON.parse(localStorage.getItem('cart'));
        delete product[id];
        localStorage.setItem('cart', JSON.stringify(product));
        let r = document.querySelectorAll('[data-cart]');
        if (r) {
            for (let i = 0; i < r.length; i++) {
                if (r[i].getAttribute('data-cart') === id) {
                    r[i].remove();
                }
            }
        }

        this.totalPrice();
        this.cartInner();
        if (Object.keys(product).length === 0) {
            window.location.href = '#shop/';
        }
    }

    removeSmallCart() {
        let small_cart = document.getElementById('cart_items');
        while (small_cart.firstElementChild) {
            small_cart.firstElementChild.remove();
        }
    }


    basketStep2(user_data) {
        let forma = document.querySelector('.users_data');
        let fragment = document.createDocumentFragment();
        delete user_data['id'];
        document.querySelector('.u_name').textContent = user_data['name'];
        document.querySelector('.u_lastname').textContent = user_data['lastname'];
        document.querySelector('.u_mail').textContent = user_data['mail'];
        document.querySelector('.u_address').textContent = user_data['address'];
    }

    placeOrder() {
        let self = this;
        let btnOrder = document.getElementById('pay');
        btnOrder.addEventListener('click', () => {
            self.removeSmallCart();
            let cart = (localStorage.getItem('cart'));
            let user = JSON.parse(sessionStorage.getItem('user_auth'))['user_id'];
            let tagDelivery = document.getElementsByName('delivery');
            let delivery = '';
            for (let i = 0; i < tagDelivery.length; i++) {
                if (tagDelivery[i].type === "radio" && tagDelivery[i].checked) {
                    delivery = tagDelivery[i].value;
                }
            }
            let comment = document.querySelector('.comment_to_order').value;
            let params = 'cart=' + cart + '&user=' + user + '&comment=' + comment + '&delivery=' + delivery;
            postReq('saveOrder.php', params).then((res) => {
                if (res) {

                    let div = document.createElement('div');
                    div.textContent = 'order number' + res + ' was successfully sent';
                    div.classList.add('successfully_order');
                    document.getElementById('register_position').classList.add('hide_form');
                    document.body.appendChild(div);
                    setTimeout(() => {
                        div.remove();
                        localStorage.removeItem('cart');
                        document.getElementById('register_position').classList.remove('hide_form');
                        window.location = '#shop/';
                    }, 2500);
                }
            });


        })
    }


    reserveOrder() {
        let self = this;
        document.getElementById('reserve').addEventListener('click', function () {
            self.removeSmallCart();
            let date = self.TimeReserve();
            let cart = (localStorage.getItem('cart'));
            localStorage.setItem('UPDATE', cart);
            self.initializeClock('clockdiv', date);
            let user = JSON.parse(sessionStorage.getItem('user_auth'))['user_id'];
            let tagDelivery = document.getElementsByName('delivery');
            let delivery = '';
            let reserve = true;
            for (let i = 0; i < tagDelivery.length; i++) {
                if (tagDelivery[i].type === "radio" && tagDelivery[i].checked) {
                    delivery = tagDelivery[i].value;
                }
            }
            let comment = document.querySelector('.comment_to_order').value;
            let params = 'cart=' + cart + '&user=' + user + '&comment=' + comment + '&delivery=' + delivery + '&reserve=' + reserve;
            postReq('saveOrder.php', params).then((res) => {
                if (res) {
                    localStorage.removeItem('cart');
                    window.location = '#shop/';
                }
            });
        });
    }

    TimeReserve() {
        let date = new Date();
        date.setMinutes(date.getMinutes() + 5);
        localStorage.setItem('reserve', date);
        return date;
    }

    getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date());
        let seconds = Math.floor((t / 1000) % 60);
        let minutes = Math.floor((t / 1000 / 60) % 60);
        let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        let days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    initializeClock(id, endtime) {
        let self = this;
        let cart = localStorage.getItem('UPDATE');
        let clock = document.getElementById(id);
        let timeinterval = setInterval(function () {
            let t = self.getTimeRemaining(endtime);
            clock.style.display = 'block';
            clock.innerHTML = 'minutes:' + t.minutes + 'seconds:' + t.seconds;
            if (t.total <= 0) {
                let cart = localStorage.getItem('UPDATE');
                let user_id = JSON.parse(sessionStorage.getItem('user_id'));
                let param = 'user_id=' + user_id + '&delete=' + true + '&cart=' + cart;
                postReq('reserveOrder.php', param).then((res) => {
                    localStorage.removeItem('UPDATE');
                    clock.style.display = 'none';
                    localStorage.removeItem('reserve');
                    if (document.querySelector('.orders_book')) {
                        document.querySelector('.orders_book').innerHTML = '<h2>No reserved orders</h2>';
                    }

                });
                clearInterval(timeinterval);
            }
            let btnRemove = document.getElementById('btnRemove');
            if (btnRemove) {
                btnRemove.addEventListener('click', function (event) {
                    clearInterval(timeinterval);
                });
            }

            let btnPay = document.getElementById('btnPay');
            if (btnPay) {
                btnPay.addEventListener('click', () => {
                    document.getElementById('checkout').addEventListener('submit', function (event) {
                        event.preventDefault();
                        clearInterval(timeinterval);
                    });
                })
            }
        }, 1000);
    }


    payBookingOrder() {
        let checkout = document.getElementById('checkout');
        checkout.style.display = 'block';
        let close = document.getElementById('closeChecout');
        close.addEventListener('click', () => {
            checkout.style.display = 'none';
        });
    }

    clear() {
        let btnRemove = document.getElementById('btnRemove');
        if (btnRemove) {
            btnRemove.addEventListener('click', function (event) {
                let clock = document.getElementById('clockdiv');
                let cart = localStorage.getItem('UPDATE');
                let user_id = JSON.parse(sessionStorage.getItem('user_id'));
                let param = 'user_id=' + user_id + '&delete=' + true + '&cart=' + cart;
                postReq('reserveOrder.php', param).then((res) => {
                    localStorage.removeItem('UPDATE');
                    clock.style.display = 'none';
                    localStorage.removeItem('reserve');
                    if (document.querySelector('.orders_book')) {
                        document.querySelector('.orders_book').innerHTML = '<h2>No reserved orders</h2>';
                    }
                    let checkout = document.getElementById('checkout');
                    checkout.style.display = 'none';

                });


            });
        }

    }

    payBook() {
        let self = this;
        let btnPay = document.getElementById('btnPay');
        let clock = document.getElementById('clockdiv');
        if (btnPay) {
            btnPay.addEventListener('click', () => {
                self.payBookingOrder();
                document.getElementById('checkout').addEventListener('submit', function (event) {
                    event.preventDefault();
                    let user_id = JSON.parse(sessionStorage.getItem('user_id'));
                    let param = 'user=' + user_id + '&payorder=payorder';
                    postReq('saveOrder.php', param).then(res => {
                        alert('Order ' + JSON.parse(res) + ' payed');
                        let checkout = document.getElementById('checkout');
                        checkout.style.display = 'none';
                    });
                    clock.style.display = 'none';
                    localStorage.removeItem('UPDATE');
                    localStorage.removeItem('reserve');
                    if (document.querySelector('.orders_book')) {
                        document.querySelector('.orders_book').innerHTML = '<h2>No reserved orders</h2>';
                    }

                });
            })
        }
    }

}



