import { Controller } from "stimulus@3.2.2"

export default class extends Controller {

  static targets = ["tab", "body"]

  switchTab(event) {
    const currentTab = event.currentTarget
    const index = currentTab.dataset.index

    this.tabTargets.forEach((tab) => {
      if (tab.dataset.index === index) {
        tab.classList.add("active")
      } else {
        tab.classList.remove("active")
      }
    })

    this.bodyTargets.forEach((body) => {
      if (body.dataset.index === index) {
        body.classList.add("active")
      } else {
        body.classList.remove("active")
      }
    })
  }

}