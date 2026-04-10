import fs from 'fs';
import path from 'path';

// Translation maps: id → { ja, zh }
const COUNTRY_NAMES: Record<string, { ja: string; zh: string }> = {
  'japan':        { ja: '日本',         zh: '日本' },
  'thailand':     { ja: 'タイ',         zh: '泰国' },
  'france':       { ja: 'フランス',     zh: '法国' },
  'usa':          { ja: 'アメリカ',     zh: '美国' },
  'australia':    { ja: 'オーストラリア', zh: '澳大利亚' },
  'vietnam':      { ja: 'ベトナム',     zh: '越南' },
  'philippines':  { ja: 'フィリピン',   zh: '菲律宾' },
  'singapore':    { ja: 'シンガポール', zh: '新加坡' },
  'indonesia':    { ja: 'インドネシア', zh: '印度尼西亚' },
  'taiwan':       { ja: '台湾',         zh: '台湾' },
  'spain':        { ja: 'スペイン',     zh: '西班牙' },
  'italy':        { ja: 'イタリア',     zh: '意大利' },
  'uk':           { ja: 'イギリス',     zh: '英国' },
  'turkey':       { ja: 'トルコ',       zh: '土耳其' },
  'greece':       { ja: 'ギリシャ',     zh: '希腊' },
  'china':        { ja: '中国',         zh: '中国' },
  'hong-kong':    { ja: '香港',         zh: '香港' },
  'guam':         { ja: 'グアム',       zh: '关岛' },
  'malaysia':     { ja: 'マレーシア',   zh: '马来西亚' },
  'cambodia':     { ja: 'カンボジア',   zh: '柬埔寨' },
  'maldives':     { ja: 'モルディブ',   zh: '马尔代夫' },
  'mongolia':     { ja: 'モンゴル',     zh: '蒙古' },
  'laos':         { ja: 'ラオス',       zh: '老挝' },
  'switzerland':  { ja: 'スイス',       zh: '瑞士' },
  'czech':        { ja: 'チェコ',       zh: '捷克' },
  'croatia':      { ja: 'クロアチア',   zh: '克罗地亚' },
  'uae':          { ja: 'UAE',          zh: '阿联酋' },
  'new-zealand':  { ja: 'ニュージーランド', zh: '新西兰' },
  'germany':      { ja: 'ドイツ',       zh: '德国' },
  'portugal':     { ja: 'ポルトガル',   zh: '葡萄牙' },
  'india':        { ja: 'インド',       zh: '印度' },
  'egypt':        { ja: 'エジプト',     zh: '埃及' },
  'canada':       { ja: 'カナダ',       zh: '加拿大' },
  'austria':      { ja: 'オーストリア', zh: '奥地利' },
  'netherlands':  { ja: 'オランダ',     zh: '荷兰' },
  'morocco':      { ja: 'モロッコ',     zh: '摩洛哥' },
  'sri-lanka':    { ja: 'スリランカ',   zh: '斯里兰卡' },
  'hungary':      { ja: 'ハンガリー',   zh: '匈牙利' },
  'mexico':       { ja: 'メキシコ',     zh: '墨西哥' },
  'finland':      { ja: 'フィンランド', zh: '芬兰' },
  'denmark':      { ja: 'デンマーク',   zh: '丹麦' },
  'iceland':      { ja: 'アイスランド', zh: '冰岛' },
  'macau':        { ja: 'マカオ',       zh: '澳门' },
};

const REGION_NAMES: Record<string, { ja: string; zh: string }> = {
  'tokyo':         { ja: '東京',           zh: '东京' },
  'osaka':         { ja: '大阪',           zh: '大阪' },
  'okinawa':       { ja: '沖縄',           zh: '冲绳' },
  'hokkaido':      { ja: '北海道',         zh: '北海道' },
  'kyoto':         { ja: '京都',           zh: '京都' },
  'fukuoka':       { ja: '福岡',           zh: '福冈' },
  'nagoya':        { ja: '名古屋',         zh: '名古屋' },
  'hiroshima':     { ja: '広島',           zh: '广岛' },
  'nara':          { ja: '奈良',           zh: '奈良' },
  'nagasaki':      { ja: '長崎',           zh: '长崎' },
  'kobe':          { ja: '神戸',           zh: '神户' },
  'bangkok':       { ja: 'バンコク',       zh: '曼谷' },
  'chiang-mai':    { ja: 'チェンマイ',     zh: '清迈' },
  'phuket':        { ja: 'プーケット',     zh: '普吉岛' },
  'pattaya':       { ja: 'パタヤ',         zh: '芭提雅' },
  'krabi':         { ja: 'クラビ',         zh: '甲米' },
  'koh-samui':     { ja: 'サムイ島',       zh: '苏梅岛' },
  'paris':         { ja: 'パリ',           zh: '巴黎' },
  'nice':          { ja: 'ニース',         zh: '尼斯' },
  'marseille':     { ja: 'マルセイユ',     zh: '马赛' },
  'new-york':      { ja: 'ニューヨーク',   zh: '纽约' },
  'los-angeles':   { ja: 'ロサンゼルス',   zh: '洛杉矶' },
  'hawaii':        { ja: 'ハワイ',         zh: '夏威夷' },
  'san-francisco': { ja: 'サンフランシスコ', zh: '旧金山' },
  'las-vegas':     { ja: 'ラスベガス',     zh: '拉斯维加斯' },
  'sydney':        { ja: 'シドニー',       zh: '悉尼' },
  'melbourne':     { ja: 'メルボルン',     zh: '墨尔本' },
  'cairns':        { ja: 'ケアンズ',       zh: '凯恩斯' },
  'hanoi':         { ja: 'ハノイ',         zh: '河内' },
  'ho-chi-minh':   { ja: 'ホーチミン',     zh: '胡志明市' },
  'da-nang':       { ja: 'ダナン',         zh: '岘港' },
  'nha-trang':     { ja: 'ニャチャン',     zh: '芽庄' },
  'hoi-an':        { ja: 'ホイアン',       zh: '会安' },
  'manila':        { ja: 'マニラ',         zh: '马尼拉' },
  'boracay':       { ja: 'ボラカイ',       zh: '长滩岛' },
  'cebu':          { ja: 'セブ',           zh: '宿务' },
  'palawan':       { ja: 'パラワン',       zh: '巴拉望' },
  'singapore':     { ja: 'シンガポール',   zh: '新加坡' },
  'bali':          { ja: 'バリ',           zh: '巴厘岛' },
  'lombok':        { ja: 'ロンボク',       zh: '龙目岛' },
  'jakarta':       { ja: 'ジャカルタ',     zh: '雅加达' },
  'yogyakarta':    { ja: 'ジョグジャカルタ', zh: '日惹' },
  'taipei':        { ja: '台北',           zh: '台北' },
  'kaohsiung':     { ja: '高雄',           zh: '高雄' },
  'madrid':        { ja: 'マドリード',     zh: '马德里' },
  'barcelona':     { ja: 'バルセロナ',     zh: '巴塞罗那' },
  'seville':       { ja: 'セビリア',       zh: '塞维利亚' },
  'granada':       { ja: 'グラナダ',       zh: '格拉纳达' },
  'rome':          { ja: 'ローマ',         zh: '罗马' },
  'venice':        { ja: 'ベネチア',       zh: '威尼斯' },
  'amalfi':        { ja: 'アマルフィ',     zh: '阿马尔菲' },
  'florence':      { ja: 'フィレンツェ',   zh: '佛罗伦萨' },
  'london':        { ja: 'ロンドン',       zh: '伦敦' },
  'edinburgh':     { ja: 'エディンバラ',   zh: '爱丁堡' },
  'istanbul':      { ja: 'イスタンブール', zh: '伊斯坦布尔' },
  'cappadocia':    { ja: 'カッパドキア',   zh: '卡帕多奇亚' },
  'antalya':       { ja: 'アンタルヤ',     zh: '安塔利亚' },
  'athens':        { ja: 'アテネ',         zh: '雅典' },
  'santorini':     { ja: 'サントリーニ',   zh: '圣托里尼' },
  'mykonos':       { ja: 'ミコノス',       zh: '米科诺斯' },
  'beijing':       { ja: '北京',           zh: '北京' },
  'shanghai':      { ja: '上海',           zh: '上海' },
  'qingdao':       { ja: '青島',           zh: '青岛' },
  'zhangjiajie':   { ja: '張家界',         zh: '张家界' },
  'guilin':        { ja: '桂林',           zh: '桂林' },
  'chengdu':       { ja: '成都',           zh: '成都' },
  'xian':          { ja: '西安',           zh: '西安' },
  'hangzhou':      { ja: '杭州',           zh: '杭州' },
  'shenzhen':      { ja: '深圳',           zh: '深圳' },
  'harbin':        { ja: 'ハルビン',       zh: '哈尔滨' },
  'hong-kong':     { ja: '香港',           zh: '香港' },
  'guam':          { ja: 'グアム',         zh: '关岛' },
  'kuala-lumpur':  { ja: 'クアラルンプール', zh: '吉隆坡' },
  'kota-kinabalu': { ja: 'コタキナバル',   zh: '哥打京那巴鲁' },
  'langkawi':      { ja: 'ランカウイ',     zh: '兰卡威' },
  'penang':        { ja: 'ペナン',         zh: '槟城' },
  'siem-reap':     { ja: 'シェムリアップ', zh: '暹粒' },
  'phnom-penh':    { ja: 'プノンペン',     zh: '金边' },
  'male':          { ja: 'マレ',           zh: '马累' },
  'ulaanbaatar':   { ja: 'ウランバートル', zh: '乌兰巴托' },
  'luang-prabang': { ja: 'ルアンパバーン', zh: '琅勃拉邦' },
  'vientiane':     { ja: 'ビエンチャン',   zh: '万象' },
  'zurich':        { ja: 'チューリッヒ',   zh: '苏黎世' },
  'interlaken':    { ja: 'インターラーケン', zh: '因特拉肯' },
  'prague':        { ja: 'プラハ',         zh: '布拉格' },
  'dubrovnik':     { ja: 'ドゥブロヴニク', zh: '杜布罗夫尼克' },
  'split':         { ja: 'スプリト',       zh: '斯普利特' },
  'dubai':         { ja: 'ドバイ',         zh: '迪拜' },
  'abu-dhabi':     { ja: 'アブダビ',       zh: '阿布扎比' },
  'auckland':      { ja: 'オークランド',   zh: '奥克兰' },
  'queenstown':    { ja: 'クイーンズタウン', zh: '皇后镇' },
  'berlin':        { ja: 'ベルリン',       zh: '柏林' },
  'munich':        { ja: 'ミュンヘン',     zh: '慕尼黑' },
  'lisbon':        { ja: 'リスボン',       zh: '里斯本' },
  'porto':         { ja: 'ポルト',         zh: '波尔图' },
  'new-delhi':     { ja: 'ニューデリー',   zh: '新德里' },
  'mumbai':        { ja: 'ムンバイ',       zh: '孟买' },
  'cairo':         { ja: 'カイロ',         zh: '开罗' },
  'luxor':         { ja: 'ルクソール',     zh: '卢克索' },
  'vancouver':     { ja: 'バンクーバー',   zh: '温哥华' },
  'toronto':       { ja: 'トロント',       zh: '多伦多' },
  'vienna':        { ja: 'ウィーン',       zh: '维也纳' },
  'salzburg':      { ja: 'ザルツブルク',   zh: '萨尔茨堡' },
  'amsterdam':     { ja: 'アムステルダム', zh: '阿姆斯特丹' },
  'marrakech':     { ja: 'マラケシュ',     zh: '马拉喀什' },
  'colombo':       { ja: 'コロンボ',       zh: '科伦坡' },
  'budapest':      { ja: 'ブダペスト',     zh: '布达佩斯' },
  'cancun':        { ja: 'カンクン',       zh: '坎昆' },
  'helsinki':      { ja: 'ヘルシンキ',     zh: '赫尔辛基' },
  'copenhagen':    { ja: 'コペンハーゲン', zh: '哥本哈根' },
  'reykjavik':     { ja: 'レイキャビク',   zh: '雷克雅未克' },
  'macau':         { ja: 'マカオ',         zh: '澳门' },
};

function patchName(name: { ko: string; en: string; ja?: string; zh?: string }, translations: { ja: string; zh: string }) {
  name.ja = translations.ja;
  name.zh = translations.zh;
}

// Patch countries.json (index file)
const countriesIndexPath = path.join(__dirname, '../src/data/countries.json');
const countriesIndex = JSON.parse(fs.readFileSync(countriesIndexPath, 'utf-8')) as Array<{ id: string; name: { ko: string; en: string; ja?: string; zh?: string }; [key: string]: unknown }>;

let indexPatched = 0;
let indexSkipped = 0;
for (const country of countriesIndex) {
  const t = COUNTRY_NAMES[country.id];
  if (t) {
    patchName(country.name, t);
    indexPatched++;
  } else {
    console.warn(`[WARN] No translation for country: ${country.id}`);
    indexSkipped++;
  }
}
fs.writeFileSync(countriesIndexPath, JSON.stringify(countriesIndex, null, 2) + '\n');
console.log(`countries.json: patched ${indexPatched}, skipped ${indexSkipped}`);

// Patch each countries/{id}.json
const countriesDir = path.join(__dirname, '../src/data/countries');
const countryFiles = fs.readdirSync(countriesDir).filter(f => f.endsWith('.json'));

let totalCountries = 0;
let totalRegions = 0;
let totalRegionsSkipped = 0;

for (const file of countryFiles) {
  const filePath = path.join(countriesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as {
    id: string;
    name: { ko: string; en: string; ja?: string; zh?: string };
    regions: Array<{ id: string; name: { ko: string; en: string; ja?: string; zh?: string }; [key: string]: unknown }>;
    [key: string]: unknown;
  };

  const countryT = COUNTRY_NAMES[data.id];
  if (countryT) {
    patchName(data.name, countryT);
    totalCountries++;
  } else {
    console.warn(`[WARN] No translation for country: ${data.id}`);
  }

  for (const region of data.regions) {
    const regionT = REGION_NAMES[region.id];
    if (regionT) {
      patchName(region.name, regionT);
      totalRegions++;
    } else {
      console.warn(`[WARN] No translation for region: ${region.id} (in ${data.id})`);
      totalRegionsSkipped++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

console.log(`countries/{id}.json: patched ${totalCountries} countries, ${totalRegions} regions, ${totalRegionsSkipped} regions skipped`);
console.log('Done.');
