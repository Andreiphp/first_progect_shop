'use strict';

class Sort extends Goods {
    constructor() {
        super();
        this.trigger_by_sort = document.querySelector('.trigger_by_sort').firstElementChild;
        this.sort_list = document.querySelector('.sort_list');
        this.products_content = document.getElementById('products_content');
        this.switch = document.querySelector('.switch');
        this.page = 0;
        this.catName = '';
        this.paramPage = '';
        this.getPageSort();
        this.hideElement();
        this.createSortList();
        this.activeSort();
    }

    getPageSort() {
        let hash = location.hash.slice(1).split('/');
        if (hash.length <= 2) {
            this.page = 1;
            this.paramPage = 'index';
        } else {
            if (hash[1] === 'page') {
                this.page = hash[2];
                this.paramPage = 'index';
            } else if (hash[1] === 'category' && hash.length < 4) {
                this.page = 1;
                this.catName = hash[2];
            } else {
                this.catName = hash[2];
                this.page = hash[3];
            }
        }
    }

    createSortList() {
        let arr = this.arraySorting();
        let self = this;
        arr.forEach(function (el) {
            let li = document.createElement('li');
            li.textContent = el.title;
            li.setAttribute('data-sort', el.sorting);
            self.sort_list.appendChild(li);
        });
    }

    // 'Default sorting','Sort by newness','Sort by price: low to high','Sort by price: high to low'

    arraySorting() {
        return [
            {
                title: 'Default sorting',
                sorting: 'default'
            },
            {
                title: 'Sort by newness',
                sorting: 'news'
            },
            {
                title: 'Sort by price: low to high',
                sorting: 'price_ask'
            },
            {
                title: 'Sort by price: high to low',
                sorting: 'price_desk'
            },

        ];
    }

    hideElement() {
        let self = this;
        this.trigger_by_sort.addEventListener('click', function (e) {
            if (self.sort_list.classList.contains('hide')) {
                self.sort_list.classList.remove('hide');
            } else {
                self.sort_list.classList.add('hide');
            }
        });
    }

    insertElement() {
        let self = this;
        let text = JSON.parse(localStorage.getItem('sort'));
        this.trigger_by_sort.innerHTML = text.title;
        this.sort_list.addEventListener('click', function (e) {
            let sort_obj = {
                title: e.target.textContent,
                param: e.target.dataset.sort
            };
            localStorage.setItem('sort', JSON.stringify(sort_obj));
            text = JSON.parse(localStorage.getItem('sort'));
            self.trigger_by_sort.innerHTML = text.title;
            self.sort_list.classList.remove('hide');
            if (self.paramPage !== 'index') {
                let caregory = new Cat();
                caregory.getSortCategoryProducts(self.catName, self.page);
            } else {
                self.getSortProducts(self.page);
            }
        });
    }

    changeTemplate() {
        this.products_content.className = JSON.parse(localStorage.getItem('layout'));
        let self = this;
        this.switch.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.setItem('layout', JSON.stringify(event.target.dataset.content));
            self.activeSort();
            self.changeTemplate();
        })
    }

    activeSort(){
        if(JSON.parse(localStorage.getItem('layout')) === 'main'){
            document.getElementById('main').classList.add('active_tmp');
            document.getElementById('main_list').classList.remove('active_tmp');

        }

        if(JSON.parse(localStorage.getItem('layout')) === 'main_list') {
            document.getElementById('main').classList.remove('active_tmp');
            document.getElementById('main_list').classList.add('active_tmp');

        }
    }


}

