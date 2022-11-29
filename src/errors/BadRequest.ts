export class BadRequest extends Error {
  status: number;

  constructor(msg: string) {
    super(msg);
    this.message = msg;
    this.name = 'Bad Request';
    this.status = 400;
  }
}
