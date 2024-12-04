import type { FeatureCollection } from "geojson";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { useLogger } from "nuxt/kit";
import type { RestaurantFeature } from "~/models/restaurant-feature";

const logger = useLogger();

const OUTPUT_PATH = "./public/geojson.json";

export async function runDataExctractorApi() {
  if (!process.env.DATA_COOKIE) {
    throw Error("Var DATA_COOKIE not defined!");
  }

  if (existsSync(OUTPUT_PATH)) {
    logger.info(
      `"geojson.json" file exists... skip data extraction process...`
    );
    return;
  }

  const cookie = process.env.DATA_COOKIE;
  const features: GeoJSON.Feature[] = [];
  const maxPP = 100;

  for (let pp = 1; pp <= maxPP; pp++) {
    try {
      console.info(`Fetching page ${pp}...`);
      // TODO change
      const rawPayload = await getResp(
        cookie,
        pp,
        process.env.DATA_U!,
        process.env.DATA_CITTA!,
        process.env.DATA_LAT!,
        process.env.DATA_LNG!
      );

      if (rawPayload.status === "ok") {
        if (rawPayload.poses.length === 0) {
          // Stop, we have no more data
          console.info("Search complete");
          pp = maxPP + 1;
        }

        for (let i = 0; i < rawPayload.poses.length; i++) {
          const pose = rawPayload.poses[i];

          const res: RestaurantFeature = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [pose.lng, pose.lat],
            },
            properties: {
              number: pose.data.id,
              name: pose.data.name,
              address: pose.data.location.address.street_address.street_name,
              city: pose.data.location.address.city,
              postalCode: pose.data.location.address.post_code,
              province: pose.data.location.address.province,
              region: pose.data.location.address.province,
              fraction: pose.data.location.address.city,
              type: pose.data.type,
              closingDay: "",
              vatNumber: "",
              supplierName: "",
              code: pose.data.code,
            },
          };

          features.push(res);
        }
      } else {
        console.error(`Error fetching page ${pp}`, rawPayload);
      }
    } catch (e) {
      console.error(`Real error fetching page ${pp}`, e);
    }

    // Wait some time between 1 and 2 seconds to avoid being blocked by the server
    // const delay = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
    // await new Promise((res) => setTimeout(res, delay));
  }

  const featureCollection: FeatureCollection = {
    type: "FeatureCollection",
    features,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(featureCollection, null, 2), {
    encoding: "utf-8",
  });
}

async function doRequest(
  cookie: string,
  page: number,
  u: string,
  citta: string,
  lat: string,
  lng: string
) {
  const res = await fetch("https://utilizzatori.day.it/ajax/user/poses", {
    method: "POST",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      Origin: "https://utilizzatori.day.it",
      DNT: "1",
      "Sec-GPC": "1",
      Connection: "keep-alive",
      Referer: "https://utilizzatori.day.it/day/it/pausa-pranzo/map",
      Cookie: cookie,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Priority: "u=0",
      TE: "trailers",
    },
    body: new URLSearchParams({
      op: "get-poses",
      kind: "pp",
      lat: lat,
      lng: lng,
      page: `${page}`,
      "search[nome-locale]": "",
      "search[citta]": citta,
      "search[indirizzo]": "",
      "search[mode]": "card",
      company: "",
      u: u,
    }),
  });

  return await res.json();
}

async function getResp(
  cookie: string,
  page: number,
  u: string,
  citta: string,
  lat: string,
  lng: string
) {
  return JSON.parse(readFileSync("data.json", { encoding: "utf-8" }))[page];
}
