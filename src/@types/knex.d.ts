import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      created_at: string;
      email: string;
      password: string;
    };
    meals: {
      id: string;
      created_at: string;
      updated_at: string;
      name: string;
      description?: string;
      in_diet: boolean;
      meal_time: string;
      user_id: string;
    };
  }
}
