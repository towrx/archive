const BACKUP_DOMAINS = "https://ppv.domains/";
const BASE_URL = "https://api.ppv.st/api/streams";
const FALLBACK_POSTER_URL = "https://i.ibb.co/rKHf363x/fallback-thumbnail.webp";

const CATEGORY_MAP = {
  baseball: "Baseball",
  basketball: "Basketball",
  football: "Football",
  volleyball: "Volleyball",
  channels: "24/7 Streams"
};

// =============================================================================
// NHÓM 1: CẤU HÌNH (Config & Metadata)
// =============================================================================

function getManifest() {
  return JSON.stringify({
    id: "ppv",
    name: "PPV",
    version: "1.0.1",
    baseUrl: BASE_URL,
    iconUrl: "https://i.ibb.co/BHQSwhLX/ppv-logo.png",
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
      slug: "baseball",
      title: "Baseball ⚾",
      type: "Horizontal",
      path: ""
    },
    {
      slug: "basketball",
      title: "Basketball 🏀",
      type: "Horizontal",
      path: ""
    },
    {
      slug: "football",
      title: "Football ⚽",
      type: "Horizontal",
      path: ""
    },
    {
      slug: "volleyball 🏐",
      title: "Volleyball",
      type: "Horizontal",
      path: ""
    },
    {
      slug: "channels",
      title: "24/7 Streams 📺",
      type: "Horizontal",
      path: ""
    }
  ]);
}

function getPrimaryCategories() {
  return JSON.stringify([
    { name: "Baseball", slug: "baseball" },
    { name: "Football", slug: "basketball" },
    { name: "Football", slug: "football" },
    { name: "Volleyball", slug: "volleyball" },
    { name: "24/7 Streams", slug: "channels" }
  ]);
}

function getFilterConfig() {
  return JSON.stringify({ sort: [], category: [] });
}

// =============================================================================
// NHÓM 2: SINH URL (App gọi hàm → nhận URL → tự fetch HTTP)
// =============================================================================

function getUrlList(slug, filtersJson) {
  return BASE_URL + "?category=" + encodeURIComponent(slug);
}

function getUrlSearch(keyword, filtersJson) {
  return BASE_URL + "?search=" + encodeURIComponent(keyword?.trim() || "");
}

function getUrlDetail(path) {
  if (!path) return "";
  if (path.indexOf("http") === 0) return path;
  // if (path.charAt(0) !== "/") path = "/" + path;
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

function parseListResponse(html, apiUrl) {
  try {
    const data = JSON.parse(html);
    let streams = data?.streams;
    const items = [];

    streams = getStreamsBySearch(apiUrl, "search", streams);
    // filter by param category
    streams = getStreamsByParam(apiUrl, "category", streams);

    streams?.forEach((stream) => {
      const {
        id,
        name,
        poster,
        starts_at,
        always_live,
        locale,
        category_name,
        viewers
      } = stream;

      items.push({
        id:
          "?id=" +
          encodeURIComponent(id) +
          "&category=" +
          encodeURIComponent(extractParamFromUrl(apiUrl, "category")),
        title: name,
        description: `Event "${name}" is hosted on server "PPV".`,
        posterUrl: poster || FALLBACK_POSTER_URL,
        backdropUrl: poster || FALLBACK_POSTER_URL,
        quality: always_live ? "LIVE 24/7" : formatDateTime(starts_at),
        episode_current: "Viewers: " + viewers,
        lang: locale?.toUpperCase() + " - " + category_name?.toUpperCase()
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
  const data = JSON.parse(html);
  let streams = data?.streams;

  // filter by param category
  streams = getStreamsByParam(apiUrl, "category", streams);

  if (!Array.isArray(streams) || streams?.length === 0)
    return JSON.stringify({
      id: "",
      title: "⚠️ Link Not Found!",
      posterUrl: FALLBACK_POSTER_URL,
      backdropUrl: FALLBACK_POSTER_URL,
      servers: []
    });
  // get stream by param id
  const stream = getStreamByParam(apiUrl, "id", streams);

  const {
    name,
    poster,
    starts_at,
    always_live,
    locale,
    category_name,
    viewers,
    iframe,
    substreams,
    uri_name
  } = stream;
  const episodes = [];

  episodes.push({
    id: iframe,
    name: "Link 1",
    slug: uri_name
  });

  // substreams?.streams?.map((stream, index) => {
  //   const { name, url } = stream;
  //   episodes.push({
  //     id: url,
  //     name: obj?.events || obj?.replays ? name : `Link - ${index + 1}`,
  //     slug: url
  //   });
  // });

  return JSON.stringify({
    id: uri_name,
    title: name,
    posterUrl: poster || FALLBACK_POSTER_URL,
    backdropUrl: poster || FALLBACK_POSTER_URL,
    quality: always_live ? "LIVE 24/7" : formatDateTime(starts_at),
    episode_current: "Viewers: " + viewers,
    description: `Event "${name}" is hosted on server PPV`,
    lang: `SERVER: Ppv - ${locale}`,
    servers: [{ name: "PPV", episodes: episodes }]
  });
}

function parseDetailResponse(html, sourceUrl) {
  return JSON.stringify({
    url: sourceUrl,
    headers: {
      Referer: "https://embedindia.st/"
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

function extractParamFromUrl(url, param) {
  if (!url) return "";
  var match = url.match(new RegExp("[?&]" + param + "=([^&]+)"));
  return match ? decodeURIComponent(match[1]) : "";
}

function formatDateTime(timestamp) {
  if (timestamp == null) return "";
  // Hỗ trợ cả Unix timestamp (giây) và milliseconds
  if (timestamp < 1e12) {
    timestamp *= 1000;
  }

  const date = new Date(timestamp);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const MM = String(date.getMonth() + 1).padStart(2, "0");

  return `${hh}:${mm} - ${dd}/${MM}`;
}

function getStreamsByParam(apiUrl, param, streams) {
  const category = extractParamFromUrl(apiUrl, param);

  if (category)
    return streams?.find((stream) => {
      return stream?.category === CATEGORY_MAP[category];
    })?.streams;
  return streams;
}

function getStreamByParam(apiUrl, param, streams) {
  const id = extractParamFromUrl(apiUrl, param);

  if (id)
    return streams?.find((stream) => {
      return "" + stream?.id === id;
    });
  return {};
}

function getStreamsBySearch(apiUrl, param, streams) {
  const searchKeyword = extractParamFromUrl(apiUrl, param);

  const result = [];
  if (searchKeyword) {
    streams?.forEach((categoryStreams) => {
      categoryStreams?.streams?.forEach((stream) => {
        if (
          stream?.name
            ?.toLowerCase()
            ?.indexOf(searchKeyword?.toLowerCase() || "") >= 0
        )
          result.push(stream);
      });
    });

    return result;
  }
  return streams;
}
