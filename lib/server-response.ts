export class ServerResponse {
  constructor(public status: string, public code: string, public message: string, public data = null) {
    this.status = status;
    this.code = code;
    this.message = message;
    this.data = data;
  }
}