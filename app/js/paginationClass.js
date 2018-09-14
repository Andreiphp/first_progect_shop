'use strict';

class Pagination extends Goods {
    constructor() {
        super();
        this.pagElement = document.getElementById('pag_list');
        this.CNT = 6;
        this.param = null;
        this.pathLinksParam = '';
        this.pathLinks = '';
        this.links = document.getElementsByClassName('pagination_links');
    }

    getParam(param) {
        if (param) {
            this.param = param;
        }
        this.linksPath();
    }

    getCountPages() {
        if (this.param != null) {
            let category_name = 'cat=' + this.param;
            return this.getDAta('count_products.php?' + category_name);
        } else {
            return this.getDAta('count_products.php');
        }

    }

    initPagination() {
        let self = this;
        this.getCountPages().then(countPages => {
            let count_page = Math.ceil(countPages / this.CNT);
            let links2 = [];
            let links3 = '';
            let hash = window.location.hash;

            let currentPage = (isNaN(Number(hash.split('/')[3]))) ? Number(hash.split('/')[2]) : Number(hash.split('/')[3]);

            if (currentPage > count_page) {
                template.getErrorTemplate();
                return false;
            }

            if (currentPage === undefined || currentPage === "" || isNaN(currentPage)) {
                currentPage = 1;
            }
            let info;
            let array = [];
            for (let i = 1; i <= count_page; i++) {
                array.push(i);
            }
            let index = array.indexOf(currentPage);
            let prevlink = array[0];
            let prevone = array[index - 1];
            let curentlink = array[index];
            let nextlink = array[index + 1];
            let nexttolink = array[index + 2];
            let lastlink = array[array.length - 1];
            if (count_page <= 1) {


            } else if (count_page <= 5) {
                info = '<span class="page_pag">' + 'Page:  ' + currentPage + '</span>' + '<span class="pages_pag">' + 'From:  ' + count_page + '</span>';
                document.getElementById('pag_s').innerHTML = info;
                array.forEach(function (el) {
                    links3 += "<li><a class='pagination_links' href='#shop/" + self.pathLinks + self.pathLinksParam + el + "'>" + el + "</a></li>";
                });
            }
            else {
                info = '<span class="page_pag">' + 'Page:  ' + currentPage + '</span>' + '<span class="pages_pag">' + 'From:  ' + count_page + '</span>';
                document.getElementById('pag_s').innerHTML = info;
                if (currentPage === 1) {
                    links2.push(curentlink);
                    links2.push(nextlink);
                    links2.push(nexttolink);
                    links2.push('&gt;');
                    links3 = links2.map(el => {
                        if (el === links2[links2.length - 1]) {
                            el = "<li><a class='pagination_links'  href='#shop/" + self.pathLinks + self.pathLinksParam + lastlink + "'>" + el + "</a></li>";
                        } else {
                            el = "<li><a class='pagination_links' href='#shop/" + self.pathLinks + self.pathLinksParam + el + "'>" + el + "</a></li>";
                        }
                        return el;
                    }).join('');
                }
                if (currentPage > 1 && currentPage < count_page) {
                    if (currentPage >= count_page - 2) {
                        links2.push('&lt;');
                        links2.push(prevone);
                        links2.push(curentlink);
                        links2.push(nextlink);
                        links3 = links2.map(el => {
                            if (el === links2[0]) {
                                el = "<li><a class='pagination_links' href='#shop/" + self.pathLinks + self.pathLinksParam + prevlink + "'>" + el + "</a></li>";
                            } else if (el === links2[1]) {
                                el = "<li><a class='pagination_links' href='#shop/" + self.pathLinks + self.pathLinksParam + el + "'>" + el + "</a></li><li>...</li>";
                            }
                            else {
                                el = "<li><a class='pagination_links' href='#shop/" + self.pathLinks + self.pathLinksParam + el + "'>" + el + "</a></li>";
                            }
                            return el;
                        }).join('');

                    } else {
                        links2.push('&lt;');
                        links2.push(prevone);
                        links2.push(curentlink);
                        links2.push(nextlink);
                        links2.push(nexttolink);
                        links2.push('&gt;');
                        links3 = links2.map(el => {
                            if (el === links2[0]) {
                                el = "<li><a class='pagination_links' href='#shop/" + self.pathLinks + self.pathLinksParam + prevlink + "'>" + el + "</a></li>";
                            } else if (el === links2[1]) {
                                el = "<li><a class='pagination_links' href='#shop/" + self.pathLinks + self.pathLinksParam + el + "'>" + el + "</a></li><li>...</li>";
                            }
                            else if (el === links2[links2.length - 1]) {
                                el = "<li><a class='pagination_links' href='#shop/" + self.pathLinks + self.pathLinksParam + lastlink + "'>" + el + "</a></li>";
                            }
                            else {
                                el = "<li><a class='pagination_links' href='#shop/" + self.pathLinks + self.pathLinksParam + el + "'>" + el + "</a></li>";
                            }
                            return el;
                        }).join('');
                    }
                }
                if (currentPage >= count_page) {
                    links2.push('&lt;');
                    links2.push(prevone);
                    links2.push(curentlink);
                    links3 = links2.map(el => {
                        if (el === links2[0]) {
                            el = "<li><a class='pagination_links' href='#shop/" + self.pathLinks + self.pathLinksParam + prevlink + "'>" + el + "</a></li>";
                        } else if (el === links2[1]) {
                            el = "<li><a class='pagination_links' href='#shop/" + self.pathLinks + self.pathLinksParam + el + "'>" + el + "</a></li><li>...</li>";
                        }
                        else {
                            el = "<li><a class='pagination_links' href='#shop/" + self.pathLinks + self.pathLinksParam + el + "'>" + el + "</a></li>";
                        }
                        return el;
                    }).join('');
                }
            }
            document.getElementById('pag_list').innerHTML = links3;
            if (count_page > 1) {
                this.activeLinks();
            }

        });
    }

    linksPath() {
        if (this.param != null) {
            this.pathLinks = 'category/';
            this.pathLinksParam = this.param + '/';
        } else {
            this.pathLinksParam = 'page/'
        }
    }

    activeLinks() {
        for (let i = 0; i < this.links.length; i++) {
            if (window.location.href === this.links[i].href) {
                this.links[i].classList.add("active_links");
            } else {
                this.links[i].classList.remove("active_links");
            }
        }
        if (window.location.hash === '') {
            this.links[0].classList.add("active_links");
        }
        let hash = window.location.hash;
        let res = hash.split('/');
        if (res.length === 2) {
            this.links[0].classList.add("active_links");
        }
        if (res.length === 3 && res[1] === 'category') {
            this.links[0].classList.add("active_links");
        }
    }
}




