import { pgTable, uuid, text, timestamp, foreignKey, jsonb, boolean, bigint, integer, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const pricingPlanInterval = pgEnum("pricing_plan_interval", ['day', 'week', 'month', 'year'])
export const pricingType = pgEnum("pricing_type", ['one_time', 'recurring'])
export const subscriptionStatus = pgEnum("subscription_status", ['trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid'])



export const workspaces = pgTable("workspaces", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	title: text("title").notNull(),
	iconId: text("icon_id").notNull(),
	data: text("data"),
	inTrash: text("in_trash"),
	logo: text("logo"),
	bannerUrl: text("banner_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	workspaceOwner: uuid("workspace_owner").notNull(),
});

export const files = pgTable("files", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	title: text("title").notNull(),
	iconId: text("icon_id").notNull(),
	data: text("data"),
	inTrash: text("in_trash"),
	bannerUrl: text("banner_url"),
	workspaceId: uuid("workspace_id").notNull(),
	folderId: uuid("folder_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		filesFolderIdFoldersIdFk: foreignKey({
			columns: [table.folderId],
			foreignColumns: [folders.id],
			name: "files_folder_id_folders_id_fk"
		}).onDelete("cascade"),
		filesWorkspaceIdWorkspacesIdFk: foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspaces.id],
			name: "files_workspace_id_workspaces_id_fk"
		}).onDelete("cascade"),
	}
});

export const folders = pgTable("folders", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	title: text("title").notNull(),
	iconId: text("icon_id").notNull(),
	data: text("data"),
	inTrash: text("in_trash"),
	bannerUrl: text("banner_url"),
	workspaceId: uuid("workspace_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		foldersWorkspaceIdWorkspacesIdFk: foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspaces.id],
			name: "folders_workspace_id_workspaces_id_fk"
		}).onDelete("cascade"),
	}
});

export const users = pgTable("users", {
	id: uuid("id").primaryKey().notNull(),
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	billingAddress: jsonb("billing_address"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	paymentMethod: jsonb("payment_method"),
	email: text("email"),
});

export const customers = pgTable("customers", {
	id: uuid("id").primaryKey().notNull(),
	stripeCustomerId: text("stripe_customer_id"),
});

export const products = pgTable("products", {
	id: text("id").primaryKey().notNull(),
	active: boolean("active"),
	name: text("name"),
	description: text("description"),
	image: text("image"),
	metadata: jsonb("metadata"),
});

export const prices = pgTable("prices", {
	id: text("id").primaryKey().notNull(),
	productId: text("product_id"),
	active: boolean("active"),
	description: text("description"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	unitAmount: bigint("unit_amount", { mode: "number" }),
	currency: text("currency"),
	type: pricingType("type"),
	interval: pricingPlanInterval("interval"),
	intervalCount: integer("interval_count"),
	trialPeriodDays: integer("trial_period_days"),
	metadata: jsonb("metadata"),
},
(table) => {
	return {
		pricesProductIdProductsIdFk: foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "prices_product_id_products_id_fk"
		}),
	}
});

export const subscriptions = pgTable("subscriptions", {
	id: text("id").primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	status: subscriptionStatus("status"),
	metadata: jsonb("metadata"),
	priceId: text("price_id"),
	quantity: integer("quantity"),
	cancelAtPeriodEnd: boolean("cancel_at_period_end"),
	created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	currentPeriodStart: timestamp("current_period_start", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	currentPeriodEnd: timestamp("current_period_end", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	endedAt: timestamp("ended_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	cancelAt: timestamp("cancel_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	trialStart: timestamp("trial_start", { withTimezone: true, mode: 'string' }).defaultNow(),
	trialEnd: timestamp("trial_end", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		subscriptionsPriceIdPricesIdFk: foreignKey({
			columns: [table.priceId],
			foreignColumns: [prices.id],
			name: "subscriptions_price_id_prices_id_fk"
		}),
	}
});

export const collaborators = pgTable("collaborators", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	workspaceId: uuid("workspace_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id").notNull(),
},
(table) => {
	return {
		collaboratorsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "collaborators_user_id_users_id_fk"
		}).onDelete("cascade"),
		collaboratorsWorkspaceIdWorkspacesIdFk: foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspaces.id],
			name: "collaborators_workspace_id_workspaces_id_fk"
		}).onDelete("cascade"),
	}
});