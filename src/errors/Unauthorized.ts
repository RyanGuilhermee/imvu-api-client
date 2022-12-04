export class Unauthorized extends Error {
  status: number;

  constructor(msg: string) {
    super(msg);
    this.message = msg;
    this.name = 'Unauthorized';
    this.status = 401;
  }
}
