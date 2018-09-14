'use strict';
class Slider {
    constructor() {
        this.sliderContainer = document.getElementById('slider');
        this.slideItems = document.querySelectorAll('.slider-items');
        this.dots = document.querySelectorAll('.dots');
        this.curentSlide = 0;
        this.next = '';
        this.prev = '';
        let self = this;
        this.getPrevAndNext(1);
        document.querySelector('.next').addEventListener('click',function (e) {
            e.preventDefault();
            self.getPrevAndNext(1);

        });
        document.querySelector('.prev').addEventListener('click',function (e) {
            e.preventDefault();
            self.getPrevAndNext(-1);

        })
    }


    getPrevAndNext(n) {
        this.curentSlide += n;
        if(this.curentSlide > this.slideItems.length-1){
            this.curentSlide = 0;
        }
        if(this.curentSlide < 0){
            this.curentSlide = this.slideItems.length-1;
        }


        if (this.curentSlide == 0) {
            this.prev = this.slideItems.length - 1;
            this.next = this.curentSlide + 1;
        }
        else if (this.curentSlide == this.slideItems.length - 1) {
            this.next = 0;
            this.prev = this.curentSlide - 1;
        }
        else {
            this.next = this.curentSlide + 1;
            this.prev = this.curentSlide - 1;
        }
         this.addClass();
    }

    addClass() {
        for (let i = 0; i < this.slideItems.length; i++) {
            if (i == this.curentSlide) {
                this.slideItems[i].classList.remove();
                this.slideItems[i].className = 'slider-items current_slide';
            }
            else if (i == this.prev) {
                this.slideItems[i].classList.remove();
                this.slideItems[i].className ='slider-items prev_slide';
            }else if (i == this.next) {
                this.slideItems[i].classList.remove();
                this.slideItems[i].className ='slider-items nex_slide';
            }else {
                this.slideItems[i].classList.remove();
                this.slideItems[i].className ='hide_block';
            }
        }
    }
}


