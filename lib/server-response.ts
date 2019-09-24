import { PaginateResponse } from "../handlers/pagination.handler";

export class ServerResponse {
  constructor(public status: string, public code: string, public message: string, public data = null, public meta: PaginateResponse | null = null) {
    this.status = status;
    this.code = code;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}