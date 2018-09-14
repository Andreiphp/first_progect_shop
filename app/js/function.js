'use strict';

function ElementProduct(id, name, img, price) {
    let one_product = "<div class='product'>"
        + "<a class='prod_link' href='#shop/product/" + id + "' id=" + id + "> "
        + "<img class='product_img' data-image=" + id + " src='app/img/content/small_img/" + img + "'></a>"
        + "<span class='product_title'><a class='prod_link' href='#shop/product/" + id + "' id=" + id + "> " + name + "</a></span>"
        + "<div class='min_description'>To build lean muscle, you obviously need to train hard, apply yourself, and have good nutrition, but the most important part of any muscle-building nutrition program is protein… High-quality protein!</div>"
        + "<span class='add_to_cart'><button class='cart' id=" + id + ">ADD TO CART</button></span>"
        + "<span class='product_price'>" + '$' + +price + "</span></div>";
    return one_product;
}


function subCategories(id, title, img) {
    let sub_cat = "<div class='goals_items'><a href='#shop/sub_categories/" + title + "'>"
        + "<img class='' src='app/img/" + img + "'>"
        + "<span class='goals_bacg'></span>"
        + "<span class='goals_bacg_title'>" + title + "</span></a></div>";
    return sub_cat;
}

function adminProducts2(id, img, title, price, count) {
    let tr = document.createElement('tr');
    let steps = 1000 / (1000 / 50);
    let op = 0;
    let d0 = 1 / steps;
    let set = setInterval(() => {
        op += d0;
        tr.style.opacity = op;
        steps--;
        if (steps <=0) {
            clearInterval(set);
        }
    }, 20);

    tr.id = id;
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');
    let td6 = document.createElement('td');
    let button1 = document.createElement('button');
    let button2 = document.createElement('button');
    button1.textContent = 'Edit';
    button2.textContent = 'Delete';
    button1.setAttribute('data-edit',id);

    button2.setAttribute('data-delite',id);
    td5.appendChild(button1);
    td6.appendChild(button2);
    let image = new Image();
    image.src = '/app/img/content/small_img/' + img;
    td1.appendChild(image);
    td2.textContent = title;
    td3.textContent = price;
    td4.textContent = count;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);

    return tr;

}

// function adminProducts(id, img, title, price, count) {
//     let res = "<tr id=" + id + ">"
//         + "<td><img src='/app/img/content/small_img/" + img + "'></td>"
//         + "<td>" + title + "</td>"
//         + "<td> " + price + " </td>"
//         + "<td> " + count + "</td>"
//         + "<td><button data-edit=" + id + ">edit</button> </td>"
//         + "<td><button data-delite=" + id + ">delite</button> </td></tr>";
//     return res;
// }

function orders(id, time, comment, delivery) {
    let orders = "<tr> <td>" + id + "</td>"
        + "<td>" + time + "</td>"
        + "<td> " + comment + " </td>"
        + "<td> " + delivery + "</td>"
        + "<td><button data-order=" + id + ">check</button> </td></tr>";
    return orders;
}

function applyStyle(bool, error_name) {
    if (bool) {
        error_name.textContent = 'valid';
        error_name.style.color = 'green';
    } else {
        error_name.textContent = 'not valid';
        error_name.style.color = 'red';
    }
}

function createTableProducts(products) {
    let result = '';
    let tableProducts = document.querySelector('.admin_products');
    products.forEach(el => {
        result = adminProducts2(el.id, el.img, el.title, el.price, el.count);
        tableProducts.appendChild(result);
    });


}

function postReq(url, params) {
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

