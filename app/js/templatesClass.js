'use strict';

class Templates {
    constructor() {
        this.mainTemplate = document.getElementById('wrapper');
        this.main = document.getElementById('main');
        this.shop = document.getElementById('shop');
        this.product = document.getElementById('pr');
    }

    getData(url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            // xhr.responseType = 'document';
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

    getMainTemplate() {
        let self = this;
        return new Promise(function (resolve) {
            self.getData('app/template/main.html').then(result => {

                self.mainTemplate.innerHTML = result;
                resolve();
            });
        })
    }

    getShopTemplate() {
        let self = this;
        return new Promise(function (resolve) {
            self.getData('app/template/shop.html').then(result => {
                self.mainTemplate.innerHTML = result;
                resolve();
            });
        })
    }

    getProductTemplate() {
        let self = this;
        return new Promise(function (resolve) {
            self.getData('app/template/product.html').then(result => {
                self.mainTemplate.innerHTML = result;
                resolve();
            });
        })
    }

    getBasketTemplate() {
        let self = this;
        return new Promise(function (resolve) {
            self.getData('app/template/basket.html').then(result => {
                self.mainTemplate.innerHTML = result;
                resolve();
            });
        })
    }
    getAccountTamplate(){
        let self = this;
        return new Promise(function (resolve) {
            self.getData('app/template/acount.html').then(result => {
                self.mainTemplate.innerHTML = result;
                resolve();
            });
        })
    }

    getBasketStep2() {
        let self = this;
        return new Promise(function (resolve) {
            self.getData('app/template/basketstep2.html').then(result => {
                self.mainTemplate.innerHTML = result;
                resolve();
            });
        })
    }

    getAdminTemplate() {
        let self = this;
        return new Promise(function (resolve) {
            self.getData('app/template/admin.html').then(result => {
                self.mainTemplate.innerHTML = result;
                resolve();
            });
        })
    }
    getErrorTemplate() {
        let self = this;
        return new Promise(function (resolve) {
            self.getData('app/template/error.html').then(result => {
                self.mainTemplate.innerHTML = result;
                resolve();
            });
        })
    }

    destroyMain() {
        if (document.getElementById('main_content')) {
            document.getElementById('main_content').remove();
        }
    }

    destroyShop() {
        if (document.getElementById('shop_contents')) {
            document.getElementById('shop_contents').remove();
        }
    }


}

let template = new Templates();
