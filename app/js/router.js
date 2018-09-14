'use strict';

class Router {
    constructor(routers) {
        this.routers = routers;
        this.query = '([a-zA-Z]{1,10}(?:-?[a-zA-Z])*)\/?';
        this.page = '([0-9]{1,})\/?';
        this.flag = false;
        this.matchesRoots();
        let self = this;
        window.addEventListener('hashchange', function (e) {
            e.preventDefault();
            self.matchesRoots();
        });
        window.history.pushState(null, null, window.location.hash);
    }

    matchesRoots() {
        this.url = window.location.hash.slice(1);
        this.count = 0;
        this.fall = 0;
        let matches = [];
        for (let key in this.routers.roots) {
            let reg = this.getRegular(key);
            if (reg.test(this.url)) {
                matches = this.url.match(reg);
                this.funcMatches(this.routers.roots[key], matches);
            } else {
                this.fall++;
            }
            this.count++;
        }
        if (this.fall === this.count) {
            this.routers['error'].apply(null);
        }
    }

    getRegular(key) {
        let str = key.replace(/:query/g, this.query);
        str = str.replace(/:page/g, this.page);
        let strReg = '^' + str + '$';
        let regEx = new RegExp(strReg);

        return regEx;
    }

    funcMatches(key, matches) {
        if (matches.length > 1) {
            this.routers[key].apply(null, matches);
        } else {
            this.routers[key].apply(null);
        }
    }
}
