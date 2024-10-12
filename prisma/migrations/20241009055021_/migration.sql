-- CreateTable
CREATE TABLE "_UserFavourite" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavourite_AB_unique" ON "_UserFavourite"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavourite_B_index" ON "_UserFavourite"("B");

-- AddForeignKey
ALTER TABLE "_UserFavourite" ADD CONSTRAINT "_UserFavourite_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavourite" ADD CONSTRAINT "_UserFavourite_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
