import { pgTable, uuid, text, varchar, numeric, timestamp, jsonb, integer } from "drizzle-orm/pg-core";

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  images: jsonb("images").notNull(),
  category_id: uuid("category_id").references(() => categories.id),
  stock: integer("stock").default(0),
  sold: integer("sold").default(0),
  sku: varchar("sku", { length: 50 }).array().notNull().default("{}"),
  variants: jsonb("variants"),
  status: varchar("status", { length: 50 }).default("active"),

  // 👇 product-level discount (simple field)
  discount_percent: numeric("discount_percent", { precision: 5, scale: 2 }).default("0.00"), 

  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});


export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(), // reference to auth.users
  total_amount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  payment_status: varchar("payment_status", { length: 50 }).default("pending"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

/** Shipping Table */
export const shipping = pgTable("shipping", {
  id: uuid("id").primaryKey().defaultRandom(),
  order_id: uuid("order_id").notNull(), // reference to orders.id
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  postcode: varchar("postcode", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Order Items table
export const order_items = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  order_id: uuid("order_id").references(() => orders.id).notNull(),
  product_id: uuid("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  color: varchar("color").notNull()
});

// Special Offers table
export const special_offers = pgTable("special_offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").references(() => products.id).notNull(),
  discount_percent: numeric("discount_percent", { precision: 5, scale: 2 }).notNull(),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  product_id: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  user_id: uuid("user_id").notNull(), // directly from auth.users
  username: text("username").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  created_at: timestamp("created_at").defaultNow(),
});



export const cart = pgTable("cart", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(),            // Auth user ID
  product_id: uuid("product_id").notNull().references(() => products.id),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  size: varchar("size", { length: 10 }).default(""),   // optional
  quantity: integer("quantity").notNull().default(1),   
  color:varchar("color"),                      // product image URL
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
