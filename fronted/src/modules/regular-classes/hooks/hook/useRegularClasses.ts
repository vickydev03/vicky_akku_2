// "use client";
// import { DEFAULT_PAGE } from "@/constant";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
// import {} from "nuqs/server";
const params = {
  page: parseAsInteger
    .withDefault(1)
    .withOptions({ clearOnDefault: true }),
    
  limit: parseAsInteger
    .withDefault(10)
    .withOptions({ clearOnDefault: true }),

     startDate: parseAsString
    .withDefault("")
    .withOptions({ clearOnDefault: true }),

  endDate: parseAsString
    .withDefault("")
    .withOptions({ clearOnDefault: true }),
    
  productId: parseAsString
    .withDefault("")
    .withOptions({ clearOnDefault: true }),

}

export const useRegularClassesFilters = () => {
  return useQueryStates(params);
};
