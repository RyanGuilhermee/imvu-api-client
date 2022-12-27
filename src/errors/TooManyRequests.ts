export class TooManyRequests extends Error {
  status: number;

  constructor(msg: string) {
    super(msg);
    this.message = msg;
    this.name = 'Too Many Requests';
    this.status = 429;
  }
}
