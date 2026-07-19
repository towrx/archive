const BASE_URL = "https://streamed.pk";
const FALLBACK_POSTER_URL =
  "https://raw.githubusercontent.com/towrx/archive/refs/heads/main/vaxapp/images/streamed-fallback-poster.webp";

// =============================================================================
// NHÓM 1: CẤU HÌNH (Config & Metadata)
// =============================================================================

function getManifest() {
  return JSON.stringify({
    id: "streamed",
    name: "Streamed",
    version: "1.0.2",
    baseUrl: BASE_URL,
    iconUrl:
      "https://raw.githubusercontent.com/towrx/archive/refs/heads/main/vaxapp/images/streamed-logo.png",
    isEnabled: true,
    isAdult: false,
    type: "VIDEO",
    layoutType: "VERTICAL",
    playerType: "embedtoexoplay"
  });
}

function getHomeSections() {
  return JSON.stringify([
    { slug: "live", title: "LIVE 🔴", type: "Horizontal", path: "" },
    {
      slug: "fight",
      title: "Fight (UFC, Boxing) 🥊",
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
      title: "USA Football 🏉",
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
    { name: "Fight", slug: "fight" },
    { name: "Football", slug: "football" },
    { name: "Basketball", slug: "basketball" },
    { name: "USA Football", slug: "american-football" },
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
  if (slug === "live") slug += "/popular";
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
    var data = JSON.parse(html);
    var items = [];
    data.forEach((item) => {
      const imageUrl = getPosterUrl(item);
      item.sources.forEach((source) => {
        items.push({
          id: `/api/stream/${source?.source}/${source?.id}`,
          title: item?.title,
          description: `Server: ${source?.source?.toUpperCase()}`,
          posterUrl: imageUrl,
          backdropUrl: imageUrl,
          quality: `${String(new Date(item?.date).getHours()).padStart(2, "0")}:${String(new Date(item?.date).getMinutes()).padStart(2, "0")}-${String(new Date(item?.date).getDate()).padStart(2, "0")}/${String(new Date(item?.date).getMonth() + 1).padStart(2, "0")}`,
          episode_current: source?.source?.toUpperCase(),
          lang:
            item?.category === "american-football"
              ? "USA Football"
              : item?.category?.toUpperCase() || ""
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
  var stream = JSON.parse(html);
  if (!Array.isArray(stream) || stream.length === 0)
    return JSON.stringify({
      id: "",
      title: "⚠️ Link Not Found!",
      posterUrl: FALLBACK_POSTER_URL,
      backdropUrl: FALLBACK_POSTER_URL,
      servers: []
    });
  var episodes = [];
  const serverName = stream?.[0]?.source?.toUpperCase();

  stream.map((item, index) => {
    episodes.push({
      id: item?.embedUrl,
      name: `${item?.hd ? `HD-${/^\d+$/.test(item?.viewers) ? (+item?.viewers < 1000 ? item?.viewers : String(Math.floor(+item?.viewers / 1000)) + "N") : item?.viewers}` : `SD-${/^\d+$/.test(item?.viewers) ? (+item?.viewers < 1000 ? item?.viewers : String(Math.floor(+item?.viewers / 1000)) + "N") : item?.viewers}`}`,
      slug: item?.streamNo
    });
  });
  return JSON.stringify({
    id: stream[0]?.id || "",
    title:
      stream[0]?.id
        ?.split(/[-_]+/)
        .filter(Boolean)
        .map((w, i) =>
          i === 0 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)
        )
        .join(" ") || "",
    posterUrl: FALLBACK_POSTER_URL,
    backdropUrl: FALLBACK_POSTER_URL,
    servers:
      serverName && episodes.length !== 0
        ? [{ name: serverName, episodes: episodes }]
        : []
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

function getPosterUrl(item) {
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
