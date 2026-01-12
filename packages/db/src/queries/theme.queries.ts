import { db, storeThemes, storeContent, NewStoreTheme, NewStoreContent } from "@vendly/db";

export const createStoreTheme = async (data: NewStoreTheme) => {
  await db.insert(storeThemes).values(data);
}; 

export const createStoreContent = async (data: NewStoreContent) => {
  await db.insert(storeContent).values(data);
};
