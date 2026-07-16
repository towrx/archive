// =============================================================================
// VAAPP Plugin Template
// Hướng dẫn chi tiết: xem HUONG_DAN.md
// =============================================================================

// =============================================================================
// NHÓM 1: CẤU HÌNH (Config & Metadata)
// =============================================================================

const BASE_URL = "https://streamed.pk";


function getManifest() {
  return JSON.stringify({
    id: "streamed", // ID duy nhất, không dấu, không khoảng trắng
    name: "streamed", // Tên hiển thị trong App
    version: "1.0.0", // Đổi version → App tự cập nhật
    baseUrl: BASE_URL,
    iconUrl: "https://raw.githubusercontent.com/towrx/archive/refs/heads/main/vaxapp-plugins/logos/streamed.png",
    isEnabled: true,
    isAdult: false,
    type: "LIVE", // "MOVIE" hoặc "COMIC"
    layoutType: "VERTICAL", // "VERTICAL" hoặc "HORIZONTAL"
    playerType: "embed"
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
  var basePath = "/api/matches/";
  return BASE_URL + basePath + slug;
}

function getUrlSearch(keyword, filtersJson) {
  var page = JSON.parse(filtersJson || "{}").page || 1;
  return "https://domain-phim-cua-ban.com/tim-kiem?q=" + encodeURIComponent(keyword) + "&page=" + page;
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

/**
 * Parse danh sách phim từ HTML trang danh sách.
 * App mong đợi: { items: [{id, title, posterUrl, ...}], pagination: {...} }
 */
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
          description: `Server: ${source.source.toUpperCase()}`,
          posterUrl: imageUrl,
          backdropUrl: imageUrl,
          year: time || 0,
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

/**
 * Parse chi tiết phim: title, description, servers + episodes.
 * ⚠️ episode.id là giá trị App dùng để resolve link xem:
 *    - Nếu là URL .m3u8/.mp4 → App phát luôn
 *    - Nếu là slug/URL → App gọi getUrlDetail(id) → parseDetailResponse()
 */
function parseMovieDetail(html) {
  var stream = JSON.parse(html);
  var servers = [];
  stream.map((item, index) => {
    servers.push({
      name: "Server: " + stream[0].source,
        episodes: [
          { id: item.embedUrl, name: `${item.hd ? 'FullHD' : 'HD or SD'}`, slug: "/"+(index+1) },
        ]
    })
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

/**
 * Parse link video cuối cùng để Player phát.
 *
 * Trường hợp 1 — Link trực tiếp:
 *   { url: "https://cdn.com/video.m3u8", headers: {...} }
 *
 * Trường hợp 2 — Embed (WebView):
 *   { url: "https://player.com/embed/abc", headers: {...} }
 *   (Manifest cần set playerType: "embed" hoặc "auto")
 *
 * Trường hợp 3 — Recursive embed (cần fetch thêm):
 *   { url: "https://site.com/ajax.php", isEmbed: true, postBody: "id=123&sv=1" }
 *   → App sẽ POST/GET url đó → gọi parseEmbedResponse()
 *
 * Trường hợp 4 — Extension lạ:
 *   { url: "https://cdn.com/video.vl", mimeType: "application/x-mpegURL" }
 *   → Báo App đây là HLS dù extension không phải .m3u8
 */
function parseDetailResponse(html) {
  return JSON.stringify({
    url: "https://cdn.example.com/video.m3u8",
    headers: {
      Referer: "https://domain-phim-cua-ban.com",
    },
    subtitles: [],
    // isEmbed: false,     // true nếu cần fetch tiếp (xem parseEmbedResponse)
    // postBody: "",       // Body cho POST request (rỗng = GET)
    // mimeType: ""        // "application/x-mpegURL" cho HLS, "video/mp4" cho MP4
  });
}

/**
 * [TÙY CHỌN] Xử lý embed nhiều bước.
 * Chỉ cần viết hàm này khi trang dùng luồng phức tạp:
 *   Trang chi tiết → AJAX → iframe → stream URL
 *
 * App gọi hàm này trong vòng lặp (tối đa 3 lần):
 *   - isEmbed: true  → App fetch tiếp URL trả về
 *   - isEmbed: false → URL cuối cùng, phát luôn
 *   - url: ""        → Dừng lặp
 *
 * @param {string} html - HTML/JSON response từ bước trước
 * @param {string} sourceUrl - URL đã fetch để lấy html này
 */
function parseEmbedResponse(html, sourceUrl) {
  // Ví dụ: AJAX response chứa iframe
  // if (sourceUrl.indexOf('ajax') !== -1) {
  //     var data = JSON.parse(html);
  //     var match = data.player.match(/src="([^"]+)"/);
  //     if (match) {
  //         return JSON.stringify({ url: match[1], isEmbed: true });
  //     }
  // }

  // Ví dụ: Embed page chứa file stream
  // var fileMatch = html.match(/"file"\s*:\s*"(https?[^"]+)"/);
  // if (fileMatch) {
  //     return JSON.stringify({
  //         url: fileMatch[1],
  //         isEmbed: false,
  //         mimeType: "application/x-mpegURL",
  //         headers: { "Referer": "https://embed-server.com/" }
  //     });
  // }

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
