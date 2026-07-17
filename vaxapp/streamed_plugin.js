// =============================================================================
// NHÓM 1: CẤU HÌNH (Config & Metadata)
// =============================================================================

const BASE_URL = "https://streamed.pk";

function getManifest() {
  return JSON.stringify({
    id: "streamed",
    name: "streamed",
    version: "1.0.0",
    baseUrl: BASE_URL,
    iconUrl: "https://raw.githubusercontent.com/towrx/archive/refs/heads/main/vaxapp/logos/streamed.png",
    isEnabled: true,
    isAdult: false,
    type: "VIDEO",
    layoutType: "VERTICAL",
    playerType: "embed",
  });
}

function getHomeSections() {
  return JSON.stringify([
    { slug: "live", title: "🔴 LIVE", type: "Horizontal", path: "" },
    { slug: "all-today", title: "Today's Matches", type: "Horizontal", path: "" },
    { slug: "all", title: "All Matches", type: "Horizontal", path: "" },
    { slug: "fight", title: "Fight (UFC, Boxing)", type: "Horizontal", path: "" },
    { slug: "football", title: "Football", type: "Horizontal", path: "" },
    { slug: "billiards", title: "Billiards", type: "Horizontal", path: "" },
    { slug: "basketball", title: "Basketball", type: "Horizontal", path: "" },
    { slug: "golf", title: "Golf", type: "Horizontal", path: "" },
    { slug: "other", title: "Other", type: "Horizontal", path: "" },
  ]);
}

function getPrimaryCategories() {
  return JSON.stringify([
    { name: "Basketball", slug: "basketball" },
    { name: "Football", slug: "football" },
    { name: "American Football", slug: "american-football" },
    { name: "Hockey", slug: "hockey" },
    { name: "Baseball", slug: "baseball" },
    { name: "Motor Sports", slug: "motor-sports" },
    { name: "Fight (UFC, Boxing)", slug: "fight" },
    { name: "Tennis", slug: "tennis" },
    { name: "Rugby", slug: "rugby" },
    { name: "Golf", slug: "golf" },
    { name: "Billiards", slug: "billiards" },
    { name: "AFL", slug: "afl" },
    { name: "Darts", slug: "darts" },
    { name: "Cricket", slug: "cricket" },
    { name: "Other", slug: "other" },
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
  var page = JSON.parse(filtersJson || "{}").page || 1;
  return "https://streamed.pk/api/matches/all";
}

function getUrlDetail(slug) {
  if (!slug) return "";
  if (slug.indexOf("http") === 0) return slug;
  if (slug.charAt(0) !== "/") slug = "/" + slug;
  return BASE_URL + slug;
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
      const time = new Date(item.date).toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
      });
      item.sources.forEach((source) => {
        items.push({
          id: `/api/stream/${source.source}/${source.id}`,
          title: item.title,
          description: `Server: ${source.source.toUpperCase()} + Time: ${time}`,
          posterUrl: imageUrl,
          backdropUrl: imageUrl,
          // year: time || 0,
          year: 0,
        });
      });
    });

    return JSON.stringify({
      items: items,
      pagination: { currentPage: 1, totalPages: 1 },
    });
  } catch (e) {
    return JSON.stringify({ items: [], pagination: { currentPage: 1, totalPages: 1 } });
  }
}

function parseSearchResponse(html) {
  return parseListResponse(html);
}

function parseMovieDetail(html) {
  var stream = JSON.parse(html);
  var servers = [];
  stream.map((item, index) => {
    servers.push({
      name: "Server: " + stream[0].source,
      episodes: [{ id: item.embedUrl, name: `${item.hd ? "FullHD" : "HD or SD"}`, slug: "/" + (index + 1) }],
    });
  });
  return JSON.stringify({
    id: stream[0].id,
    title: stream[0].id,
    posterUrl: "",
    backdropUrl: "",
    description: "",
    servers: servers,
    quality: "",
    year: 2024,
    rating: "",
    status: "",
    duration: "",
    casts: "",
    director: "",
    category: "",
  });
}

function parseDetailResponse(html, pageUrl) {
  return JSON.stringify({
    url: pageUrl,
    headers: {
      Referer: BASE_URL + "/",
    },
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

function getPosterUrl(item) {
  try {
    const logoTeamHome = item?.teams?.home?.badge;
    const logoTeamAway = item?.teams?.away?.badge;
    const imagePath = item?.poster ? item.poster : `/api/images/poster/${logoTeamHome}/${logoTeamAway}.webp`;
    return BASE_URL + imagePath;
  } catch (e) {
    return "";
  }
}
