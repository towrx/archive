const BASE_URL = "https://timstreams.st";
const BASE_API_URL = "https://api.vixnuvew.uk";
const FALLBACK_POSTER_URL = "https://i.ibb.co/rKHf363x/fallback-thumbnail.webp";

// =============================================================================
// NHÓM 1: CẤU HÌNH (Config & Metadata)
// =============================================================================

function getManifest() {
  return JSON.stringify({
    id: "timstreams",
    name: "Timstreams",
    version: "1.1.1",
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
      slug: "replays",
      title: "Latest Replays 🎞️",
      type: "Horizontal",
      path: ""
    },
    {
      slug: "channels",
      title: "Television 24/7 📺",
      type: "Grid",
      path: ""
    }
  ]);
}

function getPrimaryCategories() {
  return JSON.stringify([
    { name: "LIVE EVENTS", slug: "live-upcoming" },
    { name: "Latest Replays", slug: "replays" },
    { name: "Television 24/7", slug: "channels" }
  ]);
}

function getFilterConfig() {
  return JSON.stringify({ sort: [], category: [] });
}

// =============================================================================
// NHÓM 2: SINH URL (App gọi hàm → nhận URL → tự fetch HTTP)
// =============================================================================

function getUrlList(slug, filtersJson) {
  return `${BASE_API_URL}/api/${slug}`;
}

function getUrlSearch(keyword, filtersJson) {
  return `${BASE_API_URL}/api/channels?search=${encodeURIComponent(keyword?.trim())}`;
}

function getUrlDetail(path) {
  if (!path) return "";
  if (path.indexOf("http") === 0) return path;
  if (path.charAt(0) !== "/") path = "/" + path;
  return `${BASE_API_URL}/api${path}`;
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
    let streams = data?.events || data?.channels || data?.replays;
    const items = [];

    // Lọc theo search keyword từ ?search= trong apiUrl
    const keyword = extractParamFromUrl(apiUrl, "search");
    streams = filterByKeyword(streams, keyword);

    streams.forEach((stream) => {
      const { url, name, logo, genre, time } = stream;
      const description = `Event "${name}" is hosted on server Timstreams.`;
      const tRInfo = data?.genres?.[genre] || "REPLAY";
      const path =
        (data?.events
          ? "/live-upcoming"
          : data?.channels
            ? "/channels"
            : "/replays") + `?slug=${url}`;
      const tLInfo = data?.channels
        ? "LIVE 24/7"
        : data?.replays
          ? "📀"
          : isLive(time)
            ? "LIVE"
            : formatDateTimeGMT7(time);

      items.push({
        id: path,
        title: name,
        description: description,
        posterUrl: logo || FALLBACK_POSTER_URL,
        backdropUrl: logo || FALLBACK_POSTER_URL,
        quality: tLInfo,
        episode_current: tRInfo
      });
    });

    return JSON.stringify({
      items: items,
      pagination: { currentPage: 1, totalPages: 1 }
    });
  } catch (e) {
    console.log(e);
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
  const data = JSON.parse(html);
  const streams = data?.events || data?.replays || data?.channels;

  if (!Array.isArray(streams) || streams?.length === 0)
    return JSON.stringify({
      id: "",
      title: "⚠️ Link Not Found!",
      posterUrl: FALLBACK_POSTER_URL,
      backdropUrl: FALLBACK_POSTER_URL,
      servers: []
    });

  const slug = extractParamFromUrl(apiUrl, "slug");
  const stream = findStreamBySlug(streams, slug);
  const { url, name, logo, genre, time } = stream || {};
  const type = genre && (data?.genres[genre] || data?.genres[genre]);
  const dateTime =
    data?.events && isLive(time) ? "LIVE" : formatDateTimeGMT7(time);
  const description = `Event "${name}" is hosted on server Timstreams`;
  const episodes = [];

  stream?.streams?.forEach((item, index) => {
    let { name, url } = item;
    name = data?.events || data?.replays ? name : `Link - ${index + 1}`;
    const slug = `${stream.url}-${index + 1}`;

    episodes.push({
      id: url,
      name: name,
      slug: slug
    });
  });

  const servers = [{ name: "Timstreams", episodes: episodes }];

  return JSON.stringify({
    id: url,
    title: name,
    posterUrl: logo || FALLBACK_POSTER_URL,
    backdropUrl: logo || FALLBACK_POSTER_URL,
    quality: type,
    episode_current: dateTime,
    description: description,
    servers: servers
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
// NHÓM 4: HELPERS
// =============================================================================

// GMT-4
const isLive = (time) => Date.now() >= new Date(time + ":00-04:00").getTime();

function formatDateTimeGMT7(timestamp) {
  if (!timestamp) return "";
  if (!timestamp.includes(":")) return timestamp;

  const [datePart, timePart] = timestamp.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, hour + 11, minute));

  return (
    `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}-` +
    `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`
  );
}

function extractParamFromUrl(url, param) {
  if (!url) return "";
  var match = url.match(new RegExp("[?&]" + param + "=([^&]+)"));
  return match ? decodeURIComponent(match[1]) : "";
}

function findStreamBySlug(streams, slug) {
  if (!Array.isArray(streams) || streams?.length === 0) return undefined;
  return streams.find((stream) => stream?.url === slug);
}

function filterByKeyword(streams, keyword) {
  if (keyword) {
    streams = streams.filter(function (stream) {
      return stream?.name?.toLowerCase()?.indexOf(keyword.toLowerCase()) >= 0;
    });
  }

  return streams;
}
