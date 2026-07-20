const BASE_URL = "https://timstreams.st";
const BASE_API_URL = "https://api.vixnuvew.uk/api/";
const FALLBACK_POSTER_URL = "https://i.ibb.co/rKHf363x/fallback-thumbnail.webp";

// =============================================================================
// NHÓM 1: CẤU HÌNH (Config & Metadata)
// =============================================================================

function getManifest() {
  return JSON.stringify({
    id: "timstreams",
    name: "Timstreams",
    version: "1.0.6",
    baseUrl: BASE_API_URL,
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
    },
    {
      slug: "channels",
      title: "Televion 24/7 📺",
      type: "Horizontal",
      path: ""
    },
    {
      slug: "replays",
      title: "Latest Replays 🎥",
      type: "Horizontal",
      path: ""
    }
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
  return (
    BASE_API_URL +
    "channels?search=" +
    encodeURIComponent(keyword?.trim() || "")
  );
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

function parseListResponse(html, apiUrl) {
  try {
    const data = JSON.parse(html);
    let objs = data?.events || data?.channels || data?.replays;
    const items = [];

    // Lọc theo search keyword từ ?search= trong apiUrl
    const searchKeyword = extractParamFromUrl(apiUrl, "search");
    if (searchKeyword) {
      objs = objs.filter(function (obj) {
        return (
          obj?.name
            ?.toLowerCase()
            ?.indexOf(searchKeyword?.toLowerCase() || "") >= 0
        );
      });
    }

    objs.forEach((obj) => {
      const { url, name, logo, genre, time } = obj;
      const path =
        (data?.events
          ? "live-upcoming"
          : data?.channels
            ? "channels"
            : "replays") + `?slug=${url}`;
      items.push({
        id: path,
        title: name,
        description: `Event "${name}" is hosted on server "TIMSTREAMS".`,
        posterUrl: logo || FALLBACK_POSTER_URL,
        backdropUrl: logo || FALLBACK_POSTER_URL,
        quality: data?.channels
          ? "LIVE 24/7"
          : data?.replays
            ? "📀"
            : formatDateTimeGMT7(time),
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

function parseSearchResponse(html, apiUrl) {
  return parseListResponse(html, apiUrl);
}

function parseMovieDetail(html, apiUrl) {
  const obj = JSON.parse(html);
  const sources = obj?.events || obj?.replays || obj?.channels;
  if (!Array.isArray(sources) || sources?.length === 0)
    return JSON.stringify({
      id: "",
      title: "⚠️ Link Not Found!",
      posterUrl: FALLBACK_POSTER_URL,
      backdropUrl: FALLBACK_POSTER_URL,
      servers: []
    });

  const slug = extractParamFromUrl(apiUrl, "slug");
  const source = findSourceBySlugInList(sources, slug);
  const { url, name, logo, genre, time, streams } = source || {};
  const episodes = [];

  source?.streams?.map((stream, index) => {
    const { name, url } = stream;
    episodes.push({
      id: url,
      name: obj?.events || obj?.replays ? name : `Link - ${index + 1}`,
      slug: url
    });
  });

  return JSON.stringify({
    id: url,
    title: name,
    posterUrl: logo || FALLBACK_POSTER_URL,
    backdropUrl: logo || FALLBACK_POSTER_URL,
    quality: genre && (obj?.genres[genre] || obj?.genres[genre]),
    episode_current: formatDateTimeGMT7(time),
    description: `Event "${name}" is hosted on server TIMSTREAMS`,
    lang: `SERVER: Timstreams`,
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

function formatDateTimeGMT7(timestamp) {
  if (!timestamp) return "";
  if (!timestamp.includes(":")) return timestamp;

  const [datePart, timePart] = timestamp.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, hour + 11, minute));

  return (
    `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} - ` +
    `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`
  );
}

function extractParamFromUrl(url, param) {
  if (!url) return "";
  var match = url.match(new RegExp("[?&]" + param + "=([^&]+)"));
  return match ? decodeURIComponent(match[1]) : "";
}

function findSourceBySlugInList(sources, slug) {
  if (!Array.isArray(sources) || sources?.length === 0) return undefined;
  return sources.find((source) => source?.url === slug);
}
