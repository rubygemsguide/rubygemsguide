import { Controller } from "stimulus@3.2.2"

export default class extends Controller {

  static targets = ["item"]

  initialize() {
    this.itemTargets.forEach(item => {
      if (item.classList.contains("active")) {
        item.scrollIntoView()
      }
    });
    this.element.style.visibility = "visible"
  }

}
