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

export interface CarWithId {
  name: string;
  color: string;
  id: number;
}

export interface Winner {
  id?: number;
  wins: number;
  time: number;
}

export interface WinnerWithId {
  id: number;
  wins: number;
  time: number;
}

export interface PromiseCars {
  data: Array<Car>;
  count: string | null;
}

export interface PromiseWinners {
  data: Array<WinnerWithId>;
  count: string | null;
}

export interface driveEngineStatus {
  success: boolean;
}

export interface StatusEngine {
  velocity: number;
  distance: number;
}

export interface Winners {
  car: CarWithId;
  wins: number;
  time: number;
}

export interface StatusPage {
  carsPage: number;
  winnersPage: number;
  carsCount: number;
  winnersCount: number;
  cars: Array<CarWithId>;
  winners: Array<Winners>;
  anima: Animation;
  view: string;
  sortBy: string;
  sortOrder: string;
}
export interface dataCar {
  data: Array<Car>;
  count: number;
}
export interface dataWinner {
  data: Array<Winner>;
  count: number;
}
export enum namePages {
  garage = "garage",
  winners = "winners",
}
export enum sortName {
  time = "time",
  wins = "wins",
}
export enum orderName {
  up = "ASC",
  down = "DESC",
}
