'use strict';

class Goods {
    constructor() {
        this.main = document.querySelector('.main');
        if (!this.main) {
            this.main = document.querySelector('.main_list');
        }
        this.specials = document.querySelector('.main_specials');
        this.productImage = document.querySelector('.product_images');
    }

    getDAta(url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.onload = function () {
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    let error = new Error(this.statusText);
                    error.code = this.status;
                    reject(error);
                }
            };
            xhr.onerror = function () {
                reject(new Error("Network Error"));
            };

            xhr.send();

        });
    }

    getSortProducts(page) {
        let sort_name = JSON.parse(localStorage.getItem('sort'));
        let start = "sorting=" + sort_name.param + "&page=" + ((page - 1) * 6);
        this.getDAta('sortingProducts.php?' + start).then(res => {
            let products = JSON.parse(res);
            return products;
        }).then(res => {
            let result = '';
            res.forEach(function (el) {
                result += ElementProduct(el.id, el.title, el.img, el.price);
            });
            return result;
        }).then(str => {
            while (this.main.firstChild) {
                this.main.firstChild.remove();
            }
            this.main.insertAdjacentHTML('afterBegin', str);

        })
    }


    getSpecialProducts() {
        let specials = "specials=" + 1;
        this.getDAta('poducts.php?' + specials).then(res => {
            console.log(res);
            let products = JSON.parse(res);
            return products;
        }).then(res => {

            let result = '';
            res.forEach(function (el) {
                result += ElementProduct(el.id, el.title, el.img, el.price);
            });
            return result;
        }).then(str => {
            this.specials.insertAdjacentHTML('afterBegin', str);
        });
    }


    getOneProduct(id) {
        let id_product = "id_product=" + id;
        this.getDAta('singleProduct.php?' + id_product).then(res => {
            let products = JSON.parse(res);
            return products;
        }).then(res => {
            console.log(res);
            if(res.length<=0){
                template.getErrorTemplate();
                return false;
            }
            let buttTocart = document.getElementById('toCart');
            buttTocart.setAttribute('data-tocart',res.id);
            let m = document.querySelector('.main_img');
            let title = document.querySelector('.product_title');
            let price = document.querySelector('.product_price');
            let span = document.createElement('span');
            let span2 = document.createElement('span');
            span.textContent = '$';
            span2.textContent = res.price;
            let discription = document.getElementById('desc');
            let pc = document.getElementById('pc');
            m.src = 'app/img/content/large_img/' + res.img;
            title.textContent = res.title;
            price.appendChild(span2);
            price.appendChild(span);
            discription.textContent = res.discription;
            pc.textContent = res.composition;
            this.cloneImg();
        })
    }

    cloneImg() {
        this.image = document.querySelector('.main_img');
        let self = this;
        let img2 = self.image.cloneNode(true);
        img2.className = 'imd2';
        self.productImage.appendChild(img2);
        let T = this.image.getBoundingClientRect();
        let K = img2.getBoundingClientRect();
        this.related = null;
        this.productImage.onmouseover = function (event) {
            img2.style.width = '110%';
            img2.style.height = '110%';
        };
        this.productImage.addEventListener('mousemove', function (event) {
            img2.style.left = (K.width / 2 - event.offsetX) / 10 - 30 + 'px';
            img2.style.top = (K.y / 2 - event.offsetY) / 10 + 'px';
        });
        this.productImage.onmouseout = function (event) {
            img2.style.left = 0;
            img2.style.top = 0;
            img2.style.width = '100%';
            img2.style.height = '100%';

        };
    }

    activeTabs() {
        let tabs = document.querySelectorAll('.tabs_list');
        let discription = document.getElementById('desc');
        let pc = document.getElementById('pc');
        document.querySelector('.tabs_product').addEventListener('click', function (event) {
            if (event.target.getAttribute('data-content') === 'desc') {
                discription.style.display = 'block';
                pc.style.display = 'none';
            }
            if (event.target.getAttribute('data-content') === 'pc') {

                pc.style.display = 'block';
                discription.style.display = 'none';

            }
        })
    }

}





