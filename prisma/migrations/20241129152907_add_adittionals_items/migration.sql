-- CreateTable
CREATE TABLE "Additional" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "additionalGroupId" TEXT NOT NULL,

    CONSTRAINT "Additional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "maxSelect" INTEGER NOT NULL,

    CONSTRAINT "AdditionalGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Additional" ADD CONSTRAINT "Additional_additionalGroupId_fkey" FOREIGN KEY ("additionalGroupId") REFERENCES "AdditionalGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
