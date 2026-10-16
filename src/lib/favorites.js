import "server-only";

const store = globalThis;

if (!store.__addisEatsFavorites) {
  store.__addisEatsFavorites = new Map();
}

const favoritesByUser = store.__addisEatsFavorites;

export function getFavoriteIdsForUser(userId) {
  if (typeof userId !== "string" || !userId) return [];

  return [...(favoritesByUser.get(userId) ?? new Set())];
}

export function setFavoriteForUser(userId, dishId, isFavorite) {
  if (typeof userId !== "string" || !userId) return false;

  let favoriteIds = favoritesByUser.get(userId);

  if (isFavorite) {
    if (!favoriteIds) {
      favoriteIds = new Set();
      favoritesByUser.set(userId, favoriteIds);
    }

    favoriteIds.add(dishId);
    return true;
  }

  if (!favoriteIds) return true;

  favoriteIds.delete(dishId);
  if (favoriteIds.size === 0) favoritesByUser.delete(userId);
  return true;
}
