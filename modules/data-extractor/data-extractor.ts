import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { Buffer } from "node:buffer";
import { read, utils } from "xlsx";
import type { Restaurant } from "~/models/restaurant";
import type { FeatureCollection, Position } from "geojson";
import { useLogger } from "nuxt/kit";
import mbxGeocodingClient, {
  type GeocodeService,
} from "@mapbox/mapbox-sdk/services/geocoding";
import mbxClient from "@mapbox/mapbox-sdk";
import type { RestaurantFeature } from "~/models/restaurant-feature";

const logger = useLogger();

const OUTPUT_PATH = "./public/geojson.json";

export async function runDataExctractor(url: string) {
  if (existsSync(OUTPUT_PATH)) {
    logger.info(
      `"geojson.json" file exists... skip data extraction process...`
    );
    return;
  }

  // Create a generic mapbox client
  const mapboxClient = mbxClient({ accessToken: process.env.MAPBOX_TOKEN });
  // Create geocoding client
  const geocodingClient = mbxGeocodingClient(mapboxClient);

  let isUrl: boolean;

  try {
    new URL(url);
    isUrl = true;
  } catch (e) {
    isUrl = false;
  }

  let file: Buffer | null = null;

  if (isUrl) {
    const res = await fetch(url);

    if (!res.ok) {
      throw Error("Fail to download XLS " + res.json());
    }
    file = Buffer.from(await res.arrayBuffer());
  } else {
    file = readFileSync(url);
  }

  const workbook = read(file);

  const data = {
    restaurants: [] as Restaurant[],
  };

  var xlData: Record<string, any>[] = utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]]
  );

  let i = 0;
  for (let row of xlData) {
    i++;

    data.restaurants.push({
      number: i,
      name: row["__EMPTY_3"],
      address: row["__EMPTY_4"],
      city: row["__EMPTY_5"],
      postalCode: row["__EMPTY_6"],
      province: row["__EMPTY_7"],
      region: row["__EMPTY_8"],
      fraction: row["__EMPTY_9"],
      type: row["__EMPTY_10"],
      closingDay: row["__EMPTY_11"],
      vatNumber: row["__EMPTY_12"],
      supplierName: row["__EMPTY_13"],
      code: row["__EMPTY_14"],

      // number: row["N."],
      // name: row["Insegna"],
      // address: row["Indirizzo"],
      // city: row["Localita'"],
      // postalCode: row["CAP"],
      // province: row["Prov"],
      // region: row["CDREG"],
      // fraction: row["Frazione"],
      // type: row["Tipo locale"],
      // closingDay: row["Giorno di chiusura"],
      // vatNumber: row["PARTITA IVA"],
      // supplierName: row["RAG SOC FORNITORE"],
      // code: row["COD locale"],
    });
  }

  const features: GeoJSON.Feature[] = [];

  for (let i = 0; i < data.restaurants.length; i++) {
    const store = data.restaurants[i];

    if (i % 10 === 0) {
      logger.info(`Geocoding ${i}/${data.restaurants.length}...`);
    }

    const coordinates = await resolveCoordinates(geocodingClient, store);

    const res: RestaurantFeature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates,
      },
      properties: {
        number: store.number,
        name: store.name,
        address: store.address,
        city: store.city,
        postalCode: store.postalCode,
        province: store.province,
        region: store.region,
        fraction: store.fraction,
        type: store.type,
        closingDay: store.closingDay,
        vatNumber: store.vatNumber,
        supplierName: store.supplierName,
        code: store.code,
      },
    };

    features.push(res);
  }

  const featureCollection: FeatureCollection = {
    type: "FeatureCollection",
    features,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(featureCollection, null, 2), {
    encoding: "utf-8",
  });
}

async function resolveCoordinates(
  client: GeocodeService,
  store: Restaurant
): Promise<Position> {
  const queryText = `${store.address}, ${store.fraction}, ${store.city}, ${store.province}, ${store.postalCode}`;

  const response = await client
    .forwardGeocode({
      query: queryText,
      bbox: [10.17, 45.69, 12.48, 47.09],
      limit: 1,
      countries: ["IT"],
    })
    .send();

  if (response.statusCode != 200) {
    logger.warn(
      `Fail to geocode ${store.name} error ${response.statusCode}: ${response.rawBody}`
    );
    return [0, 0];
  }

  const match = response.body;
  return match.features[0]?.center;
}
