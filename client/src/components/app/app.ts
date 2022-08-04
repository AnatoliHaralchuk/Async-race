import { AppController } from "../controller/AppController";
import { View } from "../view/View";
import { ApiLoader } from "../controller/ApiLoader";

export class App {
  private controller: AppController;

  private a: ApiLoader;

  private view: View;

  constructor() {
    this.controller = new AppController();
    this.view = new View();
    this.a = new ApiLoader();
  }

  startApp() {
    document.body.innerHTML = "";
    console.log(this.a.deleteCar(8));
  }
}
