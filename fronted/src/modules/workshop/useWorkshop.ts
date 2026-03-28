import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

const params = {
  page: parseAsInteger
    .withDefault(1)
    .withOptions({ clearOnDefault: true }),
  limit: parseAsInteger
    .withDefault(10)
    .withOptions({ clearOnDefault: true }),
  location: parseAsString
    .withDefault("all")
    .withOptions({ clearOnDefault: true }),
  type:parseAsString.withDefault("upcoming").withOptions({clearOnDefault:true})
  
}

export const useWorkshopFilters = () => {
  return useQueryStates(params);
};
