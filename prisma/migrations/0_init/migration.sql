-- CreateTable
CREATE TABLE "client_profile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "name_pharmacy" VARCHAR(255) NOT NULL,

    CONSTRAINT "client_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_a" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name_pharmacy" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "submission_date" TIMESTAMP(6) NOT NULL,
    "order_id" UUID,
    "sex" VARCHAR(255),
    "name_patient" TEXT,
    "medication_details" TEXT,

    CONSTRAINT "form_a_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_b" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name_pharmacy" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name_patient" UUID,
    "sex" UUID,
    "submission_date" TIMESTAMP(6) NOT NULL,
    "forme_pharmaceutique" BOOLEAN NOT NULL,
    "modalite_d_administration" TEXT NOT NULL,
    "decision_sous_traiter_preparation" BOOLEAN NOT NULL,
    "order_id" UUID NOT NULL,
    "decision_realiser_preparation" BOOLEAN NOT NULL,

    CONSTRAINT "form_b_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_c" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "name_pharmacy" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "name_patient" UUID,
    "controle_elements_disponible" BOOLEAN NOT NULL,
    "controle_pharmacotechniques" BOOLEAN NOT NULL,
    "decision_liberation" BOOLEAN NOT NULL,

    CONSTRAINT "form_c_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_current" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_price" DOUBLE PRECISION NOT NULL,
    "user_id" UUID NOT NULL,
    "name_pharmacy" UUID,
    "form_a_id" UUID NOT NULL,
    "form_b_id" UUID,
    "confirmation_order" BOOLEAN,
    "form_c_id" UUID,
    "delivery_order" BOOLEAN,
    "form_a_pdf_path" TEXT,
    "form_b_pdf_path" TEXT,
    "form_c_pdf_path" TEXT,

    CONSTRAINT "order_current_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_history_client" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_id" UUID NOT NULL,
    "order_statut" UUID NOT NULL,
    "order_created_at" UUID NOT NULL,
    "name_patient" UUID,
    "total_price" UUID,

    CONSTRAINT "order_history_client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_history_pharmacie" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,
    "name_pharmacy" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "order_statut" UUID NOT NULL,
    "order_created_at" UUID NOT NULL,
    "total_price" UUID,

    CONSTRAINT "order_history_pharmacie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pdf_file" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_name" VARCHAR(255) NOT NULL,
    "associated_form" UUID NOT NULL,

    CONSTRAINT "pdf_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pharmacy" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "pharmacy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "roq_user_id" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_profile_name_pharmacy_key" ON "client_profile"("name_pharmacy");

-- CreateIndex
CREATE UNIQUE INDEX "form_a_name_pharmacy_key" ON "form_a"("name_pharmacy");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "client_profile" ADD CONSTRAINT "client_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_a" ADD CONSTRAINT "form_a_name_pharmacy_fkey" FOREIGN KEY ("name_pharmacy") REFERENCES "client_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_a" ADD CONSTRAINT "form_a_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_current"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_a" ADD CONSTRAINT "form_a_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_b" ADD CONSTRAINT "form_b_name_patient_fkey" FOREIGN KEY ("name_patient") REFERENCES "form_a"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_b" ADD CONSTRAINT "form_b_name_pharmacy_fkey" FOREIGN KEY ("name_pharmacy") REFERENCES "client_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_b" ADD CONSTRAINT "form_b_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_current"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_b" ADD CONSTRAINT "form_b_sex_fkey" FOREIGN KEY ("sex") REFERENCES "form_a"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_b" ADD CONSTRAINT "form_b_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_c" ADD CONSTRAINT "form_c_name_patient_fkey" FOREIGN KEY ("name_patient") REFERENCES "form_a"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_c" ADD CONSTRAINT "form_c_name_pharmacy_fkey" FOREIGN KEY ("name_pharmacy") REFERENCES "client_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_c" ADD CONSTRAINT "form_c_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_current"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_c" ADD CONSTRAINT "form_c_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_current" ADD CONSTRAINT "order_current_form_a_id_fkey" FOREIGN KEY ("form_a_id") REFERENCES "form_a"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_current" ADD CONSTRAINT "order_current_form_b_id_fkey" FOREIGN KEY ("form_b_id") REFERENCES "form_b"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_current" ADD CONSTRAINT "order_current_form_c_id_fkey" FOREIGN KEY ("form_c_id") REFERENCES "form_c"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_current" ADD CONSTRAINT "order_current_name_pharmacy_fkey" FOREIGN KEY ("name_pharmacy") REFERENCES "client_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_current" ADD CONSTRAINT "order_current_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_history_client" ADD CONSTRAINT "order_history_client_name_patient_fkey" FOREIGN KEY ("name_patient") REFERENCES "form_a"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_history_client" ADD CONSTRAINT "order_history_client_order_created_at_fkey" FOREIGN KEY ("order_created_at") REFERENCES "order_current"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_history_client" ADD CONSTRAINT "order_history_client_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_current"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_history_client" ADD CONSTRAINT "order_history_client_order_statut_fkey" FOREIGN KEY ("order_statut") REFERENCES "order_current"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_history_client" ADD CONSTRAINT "order_history_client_total_price_fkey" FOREIGN KEY ("total_price") REFERENCES "order_current"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_history_pharmacie" ADD CONSTRAINT "order_history_pharmacie_name_pharmacy_fkey" FOREIGN KEY ("name_pharmacy") REFERENCES "client_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_history_pharmacie" ADD CONSTRAINT "order_history_pharmacie_order_created_at_fkey" FOREIGN KEY ("order_created_at") REFERENCES "order_current"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_history_pharmacie" ADD CONSTRAINT "order_history_pharmacie_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_current"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_history_pharmacie" ADD CONSTRAINT "order_history_pharmacie_order_statut_fkey" FOREIGN KEY ("order_statut") REFERENCES "order_current"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_history_pharmacie" ADD CONSTRAINT "order_history_pharmacie_total_price_fkey" FOREIGN KEY ("total_price") REFERENCES "order_current"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_history_pharmacie" ADD CONSTRAINT "order_history_pharmacie_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pdf_file" ADD CONSTRAINT "pdf_file_associated_form_fkey" FOREIGN KEY ("associated_form") REFERENCES "form_a"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pharmacy" ADD CONSTRAINT "pharmacy_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

