-- CreateTable
CREATE TABLE `MedicalInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `physicianName` VARCHAR(191) NOT NULL,
    `insuranceProvider` VARCHAR(191) NOT NULL,
    `insuranceNumber` VARCHAR(191) NOT NULL,
    `allergies` VARCHAR(191) NOT NULL,
    `currentMedicalSituation` VARCHAR(191) NOT NULL,
    `familyMedicalHistory` VARCHAR(191) NOT NULL,
    `pastMedicalHistory` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MedicalInfo_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MedicalInfo` ADD CONSTRAINT `MedicalInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
