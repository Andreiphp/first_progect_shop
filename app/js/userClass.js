'use strict';

class Users {
    constructor() {
        this.regForm = document.getElementById('reg_form');
        this.loginForm = document.getElementById('logform');
        this.valid = {
            name: false,
            lastname: false,
            address: false,
            mail: false,
            password: false,
            confirm: false
        };
        this.showFormAuth();
        this.CloseForm();
        this.validateForm();
        this.sendDataToServer();
        this.authenticationUser();
        this.createUsersBlock();
        this.logout();

    }

    showFormAuth() {
        let fixedFon = document.getElementById('register_position');
        let form = document.querySelector('.register');
        let formLog = document.querySelector('.login');
        document.getElementById('users_block').addEventListener('click', () => {
            if (event.target.id === 'register') {
                fixedFon.classList.add('hide_form');
                form.classList.add('hide_form');
            }
            if (event.target.id === 'login') {
                fixedFon.classList.add('hide_form');
                formLog.classList.add('hide_form');
            }
        });

    }

    CloseForm() {
        let fixedFon = document.getElementById('register_position');
        let form = document.querySelector('.register');
        let login = document.querySelector('.login');
        document.getElementById('closeForm').addEventListener('click', () => {
            fixedFon.classList.remove('hide_form');
            form.classList.remove('hide_form');
        });
        document.getElementById('closelog').addEventListener('click', () => {
            fixedFon.classList.remove('hide_form');
            login.classList.remove('hide_form')
        });

    }

    postRequest(url, params) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
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

            xhr.send(params);

        });
    }


    sendDataToServer() {
        let self = this;
        let error = [];
        this.regForm.addEventListener('submit', function (event) {
            event.preventDefault();
            for (let key in self.valid) {
                error.push(self.valid[key]);
            }
            checkAllInput(self.regForm.elements);
            if (error.every(el => el === true)) {
                let name = self.regForm.elements.name.value;
                let lastname = self.regForm.elements.lastname.value;
                let mail = self.regForm.elements.mail.value;
                let address = self.regForm.elements.address.value;
                let password = self.regForm.elements.password.value;
                let params = 'name=' + name + '&lastname=' + lastname + '&mail=' + mail + '&address=' + address + '&password=' + password;
                self.postRequest('saveUsers.php', params).then(res => {
                    successfulRegistration(self.regForm.elements);
                });
            }

            error = [];

        });

        function successfulRegistration(elements) {
            for (let i = 0; i < elements.length - 1; i++) {
                elements[i].value = '';
                elements[i].nextElementSibling.textContent = '';
            }

            let fixedFon = document.getElementById('register_position');
            let form = document.querySelector('.register');
            fixedFon.classList.remove('hide_form');
            form.classList.remove('hide_form');
            let div = document.createElement('div');
            div.id = 'success_reg';
            div.textContent = 'You have successfully registered';
            document.body.appendChild(div);
            setTimeout(() => {
                div.remove();
            }, 2500);
            self.valid.name = false;
            self.valid.lastname = false;
            self.valid.mail = false;
            self.valid.address = false;
            self.valid.password = false;
            self.valid.confirm = false;

        }

        function checkAllInput(val) {
            for (let i = 0; i < val.length - 1; i++) {
                if (val[i].value === '') {
                    val[i].nextElementSibling.textContent = 'fill in the field!!!';
                    val[i].nextElementSibling.style.color = 'red';
                }
            }

        }
    }


    validateForm() {
        let self = this;
        this.regForm.addEventListener('input', function (event) {
            event.preventDefault();
            switch (event.target.name) {
                case 'name':
                    validName(event.target.value);
                    break;
                case 'lastname':
                    validLastName(event.target.value);
                    break;
                case 'mail':
                    console.log('sdf');
                    validMail(event.target.value);
                    break;
                case 'address':
                    validAdress(event.target.value);
                    break;
                case 'password':
                    validPassword(event.target.value);
                    break;
                case 'confirm_password':
                    validConfirm(event.target.value);
                    break;

            }
        });

        function validName(value) {
            let reg = /^[A-z]{3,10}$/;
            let error_name = document.getElementById('error_name');
            if (value.match(reg)) {
                self.valid.name = true;
                applyStyle(true, error_name);
            } else {
                self.valid.name = false;
                applyStyle(false, error_name)
            }

        }

        function validLastName(value) {
            let reg = /^[A-z]{3,10}$/;
            let error_name = document.getElementById('error_lastname');
            if (value.match(reg)) {
                self.valid.lastname = true;
                applyStyle(true, error_name);
            } else {
                self.valid.lastname = false;
                applyStyle(false, error_name)
            }
        }

        function validMail(value) {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
            let error_name = document.getElementById('error_mail');
            if (value.match(reg)) {
                self.valid.mail = true;
                applyStyle(true, error_name);
            } else {
                self.valid.mail = false;
                applyStyle(false, error_name)
            }
            let mail = 'mail=' + value;
            postReq('checkMail.php', mail).then(res => {
                let mail = JSON.parse(res);
                if (mail.length > 0) {
                    self.valid.mail = false;
                    error_name.textContent = 'such mail already is';
                    error_name.style.color = 'red';
                }
            });
        }

        function validAdress(value) {
            let reg = /^[A-z0-9]{5,50}$/;
            let error_name = document.getElementById('error_address');
            if (value.match(reg)) {
                self.valid.address = true;
                applyStyle(true, error_name);
            } else {
                self.valid.address = false;
                applyStyle(false, error_name)
            }
        }

        function validPassword(value) {
            let reg = /^[A-z0-9]{5,50}$/;
            let error_name = document.getElementById('error_password');
            if (value.match(reg)) {
                self.valid.password = true;
                applyStyle(true, error_name);
            } else {
                self.valid.password = false;
                applyStyle(false, error_name)
            }
        }

        function validConfirm(value) {
            let pass = document.getElementById('passowrd_value').value;
            let error_name = document.getElementById('error_confirm');
            if (value === pass) {
                self.valid.confirm = true;
                applyStyle(true, error_name);
            } else {
                self.valid.confirm = false;
                applyStyle(false, error_name)
            }
        }
    }

    authenticationUser() {
        let self = this;
        let span_error = document.querySelector('.login_error');
        this.loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            checkField(self.loginForm.elements);


        });

        function checkField(value) {
            if (value.name.value === '' || value.password.value === '') {
                span_error.textContent = 'fill in the field!!!';
                span_error.style.color = 'red';
            } else {
                let [name, password] = value;
                checkLogin('login=' + name.value + '&password=' + password.value, value);
            }
        }

        function checkLogin(params, value) {
            self.postRequest('auth.php', params).then(result => {
                let user_auth = JSON.parse(result);
                if (user_auth) {
                    sessionStorage.setItem('user_id', user_auth['user_id']);
                    sessionStorage.setItem('user_auth', JSON.stringify(user_auth));
                    span_error.textContent = '';
                    setTimeout(() => {
                        hideLoginForm();
                        if (user_auth['user_role'] === 'admin') {
                            window.location = '#admin/';
                        } else {
                            self.createUsersBlock();
                        }

                    }, 500);
                } else {
                    value.name.value = '';
                    value.password.value = '';
                    span_error.textContent = 'the wrong pair of username password!!!';
                    span_error.style.color = 'red';
                }
            });
        }

        function hideLoginForm() {
            let fixedFon = document.getElementById('register_position');
            let login = document.querySelector('.login');
            fixedFon.classList.remove('hide_form');
            login.classList.remove('hide_form');
        }


    }

    createUsersBlock() {
        // let parent = document.querySelector('.header_top');
        // let users_block = document.getElementById('users_block');
        if (sessionStorage.getItem('user_auth') && JSON.parse(sessionStorage.getItem('user_auth'))['user_role'] !== 'admin') {
            document.querySelector('.reg').style.display = 'none';
            document.querySelector('.log').style.display = 'block';
        } else {
            document.querySelector('.reg').style.display = 'block';
            document.querySelector('.log').style.display = 'none';
        }
    }

    logout() {
        let logout = document.getElementById('user_logout');
        logout.addEventListener('click', function () {
            sessionStorage.removeItem('user_auth');
            document.querySelector('.reg').style.display = 'block';
            document.querySelector('.log').style.display = 'none';
            window.location.href = '#shop/';
        })
    }

    showLogForm() {
        let fixedFon = document.getElementById('register_position');
        let login = document.querySelector('.login');
        fixedFon.classList.add('hide_form');
        login.classList.add('hide_form');
    }

    showAccountContent() {
        let self = this;
        let order_h = document.querySelector('.order_history_show');
        let change_contact = document.querySelector('.change_contact_form');
        let booking_order_form = document.querySelector('.booking_order_form');
        document.getElementById('acount_list').addEventListener('click', function (event) {
            if (event.target.id === 'or_hist') {
                order_h.style.display = 'block';
                change_contact.style.display = 'none';
                booking_order_form.style.display = 'none';
                let param = 'user_id=' + JSON.parse(sessionStorage.getItem('user_auth'))['user_id'];
                self.showOrderByUser(param);
            }
            if (event.target.id === 'ch_conct') {
                order_h.style.display = 'none';
                change_contact.style.display = 'block';
                booking_order_form.style.display = 'none';
            }

            if (event.target.id === 'book_or') {
                order_h.style.display = 'none';
                change_contact.style.display = 'none';
                booking_order_form.style.display = 'block';
            }
        })
    }

    showOrderByUser(param) {
        while (document.getElementById('order_list_click').firstElementChild) {
            document.getElementById('order_list_click').firstElementChild.remove();
        }
        postReq('selectOrders.php', param).then(res => {
            let orders = JSON.parse(res);
            return orders;
        }).then(res => {
            let result = '';
            res.forEach(function (el) {
                result += orders(el.id, el.time, el.delivery, el.comment);
            });
            return result;
        }).then(str => {
            document.querySelector('.order_list').insertAdjacentHTML('afterBegin', str);
        }).then(() => {

            document.getElementById('close_detali').addEventListener('click', () => {
                let ckec_detali = document.querySelector('.ckec_detali');
                ckec_detali.style.display = 'none';
            })
        });
    }

    showDetaliOrders() {
        let self = this;
        let ckec_detali = document.querySelector('.ckec_detali');
        document.getElementById('order_list_click').addEventListener('click', function (event) {
            if (event.target.hasAttribute('data-order')) {
                ckec_detali.style.display = 'block';
                let id = event.target.getAttribute('data-order');
                let param = 'id=' + id;
                postReq('getProductsOrder.php', param).then(result => {
                    self.ProductsOrderDetali(JSON.parse(result));
                })
            }

        })
    }

    ProductsOrderDetali(result) {
        while (document.querySelector('.ckec_detali_content').firstChild) {
            document.querySelector('.ckec_detali_content').firstChild.remove();
        }
        let total = document.createElement('span');
        let otal = 0;
        for (let key in result) {

            otal += Number(result[key].total);

            this.createDomProdDet('.ckec_detali_content', [result[key].img, result[key].title, result[key].price, result[key].count, result[key].total]);
        }
        total.textContent = otal.toFixed(2);
        total.className = 'total_p_order';
        document.querySelector('.ckec_detali_content').appendChild(total);

    }

    createDomProdDet(element, ...args) {
        let div = document.createElement('div');
        let img = new Image();
        img.src = 'app/img/content/small_img/' + args[0][0];
        let span = document.createElement('span');
        span.textContent = args[0][1];
        let span1 = document.createElement('span');
        span1.textContent = args[0][2];
        let span2 = document.createElement('span');
        span2.textContent = args[0][3];
        let span3 = document.createElement('span');
        span3.textContent = args[0][4];
        div.appendChild(img);
        div.appendChild(span);
        div.appendChild(span1);
        div.appendChild(span2);
        div.appendChild(span3);

        document.querySelector(element).appendChild(div);
    }

    checkFormUpdateUser() {
        let self = this;
        let flag = true;

        let user_id = JSON.parse(sessionStorage.getItem('user_auth'))['user_id'];
        let formSaveUser = document.getElementById('reg_form2');
        getUser(user_id);
        document.getElementById('reg_form2').addEventListener('input', function (event) {
            event.preventDefault();
            if (event.target.name === 'mail') {
                validMail(event.target.value);
            }
        });

        let error_name = document.getElementById('error_mail2');

        function validMail(value) {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
            if (value.match(reg)) {
                flag = true;
                applyStyle(true, error_name);
            } else {
                flag = false;
                applyStyle(false, error_name)
            }
            let mail = 'mail=' + value;
        }


        formSaveUser.addEventListener('submit', function (event) {
            event.preventDefault();
            if (flag) {
                let name = formSaveUser.elements.name.value;
                let lastname = formSaveUser.elements.lastname.value;
                let mail = formSaveUser.elements.mail.value;
                let address = formSaveUser.elements.address.value;
                let params = 'name=' + name + '&lastname=' + lastname + '&mail=' + mail + '&address=' + address + '&update=update' + '&user_id=' + user_id;
                self.postRequest('saveUsers.php', params).then(res => {
                    alert('contact details saved');
                    getUser(user_id);
                    error_name.textContent = '';
                });
            }

        });

        function getUser(user_id) {
            let param = 'user_id=' + user_id + '&select=select';
            postReq('saveUsers.php', param).then(res => {
                let data = JSON.parse(res);
                formSaveUser.elements.name.value = data.name;
                formSaveUser.elements.lastname.value = data.lastname;
                formSaveUser.elements.mail.value = data.mail;
                formSaveUser.elements.address.value = data.address;
            })
        }
    }

    bookingOrder() {
        let self = this;
        let user_id = JSON.parse(sessionStorage.getItem('user_auth'))['user_id'];
        let bookOrder = document.getElementById('book_or');
        let param = 'user_id=' + user_id + '&select=select';
        bookOrder.addEventListener('click', () => {
            while (document.querySelector('.orders_book').firstChild) {
                document.querySelector('.orders_book').firstChild.remove();
            }
            postReq('reserveOrderUserPay.php', param).then(res => {
                if (res === 'no') {
                    document.querySelector('.orders_book').innerHTML = '<h2>No reserved orders</h2>';
                } else {
                    let result = JSON.parse(res);
                    for (let key in result) {
                        self.createDomProdDet('.orders_book', [result[key].img, result[key].title, result[key].price, result[key].count, result[key].total])
                    }
                }
            })
        })
    }

    createBookingElements() {
        let btnPay = document.createElement('button');
        let btnRemove = document.createElement('button');
        btnPay.className = 'btnPay';
        btnPay.id = 'btnPay';
        btnPay.textContent = 'pay order';
        btnRemove.className = 'btnRemove';
        btnRemove.id = 'btnRemove';
        btnRemove.textContent = 'delete order';
        document.querySelector('.orders_btn').appendChild(btnPay);
        document.querySelector('.orders_btn').appendChild(btnRemove);
    }
}


let user = new Users();

