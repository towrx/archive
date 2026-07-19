const BASE_URL = "https://streamed.pk";
const FALLBACK_POSTER_URL =
  "https://raw.githubusercontent.com/towrx/archive/refs/heads/main/vaxapp/images/fallback-thumbnail.webp";
const SELECTION_GUIDE = `\n\n✅The format of each live event link is: [VideoQuality - ConcurrentViewers].\n✅Video quality: Prefer at least HD.\n✅Concurrent viewers: higher is better, 1N = 1000 concurrent viewers.`;

// =============================================================================
// NHÓM 1: CẤU HÌNH (Config & Metadata)
// =============================================================================

function getManifest() {
  return JSON.stringify({
    id: "streamed",
    name: "Streamed",
    version: "1.1.1",
    baseUrl: BASE_URL,
    iconUrl:
      "https://raw.githubusercontent.com/towrx/archive/refs/heads/main/vaxapp/images/streamed-logo.png",
    isEnabled: true,
    isAdult: false,
    type: "LIVE",
    layoutType: "HORIZONTAL",
    playerType: "embedtoexoplay"
  });
}

https: function getHomeSections() {
  return JSON.stringify([
    {
      slug: "live/popular-viewcount",
      title: "🔴 LIVE (popular by viewers)",
      type: "Horizontal",
      path: ""
    },
    {
      slug: "live/popular",
      title: "🔴 LIVE",
      type: "Horizontal",
      path: ""
    },
    {
      slug: "fight",
      title: "Fight (Boxing, UFC) 🥊",
      type: "Horizontal",
      path: ""
    },
    { slug: "football", title: "Football ⚽", type: "Horizontal", path: "" },
    {
      slug: "motor-sports",
      title: "Motor Sports 🏁",
      type: "Horizontal",
      path: ""
    },
    { slug: "billiards", title: "Billiards 🎱", type: "Horizontal", path: "" },
    {
      slug: "basketball",
      title: "Basketball 🏀",
      type: "Horizontal",
      path: ""
    },
    {
      slug: "american-football",
      title: "American Football 🏉",
      type: "Horizontal",
      path: ""
    },
    { slug: "golf", title: "Golf 🚩", type: "Horizontal", path: "" },
    { slug: "tennis", title: "Tennis 🎾", type: "Horizontal", path: "" },
    { slug: "other", title: "Other 🏳️‍🌈", type: "Horizontal", path: "" },
    {
      slug: "all-today",
      title: "Today's Matches 📋",
      type: "Horizontal",
      path: ""
    }
  ]);
}

function getPrimaryCategories() {
  return JSON.stringify([
    { name: "Fight (Boxing, UFC)", slug: "fight" },
    { name: "Football", slug: "football" },
    { name: "Basketball", slug: "basketball" },
    { name: "American Football", slug: "american-football" },
    { name: "Motor Sports", slug: "motor-sports" },
    { name: "Tennis", slug: "tennis" },
    { name: "Golf", slug: "golf" },
    { name: "Billiards", slug: "billiards" },
    { name: "Baseball", slug: "baseball" },
    { name: "Cricket", slug: "cricket" },
    { name: "AFL", slug: "afl" },
    { name: "Darts", slug: "darts" },
    { name: "Hockey", slug: "hockey" },
    { name: "Rugby", slug: "rugby" },
    { name: "Other", slug: "other" }
  ]);
}

function getFilterConfig() {
  return JSON.stringify({ sort: [], category: [] });
}

// =============================================================================
// NHÓM 2: SINH URL (App gọi hàm → nhận URL → tự fetch HTTP)
// =============================================================================

function getUrlList(slug, filtersJson) {
  const basePath = "/api/matches/";
  return BASE_URL + basePath + slug;
}

function getUrlSearch(keyword, filtersJson) {
  return "https://streamed.pk/api/matches/all";
}

function getUrlDetail(path) {
  if (!path) return "";
  if (path.indexOf("http") === 0) return path;
  return BASE_URL + path;
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

function parseListResponse(html) {
  try {
    const data = JSON.parse(html);
    const items = [];
    data.forEach((item) => {
      const imageUrl = getThumbnailUrl(item);
      item.sources.forEach((source) => {
        const path = `/api/stream/${source?.source}/${source?.id}`;
        const serverName = source?.source?.toUpperCase();
        const title = item?.title?.trim();
        const dateTime = formatDateTimeGMT7(item?.date);
        const category = item?.category?.toUpperCase() || "";

        items.push({
          id: path,
          title: title,
          description: `Event "${title}" is hosted on server ${serverName}.`,
          posterUrl: imageUrl,
          backdropUrl: imageUrl,
          quality: dateTime,
          episode_current: serverName ? `Server: ${serverName}` : "",
          lang: category
        });
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
  const stream = JSON.parse(html);

  if (!Array.isArray(stream) || stream.length === 0)
    return JSON.stringify({
      id: "",
      title: "⚠️ Link Not Found!",
      posterUrl: FALLBACK_POSTER_URL,
      backdropUrl: FALLBACK_POSTER_URL,
      servers: []
    });

  const id = stream[0]?.id || "";
  const title =
    stream[0]?.id
      ?.split(/[-_]+/)
      .filter(Boolean)
      .map((w, i) =>
        i === 0 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)
      )
      .join(" ") || "";
  const episodes = [];
  const serverName = stream?.[0]?.source?.toUpperCase();

  stream.map((item, index) => {
    const embedUrl = item?.embedUrl;
    const quality = item?.hd ? "HD" : "SD";
    const slug = item?.streamNo;
    const viewerCount = formatViewerCount(item?.viewers);

    episodes.push({
      id: embedUrl,
      name: `${quality}-${viewerCount}`,
      slug: slug
    });
  });

  return JSON.stringify({
    id: id,
    title: title,
    posterUrl: FALLBACK_POSTER_URL,
    backdropUrl: FALLBACK_POSTER_URL,
    lang: `SERVER: ${serverName}`,
    description: `Event "${title}" is hosted on server ${serverName}.${SELECTION_GUIDE}`,
    servers: [{ name: serverName, episodes: episodes }]
  });
}

function parseDetailResponse(html, sourceUrl) {
  return JSON.stringify({
    url: sourceUrl,
    headers: {
      Referer: "https://embed.st/"
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

  const date = new Date(timestamp);
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const gmt7 = new Date(utc + 7 * 60 * 60 * 1000);
  const hh = String(gmt7.getHours()).padStart(2, "0");
  const mm = String(gmt7.getMinutes()).padStart(2, "0");
  const dd = String(gmt7.getDate()).padStart(2, "0");
  const MM = String(gmt7.getMonth() + 1).padStart(2, "0");

  return `${hh}:${mm} - ${dd}/${MM}`;
}

function formatViewerCount(viewerCount) {
  return /^\d+$/.test(viewerCount)
    ? +viewerCount < 1000
      ? viewerCount + "👁️"
      : String(Math.floor(+viewerCount / 1000)) + "N👁️"
    : viewerCount;
}
