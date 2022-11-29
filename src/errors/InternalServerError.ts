export class InternalServerError extends Error {
  status: number;

  constructor(msg: string) {
    super(msg);
    this.message = msg;
    this.name = 'Internal Server Error';
    this.status = 500;
  }
}
