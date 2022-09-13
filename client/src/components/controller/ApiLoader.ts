import {
  Car,
  driveEngineStatus,
  Path,
  Winner,
  PromiseCars,
  PromiseWinners,
  CarWithId,
  WinnerWithId,
  StatusEngine,
} from "../../type/type";

export class ApiLoader {
  private base: string;

  private path: Path;

  constructor() {
    this.base = "http://127.0.0.1:3000";
    this.path = {
      garage: `${this.base}/garage`,
      winners: `${this.base}/winners`,
      engine: `${this.base}/engine`,
    };
  }

  public async getCars(page: number, limit = 7): Promise<PromiseCars> {
    const response = await fetch(
      `${this.path.garage}?_page=${page}&_limit=${limit}`
    );
    return {
      data: await response.json(),
      count: response.headers.get("X-Total-Count"),
    };
  }

  public async getCar(id: number): Promise<CarWithId> {
    const response = await (await fetch(`${this.path.garage}/${id}`)).json();
    return response;
  }

  public async createCar(body: Car): Promise<CarWithId> {
    const response = await (
      await fetch(`${this.path.garage}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    return response;
  }

  public async deleteCar(id: number): Promise<CarWithId> {
    const response = await (
      await fetch(`${this.path.garage}/${id}`, {
        method: "DELETE",
      })
    ).json();
    return response;
  }

  public async updateCar(id: number, body: Car): Promise<CarWithId> {
    const response = await (
      await fetch(`${this.path.garage}/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    return response;
  }

  public async startEngine(id: number): Promise<StatusEngine> {
    const response = await (
      await fetch(`${this.path.engine}?id=${id}&status=started`, {
        method: "PATCH",
      })
    ).json();
    return response;
  }

  public async stopEngine(id: number): Promise<StatusEngine> {
    const response = await (
      await fetch(`${this.path.engine}?id=${id}&status=stopped`, {
        method: "PATCH",
      })
    ).json();
    return response;
  }

  public async driveEngine(id: number): Promise<driveEngineStatus> {
    const response = await fetch(`${this.path.engine}?id=${id}&status=drive`, {
      method: "PATCH",
    }).catch();
    return !response.ok ? { success: false } : { ...(await response.json()) };
  }

  public async getWinners(
    page: number,
    limit: number,
    sort: string,
    order: string
  ): Promise<PromiseWinners> {
    const response = await fetch(
      `${this.path.winners}?_page=${page}&_limit=${limit}${
        sort && order ? `&_sort=${sort}&_order=${order}` : ``
      }`
    );
    return {
      data: await response.json(),
      count: response.headers.get("X-Total-Count"),
    };
  }

  public async getWinner(id: number): Promise<WinnerWithId> {
    const response = await (await fetch(`${this.path.winners}/${id}`)).json();
    return response;
  }

  public async createWinner(body: Winner): Promise<void> {
    const response = (
      await fetch(`${this.path.winners}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    return response;
  }

  public async updateWinner(id: number, body: Winner): Promise<void> {
    const response = (
      await fetch(`${this.path.winners}/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    return response;
  }

  public async deleteWinner(id: number): Promise<void> {
    const response = (
      await fetch(`${this.path.winners}/${id}`, { method: "DELETE" })
    ).json();
    return response;
  }

  public async getWinnerStatus(id: number): Promise<number> {
    const response = await fetch(`${this.path.winners}/${id}`);
    return response.status;
  }

  public async addWinner(id: number, time: number): Promise<void> {
    const status = await this.getWinnerStatus(id);
    if (status === 404) {
      await this.createWinner({
        id,
        wins: 1,
        time,
      });
    } else {
      const currenWinner = await this.getWinner(id);
      await this.updateWinner(id, {
        id,
        wins: currenWinner.wins + 1,
        time: currenWinner.time > time ? time : currenWinner.time,
      });
    }
  }
}
