import {
  createLoader,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"

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
  location: parseAsString
    .withDefault("all")
    .withOptions({ clearOnDefault: true }),
  type:parseAsString.withDefault("upcoming").withOptions({clearOnDefault:true})
  
}

export const loadWorkshopFilter = createLoader(params)
