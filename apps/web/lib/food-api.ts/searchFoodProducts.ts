// OpenFoodFacts API integration
export async function searchFoodProductsFromExternalAPI(query: string, limit = 10) {
  const response = await fetch(
    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=${limit}&fields=product_name,nutriments,quantity`
  );
  return response.json();
}

export async function getPopularIngredients(category: string) {
  // Search for popular items in each category
  return searchFoodProductsFromExternalAPI(category, 5);
}
