ALTER TYPE "public"."tenant_status" ADD VALUE 'generating';--> statement-breakpoint
ALTER TYPE "public"."tenant_status" ADD VALUE 'failed';--> statement-breakpoint
DROP TABLE "demo" CASCADE;