export default class Slide {
  constructor(slideContainer, slide) {
    this.slideContainer = document.querySelector(slideContainer);
    this.slide = document.querySelector(slide);
  }

  onMove(event) {
    console.log("moveu");
  }

  onStart(event) {
    event.preventDefault();
    console.log("mousedown");
    this.slideContainer.addEventListener("mousemove", this.onMove);
  }

  onEnd(event) {
    console.log("acabou");
    this.slideContainer.removeEventListener("mousemove", this.onMove);
  }

  addSlideEvents() {
    this.slideContainer.addEventListener("mousedown", this.onStart);
    this.slideContainer.addEventListener("mouseup", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}
