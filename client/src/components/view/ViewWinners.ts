import { StatusPage } from "../../type/type";
import { ViewGarage } from "./viewGarage";

export class ViewWinners extends ViewGarage {
  public drawWinners(data: StatusPage): string {
    return `
    <section class="to-winners" style = "display: none">
      ${this.drawListWin(data)}
    </section>`;
  }

  public drawListWin(data: StatusPage): string {
    return `
    <h1 class="title-main">Garage(${data.winnersCount})</h1>
    <h2 class="title-page">Page #${data.winnersPage}</h2>
    <table class="table">
    <thead>
        <th>Number</th>
        <th>Car</th>
        <th>Name</th>
        <th class="th-btn th-wins ${
          data.sortBy === "wins" ? data.sortOrder : ""
        }">Wins</th>
        <th class="th-btn th-time ${
          data.sortBy === "time" ? data.sortOrder : ""
        }">Best time (seconds)</th>
    </thead>
      <tbody>
        ${data.winners
          .map(
            (winner, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${this.darwImage(winner.car.color)}</td>
            <td>${winner.car.name}</td>
            <td>${winner.wins}</td>
            <td>${winner.time}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    `;
  }
}
