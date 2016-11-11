"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_native_1 = require('ionic-native');
var ionic_angular_1 = require('ionic-angular');
var Shrinkage = (function () {
    function Shrinkage(el, renderer, zone) {
        this.el = el;
        this.renderer = renderer;
        this.zone = zone;
        this.lastScrollTop = 0;
        this.lastHeaderTop = 0;
        this.showAtTop = 0;
        this.isStatusBarShowing = true;
        this.pauseForBarAnimation = false;
        this.pauseForBarDuration = 500;
        this.scrollTop = 0;
        this.contentHeight = 0;
        this.scrollHeight = 0;
        this.scrollChange = 0;
        this.lastTopFloored = 0;
        this.showParallaxFactor = 0.7;
        this.hideParallaxFactor = this.showParallaxFactor * 0.6;
    }
    Shrinkage.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.resize();
        this.render(null);
        this.content.addScrollListener(function (event) {
            _this.onPageScroll(event);
        });
    };
    Shrinkage.prototype.ngOnDestroy = function () {
    };
    Shrinkage.prototype.resize = function () {
        this.headerHeight = this.el.nativeElement.scrollHeight;
        this.showAtTop = this.headerHeight / this.showParallaxFactor;
        if (!this.showAlways)
            this.headerHeight += 56;
    };
    Shrinkage.prototype.render = function (ts) {
        var _this = this;
        requestAnimationFrame(function (ts) { return _this.render(ts); });
        this.calculateRender(ts);
    };
    Object.defineProperty(Shrinkage.prototype, "showingHeight", {
        get: function () {
            return this.headerHeight - this.lastHeaderTop;
        },
        enumerable: true,
        configurable: true
    });
    Shrinkage.prototype.onPageScroll = function (event) {
        this.scrollTop = event.target.scrollTop;
        this.contentHeight = event.clientHeight;
        this.scrollHeight = event.scrollHeight;
    };
    Shrinkage.prototype.calculateRender = function (timestamp) {
        var _this = this;
        if (this.scrollTop >= 0 && this.scrollTop !== this.lastScrollTop) {
            this.scrollChange = this.scrollTop - this.lastScrollTop;
            this.lastScrollTop = this.scrollTop;
            this.pastBottom = this.contentHeight + this.scrollTop > this.scrollHeight;
            if (this.scrollChange > 0) {
                if (this.isStatusBarShowing && !this.pauseForBarAnimation) {
                    this.isStatusBarShowing = false;
                    ionic_native_1.StatusBar.hide();
                }
                this.lastHeaderTop += (this.scrollChange * this.hideParallaxFactor);
                if (this.lastHeaderTop >= this.headerHeight) {
                    this.lastHeaderTop = this.headerHeight;
                }
            }
            else if (this.scrollChange < 0 && !this.pastBottom) {
                if (this.showAlways || this.scrollTop <= this.showAtTop) {
                    if (!this.isStatusBarShowing && this.showingHeight > 40) {
                        if (!this.pauseForBarAnimation) {
                            this.pauseForBarAnimation = true;
                            this.isStatusBarShowing = true;
                            ionic_native_1.StatusBar.show();
                            setTimeout(function () {
                                _this.pauseForBarAnimation = false;
                            }, this.pauseForBarDuration);
                        }
                    }
                }
                this.lastHeaderTop += (this.scrollChange * this.showParallaxFactor);
                if (this.lastHeaderTop <= 0) {
                    this.lastHeaderTop = 0;
                }
            }
            else {
                console.log("going NOWHERE", this.scrollChange, this.scrollTop);
            }
            this.lastTopFloored = ~~this.lastHeaderTop;
            this.renderer.setElementStyle(this.el.nativeElement, 'transform', "translate3d(0, " + -this.lastTopFloored + "px ,0)");
        }
        else {
        }
    };
    __decorate([
        core_1.Input('shrinkage'), 
        __metadata('design:type', ionic_angular_1.Content)
    ], Shrinkage.prototype, "content", void 0);
    __decorate([
        core_1.Input('showAlways'), 
        __metadata('design:type', Boolean)
    ], Shrinkage.prototype, "showAlways", void 0);
    Shrinkage = __decorate([
        core_1.Directive({
            selector: '[shrinkage]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer, core_1.NgZone])
    ], Shrinkage);
    return Shrinkage;
}());
exports.Shrinkage = Shrinkage;
//# sourceMappingURL=shrinkage.directive.js.map