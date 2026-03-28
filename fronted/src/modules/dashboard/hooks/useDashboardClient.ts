import {
  createLoader,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"

const params = {
  startDate: parseAsString
    .withDefault("")
    .withOptions({ clearOnDefault: true }),

  endDate: parseAsString
    .withDefault("")
    .withOptions({ clearOnDefault: true }),
  
  productId: parseAsString
    .withDefault("")
    .withOptions({ clearOnDefault: true }),

  page: parseAsInteger
    .withDefault(1)
    .withOptions({ clearOnDefault: true }),

  limit: parseAsInteger
    .withDefault(10)
    .withOptions({ clearOnDefault: true }),

}

export const loadDashboardUserFilter = createLoader(params)
