export class NotFound extends Error {
  status: number;

  constructor(msg: string) {
    super(msg);
    this.message = msg;
    this.name = 'Not Found';
    this.status = 404;
  }
}
