import debounce from "./debounce.js";

export class Slide {
  constructor(slideContainer, slide) {
    this.slideContainer = document.querySelector(slideContainer);
    this.slide = document.querySelector(slide);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
    };
    this.activeClass = "ativo";
    this.changeEvent = new Event("changeEvent");
  }

  transition(active) {
    this.slide.style.transition = active ? "transform 0.3s" : "";
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

    this.transition(false);
    this.slideContainer.addEventListener(moveType, this.onMove);
  }

  onEnd(event) {
    const moveType = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.slideContainer.removeEventListener(moveType, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== null) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.previous !== null) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvents() {
    this.slideContainer.addEventListener("mousedown", this.onStart);
    this.slideContainer.addEventListener("touchstart", this.onStart);
    this.slideContainer.addEventListener("mouseup", this.onEnd);
    this.slideContainer.addEventListener("touchend", this.onEnd);
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
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      previous: index ? index - 1 : null,
      active: index,
      next: index === last ? null : index + 1,
    };
  }

  changeSlide(index) {
    this.moveSlide(this.slideArray[index].position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = this.slideArray[index].position;
    this.changeActiveClass();
    this.slideContainer.dispatchEvent(this.changeEvent);
  }

  changeActiveClass() {
    this.slideArray.forEach((item) => {
      item.element.classList.remove(this.activeClass);
    });
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  activePrevSlide() {
    if (this.index.previous !== null) {
      this.changeSlide(this.index.previous);
    }
  }

  activeNextSlide() {
    if (this.index.next !== null) {
      this.changeSlide(this.index.next);
    }
  }

  onResize() {
    setTimeout(() => {
      this.slideConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }

  addResizeEvent() {
    window.addEventListener("resize", debounce(this.onResize, 200));
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = this.onResize.bind(this);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slideConfig();
    this.addResizeEvent();
    this.changeSlide(0);
    return this;
  }
}

export default class SlideNav extends Slide {
  constructor(slideContainer, slide) {
    super(slideContainer, slide);
    this.bindControlEvents();
  }

  addArrow(prev, next) {
    this.prev = document.querySelector(prev);
    this.next = document.querySelector(next);

    this.addArrowEvent();
  }

  addArrowEvent() {
    this.prev.addEventListener("click", this.activePrevSlide);
    this.next.addEventListener("click", this.activeNextSlide);
  }

  createControl() {
    const control = document.createElement("ul");
    control.dataset.control = "slide";
    this.slideArray.forEach((item, index) => {
      control.innerHTML =
        control.innerHTML +
        `<li><a href="#index${index + 1}">${index + 1}</a></li>`;
    });
    this.slideContainer.appendChild(control);

    return control;
  }

  eventControl(item, index) {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      this.changeSlide(index);
    });

    this.slideContainer.addEventListener(
      "changeEvent",
      this.addActiveControlItem
    );
  }

  addActiveControlItem() {
    this.controlArray.forEach((item) => {
      item.classList.remove(this.activeClass);
    });
    this.controlArray[this.index.active].classList.add(this.activeClass);
  }

  addControl(customControl) {
    this.control =
      document.querySelector(customControl) || this.createControl();
    this.controlArray = [...this.control.children];

    this.addActiveControlItem();

    this.controlArray.forEach((item, index) => {
      this.eventControl(item, index);
    });
  }

  bindControlEvents() {
    this.eventControl = this.eventControl.bind(this);
    this.addActiveControlItem = this.addActiveControlItem.bind(this);
  }
}
