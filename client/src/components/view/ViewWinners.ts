import { Data } from "../../type/type";

export class ViewWinners {
  drawWinners(data: Data) {
    return `
        <main class="main">
        <h1 class="title-main">Garage(${data.winnersCount})</h1>
        <h2 class="title-page">Page #${data.winnersPage}</h2>
        <table class="table">
            <thead>
                <th>Number</th>
                <th>Car</th>
                <th>Name</th>
                <th class="th-btn th-wins">Wins</th>
                <th class="th-btn th-time">Best time (seconds)</th>
            </thead>
            <tbody>
            </tbody>
        </table>
    </main>`;
  }
}
