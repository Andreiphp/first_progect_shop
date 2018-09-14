'use strict';

class Search {
    constructor() {
        this.search = document.getElementById('search');
        this.ul = document.getElementById('search_list');
        this.count = 0;
        this.resultCursor = 0;
    }

    getDAta(url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.onload = function () {
                if (this.status == 200) {
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

    inputSearch() {
        let self = this;
        this.search.addEventListener('input', function (e) {
            e.preventDefault();
            self.count = 0;
            if (e.target.value.length < 3) {
                while (self.ul.firstChild) {
                    self.ul.firstChild.remove();
                }
            }
            if (e.target.value.length >= 3) {
                let query = "query=" + e.target.value;
                self.getDAta('search.php?' + query).then(res => {
                    let result = JSON.parse(res);
                    self.showSearchResult(result);
                })
            }
        });


        self.resultCursor = 0;
        self.search.addEventListener('keydown', function (e) {
            let el = [... document.getElementsByClassName('new_list')];
            switch (e.keyCode) {
                case 13:
                    document.querySelector('.active > a').click();
                    break;
                case 38:
                    self.resultCursor = (self.resultCursor <= 0) ? el.length - 1 : --self.resultCursor;
                    if (self.ul.children.length > 0) {
                        self.movecursor(self.resultCursor);
                    }
                    break;
                case 40:
                    self.resultCursor = (self.resultCursor == el.length - 1) ? 0 : ++self.resultCursor;
                    if (self.ul.children.length > 0) {
                        self.movecursor(self.resultCursor);
                    }
                    break;
            }
        });

    }

    showSearchResult(result) {
        if (result.length == 0) {
            let li = document.createElement('li');
            li.innerHTML = 'Совпадений не найденно';
            if (this.ul.childElementCount == 0) {
                this.ul.appendChild(li);
            }
        } else {
            let self = this;
            if (this.count < result.length || this.count > result.length) {
                while (this.ul.firstChild) {
                    this.ul.firstChild.remove();
                }
                self.resultCursor = 0;
                result.forEach(function (el) {
                    let li = document.createElement('li');
                    let a = document.createElement('a');
                    a.href = '#shop/product/' + el.id;
                    a.textContent = el.title;
                    li.className = 'new_list';
                    li.appendChild(a);
                    self.ul.appendChild(li);
                });
            }
            this.count = result.length;
        }

    }


    movecursor(resultCursor) {
        for (let i = 0; i < this.ul.children.length; i++) {
            this.ul.children[i].classList.remove("active");
        }
        this.ul.children[resultCursor].classList.add("active");
    }




}

