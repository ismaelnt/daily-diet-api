import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.uuid("id").primary().notNullable();
    table.unique(["email"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropPrimary();
    table.dropColumn("id");
    table.text("email").primary();
  });
}
