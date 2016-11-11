import { ElementRef, Renderer, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { Content } from 'ionic-angular';
export declare class Shrinkage implements AfterViewInit, OnDestroy {
    private el;
    private renderer;
    private zone;
    private headerHeight;
    private lastScrollTop;
    private lastHeaderTop;
    private showAtTop;
    private isStatusBarShowing;
    private pauseForBarAnimation;
    private pauseForBarDuration;
    private pauseForBarTimeout;
    private scrollTop;
    private contentHeight;
    private scrollHeight;
    private scrollChange;
    private pastBottom;
    private lastTopFloored;
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
    private showParallaxFactor;
    private hideParallaxFactor;
    content: Content;
    showAlways: boolean;
    constructor(el: ElementRef, renderer: Renderer, zone: NgZone);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    resize(): void;
    render(ts: number): void;
    readonly showingHeight: number;
    private onPageScroll(event);
    calculateRender(timestamp: number): void;
}
