import { ViewGarage } from "./viewGarage";
import { ViewWinners } from "./viewWinners";
import { StatusPage } from "../../type/type";

export class View {
  private garage: ViewGarage;

  private winners: ViewWinners;

  constructor() {
    this.garage = new ViewGarage();
    this.winners = new ViewWinners();
  }

  public drawFullPage(data: StatusPage): string {
    document.body.innerHTML = "";
    return (
      this.drawHeaderBtn() +
      this.garage.drawMain(data) +
      this.winners.drawWinners(data) +
      this.drawFooterBtn()
    );
  }

  public drawPage(data: StatusPage): void {
    if (data.view === "garage") {
      const garageWrapper = document.querySelector(
        ".garage-wrapper"
      ) as HTMLElement;
      garageWrapper.innerHTML = this.garage.drawGarage(data);
    } else {
      const winnersWrapper = document.querySelector(
        ".to-winners"
      ) as HTMLElement;
      winnersWrapper.innerHTML = this.winners.drawListWin(data);
    }
  }

  public drawHeaderBtn(): string {
    return `
      <header class="header-btn">
          <button class="header-btn btn" data-page = "garage">To Garage</button>
          <button class="header-btn btn" data-page = "winners">To Winners</button>
      </header>`;
  }

  public drawFooterBtn(): string {
    return `
      <footer class="footer-btn">
          <button class="footer-btn__prev btn">prev</button>
          <button class="footer-btn__next btn">next</button>
      </footer>`;
  }
}
