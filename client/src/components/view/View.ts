import { ViewGarage } from "./viewGarage";
import { ViewWinners } from "./viewWinners";
import { Data } from "../../type/type";

export class View {
  garage: ViewGarage;

  winners: ViewWinners;

  constructor() {
    this.garage = new ViewGarage();
    this.winners = new ViewWinners();
  }

  drawFullPage(data: Data) {
    document.body.innerHTML = "";
    return (
      this.drawHeaderBtn() +
      this.garage.drawMain(data) +
      this.winners.drawWinners(data) +
      this.drawFooterBtn()
    );
  }

  drawPageGarage(data: Data) {
    const garageWrapper = document.querySelector(
      ".garage-wrapper"
    ) as HTMLElement;
    garageWrapper.innerHTML = this.garage.drawGarage(data);
  }

  drawHeaderBtn() {
    return `
      <header class="header-btn">
          <button class="header-btn btn" data-page = "garage">To Garage</button>
          <button class="header-btn btn" data-page = "winners">To Winners</button>
      </header>`;
  }

  drawFooterBtn() {
    return `
      <footer class="footer-btn">
          <button class="footer-btn__prev btn">prev</button>
          <button class="footer-btn__next btn">next</button>
      </footer>`;
  }
}
