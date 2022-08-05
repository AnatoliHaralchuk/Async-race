import { AppController } from "../controller/AppController";
import { View } from "../view/View";

export class App {
  private controller: AppController;

  private view: View;

  constructor() {
    this.controller = new AppController();
    this.view = new View();
  }

  //   startApp() {}
}
