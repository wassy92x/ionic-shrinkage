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
    private showParallaxFactor;
    private hideParallaxFactor;
    content: Content;
    showAlways: boolean;
    constructor(el: ElementRef, renderer: Renderer, zone: NgZone);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    resize(): void;
    render(ts: any): void;
    readonly showingHeight: number;
    private onPageScroll(event);
    calculateRender(timestamp: any): void;
}
