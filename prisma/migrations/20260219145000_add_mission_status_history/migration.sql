-- CreateTable
CREATE TABLE "public"."mission_status_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mission_id" UUID NOT NULL,
    "status" "public"."MissionState" NOT NULL,
    "reason" "public"."MissionReason",
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mission_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_mission_status_history_mission_id" ON "public"."mission_status_history"("mission_id");

-- AddForeignKey
ALTER TABLE "public"."mission_status_history" ADD CONSTRAINT "mission_status_history_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
