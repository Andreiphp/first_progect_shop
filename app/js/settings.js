'use strict';

if (!localStorage.getItem('sort')) {
    let sort_obj = {
        title: 'Default sorting',
        param: 'default'
    };
    localStorage.setItem('sort', JSON.stringify(sort_obj));
}


if (!localStorage.getItem('layout')) {
    let position = 'main';
    localStorage.setItem('layout', JSON.stringify(position));
    document.getElementById('main').classList.add('active_tmp');
}
