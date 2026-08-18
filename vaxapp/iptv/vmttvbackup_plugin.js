// =============================================================================
// NHÓM 1: CẤU HÌNH (Config & Metadata)
// =============================================================================

function getManifest() {
  return JSON.stringify({
    id: "vmttvbackup",
    name: "VMTTVBACKUP",
    version: "1.0.0",
    baseUrl: BASE_URL,
    iconUrl: "https://i.ibb.co/nq4ns7bd/vmttv-logo.jpg",
    isEnabled: true,
    isAdult: false,
    type: "IPTV",
    layoutType: "HORIZONTAL",
    playerType: "exoplayer",
    debug: true
  });
}

function getHomeSections() {
  return JSON.stringify([
    { slug: "kenh-vtv-dai-th-viet-nam", title: "Kênh VTV - Đài TH Việt Nam 📺", type: "Horizontal", path: "" },
    { slug: "kenh-thiet-yeu", title: "Kênh Thiết Yếu 🌐", type: "Horizontal", path: "" },
    { slug: "kenh-phim-truyen", title: "Kênh Phim Truyện 🎬", type: "Horizontal", path: "" },
    { slug: "kenh-giai-tri", title: "Kênh Giải Trí 🎭", type: "Horizontal", path: "" },
    { slug: "kenh-htv-bao-va-ptth-tphcm", title: "Kênh HTV - Báo và PTTH TPHCM 📺", type: "Horizontal", path: "" },
    { slug: "kenh-htvc-bao-va-ptth-tphcm", title: "Kênh HTVC - Báo và PTTH TPHCM 📺", type: "Horizontal", path: "" },
    { slug: "kenh-trong-nuoc-va-dia-phuong", title: "Kênh Trong Nước & Địa Phương 📍", type: "Horizontal", path: "" },
    { slug: "kenh-tin-tuc", title: "Kênh Tin Tức 📰", type: "Horizontal", path: "" },
    { slug: "kenh-tong-hop-nuoc-ngoai", title: "Kênh Tổng Hợp Nước Ngoài 🌍", type: "Horizontal", path: "" },
    { slug: "kenh-dac-sac", title: "Kênh Đặc Sắc ⭐", type: "Horizontal", path: "" },
    { slug: "kenh-ca-nhac", title: "Kênh Ca Nhạc 🎵", type: "Horizontal", path: "" },
    { slug: "kenh-thieu-nhi", title: "Kênh Thiếu Nhi 🧒", type: "Horizontal", path: "" },
    { slug: "kenh-the-thao", title: "Kênh Thể Thao ⚽", type: "Horizontal", path: "" },
    { slug: "kenh-ban-hang", title: "Kênh Bán Hàng 🛒", type: "Horizontal", path: "" },
    { slug: "kenh-vov", title: "Kênh VOV 📻", type: "Horizontal", path: "" },
    { slug: "kenh-voh-radio", title: "Kênh VOH Radio 🎙️", type: "Horizontal", path: "" },
    { slug: "kenh-khac", title: "Kênh Khác 📦", type: "Horizontal", path: "" },
  ]);
}

function getPrimaryCategories() {
  return JSON.stringify([
    { name: "Kênh VTV - Đài TH Việt Nam", slug: "kenh-vtv-dai-th-viet-nam" },
    { name: "Kênh Thiết Yếu", slug: "kenh-thiet-yeu" },
    { name: "Kênh Phim Truyện", slug: "kenh-phim-truyen" },
    { name: "Kênh Giải Trí", slug: "kenh-giai-tri" },
    { name: "Kênh HTV - Báo và PTTH TPHCM", slug: "kenh-htv-bao-va-ptth-tphcm" },
    { name: "Kênh HTVC - Báo và PTTH TPHCM", slug: "kenh-htvc-bao-va-ptth-tphcm" },
    { name: "Kênh Trong Nước & Địa Phương", slug: "kenh-trong-nuoc-va-dia-phuong" },
    { name: "Kênh Tin Tức", slug: "kenh-tin-tuc" },
    { name: "Kênh Tổng Hợp Nước Ngoài", slug: "kenh-tong-hop-nuoc-ngoai" },
    { name: "Kênh Đặc Sắc", slug: "kenh-dac-sac" },
    { name: "Kênh Ca Nhạc", slug: "kenh-ca-nhac" },
    { name: "Kênh Thiếu Nhi", slug: "kenh-thieu-nhi" },
    { name: "Kênh Thể Thao", slug: "kenh-the-thao" },
    { name: "Kênh Bán Hàng", slug: "kenh-ban-hang" },
    { name: "Kênh VOV", slug: "kenh-vov" },
    { name: "Kênh VOH Radio", slug: "kenh-voh-radio" },
    { name: "Kênh Khác", slug: "kenh-khac" },
  ]);
}

function getFilterConfig() {
  return JSON.stringify({ sort: [], category: [] });
}

// =============================================================================
// NHÓM 2: SINH URL (App gọi hàm → nhận URL → tự fetch HTTP)
// =============================================================================

function getUrlList(slug, filtersJson) {
  return `${BASE_URL}?category=${slug}`;
}

function getUrlSearch(keyword = "", filtersJson) {
  return `${BASE_URL}?search=${encodeURIComponent(keyword?.trim())}`;
}

function getUrlDetail(path) {
  if (!path) return "";
  if (path.indexOf("http") === 0) return path;
  return `${BASE_URL}${path}`;
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
    const items = [];
    let channels = [];

    if (channelList.length === 0) channelList = parseM3U(html);
    const category = extractParamFromUrl(apiUrl, "category");
    const keyword = extractParamFromUrl(apiUrl, "search");

    if (category)
      channels = filterChannels(channelList, ["category", category]);
    else if (keyword)
      channels = filterChannels(channelList, ["search", keyword]);

    channels.forEach((channel) => {
      let matchInfo = "";
      const {
        props: {
          "http-user-agent": userAgent,
          "inputstream.adaptive.manifest_type": manifestType,
          "inputstream.adaptive.license_type": licenseType,
          "inputstream.adaptive.license_key": licenseKey
        }
      } = channel;
      if (channel.tvgGroup.includes("Live Event 🔴"))
        matchInfo = parseChannelName(channel.name);
      items.push({
        id: licenseKey
          ? licenseKey +
            "&channelId=" +
            channel.channelId +
            `|User-Agent=${userAgent || "Dalvik/2.1.0"}&Referer=${BASE_URL}`
          : "?channelId=" + channel.channelId,
        title: matchInfo.title ? matchInfo.title : channel.name,
        description: `Channel "${channel.name}" is hosted on server VMTTVBACKUP.`,
        posterUrl: channel.tvgLogo || FALLBACK_POSTER_URL,
        backdropUrl: channel.tvgLogo || FALLBACK_POSTER_URL,
        quality: matchInfo.dateTime
          ? isLive(matchInfo.dateTime)
            ? "LIVE"
            : matchInfo.dateTime
          : "LIVE",
        episode_current: manifestType
          ? `DASH - ${licenseType.toUpperCase()}`
          : channel.url.includes(".mpd")
            ? "DASH"
            : "HLS"
      });
    });

    return JSON.stringify({
      items: items,
      pagination: { currentPage: 1, totalPages: 1 }
    });
  } catch (error) {
    console.error(
      "⛔ [parseDetailResponse in vmttvbackup_plugin.js] ERROR MESSAGE: ",
      error
    );
    return JSON.stringify({
      items: [],
      pagination: { currentPage: 1, totalPages: 1 }
    });
  }
}

function parseSearchResponse(html, apiUrl) {
  return parseListResponse(html, apiUrl);
}

function parseDetailResponse(html, apiUrl) {
  try {
    if (apiUrl.indexOf("|") > 0) apiUrl = apiUrl.split("|")[0];
    const channelId = extractParamFromUrl(apiUrl, "channelId");
    const {
      url,
      name,
      props: {
        "http-user-agent": userAgent,
        "http-referrer": referrer,
        "http-origin": origin,
        "inputstream.adaptive.manifest_type": manifestType,
        "inputstream.adaptive.license_type": licenseType,
        "inputstream.adaptive.license_key": licenseKey
      }
    } = getChannel(channelList, channelId);

    console.log("ℹ️ [parseDetailResponse in vmttvbackup_plugin.js] Name: ", name);
    // Handle license_type and manifest_type:  DASH (mpd|DRM[clearkey, widevine]), DASH (mpd|No DRM) and HSL (m3u8)
    if (licenseType === "clearkey") {
      // Value manifest_type = dash or mdp, Value license_type = clearkey (DRM)
      const clearKey = getClearKey(html, licenseKey);

      console.log(
        `ℹ️ [parseDetailResponse in vmttvbackup_plugin.js] Manifest type DASH (MPD) - ClearKey: `,
        clearKey
      );
      console.log("ℹ️ [parseDetailResponse in vmttvbackup_plugin.js] URL:", url);
      return JSON.stringify({
        isEmbed: false,
        url: url,
        mimeType: "application/dash+xml",
        drmType: "clearkey",
        drmKid: clearKey.drmKid,
        drmKey: clearKey.drmKey,
        headers: {
          "User-Agent": userAgent || "Dalvik/2.1.0",
          Referer: referrer || url,
          Origin: origin || url
        }
      });
    } else if (licenseType === "widevine") {
      // Value manifest_type = dash or mdp, Value license_type = widevine (DRM)
      const licenseUrl = apiUrl.substring(0, apiUrl.indexOf("&channelId"));

      console.log(
        `ℹ️ [parseDetailResponse in vmttvbackup_plugin.js] Manifest type DASH (MPD) - Widevine: `,
        apiUrl
      );
      console.log("ℹ️ [parseDetailResponse in vmttvbackup_plugin.js] URL:", url);
      return JSON.stringify({
        isEmbed: false,
        url: url,
        mimeType: "application/dash+xml",
        drmType: "widevine",
        licenseUrl: licenseUrl,
        headers: {
          "User-Agent": userAgent || "Dalvik/2.1.0",
          Referer: referrer || url,
          Origin: origin || url
        }
      });
    } else if (url.includes(".mpd")) {
      // No manifest_type and licenseType, DASH (No DRM)
      console.log(
        `ℹ️ [parseDetailResponse in vmttvbackup_plugin.js] Manifest type DASH (MPD) - No DRM`
      );
      console.log("ℹ️ [parseDetailResponse in vmttvbackup_plugin.js] URL:", url);
      return JSON.stringify({
        isEmbed: false,
        url: url,
        mimeType: "application/dash+xml",
        drmType: "",
        drmKid: "",
        drmKey: "",
        headers: {
          "User-Agent": userAgent || "Dalvik/2.1.0",
          Referer: referrer || url,
          Origin: origin || url
        }
      });
    } else {
      //  Normal HLS (m3u8)
      console.log(
        `ℹ️ [parseDetailResponse in vmttvbackup_plugin.js] Manifest type HLS (M3U8)`
      );
      console.log("ℹ️ [parseDetailResponse in vmttvbackup_plugin.js] URL:", url);
      return JSON.stringify({
        isEmbed: false,
        url: url,
        mimeType: "application/x-mpegURL",
        headers: {
          "User-Agent": userAgent || "Dalvik/2.1.0",
          Referer: referrer || url,
          Origin: origin || url
        }
      });
    }
  } catch (error) {
    console.error(
      "⛔ [parseDetailResponse in vmttvbackup_plugin.js] ERROR MESSAGE: ",
      error
    );
    return "{}";
  }
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

// ======================================
// VARIABLES
// ======================================

const BASE_URL = "https://1.org.vn/vmttv";
const FALLBACK_POSTER_URL = "https://i.ibb.co/rKHf363x/fallback-thumbnail.webp";
let channelList = [];
const GROUP_MAP = {
  "kênh vtv": "Kênh VTV - Đài TH Việt Nam 📺",
  "kênh thiết yếu": "Kênh Thiết Yếu 🌐",
  "kênh phim truyện": "Kênh Phim Truyện 🎬",
  "kênh giải trí": "Kênh Giải Trí 🎭",
  "kênh htvc": "Kênh HTVC - Báo và PTTH TPHCM 📺",
  "kênh htv": "Kênh HTV - Báo và PTTH TPHCM 📺",
  "kênh trong nước & địa phương": "Kênh Trong Nước & Địa Phương 📍",
  "kênh tin tức": "Kênh Tin Tức 📰",
  "kênh tổng hợp n": "Kênh Tổng Hợp Nước Ngoài 🌍",
  "kênh đặc sắc": "Kênh Đặc Sắc ⭐",
  "kênh ca nh": "Kênh Ca Nhạc 🎵",
  "kênh thiếu nhi": "Kênh Thiếu Nhi 🧒",
  "kênh thể thao": "Kênh Thể Thao ⚽",
  "kênh b": "Kênh Bán Hàng 🛒",
  "kênh vov": "Kênh VOV 📻",
  "kênh voh radio": "Kênh VOH Radio 🎙️",
  "kênh khác": "Kênh Khác 📦",
};

// Use CATEGORY_MAP to convert the slug to tvg-group.
const CATEGORY_MAP = {
  "kenh-vtv-dai-th-viet-nam": "Kênh VTV - Đài TH Việt Nam 📺",
  "kenh-thiet-yeu": "Kênh Thiết Yếu 🌐",
  "kenh-phim-truyen": "Kênh Phim Truyện 🎬",
  "kenh-giai-tri": "Kênh Giải Trí 🎭",
  "kenh-htv-bao-va-ptth-tphcm": "Kênh HTV - Báo và PTTH TPHCM 📺",
  "kenh-htvc-bao-va-ptth-tphcm": "Kênh HTVC - Báo và PTTH TPHCM 📺",
  "kenh-trong-nuoc-va-dia-phuong": "Kênh Trong Nước & Địa Phương 📍",
  "kenh-tin-tuc": "Kênh Tin Tức 📰",
  "kenh-tong-hop-nuoc-ngoai": "Kênh Tổng Hợp Nước Ngoài 🌍",
  "kenh-dac-sac": "Kênh Đặc Sắc ⭐",
  "kenh-ca-nhac": "Kênh Ca Nhạc 🎵",
  "kenh-thieu-nhi": "Kênh Thiếu Nhi 🧒",
  "kenh-the-thao": "Kênh Thể Thao ⚽",
  "kenh-ban-hang": "Kênh Bán Hàng 🛒",
  "kenh-vov": "Kênh VOV 📻",
  "kenh-voh-radio": "Kênh VOH Radio 🎙️",
  "kenh-khac": "Kênh Khác 📦",
};

// ======================================
// FUNCTIONS
// ======================================

function extractParamFromUrl(url, param) {
  if (!url) return "";
  var match = url.match(new RegExp("[?&]" + param + "=([^&]+)"));
  return match ? decodeURIComponent(match[1]) : "";
}

function filterChannels(channels, [filterKey, filterValue]) {
  // filter channels by category
  if (filterValue && filterKey === "category") {
    return channels.filter(
      (channel) => CATEGORY_MAP[filterValue] === channel.tvgGroup
    );
  }
  if (filterValue && filterKey === "search") {
    return channels.filter((channel) => {
      const name = channel.name.toLowerCase();
      filterValue = filterValue.toLowerCase();
      return name.indexOf(filterValue) >= 0;
    });
  }
}

function getChannel(channels, channelId) {
  if (channelId === undefined || channelId === null || channelId === "")
    return {};
  const numId = parseInt(channelId, 10);
  return (
    channels.find(
      (channel) => String(channel.channelId) === String(channelId)
    ) || {}
  );
}

function parseM3U(text) {
  const lines = text.split("\n");
  const channels = [];
  let currentChannel = null;
  let count = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.toUpperCase().includes("EXTINF:")) {
      currentChannel = {
        name: "No Name",
        tvgLogo: "",
        tvgGroup: "No Group",
        url: "",
        tvgId: "",
        channelId: count++,
        props: {}
      };

      const commaIndex = line.lastIndexOf(`",`);
      if (commaIndex !== -1)
        currentChannel.name =
          line.substring(commaIndex + 2).trim() || "No Name";

      const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
      if (logoMatch && logoMatch[1]) currentChannel.tvgLogo = logoMatch[1];

      const groupMatch = line.match(/group-title="([^"]+)"/i);
      if (groupMatch && groupMatch[1]) {
        const keys = Object.keys(GROUP_MAP).find(key => groupMatch[1].toLowerCase().includes(key));
        currentChannel.tvgGroup = keys ? GROUP_MAP[keys] : groupMatch[1];
      }
        
      const idMatch = line.match(/tvg-id="([^"]+)"/i);
      if (idMatch && idMatch[1]) currentChannel.tvgId = idMatch[1];

      // Capture all catchup attributes
      const catchupMatch = line.match(/catchup="([^"]+)"/i);
      if (catchupMatch) currentChannel.props.catchup = catchupMatch[1];

      const catchupDaysMatch = line.match(/catchup-days="([^"]+)"/i);
      if (catchupDaysMatch)
        currentChannel.props.catchupDays = catchupDaysMatch[1];

      const catchupSourceMatch = line.match(/catchup-source="([^"]+)"/i);
      if (catchupSourceMatch)
        currentChannel.props.catchupSource = catchupSourceMatch[1];
    } else if (line.toUpperCase().startsWith("#KODIPROP:")) {
      if (currentChannel) {
        const propLine = line.substring(10).trim();
        const equalIdx = propLine.indexOf("=");
        if (equalIdx !== -1) {
          const key = propLine.substring(0, equalIdx).trim();
          const val = propLine.substring(equalIdx + 1).trim();
          currentChannel.props[key] = val;
        }
      }
    } else if (line.toUpperCase().startsWith("#EXTVLCOPT:")) {
      if (currentChannel) {
        const optLine = line.substring(11).trim();
        const equalIdx = optLine.indexOf("=");
        if (equalIdx !== -1) {
          const key = optLine.substring(0, equalIdx).trim();
          const val = optLine.substring(equalIdx + 1).trim();
          currentChannel.props[key] = val;
        }
      }
    } else if (line !== "" && !line.startsWith("#")) {
      if (currentChannel) {
        currentChannel.url = line;
        channels.push(currentChannel);
        currentChannel = null;
      } else {
        channels.push({
          name: line.split("/").pop().toUpperCase() || "No Name",
          tvgLogo: "",
          tvgGroup: "No Group",
          url: line,
          channelId: count++,
          props: {}
        });
      }
    }
  }
  return channels;
}

// Convert Base64/Base64Url to Hex for ClearKey
function base64ToHex(base64) {
  if (!base64) return "";
  let b64 = base64.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) b64 += "=";
  try {
    const raw = atob(b64);
    let result = "";
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += hex.length === 2 ? hex : "0" + hex;
    }
    return result.toLowerCase();
  } catch (e) {
    console.error("Lỗi giải mã Base64:", e);
    return "";
  }
}

// A handmade atob function for QuickJS
function atob(input) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let str = String(input).replace(/[\t\n\f\r ]/g, "");

  let output = "";
  let buffer = 0;
  let bits = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === "=") break;

    const index = chars.indexOf(str[i]);
    if (index === -1) {
      throw new Error("Invalid base64 character");
    }

    buffer = (buffer << 6) | index;
    bits += 6;

    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }

  return output;
}

// The getClearKey function is used for multiple IPTV sources.
function getClearKey(html, licenseKey) {
  const clearKey = {};
  try {
    // clearKey needs to be fetched.
    // JSON format {"keys":[{"kid":"...","k":"..."}]}
    const keyData = JSON.parse(html);
    console.log(
      "ℹ️ [getClearKey in vmttvbackup_plugin.js] clearKey NEEDS to be fetched - ",
      keyData
    );
    if (keyData.keys && Array.isArray(keyData.keys)) {
      keyData.keys.forEach((k) => {
        clearKey.drmKid = base64ToHex(k.kid);
        clearKey.drmKey = base64ToHex(k.k);
      });
    } else if (keyData.kid && keyData.k) {
      // JSON format {"kid":"...","k":"..."}
      clearKey.drmKid = base64ToHex(keyData.kid);
      clearKey.drmKey = base64ToHex(keyData.k);
    }
  } catch (error) {
    // clearKey does not require fetching.
    console.log(
      "ℹ️ [getClearKey in vmttvbackup_plugin.js] clearKey does NOT require fetching - ",
      licenseKey
    );
    // Hex format "KID:KEY" (e.g. license_key=aabb...:ccdd...)
    if (
      licenseKey &&
      licenseKey.includes(":") &&
      licenseKey.split(":").length === 2
    ) {
      const parts = licenseKey.split(":");

      if (/^[0-9a-fA-F]+$/.test(parts[0]) && /^[0-9a-fA-F]+$/.test(parts[1])) {
        clearKey.drmKid = parts[0].toLowerCase();
        clearKey.drmKey = parts[1].toLowerCase();
      }
    } else {
      const keyData = JSON.parse(licenseKey);
      // JSON format {"keys":[{"kid":"...","k":"..."}]}
      if (keyData.keys && Array.isArray(keyData.keys)) {
        keyData.keys.forEach((k) => {
          clearKey.drmKid = base64ToHex(k.kid);
          clearKey.drmKey = base64ToHex(k.k);
        });
      } else if (keyData.kid && keyData.k) {
        // JSON format {"kid":"...","k":"..."}
        clearKey.drmKid = base64ToHex(keyData.kid);
        clearKey.drmKey = base64ToHex(keyData.k);
      }
    }
  }

  return clearKey;
}

function parseChannelName(channelName) {
  const arr = channelName.split(".");
  return {
    dateTime: arr[0]?.trim() || "",
    title: arr[1]?.trim() || ""
  };
}

function isLive(dateTime) {
  // dateTime format: "22:30-05/08"
  var match = /^(\d{2}):(\d{2})-(\d{2})\/(\d{2})$/.exec(dateTime);

  if (!match) {
    return false;
  }
  var hour = Number(match[1]);
  var minute = Number(match[2]);
  var day = Number(match[3]);
  var month = Number(match[4]);
  var now = new Date();
  var year = now.getUTCFullYear();
  // GMT+7 -> UTC
  var eventTime = Date.UTC(year, month - 1, day, hour - 7, minute);

  return eventTime <= Date.now();
}

function isLive(dateTime) {
  // dateTime format: "22:30-05/08" hoặc "3:30-05/08"
  // Mặc định GMT+7
  var match = /^(\d{1,2}):(\d{2})-(\d{2})\/(\d{2})$/.exec(dateTime);

  if (!match) {
    return false;
  }
  var hour = Number(match[1]);
  var minute = Number(match[2]);
  var day = Number(match[3]);
  var month = Number(match[4]);

  // Validate
  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return false;
  }
  // Lấy năm hiện tại theo UTC
  var now = new Date();
  var year = now.getUTCFullYear();
  // GMT+7 -> UTC
  var eventTimestamp = Date.UTC(year, month - 1, day, hour - 7, minute, 0, 0);

  // So sánh timestamp hiện tại (UTC)
  return eventTimestamp <= Date.now();
}
