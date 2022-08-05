export class View {
  //   constructor() {}
  drawHeaderBtn() {
    return `
      <header class="header-btn">
          <button class="header-btn__garage btn">To Garage</button>
          <button class="header-btn__winners btn">To Winners</button>
      </header>`
  }

  drawFooterBtn() {
    return `
      <footer class="footer-btn">
          <button class="footer-btn__prev btn">prev</button>
          <button class="footer-btn__next btn">next</button>
      </footer>`
  }

}
