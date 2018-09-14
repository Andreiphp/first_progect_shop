'use strict';

class Cat extends Goods {
    constructor() {
        super();
    }

    getLinksForCategories() {
        let result = '';
        let links = '';
        this.getDAta('getCategories.php').then(res => {
            result = JSON.parse(res);
            return result;
        }).then((result) => {
            result.forEach(function (el) {
                links += "<li><a class='menu_links' href='#shop/category/" + el.links + "' id=" + el.id + ">" + el.name + "</a></li> ";
            });
            return links;
        }).then(links => {
            document.getElementById('cat').innerHTML = links;
            return true;
        }).then(() => {
            this.activeLinksCat();
        });
    }

    getSortCategoryProducts(name, page) {
        if (!page) {
            page = 1;
        }
        let sort_name = JSON.parse(localStorage.getItem('sort'));
        let start = "cat_links=" + name + "&sorting=" + sort_name.param + "&page=" + ((page - 1) * 6);
        this.getDAta('getSortCatProducts.php?' + start).then(res => {
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
        }).catch(error => {
           // let template = new Templates();
            template.getErrorTemplate();
        });
    }

    // getSubCategories() {
    //     let sub_cat = "sub_cat=" + 1;
    //     this.getDAta('getCategories.php?' + sub_cat).then(res => {
    //         let sub_category = JSON.parse(res);
    //         return sub_category;
    //     }).then(res => {
    //         let result = '';
    //         res.forEach(function (el) {
    //             result += subCategories(el.id, el.title, el.img);
    //         });
    //         return result;
    //     }).then(str => {
    //         document.querySelector('.goals_category').insertAdjacentHTML('afterBegin', str);
    //     });
    // }

    activeLinksCat() {
        let hash = window.location.href;
        let res = hash.split('/');
        let del = res.pop();
        let hash_links = res.join('/');
        let menu_links = document.querySelectorAll('.menu_links');
        for (let i = 0; i < menu_links.length; i++) {
            if (window.location.href === menu_links[i].href || window.location.href === menu_links[i].href + '/' || hash_links === menu_links[i].href) {
                menu_links[i].classList.add("active_menu_links");
            } else {
                menu_links[i].classList.remove("active_menu_links");
            }

        }

    }
}






