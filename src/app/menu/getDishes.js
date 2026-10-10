export async function getDishes() {
    const { dishes } = await import('./dishes.js');

    return dishes;
}