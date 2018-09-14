let WorkSpace = new Router({
    roots: {
        "": 'index',
        "shop/": 'shop',
        "shop/page/:page": 'shop',
        "shop/category/:query": 'category',
        "shop/category/:query:page": 'category',
        "shop/product/:page": 'product',
        "basket/": 'basket',
        "basket/step2/": 'basket_auth',
        "account/": 'user_account',
        "admin/": 'admin',
        "about/": 'about',
    },
    index: function (...query) {
        template.getMainTemplate().then(() => {
            template.destroyShop();
            let goods = new Goods();
            let category = new Cat();
            goods.getSpecialProducts();
            //category.getSubCategories();
            let slider = new Slider();
            let cart = new Cart();
            cart.addToCart();
            cart.showCardBlock();
            cart.updateSmallCart();
            let date = localStorage.getItem('reserve');
        });
    },
    shop: function (...query) {
        template.getShopTemplate().then(() => {
            template.destroyMain();
            let sort = new Sort();
            sort.changeTemplate();
            sort.insertElement();
            let goods = new Goods();
            let category = new Cat();
            if (!query[1]) {
                goods.getSortProducts(1);
            } else {
                goods.getSortProducts(query[1]);
            }
            category.getLinksForCategories();
            let pagination = new Pagination();
            pagination.getParam();
            pagination.initPagination();

            let search = new Search();
            search.inputSearch();
            let cart = new Cart();
            cart.addToCart();
            cart.showCardBlock();
            cart.updateSmallCart();

        });
    },
    category: function (...query) {
        template.getShopTemplate().then(() => {
            let sort = new Sort();
            sort.changeTemplate();
            sort.insertElement();
            // let goods = new Goods();
            let category = new Cat();
            category.getLinksForCategories();
            if (!query[2]) {
                category.getSortCategoryProducts(query[1]);
            } else {
                category.getSortCategoryProducts(query[1], query[2]);
            }
            category.activeLinksCat();
            let pagination = new Pagination();
            pagination.getParam(query[1]);
            pagination.initPagination();
            let search = new Search();
            search.inputSearch();
            let cart = new Cart();
            cart.addToCart();
            cart.showCardBlock();
            let date = localStorage.getItem('reserve');

        });
    },

    product: function (...query) {
        // alert(query[1]);
        // let param = 'id='+query[1];
        // postReq('',)
        template.getProductTemplate().then(() => {
            let goods = new Goods();
            goods.getOneProduct(query[1]);
            goods.activeTabs();
            let cart = new Cart();
            cart.hideCardBlock();
            cart.addToCartOneProduct();
            let date = localStorage.getItem('reserve');

        });
    },

    basket: function () {
        template.getBasketTemplate().then(() => {
            let cart = new Cart();
            cart.hideCardBlock();
            cart.fillBasket();
            cart.updateMainBasket();
            cart.redirectToShop();
            cart.updateSmallCart();
            let date = localStorage.getItem('reserve');


        })
    },

    basket_auth: function () {
        let getauth = 'auth=' + true;
        if (sessionStorage.getItem('user_auth')) {
            let param = 'user_id=' + JSON.parse(sessionStorage.getItem('user_auth'))['user_id'];
            postReq('reserveOrder.php', param).then(result => {
                if (JSON.parse(result) === false) {
                    alert('Оплатите забронированный товар');
                    window.location = '#basket/';
                } else {
                    auth.ajaxRequest('auth.php?' + getauth).then(result => {
                        if (result) {
                            template.getBasketStep2().then(() => {
                                let cart = new Cart();
                                cart.hideCardBlock();
                                cart.basketStep2(JSON.parse(result));
                                cart.totalPrice();
                                cart.cartInner();
                                cart.placeOrder();
                                cart.reserveOrder();
                            })
                        } else {
                            user.showLogForm();
                            window.location = '#basket/';
                        }
                    })
                }
            })
        } else {
            user.showLogForm();
            window.location = '#basket/';
        }

    },
    user_account: function () {
        let getauth = 'auth=' + true;
        if (sessionStorage.getItem('user_auth')) {
            let param = 'user_id=' + JSON.parse(sessionStorage.getItem('user_auth'))['user_id'];
            auth.ajaxRequest('auth.php?' + getauth).then(result => {
                if (result) {
                    template.getAccountTamplate().then(() => {
                        user.showAccountContent();
                        user.showOrderByUser(param);
                        user.showDetaliOrders();
                        user.checkFormUpdateUser();
                        user.bookingOrder();
                        user.createBookingElements();
                        let cart = new Cart();
                        cart.clear();
                        cart.payBook();
                    })
                } else {
                    user.showLogForm();
                    window.location = '#shop/';

                }
            })

        } else {
            user.showLogForm();
            window.location = '#shop/';
        }
    },
    admin: function () {
        let user = JSON.parse(sessionStorage.getItem('user_auth'));
        if (!user || user['user_role'] !== 'admin') {
            window.location = '#shop/';
        } else {
            template.getAdminTemplate().then(() => {
                let admin = new Admin();
                //admin.getAllProducts();

            })
        }

    },

    error: function () {
        template.getErrorTemplate();
        // window.location = '#shop/';
    }
});



