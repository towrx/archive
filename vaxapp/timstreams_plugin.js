const BASE_URL = "https://timstreams.st";
const BASE_API_URL = "https://api.vixnuvew.uk/api/";
const FALLBACK_POSTER_URL =
  "https://raw.githubusercontent.com/towrx/archive/refs/heads/main/vaxapp/images/fallback-thumbnail.webp";
const SELECTION_GUIDE = `\n\n✅The format of each live event link is: [VideoQuality - ConcurrentViewers].\n✅Video quality: Prefer at least HD.\n✅Concurrent viewers: higher is better, 1N = 1000 concurrent viewers.`;

// =============================================================================
// NHÓM 1: CẤU HÌNH (Config & Metadata)
// =============================================================================

function getManifest() {
  return JSON.stringify({
    id: "timstreams",
    name: "Timstreams",
    version: "1.0.0",
    baseUrl: BASE_URL,
    iconUrl: "https://i.ibb.co/WN9gstLN/logo.png",
    isEnabled: true,
    isAdult: false,
    type: "VIDEO",
    layoutType: "HORIZONTAL",
    playerType: "embedtoexoplay"
  });
}

https: function getHomeSections() {
  return JSON.stringify([
    {
      slug: "live-upcoming",
      title: "🔴 LIVE EVENTS",
      type: "Horizontal",
      path: ""
    }
    // {
    //   slug: "channels",
    //   title: "Televion 24/7 📺",
    //   type: "Horizontal",
    //   path: ""
    // },
    // {
    //   slug: "replays",
    //   title: "Latest Replays 🎥",
    //   type: "Horizontal",
    //   path: ""
    // }
  ]);
}

function getPrimaryCategories() {
  return JSON.stringify([
    { name: "LIVE EVENTS", slug: "live-upcoming" },
    { name: "Televion 24/7", slug: "channels" },
    { name: "Latest Replays", slug: "replays" }
  ]);
}

function getFilterConfig() {
  return JSON.stringify({ sort: [], category: [] });
}

// =============================================================================
// NHÓM 2: SINH URL (App gọi hàm → nhận URL → tự fetch HTTP)
// =============================================================================

function getUrlList(slug, filtersJson) {
  return BASE_API_URL + slug;
}

function getUrlSearch(keyword, filtersJson) {
  return "";
}

function getUrlDetail(path) {
  if (!path) return "";
  if (path.indexOf("http") === 0) return path;
  return BASE_API_URL + path;
}

function getUrlCategories() {
  return "";
}
function getUrlCountries() {
  return "";
}
function getUrlYears() {
  return "";
}

// =============================================================================
// NHÓM 3: PARSER (App fetch URL xong → ném HTML/JSON thô vào đây → bạn parse)
// =============================================================================

// {
//     "events": [
//         {
//             "url": "spain-vs-argentina",
//             "name": "Spain vs. Argentina",
//             "logo": "https://static-media.fox.com/fmc/prod/artwork/MC-1319675/0o7jyhspsrtv8h7a.jpg",
//             "genre": 1,
//             "time": "2026-07-19T15:00",
//             "isevent": true,
//             "vip": false,
//             "featured": false,
//             "streams": [
//                 {
//                     "name": "FOX USA",
//                     "url": "https://logic.icelanders.st/embed/fox-usa",
//                     "vip": false
//                 },
//                 {
//                     "name": "FOX 4K USA",
//                     "url": "https://logic.icelanders.st/embed/fox4k-usa",
//                     "vip": false
//                 },
//                 {
//                     "name": "Telemundo USA",
//                     "url": "https://logic.icelanders.st/embed/telemundo-usa",
//                     "vip": false
//                 },
//                 {
//                     "name": "UNIVERSO USA",
//                     "url": "https://logic.icelanders.st/embed/universo-usa",
//                     "vip": false
//                 },
//                 {
//                     "name": "UNIVERSO 4K USA",
//                     "url": "https://logic.icelanders.st/embed/universo4k-usa",
//                     "vip": false
//                 },
//                 {
//                     "name": "FUSSBALL.TV 1 4K Deutsch",
//                     "url": "https://logic.icelanders.st/embed/fussballtv1uhd-de",
//                     "vip": false
//                 },
//                 {
//                     "name": "FUSSBALL.TV 1 4K Deutsch No Commentary",
//                     "url": "https://logic.icelanders.st/embed/fussballtvuhd-de",
//                     "vip": false
//                 },
//                 {
//                     "name": "RAI 4K Italia",
//                     "url": "https://logic.icelanders.st/embed/rai4k-it",
//                     "vip": false
//                 },
//                 {
//                     "name": "beIN Sports MENA 4K",
//                     "url": "https://logic.icelanders.st/embed/beinsportsuhd-sa",
//                     "vip": false
//                 },
//                 {
//                     "name": "ITV 1 UK",
//                     "url": "https://logic.icelanders.st/embed/itv-uk",
//                     "vip": false
//                 },
//                 {
//                     "name": "beIN Sports MAX MENA",
//                     "url": "https://logic.icelanders.st/embed/beinsportsmax-sa",
//                     "vip": false
//                 },
//                 {
//                     "name": "DAZN Mundial Spain",
//                     "url": "https://logic.icelanders.st/embed/daznmundial-es",
//                     "vip": false
//                 },
//                 {
//                     "name": "TSN Canada",
//                     "url": "https://logic.icelanders.st/embed/tsn1-ca",
//                     "vip": false
//                 },
//                 {
//                     "name": "DD Sports India",
//                     "url": "https://logic.icelanders.st/embed/ddsports-in",
//                     "vip": false
//                 },
//                 {
//                     "name": "CazeTV Brasil",
//                     "url": "https://logic.icelanders.st/embed/cazetv-br",
//                     "vip": false
//                 },
//                 {
//                     "name": "DSports Argentina",
//                     "url": "https://logic.icelanders.st/embed/dsport-ar ",
//                     "vip": false
//                 },
//                 {
//                     "name": "TVP SPORT Polska",
//                     "url": "https://logic.icelanders.st/embed/tvpsport-pl",
//                     "vip": false
//                 }
//             ]
//         }
//     ],
//     "genres": {
//         "1": "Soccer",
//         "2": "Motorsport",
//         "3": "Mixed Martial Arts",
//         "4": "Bare Knuckles",
//         "5": "Boxing",
//         "6": "Profesional Wrestling",
//         "7": "Basketball",
//         "8": "American Football",
//         "9": "Baseball",
//         "10": "Tennis",
//         "11": "Hockey",
//         "12": "Darts",
//         "13": "Cricket",
//         "14": "Cycling",
//         "15": "Rugby",
//         "16": "Rugby",
//         "17": "Live Shows",
//         "18": "Others / Uncategorized"
//     }
// }

function parseListResponse(html) {
  try {
    const data = JSON.parse(html);
    // const {events, channels, replays} = data;
    const objs = data?.events || data?.channels || data?.replays;
    const items = [];

    objs.forEach((obj) => {
      const { url, name, logo, genre, time } = obj;

      items.push({
        id: data?.events
          ? "watch/" + url
          : data?.channels
            ? "channels"
            : "replays",
        title: name,
        description: `Event "${name}" is hosted on server "TIMSTREAMS".`,
        posterUrl: logo || FALLBACK_POSTER_URL,
        backdropUrl: logo || FALLBACK_POSTER_URL,
        quality: formatDateTimeGMT7(time) || "LIVE 24/7",
        episode_current: data?.genres?.[genre] || "REPLAY"
      });
    });

    return JSON.stringify({
      items: items,
      pagination: { currentPage: 1, totalPages: 1 }
    });
  } catch (e) {
    return JSON.stringify({
      items: [],
      pagination: { currentPage: 1, totalPages: 1 }
    });
  }
}

function parseSearchResponse(html) {
  return parseListResponse(html);
}

function parseMovieDetail(html) {
  const obj = JSON.parse(html);

  if (!Array.isArray(obj?.item?.streams) || obj?.item?.streams.length === 0)
    return JSON.stringify({
      id: "",
      title: "⚠️ Link Not Found!",
      posterUrl: FALLBACK_POSTER_URL,
      backdropUrl: FALLBACK_POSTER_URL,
      servers: []
    });
  const { url, name, logo, genre, time, streams } = obj.item;
  const episodes = [];

  streams.map((stream, index) => {
    const { name, url } = stream;
    episodes.push({
      id: url,
      name: name,
      slug: url
    });
  });

  return JSON.stringify({
    id: url,
    title: name,
    posterUrl: logo || FALLBACK_POSTER_URL,
    backdropUrl: logo || FALLBACK_POSTER_URL,
    lang: `${obj?.genre_name[genre]} - ${formatDateTimeGMT7(time)}`,
    description: `Event "${name}" is hosted on server TIMSTREAMS`,
    servers: [{ name: "TIMSTREAMS", episodes: episodes }]
  });
}

function parseDetailResponse(html, sourceUrl) {
  return JSON.stringify({
    url: sourceUrl,
    headers: {
      Referer: "https://logic.icelanders.st/"
    },
    isEmbed: false
  });
}

function parseEmbedResponse(html, sourceUrl) {
  return JSON.stringify({ url: "", isEmbed: false });
}

function parseCategoriesResponse(html) {
  return "[]";
}
function parseCountriesResponse(html) {
  return "[]";
}
function parseYearsResponse(html) {
  return "[]";
}

// =============================================================================
// NHÓM 4: handmade function
// =============================================================================

function getThumbnailUrl(item) {
  try {
    if (item?.poster) return BASE_URL + item.poster;
    const homeTeamLogoSlug = item?.teams?.home?.badge;
    const awayTeamLogoSlug = item?.teams?.away?.badge;
    if (homeTeamLogoSlug && awayTeamLogoSlug)
      return (
        BASE_URL +
        `/api/images/poster/${homeTeamLogoSlug}/${awayTeamLogoSlug}.webp`
      );
    return FALLBACK_POSTER_URL;
  } catch (e) {
    return "";
  }
}

function formatDateTimeGMT7(timestamp) {
  if (!timestamp) return "";
  if (!timestamp.includes(":")) return timestamp;

  const [datePart, timePart] = timestamp.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // GMT-4 -> GMT+7 (+11 giờ)
  const d = new Date(Date.UTC(year, month - 1, day, hour + 11, minute));

  return (
    `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} - ` +
    `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`
  );
}
