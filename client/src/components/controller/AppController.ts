import { ApiLoader } from "./ApiLoader";
import {
  callbackAny,
  StatusPage,
  WinnerWithId,
  Winners,
  CarWithId,
  namePages,
  sortName,
  orderName,
} from "../../type/type";
import { SupportMetods } from "./supportMetods";

export class AppController {
  private apimetods: ApiLoader;

  private supportmetods: SupportMetods;

  constructor() {
    this.apimetods = new ApiLoader();
    this.supportmetods = new SupportMetods();
  }

  public data: StatusPage = {
    carsPage: 1,
    winnersPage: 1,
    carsCount: 0,
    winnersCount: 0,
    cars: [],
    winners: [],
    anima: {},
    view: namePages.garage,
    sortBy: sortName.time,
    sortOrder: orderName.up,
  };

  public async startPage(callback: callbackAny<StatusPage>): Promise<void> {
    const resCars = await this.apimetods.getCars(this.data.carsPage);
    this.data.cars = resCars.data as Array<CarWithId>;
    this.data.carsCount = Number(resCars.count);
    const resWinners = await this.apimetods.getWinners(
      this.data.winnersPage,
      10,
      this.data.sortBy,
      this.data.sortOrder
    );
    this.data.winnersCount = Number(resWinners.count);
    this.data.winners = await Promise.all(
      resWinners.data.map(async (item: WinnerWithId) => {
        const el = {} as Winners;
        const s = await this.apimetods.getCar(item.id);
        el.car = s;
        el.wins = item.wins;
        el.time = item.time;
        return el;
      })
    );
    const wrap = document.querySelector(".wrapper");
    if (wrap) callback(this.data);
    else {
      document.body.innerHTML = "";
      const wrapper = document.createElement("div");
      wrapper.classList.add("wrapper");
      wrapper.innerHTML = `${callback(this.data)}`;
      document.body.append(wrapper);
    }
    if (this.data.view === namePages.garage)
      this.disPaginationGarage(this.data.carsCount, this.data.carsPage, 7);
    else
      this.disPaginationGarage(
        this.data.winnersCount,
        this.data.winnersPage,
        10
      );
  }

  public disPaginationGarage(count: number, page: number, limit: number): void {
    const prev = document.querySelector(".footer-btn__prev") as HTMLElement;
    const next = document.querySelector(".footer-btn__next") as HTMLElement;
    if (page > 1) {
      prev.removeAttribute("disabled");
    } else {
      prev.setAttribute("disabled", "true");
    }
    if (Math.ceil(count / limit) === page) {
      next.setAttribute("disabled", "true");
    } else {
      next.removeAttribute("disabled");
    }
  }

  public listener(event: Event, callback: callbackAny<StatusPage>): void {
    const elem = event.target as HTMLElement;
    if (
      elem.classList.contains("create-btn") ||
      elem.classList.contains("update-btn")
    ) {
      event.preventDefault();
      if (elem.classList.contains("create-btn")) {
        this.createCar(callback);
      } else {
        this.updateCar(callback);
      }
    }
    if (elem.classList.contains("select-car"))
      this.selectCar(Number(elem.dataset.select));
    if (elem.classList.contains("remove-car"))
      this.deleteCar(Number(elem.dataset.remove), callback);
    if (elem.classList.contains("footer-btn__prev")) this.prev(callback);
    if (elem.classList.contains("footer-btn__next")) this.next(callback);
    if (elem.classList.contains("generate-btn")) this.generateCars(callback);
    if (elem.classList.contains("start-engine"))
      this.startEngine(Number(elem.dataset.start));
    if (elem.classList.contains("stop-engine"))
      this.stopEngine(Number(elem.dataset.stop));
    if (elem.classList.contains("header-btn")) {
      if (elem.dataset.page === "winners") {
        this.data.view = "winners";
        this.startPage(callback);
      }
      if (elem.dataset.page === namePages.garage)
        this.data.view = namePages.garage;
      this.disPaginationGarage(this.data.carsCount, this.data.carsPage, 7);
      this.togglePage(String(elem.dataset.page));
    }
    if (elem.classList.contains("race-btn")) this.race();
    if (elem.classList.contains("reset-btn")) this.reset();
    if (elem.classList.contains("popap")) {
      elem.style.display = "none";
    }
    if (elem.classList.contains("th-btn")) {
      if (elem.classList.contains("th-wins")) this.data.sortBy = sortName.wins;
      else this.data.sortBy = sortName.time;
      if (this.data.sortOrder === orderName.up)
        this.data.sortOrder = orderName.down;
      else this.data.sortOrder = orderName.up;
      this.startPage(callback);
    }
  }

  public async createCar(callback: callbackAny<StatusPage>): Promise<void> {
    const createInput = document.querySelectorAll(".create-input") as NodeList;
    await this.apimetods.createCar({
      name: (createInput[0] as HTMLInputElement).value,
      color: (createInput[1] as HTMLInputElement).value,
    });
    (createInput[0] as HTMLInputElement).value = "";
    this.startPage(callback);
  }

  public async updateCar(callback: callbackAny<StatusPage>): Promise<void> {
    const updateInput = document.querySelectorAll(".update-input");
    const updateBtn = document.querySelector(".update-btn") as HTMLElement;
    const id = Number(updateBtn.getAttribute("id"));
    await this.apimetods.updateCar(id, {
      id,
      name: (updateInput[0] as HTMLInputElement).value,
      color: (updateInput[1] as HTMLInputElement).value,
    });
    (updateInput[0] as HTMLInputElement).value = "";
    (updateInput[0] as HTMLInputElement).setAttribute("disabled", "true");
    (updateInput[1] as HTMLInputElement).setAttribute("disabled", "true");
    (updateInput[1] as HTMLInputElement).value = "#000000";
    updateBtn.setAttribute("disabled", "true");
    this.startPage(callback);
  }

  public selectCar(id: number): void {
    const updateInput = document.querySelectorAll(".update-input") as NodeList;
    const updateBtn = document.querySelector(".update-btn") as HTMLElement;
    (updateInput[0] as HTMLInputElement).removeAttribute("disabled");
    (updateInput[0] as HTMLInputElement).focus();
    (updateInput[1] as HTMLInputElement).removeAttribute("disabled");
    updateBtn.removeAttribute("disabled");
    this.apimetods.getCar(id).then((res) => {
      (updateInput[0] as HTMLInputElement).value = res.name;
      (updateInput[1] as HTMLInputElement).value = res.color;
      updateBtn.setAttribute("id", `${res.id}`);
    });
  }

  public deleteCar(id: number, callback: callbackAny<StatusPage>): void {
    this.apimetods.deleteCar(id).then(() => this.startPage(callback));
    this.apimetods.deleteWinner(id).then(() => this.startPage(callback));
  }

  public prev(callback: callbackAny<StatusPage>): void {
    if (this.data.view === namePages.garage) this.data.carsPage -= 1;
    if (this.data.view === namePages.winners) this.data.winnersPage -= 1;
    this.startPage(callback);
  }

  public next(callback: callbackAny<StatusPage>): void {
    if (this.data.view === namePages.garage) this.data.carsPage += 1;
    if (this.data.view === namePages.winners) this.data.winnersPage += 1;
    this.startPage(callback);
  }

  public generateCars(callback: callbackAny<StatusPage>): void {
    const cars = this.supportmetods.generateHundred();
    cars.forEach((car) => this.apimetods.createCar(car));
    this.startPage(callback);
  }

  public async startEngine(id: number): Promise<Winners> {
    const A = document.querySelector(`[data-start = "${id}"]`) as HTMLElement;
    const B = document.querySelector(`[data-stop = "${id}"]`) as HTMLElement;
    const raceBtn = document.querySelector(`.race-btn`) as HTMLElement;
    const resetBtn = document.querySelector(`.reset-btn`) as HTMLElement;
    A.setAttribute("disabled", "true");
    raceBtn.setAttribute("disabled", "true");
    resetBtn.setAttribute("disabled", "true");
    const thisCar = {} as Winners;
    thisCar.car = await this.apimetods.getCar(id);
    const q = await this.apimetods
      .startEngine(id)
      .then((result) => {
        const { velocity, distance } = result;
        const time = Math.round(distance / velocity);
        const car = document.querySelector(
          `[data-id = "${id}"]`
        ) as HTMLElement;
        const flag = document.querySelector(
          `[data-flag = "${id}"]`
        ) as HTMLElement;
        const way = flag.offsetLeft - car.offsetLeft + 100;
        return { car, way, time };
      })
      .then((res) => {
        const { car, way, time } = res;
        this.data.anima = this.supportmetods.animation(car, way, time);
        return time;
      })
      .then(async (time) => {
        const res = await this.apimetods.driveEngine(id);
        raceBtn.removeAttribute("disabled");
        resetBtn.removeAttribute("disabled");
        B.removeAttribute("disabled");
        if (!res.success) {
          if (this.data.anima.id) cancelAnimationFrame(this.data.anima.id);
          thisCar.time = time + 5000;
          thisCar.wins = 1;
        } else {
          thisCar.time = time;
          thisCar.wins = 1;
        }
        return thisCar;
      });
    return q;
  }

  public stopEngine(id: number): void {
    const A = document.querySelector(`[data-start = "${id}"]`) as HTMLElement;
    const B = document.querySelector(`[data-stop = "${id}"]`) as HTMLElement;
    A.removeAttribute("disabled");
    B.setAttribute("disabled", "true");
    const car = document.querySelector(`[data-id = "${id}"]`) as HTMLElement;
    car.style.transform = `translateX(${0}px)`;
    if (this.data.anima.id) cancelAnimationFrame(this.data.anima.id);
  }

  public togglePage(namePage: string): void {
    const winners = document.querySelector(".to-winners") as HTMLElement;
    const garage = document.querySelector(".main") as HTMLElement;
    if (namePage === namePages.garage) {
      winners.style.display = "none";
      garage.style.display = "block";
    } else {
      winners.style.display = "block";
      garage.style.display = "none";
    }
  }

  public race(): void {
    const popap = document.querySelector(".popap") as HTMLElement;
    const popapText = document.querySelector(".popap span") as HTMLElement;
    popapText.innerText = "";
    Promise.all(this.data.cars.map((car) => this.startEngine(car.id)))
      .then((allresult) => this.supportmetods.sortCar(allresult))
      .then((win) => {
        popap.style.display = "block";
        const time = Number((win.time / 1000).toFixed(2));
        popapText.innerText = `Wins ${win.car.name} with ${time} sec`;
        this.apimetods.addWinner(win.car.id, time);
      });
  }

  public reset(): void {
    this.data.cars.forEach((car) => {
      const btn = document.querySelector(
        `[data-stop = "${car.id}"]`
      ) as HTMLElement;
      btn.click();
    });
  }
}
