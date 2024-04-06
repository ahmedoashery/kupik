-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `provider_account_id` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `accounts_provider_provider_account_id_key`(`provider`, `provider_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `started_at` DATETIME(3) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_session_token_key`(`session_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `contact` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `zipcode` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` TEXT NULL,
    `email_verified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `users_phone_key`(`phone`),
    UNIQUE INDEX `users_name_key`(`name`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verificationtokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verificationtokens_token_key`(`token`),
    UNIQUE INDEX `verificationtokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `parent_id` INTEGER NULL,

    UNIQUE INDEX `groups_name_key`(`name`),
    INDEX `groups_parent_id_idx`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `names` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `group_id` INTEGER NULL,
    `code` VARCHAR(191) NULL,
    `accountnumber` VARCHAR(191) NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `contact` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `zipcode` VARCHAR(191) NULL,
    `started_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive` BOOLEAN NULL DEFAULT true,

    UNIQUE INDEX `names_code_key`(`code`),
    UNIQUE INDEX `names_accountnumber_key`(`accountnumber`),
    UNIQUE INDEX `names_phone_key`(`phone`),
    INDEX `names_group_id_idx`(`group_id`),
    UNIQUE INDEX `names_firstname_lastname_key`(`firstname`, `lastname`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chart_accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `number` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `parent_id` INTEGER NULL,
    `open_balance` DECIMAL(65, 30) NULL,
    `balance` DECIMAL(65, 30) NULL,
    `type` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `chart_accounts_number_key`(`number`),
    UNIQUE INDEX `chart_accounts_name_key`(`name`),
    INDEX `chart_accounts_parent_id_idx`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NULL,
    `entity_id` INTEGER NULL,
    `user_id` VARCHAR(191) NULL,
    `account_id` INTEGER NULL,
    `date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `bills_entity_id_idx`(`entity_id`),
    INDEX `bills_account_id_idx`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bill_lines` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_id` INTEGER NULL,
    `account_id` INTEGER NULL,
    `item_id` INTEGER NULL,
    `quantity` DECIMAL(10, 0) NULL,
    `price` DECIMAL(10, 0) NULL,
    `amount` DECIMAL(10, 0) NULL,

    INDEX `bill_lines_item_id_idx`(`item_id`),
    INDEX `bill_lines_bill_id_idx`(`bill_id`),
    INDEX `bill_lines_account_id_idx`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bill_payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bill_id` INTEGER NULL,
    `account_id` INTEGER NULL,
    `date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `memo` VARCHAR(191) NULL,
    `amount` DECIMAL(10, 0) NULL,

    INDEX `bill_payments_bill_id_idx`(`bill_id`),
    INDEX `bill_payments_account_id_idx`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serial_no` INTEGER NULL,
    `added_by` INTEGER NULL,
    `added_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_by` INTEGER NULL,
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status_id` INTEGER NULL,
    `status_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `comments` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `entityId` INTEGER NULL,

    UNIQUE INDEX `orders_serial_no_key`(`serial_no`),
    INDEX `orders_added_by_updated_by_status_id_entityId_idx`(`added_by`, `updated_by`, `status_id`, `entityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `statuses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `statuses_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `cities_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NULL,
    `city_id` INTEGER NULL,
    `address` VARCHAR(191) NULL,
    `shipper_id` INTEGER NULL,
    `notes` VARCHAR(191) NULL,
    `orderId` INTEGER NOT NULL,

    UNIQUE INDEX `shipments_orderId_key`(`orderId`),
    INDEX `shipments_shipper_id_city_id_orderId_idx`(`shipper_id`, `city_id`, `orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shippers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `group_id` INTEGER NULL,
    `code` VARCHAR(191) NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NULL,
    `contact` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `zipcode` VARCHAR(191) NULL,
    `started_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `shippers_code_key`(`code`),
    UNIQUE INDEX `shippers_phone_key`(`phone`),
    INDEX `shippers_group_id_idx`(`group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `num` INTEGER NULL,
    `type` VARCHAR(191) NULL,
    `entity_id` INTEGER NULL,
    `account_id` INTEGER NULL,
    `user_id` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `invoices_num_key`(`num`),
    INDEX `invoices_entity_id_idx`(`entity_id`),
    INDEX `invoices_account_id_idx`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoice_lines` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` INTEGER NULL,
    `account_id` INTEGER NULL,
    `item_id` INTEGER NULL,
    `quantity` DECIMAL(10, 0) NULL,
    `price` DECIMAL(10, 0) NULL,
    `amount` DECIMAL(10, 0) NULL,

    INDEX `invoice_lines_invoice_id_idx`(`invoice_id`),
    INDEX `invoice_lines_item_id_idx`(`item_id`),
    INDEX `invoice_lines_account_id_idx`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoice_payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` INTEGER NULL,
    `account_id` INTEGER NULL,
    `date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `memo` VARCHAR(191) NULL,
    `amount` DECIMAL(10, 0) NULL,

    INDEX `invoice_payments_invoice_id_idx`(`invoice_id`),
    INDEX `invoice_payments_account_id_idx`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NULL,
    `inventory_id` INTEGER NULL,
    `code` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `cost` DECIMAL NULL,
    `price` DECIMAL NULL,
    `image` VARCHAR(191) NULL,
    `started_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive` BOOLEAN NULL DEFAULT true,

    UNIQUE INDEX `items_code_key`(`code`),
    UNIQUE INDEX `items_name_key`(`name`),
    INDEX `items_category_id_idx`(`category_id`),
    INDEX `items_inventory_id_idx`(`inventory_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `parent_id` INTEGER NULL,

    UNIQUE INDEX `categories_name_key`(`name`),
    INDEX `categories_parent_id_idx`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `inventories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `groups` ADD CONSTRAINT `groups_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `names` ADD CONSTRAINT `names_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chart_accounts` ADD CONSTRAINT `chart_accounts_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `chart_accounts`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bills` ADD CONSTRAINT `bills_entity_id_fkey` FOREIGN KEY (`entity_id`) REFERENCES `names`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bills` ADD CONSTRAINT `bills_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bills` ADD CONSTRAINT `bills_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `chart_accounts`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bill_lines` ADD CONSTRAINT `bill_lines_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bill_lines` ADD CONSTRAINT `bill_lines_bill_id_fkey` FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bill_lines` ADD CONSTRAINT `bill_lines_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `chart_accounts`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bill_payments` ADD CONSTRAINT `bill_payments_bill_id_fkey` FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bill_payments` ADD CONSTRAINT `bill_payments_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `chart_accounts`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `statuses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_entityId_fkey` FOREIGN KEY (`entityId`) REFERENCES `names`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipments` ADD CONSTRAINT `shipments_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipments` ADD CONSTRAINT `shipments_shipper_id_fkey` FOREIGN KEY (`shipper_id`) REFERENCES `shippers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipments` ADD CONSTRAINT `shipments_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shippers` ADD CONSTRAINT `shippers_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_entity_id_fkey` FOREIGN KEY (`entity_id`) REFERENCES `names`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `chart_accounts`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_lines` ADD CONSTRAINT `invoice_lines_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_lines` ADD CONSTRAINT `invoice_lines_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_lines` ADD CONSTRAINT `invoice_lines_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `chart_accounts`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_payments` ADD CONSTRAINT `invoice_payments_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice_payments` ADD CONSTRAINT `invoice_payments_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `chart_accounts`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_inventory_id_fkey` FOREIGN KEY (`inventory_id`) REFERENCES `inventories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
