ALTER TABLE "products" ALTER COLUMN "sku" SET DATA TYPE varchar(50)[];--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sku" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sku" SET NOT NULL;