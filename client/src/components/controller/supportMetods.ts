import { Car, Animation } from "../../type/type";

export class SupportMetods {
  public nameCar: Array<string> = [
    "Mersedes",
    "BMW",
    "Audi",
    "VW",
    "Renault",
    "Lada",
    "Volvo",
    "Honda",
    "Toyota",
    "Geely",
  ];

  public modelCar: Array<string> = [
    "A5",
    "Atlas",
    "Q7",
    "Touran",
    "Talisman",
    "XC90",
    "W221",
    "Insight",
    "Corolla",
    "X5",
  ];

  public randomCar(): string {
    const name = this.nameCar[Math.floor(Math.random() * this.nameCar.length)];
    const model =
      this.modelCar[Math.floor(Math.random() * this.modelCar.length)];
    return `${name} ${model}`;
  }

  public randomColor(): string {
    const lettersColor = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i += 1) {
      color += lettersColor[Math.floor(Math.random() * lettersColor.length)];
    }
    return color;
  }

  public generateHundred(count = 100): Array<Car> {
    return new Array(count)
      .fill(0)
      .map(() => ({ name: this.randomCar(), color: this.randomColor() }));
  }

  public animation(car: HTMLElement, way: number, duration: number) {
    let start = 0;
    const obj: Animation = {};
    function step(timestamp: number) {
      if (!start) start = timestamp;
      const curTime = timestamp - start;
      const passWay = Math.round(curTime * (way / duration));
      const cloneCar = car;
      cloneCar.style.transform = `translateX(${Math.min(passWay, way)}px)`;
      if (passWay < way) {
        obj.id = requestAnimationFrame(step);
      }
    }
    obj.id = requestAnimationFrame(step);
    return obj;
  }
}
