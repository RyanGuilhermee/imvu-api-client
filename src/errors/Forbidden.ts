export class Forbbiden extends Error {
  status: number;

  constructor(msg: string) {
    super(msg);
    this.message = msg;
    this.name = 'Forbbiden';
    this.status = 403;
  }
}
