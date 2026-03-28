
import { db } from "../prisma/seed";

async function main() {
  console.log("Database URL present:", !!process.env.DATABASE_URL);
  console.log("Fetching locations...");
  try {
    const locations = await db.location.findMany({
        take: 1
    });
    console.log("Locations found:", locations);
    
    if (locations.length > 0) {
        console.log("First location keys:", Object.keys(locations[0]));
        if ('image' in locations[0]) {
            console.log("Image field is present:", locations[0].image);
        } else {
            console.log("Image field is MISSING from the object.");
        }
    } else {
        console.log("No locations found.");
    }

  } catch (error: any) {
    console.error("Error fetching locations:", error.message);
    if (error.meta) console.error("Error meta:", error.meta);
  }
}

main();
