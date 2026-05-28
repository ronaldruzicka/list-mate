import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './auth-schema';

export const list = sqliteTable('list', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull(),
});

export const listRelations = relations(list, ({ one }) => ({
	user: one(user, {
		fields: [list.userId],
		references: [user.id],
	}),
}));
