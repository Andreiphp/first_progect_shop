class Auth {
    constructor() {
        setInterval(()=>{
            this.checkToken()
        },20000);

        let date = localStorage.getItem('reserve');
        if (date) {
            let cart = new Cart();
           cart.initializeClock('clockdiv', date);
        }
    }


    ajaxRequest(url) {
        let token = JSON.parse(sessionStorage.getItem('user_auth'));
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.setRequestHeader("X-Authorization", token.user_token);
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

    checkToken() {
         if (sessionStorage.getItem('user_auth')) {
             let getAuth = 'auth=' + true;
             this.ajaxRequest('auth.php?' + getAuth).then(result => {
                 if (result) {

                 } else {
                     sessionStorage.removeItem('user_auth');
                     document.querySelector('.reg').style.display = 'block';
                     document.querySelector('.log').style.display = 'none';
                     user.showLogForm();
                     window.location = '#shop/';
                 }
             })
         }
     }

}

let auth = new Auth();