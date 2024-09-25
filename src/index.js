import {SlideNav} from "../js/slide.js";

const slide = new SlideNav(".slide-container", ".slide");
slide.init();
slide.addArrow(".prev", ".next");
slide.addControl();