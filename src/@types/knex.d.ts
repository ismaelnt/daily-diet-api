import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      created_at: string;
      email: string;
      password: string;
    };
  }
}
