import { Car, Path, Winner } from "../../type/type";

export class ApiLoader {
  base: string;

  path: Path;

  constructor() {
    this.base = "http://127.0.0.1:3000";
    this.path = {
      garage: `${this.base}/garage`,
      winners: `${this.base}/winners`,
      engine: `${this.base}/engine`,
    };
  }

  async getCars(page: number, limit = 7) {
    const response = await fetch(
      `${this.path.garage}?_page=${page}&_limit=${limit}`
    );
    return {
      data: await response.json(),
      count: response.headers.get("X-Total-Count"),
    };
  }

  async getCar(id: number) {
    const response = await (await fetch(`${this.path.garage}/${id}`)).json();
    return response;
  }

  async createCar(body: Car) {
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

  async deleteCar(id: number) {
    const response = await (
      await fetch(`${this.path.garage}/${id}`, {
        method: "DELETE",
      })
    ).json();
    return response;
  }

  async updateCar(id: number, body: Car) {
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

  async startEngine(id: number) {
    const response = await (
      await fetch(`${this.path.engine}?id=${id}&status=started`, {
        method: "PATCH",
      })
    ).json();
    return response;
  }

  async stopEngine(id: number) {
    const response = await (
      await fetch(`${this.path.engine}?id=${id}&status=stopped`, {
        method: "PATCH",
      })
    ).json();
    return response;
  }

  async driveEngine(id: number) {
    const response = await fetch(`${this.path.engine}?id=${id}&status=drive`, {
      method: "PATCH",
    }).catch();
    return response.status !== 200
      ? { success: false }
      : { ...(await response.json()) };
  }

  async getWinners(page: number, limit: number, sort?: string, order?: string) {
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

  async getWinner(id: number) {
    const response = await (await fetch(`${this.path.winners}/${id}`)).json();
    return response;
  }

  async createWinner(body: Winner) {
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

  async updateWinner(id: number, body: Winner) {
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

  async deleteWinner(id: number) {
    const response = (
      await fetch(`${this.path.winners}/${id}`, { method: "DELETE" })
    ).json();
    return response;
  }

  async getWinnerStatus(id: number) {
    const response = await fetch(`${this.path.winners}/${id}`);
    return response.status;
  }

  async addWinner(id: number, time: number) {
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
