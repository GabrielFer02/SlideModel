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
    return this.dist.finalPosition - this.dist.movement;
  }

  onMove(event) {
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onStart(event) {
    let moveType;
    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      moveType = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      moveType = "touchmove";
    }

    this.slideContainer.addEventListener(moveType, this.onMove);
  }

  onEnd(event) {
    const moveType = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.slideContainer.removeEventListener(moveType, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
  }

  addSlideEvents() {
    this.slideContainer.addEventListener("mousedown", this.onStart);
    this.slideContainer.addEventListener("touchstart", this.onStart);
    this.slideContainer.addEventListener("mouseup", this.onEnd);
    this.slideContainer.addEventListener("touchend", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  slidePosition(element) {
    const margin = (this.slideContainer.offsetWidth - element.offsetWidth) / 2;
    return -(element.offsetLeft - margin);
  }

  slideConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      return {
        position: this.slidePosition(element),
        element: element,
      };
    });
    console.log(this.slideArray);
  }

  slidesIndesNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      previous: index ? index - 1 : null,
      active: index,
      next: index === last ? null : index + 1,
    };
  }

  changeSlide(index) {
    this.moveSlide(this.slideArray[index].position);
    this.slidesIndesNav(index);
    this.dist.finalPosition = this.slideArray[index].position;
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    this.slideConfig();
    return this;
  }
}
