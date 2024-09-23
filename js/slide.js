export default class Slide {
  constructor(slideContainer, slide) {
    this.slideContainer = document.querySelector(slideContainer);
    this.slide = document.querySelector(slide);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.2;
    return  this.dist.finalPosition - this.dist.movement;
  }

  onMove(event) {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }

  onStart(event) {
    event.preventDefault();
    this.dist.startX = event.clientX;
    this.slideContainer.addEventListener("mousemove", this.onMove);
  }

  onEnd(event) {
    this.slideContainer.removeEventListener("mousemove", this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
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
