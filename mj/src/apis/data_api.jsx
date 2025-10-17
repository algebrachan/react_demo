import { base_url, getParams, postJson } from "./instance";

export const rmsInsertMeltRecipe = (param, then, error) => {
  const url = base_url + `/api/recipe_router/insert_melt_recipe`;
  postJson(url, param, then, error);
};
export const rmsSaveMeltRecipe = (param, then, error) => {
  const url = base_url + `/api/recipe_router/save_melt_recipe`;
  postJson(url, param, then, error);
};
export const rmsGetMeltRecipes = (param, then, error) => {
  const url = base_url + `/api/recipe_router/get_melt_recipes`;
  postJson(url, param, then, error);
};
export const rmsDelMeltRecipes = (param, then, error) => {
  const url = base_url + `/api/recipe_router/delete_melt_recipe`;
  postJson(url, param, then, error);
};
export const rmsGetMeltRecipeParams = (param, then, error) => {
  const url = base_url + `/api/recipe_router/get_melt_recipe_params`;
  postJson(url, param, then, error);
};
export const rmsImportRecipeParams = (param, then, error) => {
  const url = base_url + `/api/recipe_router/import_recipe_params`;
  postJson(url, param, then, error);
};
export const rmsGetRecipeList = (then, error) => {
  const url = base_url + `/api/recipe_router/get_recipe_list`;
  getParams(url, {}, then, error);
};

export const rmsGetManufacturingConditionRecipe = (param, then, error) => {
  const url =
    base_url + `/api/recipe_router/get_manufacturing_condition_recipes`;
  postJson(url, param, then, error);
};
export const rmsDelManufacturingConditionRecipe = (param, then, error) => {
  const url =
    base_url + `/api/recipe_router/delete_manufacturing_condition_recipe`;
  postJson(url, param, then, error);
};
export const rmsSaveManufacturingConditionRecipe = (param, then, error) => {
  const url =
    base_url + `/api/recipe_router/save_manufacturing_condition_recipe`;
  postJson(url, param, then, error);
};
export const rmsGetManufacturingRecipeParams = (param, then, error) => {
  const url = base_url + `/api/recipe_router/get_manufacturing_recipe_params`;
  postJson(url, param, then, error);
};
