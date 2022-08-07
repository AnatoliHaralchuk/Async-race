export type callbackAny<T> = (data: T) => void;
export interface Animation {
  id?: number;
}
export interface Path {
  garage: string;
  winners: string;
  engine: string;
}
export interface Car {
  name: string;
  color: string;
  id?: number;
}
export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface Data {
  carsPage: number;
  winnersPage: number;
  carsCount: number;
  winnersCount: number;
  cars: Array<Car>;
  winners: Array<Winner>;
  anima: Animation;
  view: string;
  sortBy: null;
  sortOrder: null;
}
export interface dataCar {
  data: Array<Car>;
  count: number;
}
export interface dataWinner {
  data: Array<Winner>;
  count: number;
}
