class Admin {
    constructor() {
        this.tableProducts = document.querySelector('.admin_products');
        this.addNew = document.getElementById('new_product');
        this.formNewProd = document.querySelector('.product_add');
        this.divEdit = document.querySelector('.product_redact');
        this.productEdit = document.getElementById('admin_pro');
        this.edit_product = document.getElementById('edit_product');
        this.FormNewProduct();
        this.addNewProduct();
        this.logout_admin = document.getElementById('logout_admin');
        this.logoutAdmin();
        this.showFornEdit();
        this.page = 2;
        let selt = this;
        document.getElementById('closeEditForm').addEventListener('click', function () {
            selt.divEdit.style.display = 'none';
        });
        postReq('lozyLoad.php', 'page=0').then(result => {
            let products = JSON.parse(result);
            createTableProducts(products);
        });

        window.onscroll = function () {
            selt.Handler();
        };
    }

    Handler() {
        this.productEdit = document.getElementById('admin_pro');
        let contentHeight = this.productEdit.offsetHeight;
        let yOffset = window.pageYOffset;
        let y = yOffset + window.innerHeight;

        if (y > contentHeight) {
            let param = 'page=' + (this.page + 1);
            postReq('lozyLoad.php', param).then(result => {
                let products = JSON.parse(result);
                createTableProducts(products);
                return products;
            }).then(products => {
                if (products.length !== 0) {
                    this.page++;
                } else {
                    document.querySelector('.allLoad').classList.add('allLoad_show');
                }
            });
        }


    }

    // getAllProducts() {
    //     let param = 'all=all';
    //     postReq('poducts.php', param).then(result => {
    //         let products = JSON.parse(result);
    //         this.createTableProducts(products);
    //     })
    // }


    // createTableProducts(products) {
    //     let result = '';
    //     products.forEach(el => {
    //         result += adminProducts(el.id, el.img, el.title, el.price, el.count);
    //     });
    //     while (this.tableProducts.firstChild) {
    //         this.tableProducts.firstChild.remove();
    //     }
    //     this.tableProducts.insertAdjacentHTML('afterBegin', result);
    // }

    FormNewProduct() {
        let self = this;
        this.addNew.addEventListener('click', function () {
            if (self.formNewProd.style.display === 'block') {
                self.formNewProd.style.display = 'none'
            } else {
                self.formNewProd.style.display = 'block';
            }
        });
    }

    addNewProduct() {
        let self = this;
        let formAdd = document.getElementById('edd_product');
        formAdd.addEventListener('submit', function (event) {
            event.preventDefault();
            let title = formAdd.elements.title.value;
            let discription = formAdd.elements.discription.value;
            let minidescription = formAdd.elements.minidescription.value;
            let count = Number(formAdd.elements.count.value);
            let category = formAdd.elements.category.value;
            let file = formAdd.elements.file.files[0].name;
            let price = formAdd.elements.price.value;
            let param = 'insert=insert' + '&title=' + title + '&discription=' + discription + '&minidescription=' + minidescription + '&count=' + count + '&catygory=' + category + '&file=' + file + '&price=' + price;
            postReq('adminInsert.php', param).then((res) => {
                for (let i = 0; i <= formAdd.elements.length; i++) {
                    formAdd.reset();
                    self.formNewProd.style.display = 'none';

                }
            })
        })

    }

    logoutAdmin() {
        this.logout_admin.addEventListener('click', function () {
            sessionStorage.removeItem('user_auth');
            window.location = '#shop/';
        })
    }

    showFornEdit() {
        let self = this;
        this.productEdit.addEventListener('click', function (event) {
            if (event.target.hasAttribute('data-edit')) {
                if (self.divEdit.style.display === 'block') {
                    self.divEdit.style.display = 'none'
                } else {
                    self.divEdit.style.display = 'block';
                }

                let id = event.target.getAttribute('data-edit');
                let param = 'id=' + id + '&edit=edit';
                postReq('adminInsert.php', param).then(res => {
                    let result = JSON.parse(res);
                    document.getElementById('edit_price').value = result[''].price;
                    document.getElementById('edit_title').value = result[''].title;
                    document.getElementById('edit_discription').value = result[''].discription;
                    document.getElementById('edit_minidescription').value = result[''].minidescription ? result[''].minidescription : 'Nothing';
                    document.getElementById('edit_count').value = result[''].count;

                    self.edit_product.addEventListener('submit', function (event) {
                        event.preventDefault();

                        let title = self.edit_product.elements.edit_title.value;
                        let discription = self.edit_product.elements.edit_discription.value;
                        let minidescription = self.edit_product.elements.edit_minidescription.value;
                        let count = Number(self.edit_product.elements.edit_count.value);
                        let category = self.edit_product.elements.edit_category.value;
                        let file = self.edit_product.elements.file.files[0].name;
                        let price = self.edit_product.elements.edit_price.value;
                        let param = 'id=' + id + '&title=' + title + '&discription=' + discription + '&minidescription=' + minidescription + '&count=' + count + '&catygory=' + category + '&file=' + file + '&price=' + price + '&update=update';
                        postReq('adminInsert.php', param).then(() => {
                            self.divEdit.style.display = 'none';
                            self.removeAllProduct(id, title, count, file, price);
                        });
                    })
                })
            }

            if (event.target.hasAttribute('data-delite')) {
                let id = event.target.getAttribute('data-delite');
                let param = 'id=' + id + '&delete=delete';
                postReq('adminInsert.php', param).then(() => {
                    let product = document.getElementById(id);
                    product.remove();
                })
            }
        })
    }

    removeAllProduct(id, title, count, file, price) {
        let product = document.getElementById(id);
        product.children[0].children[0].src = 'app/img/content/small_img/' + file;
        product.children[1].textContent = title;
        product.children[2].textContent = price;
        product.children[3].textContent = count;

    }

}