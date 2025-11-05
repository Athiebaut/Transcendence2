/*
  Warnings:

  - Made the column `emailLower` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usernameLower` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailLower" TEXT NOT NULL,
    "usernameLower" TEXT NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "emailLower", "id", "passwordHash", "username", "usernameLower") SELECT "createdAt", "email", "emailLower", "id", "passwordHash", "username", "usernameLower" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_emailLower_key" ON "User"("emailLower");
CREATE UNIQUE INDEX "User_usernameLower_key" ON "User"("usernameLower");
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
