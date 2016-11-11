var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, Input, Renderer, NgZone } from '@angular/core';
import { StatusBar } from 'ionic-native';
import { Content } from 'ionic-angular';
export var Shrinkage = (function () {
    function Shrinkage(el, renderer, 
        // private platform: Platform,
        zone) {
        this.el = el;
        this.renderer = renderer;
        this.zone = zone;
        this.lastScrollTop = 0;
        this.lastHeaderTop = 0;
        this.showAtTop = 0;
        // I'm using this because I don't know when the different platforms decide
        // if StatusBar.isVisible is true/false; is it immediate or after animation?
        // It also prevents ongoing console warnings about Cordova.
        this.isStatusBarShowing = true;
        this.pauseForBarAnimation = false;
        this.pauseForBarDuration = 500;
        // private savedConDim;
        // render vars so we aren't scoping new ones each time
        this.scrollTop = 0;
        this.contentHeight = 0;
        this.scrollHeight = 0;
        this.scrollChange = 0;
        this.lastTopFloored = 0;
        /**
         * TODO: Make this parallax value a set-able directive?
         *
         * showParallaxFactor is the rate at which the header comes back into view.
         * Then there's a hideParallaxFactor (which is always a slower rate).
         * This guarantees that, even with whatever rounding that might happen, the
         * header will be able to come completely back into view.
         *
         * But from a UX standpoint, showing the header (and other controls) is a
         * more important end than hiding them; hiding them is a bonus to have
         * more screen real estate, but showing them is a necessity to interact with
         * the app. Bringing back the controls into view might be the specific purpose
         * of the scroll action. A quicker show animation addresses this,
         * while keeping a more gradual, puroposful, and noticeable hiding animation.
         */
        this.showParallaxFactor = 0.7;
        this.hideParallaxFactor = this.showParallaxFactor * 0.6;
    }
    Shrinkage.prototype.ngAfterViewInit = function () {
        var _this = this;
        // Call to init values.
        this.resize();
        // Kick of rendering
        this.render(null);
        // console.log("ngAfterViewInit in Directive");
        // This listener only updates values. It doesn't do any rendering.
        this.content.addScrollListener(function (event) {
            _this.onPageScroll(event);
        });
        // TODO: When I look at doing footers & toolbars, grab the localName to see
        // what it is and move it accordingly.
        // console.log("this ne", this.el.nativeElement.localName);
        // console.log("this in ngAfterViewInit", this);
        // this.content.onScrollEnd((event)=>{this.onEnd(event)});
    };
    Shrinkage.prototype.ngOnDestroy = function () {
        // I expected a removeScrollListenter method on content.
        // Maybe it cleans up after itself.
        // cancelAnimationFrame(this.rAFInt);
    };
    Shrinkage.prototype.resize = function () {
        // clientHeight and offsetHeight ignore bottom shadow in measurment
        this.headerHeight = this.el.nativeElement.scrollHeight;
        // this.savedConDim = this.content.getContentDimensions();
        // console.log(`savedConDim`, this.savedConDim);
        // setTimeout(() => {
        //   this.savedConDim = this.content.getContentDimensions();
        //   console.log(`savedConDim2`, this.savedConDim);
        // }, 500);
        // console.info(`resized: new height = `, this.headerHeight);
        this.showAtTop = this.headerHeight / this.showParallaxFactor;
        // TODO
        // This is a workaround, so that a second header gets completely hidden
        // Introduce global variable or sth which counts the heights.
        if (!this.showAlways)
            this.headerHeight += 56;
    };
    Shrinkage.prototype.render = function (ts) {
        // Need a better example of doing this with a zone. This doesn't appear to
        // improve things. Maybe we'll get some magic improvments with Beta.12.
        // this.zone.runOutsideAngular(() => {
        //   requestAnimationFrame(this.move.bind(this));
        // });
        var _this = this;
        // requestAnimationFrame(this.move.bind(this));
        // windo.rAF seems the same
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
    // private onEnd(event){
    //   console.log("end?");
    //   // If this worked, I could start an interval here for momemtum. This isn't
    //   // an issue on WK, only UI. Follow this bug if I care about fixing for UI:
    //   // https://github.com/driftyco/ionic/issues/5549
    // }
    Shrinkage.prototype.onPageScroll = function (event) {
        // console.log(`e`, event.target.scrollTop);
        this.scrollTop = event.target.scrollTop;
        // This might not work and still might have to use savedConDim bc
        // clientHeight might not account for ionic footers and such.
        this.contentHeight = event.clientHeight;
        this.scrollHeight = event.scrollHeight;
    };
    Shrinkage.prototype.calculateRender = function (timestamp) {
        var _this = this;
        // Gotta be > 0 otherwise we aren't scrolling yet, or are rubberbanding.
        // If scrollTop and lastScrollTop are the same, we've stopped scrolling
        // and no need for calculations
        if (this.scrollTop >= 0 && this.scrollTop !== this.lastScrollTop) {
            // Obvious
            this.scrollChange = this.scrollTop - this.lastScrollTop;
            // Update for next loop
            this.lastScrollTop = this.scrollTop;
            // This is whether we are rubberbanding past the bottom
            this.pastBottom = this.contentHeight + this.scrollTop > this.scrollHeight;
            // GOING UP
            if (this.scrollChange > 0) {
                if (this.isStatusBarShowing && !this.pauseForBarAnimation) {
                    // StatusBar.isVisible
                    this.isStatusBarShowing = false;
                    StatusBar.hide();
                }
                // Shrink the header with the slower hideParallaxFactor
                this.lastHeaderTop += (this.scrollChange * this.hideParallaxFactor);
                // The header only moves offscreen as far as it is tall. That leaves
                // it ready to immediately scroll back when needed.
                if (this.lastHeaderTop >= this.headerHeight) {
                    this.lastHeaderTop = this.headerHeight;
                }
            }
            else if (this.scrollChange < 0 && !this.pastBottom) {
                /**
                 * The combination of scrollChange < 0 && !pastBottom has to do with
                 * the return movement of the rubberbanding effect after you've scrolled
                 * all the way to the bottom (UP), and after releasing the elastic
                 * is bringing it back down. This allows you to reach the bottom, and
                 * push the header away without it sneaking back.
                 */
                if (this.showAlways || this.scrollTop <= this.showAtTop) {
                    // Is 40 the right height (for iOS)? If it shows too early it looks weird.
                    // When animation is available, it will look better too.
                    if (!this.isStatusBarShowing && this.showingHeight > 40) {
                        // !StatusBar.isVisible
                        if (!this.pauseForBarAnimation) {
                            this.pauseForBarAnimation = true;
                            this.isStatusBarShowing = true;
                            StatusBar.show();
                            setTimeout(function () {
                                _this.pauseForBarAnimation = false;
                            }, this.pauseForBarDuration);
                        }
                    }
                    // Reveal the header with the faster showParallaxFactor
                    this.lastHeaderTop += (this.scrollChange * this.showParallaxFactor);
                    // The header can't go past (greater) zero. We should never see any
                    // gaps above the header, even when rubberbanding.
                    if (this.lastHeaderTop <= 0) {
                        this.lastHeaderTop = 0;
                    }
                }
            }
            else {
                // prevented by scrollTop !== lastScrollTop above, shouldn't happen
                console.log("going NOWHERE", this.scrollChange, this.scrollTop);
            }
            // Use floor to prevent line flicker between ion-navbar & ion-toolbar.
            // this.lastTopFloored = Math.floor(this.lastHeaderTop);
            // Double tilde is a bitwize version of floor that is a touch faster:
            // https://youtu.be/O39OEPC20GM?t=859
            this.lastTopFloored = ~~this.lastHeaderTop;
            // this.renderer.setElementStyle(this.el.nativeElement, 'transform', `translateY(${-lastTopFloored}px)`);
            // this.el.nativeElement.style.transform = `translate3d(0, ${-this.lastTopFloored}px ,0)`;
            this.renderer.setElementStyle(this.el.nativeElement, 'transform', "translate3d(0, " + -this.lastTopFloored + "px ,0)");
        }
        else {
        }
    };
    __decorate([
        Input('shrinkage'), 
        __metadata('design:type', Content)
    ], Shrinkage.prototype, "content", void 0);
    __decorate([
        Input('showAlways'), 
        __metadata('design:type', Boolean)
    ], Shrinkage.prototype, "showAlways", void 0);
    Shrinkage = __decorate([
        Directive({
            selector: '[shrinkage]'
        }), 
        __metadata('design:paramtypes', [ElementRef, Renderer, NgZone])
    ], Shrinkage);
    return Shrinkage;
}());
