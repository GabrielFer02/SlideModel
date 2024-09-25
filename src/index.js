import Slide from "../js/slide.js";

const slide = new Slide(".slide-container", ".slide");
slide.init();

slide.changeSlide(3);
slide.activePrevSlide();