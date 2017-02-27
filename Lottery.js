/**
 * Created by LiH on 2017/2/26.
 *
 **/
var Lottery = function (setting) {
    return new Lottery.prototype.init(setting);
};

Lottery.prototype={
    init:function (setting) {
        if(!setting || !setting.selector){
            console.error('setting不对');
            return false
        }

        this.target = document.querySelector(setting.selector);
        this.BgImg = setting.BgImg || 'durex.jpg';
        this.radius = setting.radius || 30;
        this.targetPersent = setting.targetPersent || 80;
        this.draw = false;
    },
    addMask:function (width, height) {
        this.mask = document.createElement('canvas');

        this.mask.setAttribute('width',width);
        this.mask.setAttribute('height',height);
        this.mask.setAttribute('style',"position:absolute;top : 0;left : 0;");

        this.maskCont = this.mask.getContext('2d');
        this.maskCont.fillStyle = '#aaa';
        this.maskCont.fillRect(0,0,width,height);
        this.maskCont.globalCompositeOperation = 'destination-out';

        this.target.insertBefore(this.mask, this.target.firstChild);
    },
    addImg:function () {
        var img = new Image(),_this=this;

        img.onload=function () {
            _this.width = img.width;
            _this.height = img.height;
            _this.target.insertBefore(img, _this.target.firstChild);
            _this.addMask(_this.width, _this.height);
            _this.addEventListener();
        };

        img.src = this.BgImg;
    },
    getTransparentPercent: function () {
        var pixels = this.maskCont.getImageData(0, 0, this.height, this.height).data,
            transPixels = 0;

        for (var i = 0, j = pixels.length; i < j; i += 4) {
            var pixel = pixels[i + 3];
            if (pixel < 128) {
                ++transPixels;
            }
        }
        return (transPixels / (pixels.length / 4) * 100).toFixed(2);
    },
    addEventListener:function () {
        var _this=this;

        var drawPoint = function (e) {
            if(!_this.draw)return false;

            var x = (e.clientX?e.clientX:e.touches[0].clientX) - (_this.target.getBoundingClientRect().left + document.documentElement.scrollLeft),
                y = (e.clientX?e.clientY:e.touches[0].clientY) - (_this.target.getBoundingClientRect().top + document.documentElement.scrollTop);

            _this.drawPoint(x,y,_this.radius);
        };

        this.mask.addEventListener('mousemove', drawPoint);
        this.mask.addEventListener('touchmove', drawPoint);

        var stopDrawing = function () {
            _this.draw = false;

            console.log(_this.getTransparentPercent());
            if(_this.getTransparentPercent()>_this.targetPersent){
                _this.mask.style.display = 'none';
            }
        };
        var startDrawing = function () {
            _this.draw = true;
        };
        this.mask.addEventListener('mouseup', stopDrawing);
        this.mask.addEventListener('touchend', stopDrawing);
        this.mask.addEventListener('mouseout', stopDrawing);

        this.mask.addEventListener('mousedown', startDrawing);
        this.mask.addEventListener('touchstart', startDrawing);
    },
    drawPoint:function (x,y,radius) {
        this.maskCont.beginPath();
        this.maskCont.fillStyle = 'rgb(0,0,0)';
        this.maskCont.arc(x,y,radius,0,2*Math.PI);
        this.maskCont.fill();
    }
};

Lottery.prototype.init.prototype = Lottery.prototype;

Lottery({selector:'body',radius: 20,targetPersent: 90}).addImg();