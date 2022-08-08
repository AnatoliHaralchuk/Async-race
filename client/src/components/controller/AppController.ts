import { ApiLoader } from "./ApiLoader";
import { callbackAny, Data, Winners } from "../../type/type";
import { SupportMetods } from "./supportMetods";

export class AppController {
  apimetods: ApiLoader;

  supportmetods: SupportMetods;

  constructor() {
    this.apimetods = new ApiLoader();
    this.supportmetods = new SupportMetods();
  }

  public data: Data = {
    carsPage: 1,
    winnersPage: 1,
    carsCount: 0,
    winnersCount: 0,
    cars: [],
    winners: [],
    anima: {},
    view: "garage",
    sortBy: null,
    sortOrder: null,
  };

  public raceCar: Array<Winners> = [];

  public startPage(callback: callbackAny<Data>) {
    this.apimetods
      .getCars(this.data.carsPage)
      .then((result) => {
        this.data.cars = result.data;
        this.data.carsCount = Number(result.count);
        if (document.querySelector(".wrapper")) {
          callback(this.data);
        } else {
          const wrapper = document.createElement("div");
          wrapper.classList.add("wrapper");
          wrapper.innerHTML = `${callback(this.data)}`;
          document.body.append(wrapper);
        }
      })
      .then(() => {
        if (this.data.view === "garage")
          this.disPaginationGarage(this.data.carsCount, this.data.carsPage, 7);
        else
          this.disPaginationGarage(
            this.data.winnersCount,
            this.data.winnersPage,
            10
          );
      });
  }

  public disPaginationGarage(count: number, page: number, limit: number) {
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

  public listener(event: Event, callback: callbackAny<Data>) {
    const elem = event.target as HTMLElement;
    if (
      elem.classList.contains("create-btn") ||
      elem.classList.contains("update-btn")
    ) {
      event.preventDefault();
      if (elem.classList.contains("create-btn")) {
        this.create(callback);
      } else {
        this.update(callback);
      }
    }
    if (elem.classList.contains("select-car"))
      this.select(Number(elem.dataset.select));
    if (elem.classList.contains("remove-car"))
      this.delete(Number(elem.dataset.remove), callback);
    if (elem.classList.contains("footer-btn__prev")) this.prev(callback);
    if (elem.classList.contains("footer-btn__next")) this.next(callback);
    if (elem.classList.contains("generate-btn")) this.generate(callback);
    if (elem.classList.contains("start-engine"))
      this.startEngine(Number(elem.dataset.start));
    if (elem.classList.contains("stop-engine"))
      this.stopEngine(Number(elem.dataset.stop));
    if (elem.classList.contains("header-btn"))
      this.togglePage(String(elem.dataset.page));
    if (elem.classList.contains("race-btn")) this.race();
    if (elem.classList.contains("reset-btn")) this.reset();
  }

  async create(callback: callbackAny<Data>) {
    const createInput = document.querySelectorAll(".create-input") as NodeList;
    await this.apimetods.createCar({
      name: (createInput[0] as HTMLInputElement).value,
      color: (createInput[1] as HTMLInputElement).value,
    });
    (createInput[0] as HTMLInputElement).value = "";
    this.startPage(callback);
  }

  async update(callback: callbackAny<Data>) {
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

  public select(id: number) {
    const updateInput = document.querySelectorAll(".update-input") as NodeList;
    const updateBtn = document.querySelector(".update-btn") as HTMLElement;
    (updateInput[0] as HTMLInputElement).removeAttribute("disabled");
    (updateInput[0] as HTMLInputElement).focus();
    (updateInput[1] as HTMLInputElement).removeAttribute("disabled");
    updateBtn.removeAttribute("disabled");
    this.apimetods.getCar(id).then((res) => {
      (updateInput[0] as HTMLInputElement).value = res.name;
      (updateInput[1] as HTMLInputElement).value = res.color;
      updateBtn.setAttribute("id", res.id);
    });
  }

  public delete(id: number, callback: callbackAny<Data>): void {
    this.apimetods.deleteCar(id).then(() => this.startPage(callback));
  }

  public prev(callback: callbackAny<Data>): void {
    this.data.carsPage -= 1;
    this.startPage(callback);
  }

  public next(callback: callbackAny<Data>): void {
    this.data.carsPage += 1;
    this.startPage(callback);
  }

  public generate(callback: callbackAny<Data>): void {
    const cars = this.supportmetods.generateHundred();
    cars.forEach((car) => this.apimetods.createCar(car));
    this.startPage(callback);
  }

  async startEngine(id: number): Promise<Winners> {
    const A = document.querySelector(`[data-start = "${id}"]`) as HTMLElement;
    const B = document.querySelector(`[data-stop = "${id}"]`) as HTMLElement;
    const raceBtn = document.querySelector(`.race-btn`) as HTMLElement;
    const resetBtn = document.querySelector(`.reset-btn`) as HTMLElement;
    A.setAttribute("disabled", "true");
    raceBtn.setAttribute("disabled", "true");
    resetBtn.setAttribute("disabled", "true");
    const thisCar = {} as Winners;
    await this.apimetods.getCar(id).then((currentCar) => {
      thisCar.car = currentCar;
    });
    return this.apimetods
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
      .then((time) => {
        this.apimetods.driveEngine(id).then((res) => {
          raceBtn.removeAttribute("disabled");
          resetBtn.removeAttribute("disabled");
          B.removeAttribute("disabled");
          if (!res.success) {
            if (this.data.anima.id) cancelAnimationFrame(this.data.anima.id);
          } else {
            thisCar.time = time;
            thisCar.wins = 1;
          }
        });
      })
      .then(() => {
        return thisCar;
      });
  }

  public stopEngine(id: number) {
    const A = document.querySelector(`[data-start = "${id}"]`) as HTMLElement;
    const B = document.querySelector(`[data-stop = "${id}"]`) as HTMLElement;
    A.removeAttribute("disabled");
    B.setAttribute("disabled", "true");
    const car = document.querySelector(`[data-id = "${id}"]`) as HTMLElement;
    const cloneCar = car;
    cloneCar.style.transform = `translateX(${0}px)`;
    if (this.data.anima.id) cancelAnimationFrame(this.data.anima.id);
  }

  public togglePage(namePage: string) {
    const winners = document.querySelector(".to-winners") as HTMLElement;
    const garage = document.querySelector(".main") as HTMLElement;
    if (namePage === "garage") {
      winners.style.display = "none";
      garage.style.display = "block";
    } else {
      winners.style.display = "block";
      garage.style.display = "none";
    }
  }

  public race() {
    Promise.race(this.data.cars.map((car) => this.startEngine(car.id))).then(
      (res) => console.log(res)
    );
  }

  public reset() {
    this.data.cars.forEach((car) => {
      const btn = document.querySelector(
        `[data-stop = "${car.id}"]`
      ) as HTMLElement;
      btn.click();
    });
  }
}
