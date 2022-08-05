export type callbackAny<T> = (data: T) => void;
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

// export interface ObjWinners {
//     data: Array<Winner>;
//     count: number;
// }
export interface Winner {
  id: number;
  wins: number;
  time: number;
}
