// =============================================================================
// NHÓM 1: CẤU HÌNH (Config & Metadata)
// =============================================================================

function getManifest() {
  return JSON.stringify({
    id: "hoiquanclick",
    name: "HOIQUANCLICK",
    version: "1.0.0",
    baseUrl: "https://raw.githubusercontent.com/hoiquanclick/hoiquan/refs/heads/main/vip.m3u",
    iconUrl: "https://i.ibb.co/HpXFPKxL/hoiquanclick-logo.png",
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
    { slug: "vtv", title: "VTV ⭐", type: "Horizontal", path: "" },
    { slug: "vtvcab", title: "VTVcab 💎", type: "Horizontal", path: "" },
    { slug: "tv360", title: "TV360 📡", type: "Horizontal", path: "" },
    { slug: "international", title: "QUỐC TẾ 🌍", type: "Horizontal", path: "" },
    { slug: "htv-htvc", title: "HTV x HTVC 🧬", type: "Horizontal", path: "" },
    { slug: "sctv", title: "SCTV 🎫", type: "Horizontal", path: "" },
    { slug: "local", title: "ĐỊA PHƯƠNG 📺", type: "Horizontal", path: "" },
    { slug: "radio", title: "Radio 📻", type: "Horizontal", path: "" },
    { slug: "china", title: "Trung Quốc 🌐", type: "Horizontal", path: "" }, 
    { slug: "illegal-hoiquanlive", title: "Hội Quán Live ⚽️", type: "Horizontal", path: "" },
    { slug: "animals-nature", title: "Animals + Nature 🐾", type: "Horizontal", path: "" },
    { slug: "anime", title: "Anime 🌸", type: "Horizontal", path: "" },
    { slug: "big-brother-live", title: "Big Brother Live 📹", type: "Horizontal", path: "" },
    { slug: "classic-tv", title: "Classic TV 📺", type: "Horizontal", path: "" },
    { slug: "comedy", title: "Comedy 😂", type: "Horizontal", path: "" },
    { slug: "competition-reality", title: "Competition Reality 🏆", type: "Horizontal", path: "" },
    { slug: "daytime-game", title: "Daytime + Game 🎲", type: "Horizontal", path: "" },
    { slug: "drama", title: "Drama 🎭", type: "Horizontal", path: "" },
    { slug: "en-espanol", title: "En Español 🇪🇸", type: "Horizontal", path: "" },
    { slug: "entertainment", title: "Entertainment 🎉", type: "Horizontal", path: "" },
    { slug: "history-science", title: "History + Science 🔬", type: "Horizontal", path: "" },
    { slug: "home-food", title: "Home + Food 🍳", type: "Horizontal", path: "" },
    { slug: "kids", title: "Kids 🧸", type: "Horizontal", path: "" },
    { slug: "local-news", title: "Local News 📍", type: "Horizontal", path: "" },
    { slug: "movies", title: "Movies 🎬", type: "Horizontal", path: "" },
    { slug: "music-videos", title: "Music Videos 🎵", type: "Horizontal", path: "" },
    { slug: "news-opinion", title: "News + Opinion 📰", type: "Horizontal", path: "" },
    { slug: "reality", title: "Reality 📸", type: "Horizontal", path: "" },
    { slug: "sci", title: "Sci 🛸", type: "Horizontal", path: "" },
    { slug: "sci-fi", title: "Sci-Fi 🚀", type: "Horizontal", path: "" },
    { slug: "sports", title: "Sports 🏅", type: "Horizontal", path: "" },
    { slug: "true-crime", title: "True Crime 🕵️", type: "Horizontal", path: "" },
    { slug: "westerns", title: "Westerns 🤠", type: "Horizontal", path: "" } 
  ]);
}

function getPrimaryCategories() {
  return JSON.stringify([

    { name: "VTV", slug: "vtv" },
    { name: "VTVcab", slug: "vtvcab" },
    { name: "TV360", slug: "tv360" },
    { name: "QUỐC TẾ", slug: "international" },
    { name: "HTV x HTVC", slug: "htv-htvc" },
    { name: "SCTV", slug: "sctv" },
    { name: "ĐỊA PHƯƠNG", slug: "local" },
    { name: "Radio", slug: "radio" },
    { name: "Trung Quốc", slug: "china" },
    { name: "Hội Quán Live", slug: "illegal-hoiquanlive" },
    { name: "Animals + Nature", slug: "animals-nature" },
    { name: "Anime", slug: "anime" },
    { name: "Big Brother Live", slug: "big-brother-live" },
    { name: "Classic TV", slug: "classic-tv" },
    { name: "Comedy", slug: "comedy" },
    { name: "Competition Reality", slug: "competition-reality" },
    { name: "Daytime + Game", slug: "daytime-game" },
    { name: "Drama", slug: "drama" },
    { name: "En Español", slug: "en-espanol" },
    { name: "Entertainment", slug: "entertainment" },
    { name: "History + Science", slug: "history-science" },
    { name: "Home + Food", slug: "home-food" },
    { name: "Kids", slug: "kids" },
    { name: "Local News", slug: "local-news" },
    { name: "Movies", slug: "movies" },
    { name: "Music Videos", slug: "music-videos" },
    { name: "News + Opinion", slug: "news-opinion" },
    { name: "Reality", slug: "reality" },
    { name: "Sci", slug: "sci" },
    { name: "Sci-Fi", slug: "sci-fi" },
    { name: "Sports", slug: "sports" },
    { name: "True Crime", slug: "true-crime" },
    { name: "Westerns", slug: "westerns" }
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
    else if (keyword) channels = filterChannels(channelList, ["search", keyword]);

    channels.forEach((channel) => {
      const {
        props: {
          "inputstream.adaptive.manifest_type": manifestType,
          "inputstream.adaptive.license_type": licenseType,
          "inputstream.adaptive.license_key": licenseKey
        }
      } = channel;

      items.push({
        id: licenseKey ? licenseKey + "&channelId=" + channel.channelId + `|User-Agent=Dalvik/2.1.0&Referer=${BASE_URL}` : "?channelId=" + channel.channelId,
        title: channel.name,
        description: `Channel "${channel.name}" is hosted on server VMTTV.`,
        posterUrl: channel.tvgLogo || FALLBACK_POSTER_URL,
        backdropUrl: channel.tvgLogo || FALLBACK_POSTER_URL,
        quality: "LIVE",
        episode_current: manifestType ? `DASH - ${licenseType.toUpperCase()}` : "HLS"
      });
    });

    return JSON.stringify({
      items: items,
      pagination: { currentPage: 1, totalPages: 1 }
    });
  } catch (error) {
    console.error("⛔ [parseDetailResponse in hoiquanclick_plugin.js] ERROR MESSAGE: ", error);
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
    
    console.log("ℹ️ [parseDetailResponse in hoiquanclick_plugin.js] Name: ", name);
    // Handle license_type and manifest_type
    // Value manifest_type = dash or mdp
    // Value license_type = clearkey
    if (licenseType === "clearkey") {
      const clearKey = getClearKey(html, licenseKey);
    
      console.log(`ℹ️ [parseDetailResponse in hoiquanclick_plugin.js] Manifest type DASH (MPD) - ClearKey: `, clearKey);
      console.log("ℹ️ [parseDetailResponse in hoiquanclick_plugin.js] URL:", url);
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
    }
    else if (licenseType === "widevine") { // Value manifest_type = dash or mdp, Value license_type = widevine
      const licenseUrl = apiUrl.substring(0, apiUrl.indexOf("&channelId"));
      
      console.log(`ℹ️ [parseDetailResponse in hoiquanclick_plugin.js] Manifest type DASH (MPD) - Widevine: `, apiUrl);
      console.log("ℹ️ [parseDetailResponse in hoiquanclick_plugin.js] URL:", url);
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
    }
    else { // No manifest_type and licenseType, Normal HLS (m3u8)
      console.log(`ℹ️ [parseDetailResponse in hoiquanclick_plugin.js] Manifest type HLS (M3U8)`);
      console.log("ℹ️ [parseDetailResponse in hoiquanclick_plugin.js] URL:", url);
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
    console.error("⛔ [parseDetailResponse in hoiquanclick_plugin.js] ERROR MESSAGE: ", error);
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

const BASE_URL = "https://raw.githubusercontent.com/hoiquanclick/hoiquan/refs/heads/main/vip.m3u";
const FALLBACK_POSTER_URL = "https://i.ibb.co/rKHf363x/fallback-thumbnail.webp";
let channelList = [];
// Use GROUP_MAP to rename and merge the channel into tvg-group.
const GROUP_MAP = {
  vtv: "VTV ⭐",
  "thời sự": "VTV ⭐",
  vtvcab: "VTVcab 💎",
  "in the box": "QUỐC TẾ 🌍",
  "📦| in the box": "QUỐC TẾ 🌍",
  "in the box copy": "QUỐC TẾ 🌍",
  "quốc tế": "QUỐC TẾ 🌍",
  "tv360": "QUỐC TẾ 🌍",
  htv: "HTV x HTVC 🧬",
  sctv: "SCTV 🎫",
  "địa phương": "ĐỊA PHƯƠNG 📺",
  "kênh địa phương": "ĐỊA PHƯƠNG 📺",
  "thvl": "ĐỊA PHƯƠNG 📺",
  "dự phòng": "BACKUP 📌",
  "sự kiện tv360": "TV360 📡",
  "tv360 live": "TV360 📡",
  "rạp phim": "TV360 📡",
  "sự kiện vtvprime": "VTVPrime 🛰️",
  "thiết yếu": "VTV ⭐",
  "🌐| thiết yếu": "VTV ⭐",
  "htv/c": "HTV x HTVC 🧬",
  "thể thao quốc tế": "International Sport 👑",
  "asean huyndai cup 2026": "🔴 ASEAN HUYNDAI CUP 2026",
  "live events 🔴": "VOD 🎞️",
  "sự kiện fpt play": "FPTPlay 🏷️",
  "radio": "Radio 📻",
  "🇬🇧 uk radio": "Radio 📻",
  "israel": "Israel 🌐",
  "🇰🇷| hàn quốc": "Hàn Quốc 🌐",
  "🇨🇳| trung quốc": "Trung Quốc 🌐",
  "cctv": "Trung Quốc 🌐",
  "hội quán live ⚽️":"Hội Quán Live ⚽️",
  "animals + nature": "Animals + Nature 🐾",
  "anime": "Anime 🌸",
  "big brother live": "Big Brother Live 📹",
  "classic tv": "Classic TV 📺",
  "comedy": "Comedy 😂",
  "competition reality": "Competition Reality 🏆",
  "daytime + game": "Daytime + Game 🎲",
  "drama": "Drama 🎭",
  "en español": "En Español 🇪🇸",
  "entertainment": "Entertainment 🎉",
  "history + science": "History + Science 🔬",
  "home + food": "Home + Food 🍳",
  "kids": "Kids 🧸",
  "local news": "Local News 📍",
  "movies": "Movies 🎬",
  "music videos": "Music Videos 🎵",
  "news + opinion": "News + Opinion 📰",
  "reality": "Reality 📸",
  "sci": "Sci 🛸",
  "sci-fi": "Sci-Fi 🚀",
  "sports": "Sports 🏅",
  "true crime": "True Crime 🕵️",
  "westerns": "Westerns 🤠"
};
// Use CATEGORY_MAP to convert the slug to tvg-group.
const CATEGORY_MAP = {
  vtv: "VTV ⭐",
  vtvcab: "VTVcab 💎",
  tv360: "TV360 📡",
  vtvprime: "VTVPrime 🛰️",
  international: "QUỐC TẾ 🌍",
  "htv-htvc": "HTV x HTVC 🧬",
  sctv: "SCTV 🎫",
  local: "ĐỊA PHƯƠNG 📺",
  backup: "BACKUP 📌",
  "international-sport": "International Sport 👑",
  "event": "🔴 ASEAN HUYNDAI CUP 2026",
  "vod": "VOD 🎞️",
  "fptplay": "FPTPlay 🏷️",
  "radio": "Radio 📻",
  "israel": "Israel 🌐",
  "korea": "Hàn Quốc 🌐",
  "china": "Trung Quốc 🌐",
  "illegal-hoiquanlive": "Hội Quán Live ⚽️",
  "animals-nature": "Animals + Nature 🐾",
  "anime": "Anime 🌸",
  "big-brother-live": "Big Brother Live 📹",
  "classic-tv": "Classic TV 📺",
  "comedy": "Comedy 😂",
  "competition-reality": "Competition Reality 🏆",
  "daytime-game": "Daytime + Game 🎲",
  "drama": "Drama 🎭",
  "en-espanol": "En Español 🇪🇸",
  "entertainment": "Entertainment 🎉",
  "history-science": "History + Science 🔬",
  "home-food": "Home + Food 🍳",
  "kids": "Kids 🧸",
  "local-news": "Local News 📍",
  "movies": "Movies 🎬",
  "music-videos": "Music Videos 🎵",
  "news-opinion": "News + Opinion 📰",
  "reality": "Reality 📸",
  "sci": "Sci 🛸",
  "sci-fi": "Sci-Fi 🚀",
  "sports": "Sports 🏅",
  "true-crime": "True Crime 🕵️",
  "westerns": "Westerns 🤠"
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
  if (channelId === undefined || channelId === null || channelId === "") return {};
  const numId = parseInt(channelId, 10);
  return channels.find(channel => String(channel.channelId) === String(channelId)) || {};
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

      const commaIndex = line.lastIndexOf(",");
      if (commaIndex !== -1)
        currentChannel.name =
          line.substring(commaIndex + 1).trim() || "No Name";

      const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
      if (logoMatch && logoMatch[1]) currentChannel.tvgLogo = logoMatch[1];

      const groupMatch = line.match(/group-title="([^"]+)"/i);
      if (groupMatch && groupMatch[1])
        currentChannel.tvgGroup = GROUP_MAP[groupMatch[1].toLowerCase()]
          ? GROUP_MAP[groupMatch[1].toLowerCase()]
          : groupMatch[1];

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
  const clearKey = {}
  try { // clearKey needs to be fetched.
    // JSON format {"keys":[{"kid":"...","k":"..."}]}
    const keyData = JSON.parse(html);
    console.log("ℹ️ [getClearKey in hoiquanclick_plugin.js] clearKey NEEDS to be fetched - ", keyData);
    if (keyData.keys && Array.isArray(keyData.keys)) {
      keyData.keys.forEach((k) => {
        clearKey.drmKid = base64ToHex(k.kid);
        clearKey.drmKey = base64ToHex(k.k);
      });
    } else if (keyData.kid && keyData.k) { // JSON format {"kid":"...","k":"..."}
      clearKey.drmKid = base64ToHex(keyData.kid);
      clearKey.drmKey = base64ToHex(keyData.k);
    }
  } catch (error) { // clearKey does not require fetching.
    console.log("ℹ️ [getClearKey in hoiquanclick_plugin.js] clearKey does NOT require fetching - ", licenseKey);
    // Hex format "KID:KEY" (e.g. license_key=aabb...:ccdd...)
    if (licenseKey && licenseKey.includes(":") && licenseKey.split(":").length === 2) {
      const parts = licenseKey.split(":");

      if (
        /^[0-9a-fA-F]+$/.test(parts[0]) &&
        /^[0-9a-fA-F]+$/.test(parts[1])
      ) {
        clearKey.drmKid = parts[0].toLowerCase();
        clearKey.drmKey = parts[1].toLowerCase();
      }
    }
    else {
      const keyData = JSON.parse(licenseKey);
      // JSON format {"keys":[{"kid":"...","k":"..."}]}
      if (keyData.keys && Array.isArray(keyData.keys)) {
      keyData.keys.forEach((k) => {
        clearKey.drmKid = base64ToHex(k.kid);
        clearKey.drmKey = base64ToHex(k.k);
      });
      } else if (keyData.kid && keyData.k) { // JSON format {"kid":"...","k":"..."}
        clearKey.drmKid = base64ToHex(keyData.kid);
        clearKey.drmKey = base64ToHex(keyData.k);
      }
    }
  }

  return clearKey
}