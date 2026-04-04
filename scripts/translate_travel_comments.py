#!/usr/bin/env python3
"""
Translate travel comment JSON files from Korean to multilingual format (ko/en/ja/zh).
"""

import json
import os

DATA_DIR = "/Users/hh/Desktop/dev/travel-weather/src/data/travel-comments"

# ============================================================
# TRANSLATION TABLES
# Each key is the exact Korean string found in the JSON files.
# Values are dicts with en/ja/zh translations.
# ============================================================

SUMMARY_TRANSLATIONS = {
    # Japan - tokyo
    "겨울 일루미네이션과 맑은 후지산 전망이 매력인 시기": {
        "en": "Winter illuminations and clear views of Mt. Fuji make this a charming time",
        "ja": "冬のイルミネーションと晴れた富士山の眺めが魅力の時期",
        "zh": "冬季灯饰与晴朗的富士山景色交相辉映，魅力十足",
    },
    "아직 쌀쌀하지만 매화가 피기 시작하는 초봄": {
        "en": "Still chilly, but early spring arrives with plum blossoms beginning to bloom",
        "ja": "まだ肌寒いが、梅が咲き始める初春",
        "zh": "仍有寒意，但梅花开始绽放，初春气息渐浓",
    },
    "벚꽃 시즌 시작, 우에노·메구로 벚꽃 명소 인파": {
        "en": "Cherry blossom season begins; crowds gather at Ueno and Meguro spots",
        "ja": "桜シーズン開幕、上野・目黒の花見スポットに人出が集中",
        "zh": "樱花季开始，上野、目黑赏花名胜游人如织",
    },
    "벚꽃(사쿠라) 만개, 일본 여행의 최고 시기": {
        "en": "Sakura in full bloom — the best time to travel Japan",
        "ja": "桜（サクラ）満開、日本旅行の最高シーズン",
        "zh": "樱花（sakura）盛开，日本旅行的最佳时节",
    },
    "신록의 계절, 쾌적한 기온으로 산책하기 좋은 시기": {
        "en": "Season of fresh greenery with pleasant temperatures — perfect for strolling",
        "ja": "新緑の季節、過ごしやすい気温で散策に最適",
        "zh": "新绿时节，气温宜人，非常适合漫步游览",
    },
    "장마(쯔유) 시즌, 비가 잦고 습도가 높아지는 시기": {
        "en": "Tsuyu (rainy season) brings frequent rain and rising humidity",
        "ja": "梅雨シーズン、雨が多く湿度が高くなる時期",
        "zh": "梅雨季节，降雨频繁，湿度明显上升",
    },
    "무더위와 높은 습도, 불꽃축제가 열리는 여름": {
        "en": "Sweltering heat and high humidity, but summer fireworks festivals light up the sky",
        "ja": "猛暑と高湿度の中、夏の花火大会が開かれる季節",
        "zh": "酷暑高湿，夏日烟火大会点亮夜空",
    },
    "한여름 폭염, 에어컨 없이는 힘든 시기": {
        "en": "Midsummer heat wave — air conditioning is a must",
        "ja": "真夏の猛暑、エアコンなしでは厳しい時期",
        "zh": "盛夏酷热，没有空调几乎难以忍受",
    },
    "잔여 더위와 태풍 가능성이 있는 초가을": {
        "en": "Lingering heat and potential typhoons mark the start of autumn",
        "ja": "残暑と台風の可能性がある初秋",
        "zh": "余热未消，台风风险犹存的初秋时节",
    },
    "단풍 시즌 시작, 닛코·교토 단풍 명소": {
        "en": "Autumn foliage season begins; Nikko and Kyoto are the prime spots",
        "ja": "紅葉シーズン開幕、日光・京都の紅葉名所が見頃に",
        "zh": "红叶季开始，日光和京都是最佳赏枫胜地",
    },
    "단풍 절정, 도쿄 최고의 가을 여행 시기": {
        "en": "Peak autumn foliage — the best time to experience Tokyo in fall",
        "ja": "紅葉最盛期、東京の秋旅行に最高の時期",
        "zh": "红叶盛景，东京秋季旅行的最佳时节",
    },
    "초겨울, 크리스마스 분위기와 일루미네이션": {
        "en": "Early winter with Christmas atmosphere and beautiful illuminations",
        "ja": "初冬、クリスマスムードとイルミネーションが輝く時期",
        "zh": "初冬时节，圣诞气氛浓厚，灯饰璀璨",
    },
    # Japan - osaka
    "추위 속에도 관광객이 적어 여유로운 오사카": {
        "en": "Cold but peaceful Osaka with fewer tourists",
        "ja": "寒いが観光客が少なく、ゆったりと楽しめる大阪",
        "zh": "天气寒冷却游客稀少，悠闲惬意的大阪",
    },
    "매화 향기 속에 봄의 시작을 알리는 오사카": {
        "en": "Osaka welcomes spring amid the fragrance of plum blossoms",
        "ja": "梅の香りの中、春の始まりを告げる大阪",
        "zh": "梅花芬芳，大阪迎来春天的序曲",
    },
    "벚꽃 명소 오사카성 공원, 봄 여행의 절정": {
        "en": "Osaka Castle Park in cherry blossom — the pinnacle of spring travel",
        "ja": "桜の名所・大阪城公園、春旅行のハイライト",
        "zh": "大阪城公园樱花盛开，春季旅行的巅峰体验",
    },
    "벚꽃 만개, 봄 축제와 야외 피크닉 시즌": {
        "en": "Cherry blossoms in full bloom — spring festivals and outdoor picnic season",
        "ja": "桜満開、春祭りと野外ピクニックシーズン",
        "zh": "樱花满开，春日祭典与户外野餐季节到来",
    },
    "初夏의 쾌적한 날씨, 도톤보리 야간 산책 좋은 시기": {
        "en": "Pleasant early summer weather; great for evening strolls along Dotonbori",
        "ja": "初夏の爽やかな天気、道頓堀の夜の散歩に最適",
        "zh": "初夏气候宜人，道顿堀夜游正当时",
    },
    "장마 시즌, 비 속에서도 타코야키와 쇼핑": {
        "en": "Rainy season, but takoyaki and shopping keep the fun going",
        "ja": "梅雨シーズン、雨の中でもたこ焼きとショッピングを楽しもう",
        "zh": "梅雨时节，雨中品尝章鱼烧、尽享购物乐趣",
    },
    "폭염과 텐진마츠리, 오사카 여름의 절정": {
        "en": "Scorching heat meets Tenjin Matsuri — the peak of Osaka summer",
        "ja": "猛暑と天神祭り、大阪の夏の最高潮",
        "zh": "酷暑与天神祭交汇，大阪夏日的巅峰",
    },
    "여름 마지막 열기와 함께하는 오사카 탐방": {
        "en": "Exploring Osaka in the final throes of summer heat",
        "ja": "夏の残り熱とともに楽しむ大阪探訪",
        "zh": "在夏末余热中探索大阪的魅力",
    },
    "태풍 주의보, 실내 관광지 중심 여행 권장": {
        "en": "Typhoon advisories; indoor attractions recommended as a priority",
        "ja": "台風注意報、室内観光スポット中心の旅行を推奨",
        "zh": "台风警报频发，建议以室内景点为主安排行程",
    },
    "단풍 시작, 오사카성과 교토 당일치기 최적": {
        "en": "Autumn foliage begins — perfect for day trips to Osaka Castle and Kyoto",
        "ja": "紅葉が始まり、大阪城と京都への日帰り旅行に最適",
        "zh": "红叶渐染，大阪城与京都一日游正当时",
    },
    "선선한 날씨와 단풍, 간사이 여행의 황금기": {
        "en": "Cool weather and autumn leaves — the golden season for Kansai travel",
        "ja": "涼しい天気と紅葉、関西旅行のゴールデンシーズン",
        "zh": "凉爽的天气与红叶相映成趣，关西旅行的黄金时期",
    },
    "연말 분위기와 크리스마스 마켓, 겨울 오사카": {
        "en": "Year-end atmosphere and Christmas markets in winter Osaka",
        "ja": "年末ムードとクリスマスマーケット、冬の大阪",
        "zh": "年末氛围浓厚，圣诞市场点缀冬日大阪",
    },
    # Japan - kyoto
    "관광객 적은 겨울 교토, 사원과 정원의 고요함": {
        "en": "Quiet winter Kyoto with few tourists — serene temples and gardens",
        "ja": "観光客の少ない冬の京都、寺院と庭園の静寂",
        "zh": "游客稀少的冬日京都，寺院与庭园宁静幽美",
    },
    "매화 피는 교토, 봄의 시작을 알리는 시기": {
        "en": "Plum blossoms in Kyoto herald the arrival of spring",
        "ja": "梅が咲く京都、春の始まりを告げる時期",
        "zh": "梅花绽放的京都，春天到来的信号",
    },
    "벚꽃 절정, 철학의 길·마루야마 공원 인산인해": {
        "en": "Cherry blossoms at their peak — the Philosopher's Path and Maruyama Park are packed",
        "ja": "桜最盛期、哲学の道・円山公園は人でいっぱい",
        "zh": "樱花盛极，哲学之道和圆山公园人山人海",
    },
    "벚꽃 만개, 교토 여행 최고의 황금기": {
        "en": "Full bloom cherry blossoms — the golden peak of Kyoto travel",
        "ja": "桜満開、京都旅行最高の黄金期",
        "zh": "樱花满开，京都旅行的黄金巅峰时刻",
    },
    "초록 단풍 신록, 교토의 숨은 매력": {
        "en": "Fresh green maples reveal Kyoto's hidden charm",
        "ja": "青紅葉の新緑、京都の隠れた魅力",
        "zh": "青翠的新叶展现京都别样的迷人魅力",
    },
    "장마철 교토, 이끼 정원과 비 내리는 사원의 운치": {
        "en": "Rainy season Kyoto — moss gardens and temples in the rain have a special charm",
        "ja": "梅雨の京都、苔庭と雨の寺院の趣",
        "zh": "梅雨中的京都，苔藓庭院与烟雨寺院别有韵味",
    },
    "한여름 교토, 기온마츠리와 폭염": {
        "en": "Midsummer Kyoto — Gion Matsuri and scorching heat",
        "ja": "真夏の京都、祇園祭と猛暑",
        "zh": "盛夏京都，祗园祭与酷暑交织",
    },
    "오봉 시즌, 교토 전통 풍경과 폭염": {
        "en": "Obon season — traditional Kyoto scenery under the blazing heat",
        "ja": "お盆シーズン、京都の伝統的な風景と猛暑",
        "zh": "盂兰盆节时节，传统京都风情与酷热并存",
    },
    "태풍 가능성과 잔더위, 아직 성수기": {
        "en": "Possible typhoons and lingering heat, but still peak season",
        "ja": "台風の可能性と残暑、まだ繁忙期",
        "zh": "台风风险与余热犹在，仍是旅游旺季",
    },
    "단풍 물드는 교토, 가을 여행의 절정": {
        "en": "Autumn colors sweep across Kyoto — the peak of fall travel",
        "ja": "紅葉に染まる京都、秋旅行の最高潮",
        "zh": "红叶染遍京都，秋季旅行的最高峰",
    },
    "교토 단풍 절정, 전 세계 여행자가 몰리는 시기": {
        "en": "Peak autumn foliage in Kyoto attracts travelers from around the world",
        "ja": "京都の紅葉最盛期、世界中の旅行者が訪れる時期",
        "zh": "京都红叶盛极，全球游客纷至沓来",
    },
    "첫눈과 함께 시작되는 교토의 겨울, 고요한 사원": {
        "en": "Kyoto's winter begins with the first snow — quiet, snow-dusted temples",
        "ja": "初雪とともに始まる京都の冬、静寂に包まれた寺院",
        "zh": "初雪揭开京都冬日序幕，寺院在宁静中更显庄严",
    },
    # Japan - hokkaido
    "동계 올림픽 강설, 니세코·루스쓰 스키 최적기": {
        "en": "Olympic-grade snowfall — peak season for skiing at Niseko and Rusutsu",
        "ja": "オリンピック級の積雪、ニセコ・ルスツのスキー最適期",
        "zh": "奥运级降雪，留寿都和二世谷滑雪的最佳时期",
    },
    "홋카이도 눈 축제, 삿포로 설경의 하이라이트": {
        "en": "Hokkaido Snow Festival — the highlight of Sapporo's winter scenery",
        "ja": "北海道雪まつり、札幌雪景色のハイライト",
        "zh": "北海道雪祭，札幌雪景的最大亮点",
    },
    "봄 시작, 눈이 녹고 야생화가 피기 시작": {
        "en": "Spring begins as snow melts and wildflowers start to bloom",
        "ja": "春の始まり、雪が解け野の花が咲き出す",
        "zh": "春天来临，积雪消融，野花开始绽放",
    },
    "신록과 봄꽃, 홋카이도의 짧은 봄": {
        "en": "Fresh greenery and spring flowers — Hokkaido's brief but beautiful spring",
        "ja": "新緑と春の花々、北海道の短い春",
        "zh": "新绿与春花相映，北海道短暂而美丽的春天",
    },
    "라벤더 시즌 준비, 라벤더 팜 개장 시작": {
        "en": "Lavender season approaches as lavender farms begin to open",
        "ja": "ラベンダーシーズン到来、ラベンダーファームがオープン開始",
        "zh": "薰衣草季节即将到来，薰衣草农场陆续开放",
    },
    "라벤더 절정, 후라노 일대 보라빛 물결": {
        "en": "Lavender at its peak — waves of purple across Furano",
        "ja": "ラベンダー最盛期、富良野一帯に紫色の波",
        "zh": "薰衣草盛开，富良野一带紫色花海令人心醉",
    },
    "여름 성수기, 쾌적하고 맑은 홋카이도": {
        "en": "Peak summer season — comfortable and sunny Hokkaido",
        "ja": "夏の繁忙期、快適で晴れた北海道",
        "zh": "夏季旅游旺季，北海道天气宜人，阳光灿烂",
    },
    "여름 끝자락, 수확 계절이 시작되는 홋카이도": {
        "en": "End of summer — harvest season begins in Hokkaido",
        "ja": "夏の終わり、収穫の季節が始まる北海道",
        "zh": "夏末时节，北海道迎来丰收季节的开始",
    },
    "단풍 명소 홋카이도, 가을 드라이브 최적기": {
        "en": "Hokkaido's famous autumn foliage — perfect for a scenic fall drive",
        "ja": "紅葉の名所・北海道、秋のドライブに最適",
        "zh": "北海道红叶名胜，秋季自驾游的最佳时期",
    },
    "초겨울, 첫눈과 함께 스키 시즌 준비": {
        "en": "Early winter — first snowfall and ski season preparations begin",
        "ja": "初冬、初雪とともにスキーシーズンの準備",
        "zh": "初冬时节，第一场雪预示滑雪季即将开始",
    },
    "파우더 스노우 시즌 개막, 세계적인 스키 명소": {
        "en": "Powder snow season opens — a world-class skiing destination",
        "ja": "パウダースノーシーズン開幕、世界的なスキー名所",
        "zh": "粉雪季节开幕，享誉全球的滑雪胜地",
    },
    "크리스마스 스키, 홋카이도 최고의 파우더 설질": {
        "en": "Christmas skiing on Hokkaido's finest powder snow",
        "ja": "クリスマススキー、北海道最高のパウダースノー",
        "zh": "圣诞滑雪，尽享北海道最优质的粉雪体验",
    },
    # Thailand - bangkok
    "건기 한가운데, 선선한 바람이 부는 여행 최적기": {
        "en": "Peak dry season with cool breezes — the best time to visit",
        "ja": "乾季の真っ只中、涼しい風が吹く旅行最適期",
        "zh": "干季正盛，凉风习习，出行最佳时节",
    },
    "건기 지속, 기온이 조금씩 오르기 시작": {
        "en": "Dry season continues as temperatures start to gradually rise",
        "ja": "乾季が続き、気温が少しずつ上がり始める",
        "zh": "干季持续，气温开始逐渐攀升",
    },
    "더위가 시작되는 과도기, 오후 폭염 주의": {
        "en": "Transitional period as heat begins — watch out for afternoon heat waves",
        "ja": "暑さが始まる過渡期、午後の猛暑に注意",
        "zh": "酷热开始的过渡期，午后高温需注意防暑",
    },
    "송크란(물축제)이 있지만 40°C 극심한 더위": {
        "en": "Songkran water festival is exciting, but extreme 40°C heat is a challenge",
        "ja": "ソンクラン（水かけ祭り）があるが、40°Cの猛暑も",
        "zh": "宋干节水上嘉年华精彩纷呈，但40°C的酷热不容小觑",
    },
    "우기 시작, 매일 오후 스콜이 쏟아지는 시기": {
        "en": "Rainy season begins with afternoon squalls every day",
        "ja": "雨季が始まり、毎日午後にスコールが降る時期",
        "zh": "雨季开始，每天午后雷阵雨倾盆而下",
    },
    "본격 우기, 오후마다 집중 호우": {
        "en": "Full rainy season with heavy downpours every afternoon",
        "ja": "本格的な雨季、毎午後に集中豪雨",
        "zh": "正式进入雨季，每日午后暴雨如注",
    },
    "우기 지속, 도로 침수가 빈번한 시기": {
        "en": "Rainy season continues with frequent road flooding",
        "ja": "雨季が続き、道路の浸水が頻発する時期",
        "zh": "雨季持续，道路积水内涝频发",
    },
    "우기와 높은 습도, 야외 관광이 힘든 시기": {
        "en": "Rainy season and high humidity make outdoor sightseeing difficult",
        "ja": "雨季と高湿度で、屋外観光が辛い時期",
        "zh": "雨季高湿，户外观光颇为艰难",
    },
    "우기 절정, 방콕 침수 위험이 가장 높은 시기": {
        "en": "Peak rainy season — highest flood risk in Bangkok",
        "ja": "雨季のピーク、バンコク浸水リスクが最も高い時期",
        "zh": "雨季高峰，曼谷洪水风险最高的时段",
    },
    "우기 막바지, 비가 줄어들기 시작": {
        "en": "Tail end of rainy season as rainfall starts to decrease",
        "ja": "雨季の終わり、雨が減り始める",
        "zh": "雨季尾声，降雨量开始减少",
    },
    "건기 시작, 러이끄라통 축제의 낭만": {
        "en": "Dry season begins with the romantic Loy Krathong festival",
        "ja": "乾季が始まり、ロイクラトン祭りのロマンス",
        "zh": "干季开始，水灯节浪漫满溢",
    },
    "건기의 선선한 바람, 연말 분위기의 여행 최적기": {
        "en": "Cool dry-season breezes and year-end atmosphere — perfect time to travel",
        "ja": "乾季の涼しい風と年末ムード、旅行最適期",
        "zh": "干季凉风送爽，年末氛围浓厚，旅行最佳时节",
    },
    # Thailand - chiang-mai
    "건기의 서늘한 날씨, 트레킹과 사원 투어 최적기": {
        "en": "Cool dry season weather — perfect for trekking and temple tours",
        "ja": "乾季の涼しい天気、トレッキングと寺院ツアーに最適",
        "zh": "干季凉爽，徒步探险与寺院游览的最佳时机",
    },
    "건기 지속, 쾌적하지만 연무 시작될 수 있는 시기": {
        "en": "Dry season continues with pleasant weather, though haze may begin",
        "ja": "乾季が続き、快適だが煙霧が始まる可能性も",
        "zh": "干季持续，天气宜人，但烟雾可能开始出现",
    },
    "산불 연무(스모그) 시작, 대기질 급격히 악화": {
        "en": "Wildfire haze begins as air quality rapidly deteriorates",
        "ja": "山火事のスモッグが始まり、大気質が急速に悪化",
        "zh": "山火烟雾弥漫，空气质量急剧恶化",
    },
    "산불 연무 절정, 세계 최악 수준의 대기질": {
        "en": "Haze peaks with some of the worst air quality in the world",
        "ja": "山火事の煙霧が最高潮に、世界最悪レベルの大気質",
        "zh": "山火烟雾最为严重，空气质量达到全球最差水平",
    },
    "연무 끝자락과 우기 시작이 겹치는 시기": {
        "en": "End of haze overlaps with the start of the rainy season",
        "ja": "煙霧の終わりと雨季の始まりが重なる時期",
        "zh": "烟雾尾声与雨季开始交叠的过渡期",
    },
    "우기이지만 공기가 맑아지고 녹음이 짙어지는 시기": {
        "en": "Rainy season brings clear air and lush greenery",
        "ja": "雨季だが空気が清んで緑が深まる時期",
        "zh": "虽是雨季，空气却变得清新，绿意更加浓郁",
    },
    "우기 지속, 짧은 오후 소나기 후 맑은 하늘": {
        "en": "Rainy season continues with brief afternoon showers followed by clear skies",
        "ja": "雨季が続き、短い午後のスコール後は晴れ渡る",
        "zh": "雨季持续，短暂午后阵雨后天空放晴",
    },
    "우기, 산길이 미끄럽고 트레킹 주의": {
        "en": "Rainy season makes mountain paths slippery — trekking caution advised",
        "ja": "雨季で山道が滑りやすく、トレッキングに注意",
        "zh": "雨季山路湿滑，徒步需格外谨慎",
    },
    "우기 절정, 강우량이 가장 많은 시기": {
        "en": "Peak rainy season with the heaviest rainfall of the year",
        "ja": "雨季のピーク、年間で最も雨量が多い時期",
        "zh": "雨季高峰，全年降雨量最多的时段",
    },
    "우기 마무리, 논 풍경이 아름다운 시기": {
        "en": "Rainy season winds down with beautiful rice paddy scenery",
        "ja": "雨季が締めくくり、稲田の風景が美しい時期",
        "zh": "雨季收尾，稻田风光格外迷人",
    },
    "이펑 축제, 건기 시작과 함께 환상적인 밤하늘": {
        "en": "Yi Peng Lantern Festival lights up the night sky as the dry season begins",
        "ja": "イーペン祭り、乾季の始まりとともに幻想的な夜空",
        "zh": "彝鹏节花灯节与干季开始交汇，夜空美轮美奂",
    },
    "건기, 서늘하고 맑은 날씨로 트레킹 최적기": {
        "en": "Dry season with cool, clear weather — ideal for trekking",
        "ja": "乾季、涼しく晴れた天気でトレッキングに最適",
        "zh": "干季凉爽晴朗，徒步探险的理想时期",
    },
    # Thailand - phuket
    "건기 절정, 맑고 잔잔한 안다만 바다의 최적기": {
        "en": "Peak dry season with clear skies and calm Andaman Sea — conditions are perfect",
        "ja": "乾季のピーク、澄んで穏やかなアンダマン海の最適期",
        "zh": "干季极致，晴空万里，安达曼海风平浪静，绝佳出游时机",
    },
    "건기 지속, 다이빙과 스노클링 최고 시야": {
        "en": "Dry season continues with the best visibility for diving and snorkeling",
        "ja": "乾季が続き、ダイビングとシュノーケリングの視界が最高",
        "zh": "干季持续，潜水与浮潜能见度达到最佳",
    },
    "건기이지만 더위가 서서히 올라오는 시기": {
        "en": "Still dry season but temperatures are starting to creep up",
        "ja": "乾季だが暑さが徐々に上がってくる時期",
        "zh": "仍是干季，但气温开始逐渐升高",
    },
    "건기 막바지, 아직 해변을 즐기기 좋은 시기": {
        "en": "Tail end of dry season — still a great time to enjoy the beach",
        "ja": "乾季の終わり、まだビーチを楽しめる時期",
        "zh": "干季尾声，海滩游玩仍是不错的选择",
    },
    "우기 시작, 파도가 높아지고 해수욕 주의": {
        "en": "Rainy season begins with higher waves — swimming caution advised",
        "ja": "雨季が始まり、波が高くなり海水浴に注意",
        "zh": "雨季开始，海浪增高，游泳需注意安全",
    },
    "우기 본격화, 2~3m 파도로 해수욕 위험": {
        "en": "Rainy season intensifies with 2–3m waves making swimming dangerous",
        "ja": "雨季本格化、2〜3mの波で海水浴は危険",
        "zh": "雨季全面来临，2-3米高浪使游泳极具危险性",
    },
    "우기, 비와 거친 파도가 지속되는 시기": {
        "en": "Rainy season with persistent rain and rough waves",
        "ja": "雨季、雨と荒波が続く時期",
        "zh": "雨季持续，风雨交加，海浪汹涌",
    },
    "우기 지속, 다이빙 시야가 떨어지는 시기": {
        "en": "Rainy season continues with reduced diving visibility",
        "ja": "雨季が続き、ダイビングの視界が落ちる時期",
        "zh": "雨季持续，潜水能见度下降",
    },
    "우기 절정, 가장 비가 많은 시기": {
        "en": "Peak rainy season with the heaviest rainfall",
        "ja": "雨季のピーク、最も雨が多い時期",
        "zh": "雨季高峰，降雨量最大的时段",
    },
    "우기 끝자락, 비가 줄어들기 시작": {
        "en": "End of rainy season as rainfall begins to decrease",
        "ja": "雨季の終わり、雨が減り始める",
        "zh": "雨季尾声，降雨量开始减少",
    },
    "건기 시작, 바다가 잔잔해지는 시기": {
        "en": "Dry season begins as the sea calms down",
        "ja": "乾季が始まり、海が穏やかになる時期",
        "zh": "干季开始，海面逐渐平静",
    },
    "건기 피크, 크리스마스 분위기의 해변 휴양": {
        "en": "Peak dry season with a festive Christmas atmosphere at the beach",
        "ja": "乾季のピーク、クリスマスムードのビーチリゾート",
        "zh": "干季高峰，海滩弥漫着圣诞节的欢乐气息",
    },
    # Vietnam - hanoi
    "겨울 안개와 보슬비, 쌀쌀하고 흐린 날이 많은 시기": {
        "en": "Winter fog and drizzle with many cool, overcast days",
        "ja": "冬の霧と小雨、肌寒く曇りの日が多い時期",
        "zh": "冬日薄雾与毛毛雨，阴凉多云的天气为主",
    },
    "아직 쌀쌀하지만 봄기운이 시작되는 시기": {
        "en": "Still chilly but spring vibes are beginning to emerge",
        "ja": "まだ肌寒いが、春の気配が感じられる時期",
        "zh": "仍有寒意，但春的气息已悄然来临",
    },
    "봄꽃이 피고 기온이 올라가는 시기": {
        "en": "Spring flowers bloom as temperatures start to rise",
        "ja": "春の花が咲き、気温が上がってくる時期",
        "zh": "春花盛开，气温逐渐回升",
    },
    "따뜻한 봄, 하롱베이 크루즈 좋은 시기": {
        "en": "Warm spring — a great time for a Ha Long Bay cruise",
        "ja": "暖かい春、ハロン湾クルーズに最適な時期",
        "zh": "春暖花开，下龙湾游船正当时",
    },
    "폭염 시작, 35°C 이상 고온다습한 시기": {
        "en": "Heat wave begins with temperatures above 35°C and high humidity",
        "ja": "猛暑が始まり、35°C以上の高温多湿な時期",
        "zh": "酷暑来临，气温超过35°C，高温高湿",
    },
    "우기와 극심한 더위가 겹치는 최악의 시기": {
        "en": "The worst period when the rainy season and extreme heat overlap",
        "ja": "雨季と猛暑が重なる最悪の時期",
        "zh": "雨季与极端酷热叠加，全年最难熬的时段",
    },
    "우기 절정, 폭우와 폭염이 동시에": {
        "en": "Peak rainy season with torrential rain and scorching heat simultaneously",
        "ja": "雨季のピーク、豪雨と猛暑が同時に",
        "zh": "雨季高峰，暴雨与酷热同时来袭",
    },
    "우기 지속, 태풍 영향 가능": {
        "en": "Rainy season continues with possible typhoon influence",
        "ja": "雨季が続き、台風の影響も考えられる",
        "zh": "雨季持续，可能受台风影响",
    },
    "우기 끝자락, 비가 줄어들기 시작": {
        "en": "Tail end of the rainy season as rainfall begins to decrease",
        "ja": "雨季の終わり、雨が減り始める",
        "zh": "雨季尾声，降雨量开始减少",
    },
    "건기 시작, 25°C의 가장 쾌적한 시기": {
        "en": "Dry season begins at a comfortable 25°C — the most pleasant time of year",
        "ja": "乾季が始まり、25°Cの最も快適な時期",
        "zh": "干季开始，25°C的宜人气候，全年最舒适的时期",
    },
    "건기, 선선하고 맑은 하노이 여행 최적기": {
        "en": "Dry season with cool, clear weather — the best time to visit Hanoi",
        "ja": "乾季、涼しく晴れたハノイ旅行の最適期",
        "zh": "干季凉爽晴朗，游览河内的最佳时机",
    },
    "건기 지속, 쌀쌀하지만 맑은 겨울": {
        "en": "Dry season continues with cool but clear winter weather",
        "ja": "乾季が続き、肌寒いが晴れた冬",
        "zh": "干季持续，天气凉爽但晴朗的冬日",
    },
    # Vietnam - ho-chi-minh
    "건기 한가운데, 맑고 쾌적한 여행 최적기": {
        "en": "Peak dry season with clear skies and comfortable weather — ideal for travel",
        "ja": "乾季の真っ只中、晴れて快適な旅行の最適期",
        "zh": "干季正盛，天气晴朗宜人，旅行最佳时节",
    },
    "건기 절정, 가장 건조한 달": {
        "en": "Peak dry season — the driest month of the year",
        "ja": "乾季のピーク、最も乾燥した月",
        "zh": "干季高峰，全年最为干燥的月份",
    },
    "건기 지속, 더위가 올라오지만 아직 쾌적": {
        "en": "Dry season continues as heat builds but it's still comfortable",
        "ja": "乾季が続き、暑さが上がってくるが、まだ快適",
        "zh": "干季持续，气温升高但仍属舒适",
    },
    "더위 본격화, 건기 막바지": {
        "en": "Heat intensifies as the dry season reaches its end",
        "ja": "暑さが本格化し、乾季の終盤",
        "zh": "酷热全面来袭，干季接近尾声",
    },
    "우기 시작, 매일 오후 스콜이 쏟아짐": {
        "en": "Rainy season starts with afternoon squalls every day",
        "ja": "雨季が始まり、毎日午後にスコールが降り注ぐ",
        "zh": "雨季开始，每天午后雷阵雨倾泻而下",
    },
    "우기, 오후 집중 호우와 도로 침수": {
        "en": "Rainy season with heavy afternoon downpours and road flooding",
        "ja": "雨季、午後の集中豪雨と道路浸水",
        "zh": "雨季来临，午后暴雨集中，道路积水严重",
    },
    "우기 지속, 높은 습도": {
        "en": "Rainy season continues with high humidity",
        "ja": "雨季が続き、高い湿度",
        "zh": "雨季持续，湿度居高不下",
    },
    "우기, 비와 습도가 극심한 시기": {
        "en": "Rainy season with extreme rain and humidity",
        "ja": "雨季、雨と湿度が極めて高い時期",
        "zh": "雨季之中，降雨与湿度均达极值",
    },
    "우기 절정, 침수 빈번": {
        "en": "Peak rainy season with frequent flooding",
        "ja": "雨季のピーク、浸水が頻繁",
        "zh": "雨季高峰，内涝频发",
    },
    "우기 끝자락, 비가 줄어들기 시작": {
        "en": "Tail end of rainy season as rainfall begins to taper off",
        "ja": "雨季の終わり、雨が減り始める",
        "zh": "雨季尾声，降雨量开始逐渐减少",
    },
    "우기 마무리, 건기로 전환 중": {
        "en": "Wrapping up the rainy season and transitioning to dry season",
        "ja": "雨季の締めくくり、乾季への移行中",
        "zh": "雨季收尾，正向干季过渡",
    },
    "건기 시작, 선선한 바람이 부는 여행 적기": {
        "en": "Dry season begins with refreshing breezes — a good time to travel",
        "ja": "乾季が始まり、涼しい風が吹く旅行適期",
        "zh": "干季开始，凉风习习，出行好时节",
    },
    # Vietnam - da-nang
    "비가 줄지만 아직 흐린 날이 많은 시기": {
        "en": "Rainfall decreases but many overcast days remain",
        "ja": "雨は減るが、まだ曇りの日が多い時期",
        "zh": "降雨减少，但阴天仍然较多",
    },
    "건기 시작, 날씨가 좋아지는 시기": {
        "en": "Dry season begins as the weather improves",
        "ja": "乾季が始まり、天気が良くなる時期",
        "zh": "干季开始，天气逐渐好转",
    },
    "건기, 해변 시즌 시작": {
        "en": "Dry season — beach season begins",
        "ja": "乾季、ビーチシーズン開幕",
        "zh": "干季到来，海滩季节正式开始",
    },
    "건기 절정, 완벽한 해변과 바나힐 관광": {
        "en": "Peak dry season — perfect beaches and Ba Na Hills sightseeing",
        "ja": "乾季のピーク、完璧なビーチとバーナーヒルズ観光",
        "zh": "干季极致，完美的海滩与巴拿山观光两不误",
    },
    "건기 지속, 해변과 마블마운틴 관광 최적기": {
        "en": "Dry season continues — the best time for beaches and Marble Mountains",
        "ja": "乾季が続き、ビーチと大理石山観光の最適期",
        "zh": "干季持续，海滩与大理山观光的最佳时期",
    },
    "더워지지만 아직 해변 즐기기 좋은 시기": {
        "en": "Getting hotter but still a great time to enjoy the beach",
        "ja": "暑くなってくるが、まだビーチを楽しめる時期",
        "zh": "气温升高，但海滩依然令人流连",
    },
    "고온이지만 해변 성수기": {
        "en": "High temperatures but it's peak beach season",
        "ja": "高温だが、ビーチの繁忙期",
        "zh": "气温偏高，但正值海滩旺季",
    },
    "태풍 시즌 시작, 비가 잦아지는 시기": {
        "en": "Typhoon season begins as rainfall increases",
        "ja": "台風シーズン開始、雨が多くなる時期",
        "zh": "台风季节开始，降雨频率增加",
    },
    "태풍 접근, 폭우가 빈번한 시기": {
        "en": "Typhoons approaching with frequent heavy rains",
        "ja": "台風接近、暴雨が頻繁な時期",
        "zh": "台风逼近，暴雨频繁来袭",
    },
    "태풍·폭우 절정, 홍수 위험 가장 높은 시기": {
        "en": "Peak typhoon and storm period with the highest flood risk",
        "ja": "台風・暴雨のピーク、洪水リスクが最も高い時期",
        "zh": "台风与暴雨双重高峰，洪水风险最大的时段",
    },
    "태풍 지속, 해수욕 불가능": {
        "en": "Typhoons continue — swimming in the sea is not possible",
        "ja": "台風が続き、海水浴は不可能",
        "zh": "台风持续，无法在海里游泳",
    },
    "우기 끝자락, 점차 날씨 회복 중": {
        "en": "Tail end of rainy season as the weather gradually recovers",
        "ja": "雨季の終わり、天気が徐々に回復中",
        "zh": "雨季尾声，天气正在逐渐好转",
    },
    # Philippines - manila
    "건기 한가운데, 맑고 선선한 관광 최적기": {
        "en": "Peak dry season — clear skies and cool weather make this the best time to visit",
        "ja": "乾季の真っ只中、晴れて涼しく観光最適期",
        "zh": "干季正盛，晴空万里，凉爽宜人，游览最佳时节",
    },
    "건기 절정, 쾌적한 날씨와 축제 시즌": {
        "en": "Peak dry season with comfortable weather and festival season",
        "ja": "乾季のピーク、快適な天気とフェスティバルシーズン",
        "zh": "干季高峰，天气舒适，节庆活动精彩纷呈",
    },
    "건기 지속, 더위가 올라오기 시작": {
        "en": "Dry season continues as temperatures start to climb",
        "ja": "乾季が続き、暑さが上がり始める",
        "zh": "干季持续，气温开始攀升",
    },
    "극심한 더위, 40°C에 달하는 폭염": {
        "en": "Extreme heat with temperatures approaching 40°C",
        "ja": "猛暑、40°Cに達する熱波",
        "zh": "酷热难耐，气温可高达40°C",
    },
    "우기 시작, 폭우와 더위가 동시에": {
        "en": "Rainy season begins with heavy rain and heat simultaneously",
        "ja": "雨季が始まり、豪雨と暑さが同時に",
        "zh": "雨季来临，暴雨与酷热同时肆虐",
    },
    "몬순 시작, 폭우와 침수 빈번": {
        "en": "Monsoon begins with heavy rains and frequent flooding",
        "ja": "モンスーン開始、豪雨と浸水が頻繁に",
        "zh": "季风来临，暴雨与内涝频繁发生",
    },
    "태풍 시즌, 극심한 폭우와 홍수": {
        "en": "Typhoon season brings extreme heavy rain and flooding",
        "ja": "台風シーズン、激しい暴雨と洪水",
        "zh": "台风季节，极端暴雨与洪水肆虐",
    },
    "태풍 절정기, 가장 위험한 시기": {
        "en": "Peak typhoon season — the most dangerous time of year",
        "ja": "台風のピーク期、最も危険な時期",
        "zh": "台风最盛期，全年最危险的时段",
    },
    "초대형 태풍 빈발, 여행 피해야 할 시기": {
        "en": "Super typhoons are frequent — this period is best avoided for travel",
        "ja": "超大型台風が頻発、旅行を避けるべき時期",
        "zh": "超强台风频繁，应尽量避免此时出行",
    },
    "태풍 시즌 끝자락, 비 여전히 많음": {
        "en": "Tail end of typhoon season but rainfall is still heavy",
        "ja": "台風シーズンの終わり、雨はまだ多い",
        "zh": "台风季节尾声，降雨量仍然较大",
    },
    "건기 시작, 날씨 회복 중": {
        "en": "Dry season begins as the weather recovers",
        "ja": "乾季が始まり、天気が回復中",
        "zh": "干季开始，天气逐渐恢复",
    },
    "건기, 크리스마스 축제 분위기의 활기찬 마닐라": {
        "en": "Dry season brings festive Christmas energy to lively Manila",
        "ja": "乾季、クリスマス祭りムードの活気あるマニラ",
        "zh": "干季时节，马尼拉洋溢着圣诞节的节日活力",
    },
    # Philippines - boracay
    "건기 절정, 투명한 바다와 화이트비치 최적기": {
        "en": "Peak dry season with crystal-clear waters and White Beach at its best",
        "ja": "乾季のピーク、透き通った海とホワイトビーチ最適期",
        "zh": "干季高峰，碧透的海水与白沙滩美不胜收",
    },
    "건기, 맑은 바다에서 아일랜드 호핑": {
        "en": "Dry season — perfect for island hopping in the clear water",
        "ja": "乾季、澄んだ海でアイランドホッピング",
        "zh": "干季，在清澈的海水中环岛跳岛正当时",
    },
    "건기 지속, 해변 컨디션 최고": {
        "en": "Dry season continues with the best beach conditions",
        "ja": "乾季が続き、ビーチコンディション最高",
        "zh": "干季持续，海滩条件达到最佳状态",
    },
    "건기 끝자락, 여전히 해변 좋은 시기": {
        "en": "Tail end of dry season — beaches are still in great condition",
        "ja": "乾季の終わり、まだビーチが良い時期",
        "zh": "干季尾声，海滩条件仍然良好",
    },
    "우기 시작 전, 해변 막바지 즐기기": {
        "en": "Just before the rainy season — last chance to enjoy the beaches",
        "ja": "雨季前、ビーチの最後の楽しみを",
        "zh": "雨季来临前，海滩的最后欢乐时光",
    },
    "우기(하바갓), 거친 바다와 해수욕 제한": {
        "en": "Habagat (rainy season) brings rough seas and swimming restrictions",
        "ja": "ハバガット（雨季）、荒れた海と海水浴制限",
        "zh": "哈巴哈特（雨季）来临，海浪汹涌，游泳受限",
    },
    "우기, 파도 높고 투어 취소 빈번": {
        "en": "Rainy season with high waves and frequent tour cancellations",
        "ja": "雨季、波が高くツアーキャンセルが頻繁",
        "zh": "雨季波浪高涨，旅游活动取消频繁",
    },
    "우기 지속, 해변 활동 어려운 시기": {
        "en": "Rainy season continues — beach activities are difficult",
        "ja": "雨季が続き、ビーチ活動が難しい時期",
        "zh": "雨季持续，海滩活动受到很大影响",
    },
    "우기 절정, 페리 결항도 잦은 시기": {
        "en": "Peak rainy season with frequent ferry cancellations",
        "ja": "雨季のピーク、フェリーの欠航も多い時期",
        "zh": "雨季高峰，轮渡停航频繁",
    },
    "우기 끝자락, 아직 바다가 거친 시기": {
        "en": "Tail end of rainy season but the sea is still rough",
        "ja": "雨季の終わり、まだ海が荒れている時期",
        "zh": "雨季尾声，但海面依然汹涌",
    },
    "건기 시작, 바다가 잔잔해지는 시기": {
        "en": "Dry season begins as the sea calms down",
        "ja": "乾季が始まり、海が穏やかになる時期",
        "zh": "干季开始，海面渐趋平静",
    },
    "건기, 화이트비치가 빛나는 크리스마스 시즌": {
        "en": "Dry season — White Beach shines in the Christmas season",
        "ja": "乾季、ホワイトビーチが輝くクリスマスシーズン",
        "zh": "干季时节，白沙滩在圣诞季节熠熠生辉",
    },
    # Philippines - cebu
    "건기, 맑은 바다에서 고래상어 투어 최적기": {
        "en": "Dry season — the best time for whale shark tours in the clear sea",
        "ja": "乾季、澄んだ海でのジンベエザメツアー最適期",
        "zh": "干季，清澈海域中鲸鲨之旅的最佳时机",
    },
    "건기 절정, 시누록 축제와 다이빙 시즌": {
        "en": "Peak dry season with Sinulog festival and diving season",
        "ja": "乾季のピーク、シヌログ祭りとダイビングシーズン",
        "zh": "干季高峰，西努洛节与潜水季节双重精彩",
    },
    "건기 지속, 해양 액티비티 최적": {
        "en": "Dry season continues — ideal for all water activities",
        "ja": "乾季が続き、マリンアクティビティに最適",
        "zh": "干季持续，各类水上活动最为适宜",
    },
    "건기 끝자락, 아직 해변 좋은 시기": {
        "en": "Tail end of dry season — beaches are still enjoyable",
        "ja": "乾季の終わり、まだビーチが良い時期",
        "zh": "干季尾声，海滩依然怡人",
    },
    "우기 시작, 비가 늘어나는 과도기": {
        "en": "Rainy season begins — transitional period as rainfall increases",
        "ja": "雨季が始まり、雨が増える過渡期",
        "zh": "雨季开始，降雨逐渐增多的过渡期",
    },
    "우기 본격화, 다이빙 시야 저하": {
        "en": "Full rainy season with reduced diving visibility",
        "ja": "雨季本格化、ダイビングの視界が低下",
        "zh": "雨季全面来临，潜水能见度下降",
    },
    "우기 지속, 태풍 영향 가능": {
        "en": "Rainy season continues with possible typhoon influence",
        "ja": "雨季が続き、台風の影響も考えられる",
        "zh": "雨季持续，可能受台风影响",
    },
    "우기, 해양 활동 제한되는 시기": {
        "en": "Rainy season restricts water activities",
        "ja": "雨季、海洋活動が制限される時期",
        "zh": "雨季期间，水上活动受到限制",
    },
    "태풍 시즌, 비가 가장 많은 시기": {
        "en": "Typhoon season — the period with the most rainfall",
        "ja": "台風シーズン、最も雨が多い時期",
        "zh": "台风季节，全年降雨量最多的时段",
    },
    "우기 끝자락, 비 줄어들기 시작": {
        "en": "Tail end of rainy season as rainfall starts to decrease",
        "ja": "雨季の終わり、雨が減り始める",
        "zh": "雨季尾声，降雨量开始减少",
    },
    "건기 시작, 다이빙 시야 회복": {
        "en": "Dry season begins as diving visibility recovers",
        "ja": "乾季が始まり、ダイビングの視界が回復",
        "zh": "干季开始，潜水能见度逐渐恢复",
    },
    "건기, 크리스마스 분위기의 세부": {
        "en": "Dry season — Cebu in a festive Christmas atmosphere",
        "ja": "乾季、クリスマスムードのセブ",
        "zh": "干季时节，圣诞节氛围浓厚的宿务",
    },
    # Indonesia - bali
    "우기 한가운데, 매일 폭우와 높은 습도": {
        "en": "Deep in the rainy season with daily torrential rain and high humidity",
        "ja": "雨季の真っ只中、毎日の豪雨と高い湿度",
        "zh": "雨季深处，每天倾盆大雨加上高湿度",
    },
    "우기 절정, 도로 침수 빈번": {
        "en": "Peak rainy season with frequent road flooding",
        "ja": "雨季のピーク、道路の浸水が頻繁",
        "zh": "雨季高峰，道路积水频繁发生",
    },
    "우기 끝자락, 비가 줄어들기 시작": {
        "en": "Tail end of rainy season as rain starts to decrease",
        "ja": "雨季の終わり、雨が減り始める",
        "zh": "雨季尾声，降雨量开始减少",
    },
    "건기 시작, 녹음 짙은 우붓과 맑은 하늘": {
        "en": "Dry season begins with lush green Ubud and clear skies",
        "ja": "乾季が始まり、緑豊かなウブドと晴れた空",
        "zh": "干季来临，郁郁葱葱的乌布与晴朗的天空交相辉映",
    },
    "건기, 서핑과 사원 투어 최적기": {
        "en": "Dry season — perfect for surfing and temple tours",
        "ja": "乾季、サーフィンと寺院ツアーに最適",
        "zh": "干季，冲浪与寺院游览的最佳时期",
    },
    "건기 절정, 선선하고 맑은 발리 여행 최적기": {
        "en": "Peak dry season — cool, clear weather makes this the best time for Bali",
        "ja": "乾季のピーク、涼しく晴れたバリ旅行の最適期",
        "zh": "干季高峰，凉爽晴朗，堪称巴厘岛旅行的最佳时节",
    },
    "건기, 성수기라 관광객 많지만 날씨 최고": {
        "en": "Dry season peak with many tourists but the best weather of the year",
        "ja": "乾季、繁忙期で観光客が多いが天気は最高",
        "zh": "干季旺季，游客众多，但天气却是全年最佳",
    },
    "건기, 우붓 예술축제와 해변 시즌": {
        "en": "Dry season with Ubud Arts Festival and prime beach season",
        "ja": "乾季、ウブドアートフェスティバルとビーチシーズン",
        "zh": "干季时节，乌布艺术节与海滩季节同步进行",
    },
    "건기 막바지, 관광객 줄고 쾌적": {
        "en": "Tail end of dry season with fewer tourists and comfortable weather",
        "ja": "乾季の終わり、観光客が減り快適に",
        "zh": "干季尾声，游客减少，天气依然舒适",
    },
    "건기 끝자락, 간간이 소나기 시작": {
        "en": "End of dry season as occasional showers start",
        "ja": "乾季の終わり、時々にわか雨が降り始める",
        "zh": "干季接近尾声，偶有阵雨开始出现",
    },
    "우기 시작, 오후 스콜이 잦아지는 시기": {
        "en": "Rainy season begins as afternoon squalls become more frequent",
        "ja": "雨季が始まり、午後のスコールが多くなる時期",
        "zh": "雨季开始，午后雷阵雨愈发频繁",
    },
    "우기, 연말 성수기라 비에도 관광객 많은 시기": {
        "en": "Rainy season but year-end peak brings many tourists despite the rain",
        "ja": "雨季だが年末の繁忙期で、雨でも観光客が多い時期",
        "zh": "雨季之中，但年末旺季游客众多，雨水也挡不住出行热情",
    },
    # Indonesia - lombok
    "우기, 린자니산 트레킹 위험한 시기": {
        "en": "Rainy season — dangerous time for Mt. Rinjani trekking",
        "ja": "雨季、リンジャニ山トレッキングが危険な時期",
        "zh": "雨季期间，林扎尼火山徒步存在危险",
    },
    "우기 절정, 산사태 위험": {
        "en": "Peak rainy season with risk of landslides",
        "ja": "雨季のピーク、土砂崩れの危険",
        "zh": "雨季高峰，山体滑坡风险较高",
    },
    "우기 끝자락, 비 줄어들기 시작": {
        "en": "Tail end of rainy season as rain starts to subside",
        "ja": "雨季の終わり、雨が減り始める",
        "zh": "雨季尾声，降雨量开始减少",
    },
    "건기 시작, 길리섬 다이빙 시야 회복": {
        "en": "Dry season begins as Gili Islands diving visibility recovers",
        "ja": "乾季が始まり、ギリ島のダイビング視界が回復",
        "zh": "干季开始，吉利岛潜水能见度逐渐恢复",
    },
    "건기, 린자니산 트레킹 최적기": {
        "en": "Dry season — the best time for Mt. Rinjani trekking",
        "ja": "乾季、リンジャニ山トレッキング最適期",
        "zh": "干季，林扎尼火山徒步的最佳时期",
    },
    "건기 절정, 맑은 바다와 길리섬 다이빙": {
        "en": "Peak dry season with clear waters and Gili Islands diving",
        "ja": "乾季のピーク、澄んだ海とギリ島ダイビング",
        "zh": "干季高峰，吉利岛海水清澈，潜水体验绝佳",
    },
    "건기, 서핑과 스노클링 최적 컨디션": {
        "en": "Dry season with optimal conditions for surfing and snorkeling",
        "ja": "乾季、サーフィンとシュノーケリングに最適なコンディション",
        "zh": "干季，冲浪与浮潜条件达到最佳",
    },
    "건기 지속, 해양 액티비티 최고": {
        "en": "Dry season continues with the best conditions for water activities",
        "ja": "乾季が続き、海洋アクティビティに最高のコンディション",
        "zh": "干季持续，水上活动条件最为优越",
    },
    "건기 끝자락, 아직 좋은 컨디션": {
        "en": "Tail end of dry season — still good conditions for outdoor activities",
        "ja": "乾季の終わり、まだ良いコンディション",
        "zh": "干季尾声，户外活动条件依然良好",
    },
    "과도기, 비가 조금씩 시작": {
        "en": "Transitional period as light rain starts",
        "ja": "過渡期、雨が少しずつ降り始める",
        "zh": "过渡期，零星降雨开始出现",
    },
    "우기 시작, 야외 활동 제한": {
        "en": "Rainy season begins — outdoor activities become limited",
        "ja": "雨季が始まり、屋外活動が制限される",
        "zh": "雨季开始，户外活动受到限制",
    },
    "우기, 해양 활동 어려운 시기": {
        "en": "Rainy season makes water activities difficult",
        "ja": "雨季、海洋活動が難しい時期",
        "zh": "雨季期间，水上活动困难重重",
    },
    # Indonesia - jakarta
    "우기 절정, 심각한 도시 침수가 매년 반복": {
        "en": "Peak rainy season with serious annual urban flooding",
        "ja": "雨季のピーク、毎年繰り返される深刻な都市浸水",
        "zh": "雨季高峰，每年都会发生严重的城市内涝",
    },
    "우기, 홍수와 교통 마비 빈번": {
        "en": "Rainy season with frequent flooding and traffic paralysis",
        "ja": "雨季、洪水と交通麻痺が頻繁に発生",
        "zh": "雨季期间，洪水与交通瘫痪频繁发生",
    },
    "우기 끝자락, 비 줄어들지만 습도 높음": {
        "en": "End of rainy season — rain decreases but humidity remains high",
        "ja": "雨季の終わり、雨は減るが湿度は高い",
        "zh": "雨季尾声，降雨减少但湿度依然偏高",
    },
    "과도기, 비가 줄고 야외 관광 가능해지는 시기": {
        "en": "Transitional period — rain decreases and outdoor sightseeing becomes possible",
        "ja": "過渡期、雨が減り屋外観光ができるようになる時期",
        "zh": "过渡期，降雨减少，户外观光变得可行",
    },
    "건기 시작, 도시 관광 쾌적해지는 시기": {
        "en": "Dry season begins — city sightseeing becomes pleasant",
        "ja": "乾季が始まり、市内観光が快適になる時期",
        "zh": "干季开始，城市观光变得舒适宜人",
    },
    "건기, 맑은 날씨의 도시 관광": {
        "en": "Dry season with clear weather — great for city sightseeing",
        "ja": "乾季、晴れた天気の市内観光",
        "zh": "干季晴朗，城市观光的好时节",
    },
    "건기 절정, 가장 쾌적한 시기": {
        "en": "Peak dry season — the most comfortable time of year",
        "ja": "乾季のピーク、最も快適な時期",
        "zh": "干季高峰，全年最为舒适的时期",
    },
    "건기, 독립기념일(8/17) 행사 시즌": {
        "en": "Dry season — Independence Day (August 17) celebration season",
        "ja": "乾季、独立記念日（8/17）のイベントシーズン",
        "zh": "干季时节，迎来独立日（8月17日）庆典季",
    },
    "건기 끝자락, 아직 쾌적": {
        "en": "Tail end of dry season — still comfortable",
        "ja": "乾季の終わり、まだ快適",
        "zh": "干季尾声，仍然舒适宜人",
    },
    "우기 시작, 도로 침수 주의": {
        "en": "Rainy season begins — watch out for road flooding",
        "ja": "雨季が始まり、道路浸水に注意",
        "zh": "雨季开始，注意道路积水",
    },
    "우기, 침수 위험 증가하는 시기": {
        "en": "Rainy season with increasing flood risk",
        "ja": "雨季、浸水リスクが増加する時期",
        "zh": "雨季期间，洪涝风险持续上升",
    },
    # Singapore
    "북동 몬순, 비가 가장 많은 시기": {
        "en": "Northeast monsoon — the rainiest period of the year",
        "ja": "北東モンスーン、最も雨が多い時期",
        "zh": "东北季风来袭，全年降雨量最多的时段",
    },
    "몬순 끝자락, 비가 줄어들기 시작": {
        "en": "End of monsoon as rainfall starts to decrease",
        "ja": "モンスーンの終わり、雨が減り始める",
        "zh": "季风尾声，降雨量开始减少",
    },
    "비교적 건조한 시기, 가든스바이더베이 관광": {
        "en": "Relatively dry period — a good time to visit Gardens by the Bay",
        "ja": "比較的乾燥した時期、ガーデンズバイザベイ観光",
        "zh": "相对干燥的时期，游览滨海湾花园正当时",
    },
    "건조한 시기, 야외 관광하기 좋은 시기": {
        "en": "Dry period — great for outdoor sightseeing",
        "ja": "乾燥した時期、屋外観光に良い時期",
        "zh": "干燥时期，户外观光的好时节",
    },
    "과도기, 간간이 소나기": {
        "en": "Transitional period with occasional showers",
        "ja": "過渡期、時々にわか雨",
        "zh": "过渡期，偶有阵雨",
    },
    "남서 몬순, 간간이 비 오지만 관광 가능": {
        "en": "Southwest monsoon with occasional rain but sightseeing is still possible",
        "ja": "南西モンスーン、時々雨が降るが観光は可能",
        "zh": "西南季风期间，偶有降雨，但观光仍可进行",
    },
    "세일 시즌(GSS), 쇼핑하기 좋은 시기": {
        "en": "Great Singapore Sale season — a great time for shopping",
        "ja": "グレートシンガポールセールシーズン、ショッピングに最適な時期",
        "zh": "新加坡大减价（GSS）季节，购物的好时机",
    },
    "국경일 시즌, 축제 분위기": {
        "en": "National Day season with a festive atmosphere",
        "ja": "ナショナルデーシーズン、お祭りムード",
        "zh": "国庆节季节，节日气氛浓厚",
    },
    "헤이즈(인니 산불 연무) 가능성 있는 시기": {
        "en": "Possible haze from Indonesian forest fires during this period",
        "ja": "インドネシアの山火事による煙霧（ヘイズ）の可能性がある時期",
        "zh": "可能受印尼山火烟霾（haze）影响的时期",
    },
    "과도기, 비가 늘어나기 시작": {
        "en": "Transitional period as rainfall starts to increase",
        "ja": "過渡期、雨が増え始める",
        "zh": "过渡期，降雨量开始增加",
    },
    "북동 몬순 시작, 비가 잦아지는 시기": {
        "en": "Northeast monsoon begins as rain becomes more frequent",
        "ja": "北東モンスーンが始まり、雨が多くなる時期",
        "zh": "东北季风开始，降雨频率增加",
    },
    "몬순 절정, 짧은 폭우가 자주 내리는 시기": {
        "en": "Monsoon peaks with frequent short but heavy downpours",
        "ja": "モンスーンのピーク、短い集中豪雨が頻繁な時期",
        "zh": "季风高峰期，频繁的短暂暴雨不断袭来",
    },
    # Taiwan
    "쌀쌀하고 비 오는 날이 많은 시기, 실내 관광 추천": {
        "en": "Cool and rainy — indoor sightseeing recommended",
        "ja": "肌寒く雨の日が多い時期、屋内観光がおすすめ",
        "zh": "天气凉爽多雨，推荐室内观光",
    },
    "봄 기운이 느껴지기 시작, 천등 축제 시즌": {
        "en": "Spring is in the air — sky lantern festival season",
        "ja": "春の気配が感じられ始める、天灯祭りシーズン",
        "zh": "春意渐浓，天灯节季节到来",
    },
    "온화한 봄, 야외 활동과 자전거 투어 최적": {
        "en": "Mild spring — perfect for outdoor activities and cycling tours",
        "ja": "穏やかな春、屋外活動とサイクリングツアーに最適",
        "zh": "温和的春天，户外活动和自行车游览最为适宜",
    },
    "온화한 날씨, 타이루거협곡 트레킹 최적기": {
        "en": "Mild weather — ideal for Taroko Gorge trekking",
        "ja": "穏やかな天気、太魯閣峡谷トレッキングに最適",
        "zh": "气候温和，太鲁阁峡谷徒步的最佳时期",
    },
    "더워지기 시작, 태풍 시즌 전 마지막 쾌적한 시기": {
        "en": "Getting warmer — the last comfortable period before typhoon season",
        "ja": "暑くなり始め、台風シーズン前の最後の快適な時期",
        "zh": "气温开始升高，台风季节前最后的舒适时期",
    },
    "장마(메이위) 시작, 비 많고 습한 시기": {
        "en": "Meiyu (plum rain) season begins with heavy rain and high humidity",
        "ja": "梅雨（メイユー）が始まり、雨が多く湿度が高い時期",
        "zh": "梅雨（梅雨季）开始，降雨增多，湿度偏高",
    },
    "본격 여름, 태풍 시즌과 뜨거운 날씨": {
        "en": "Full summer with typhoon season and scorching heat",
        "ja": "本格的な夏、台風シーズンと猛暑",
        "zh": "夏季正式来临，台风季节与酷热天气并行",
    },
    "태풍 피크 시즌, 폭우와 강풍 주의": {
        "en": "Peak typhoon season — watch out for heavy rain and strong winds",
        "ja": "台風のピークシーズン、暴雨と強風に注意",
        "zh": "台风高峰季节，注意暴雨与强风",
    },
    "태풍 잦은 시기지만 기온이 쾌적해지는 초가을": {
        "en": "Typhoons are still frequent but temperatures become more comfortable in early autumn",
        "ja": "台風が多い時期だが、気温が快適になる初秋",
        "zh": "台风仍然频繁，但初秋气温逐渐变得舒适",
    },
    "가장 쾌적한 가을, 야외 관광 최적기": {
        "en": "The most pleasant autumn — the best time for outdoor sightseeing",
        "ja": "最も快適な秋、屋外観光に最適な時期",
        "zh": "最舒适的秋季，户外观光的最佳时期",
    },
    "선선한 가을, 지우펀·예류지질공원 관광 적기": {
        "en": "Cool autumn — a great time for Jiufen and Yehliu Geopark",
        "ja": "涼しい秋、九份・野柳地質公園観光に適した時期",
        "zh": "凉爽的秋天，九份和野柳地质公园游览的好时机",
    },
    "선선하고 가끔 비, 쾌적한 겨울 관광": {
        "en": "Cool with occasional rain — comfortable winter sightseeing",
        "ja": "涼しく時々雨、快適な冬の観光",
        "zh": "凉爽偶有降雨，冬季观光舒适宜人",
    },
    # Taiwan - kaohsiung
    "건기, 맑고 따뜻한 가오슝 여행 최적기": {
        "en": "Dry season — the best time for sunny and warm Kaohsiung travel",
        "ja": "乾季、晴れて暖かい高雄旅行の最適期",
        "zh": "干季，晴朗温暖，游览高雄的最佳时节",
    },
    "건기 지속, 쾌적한 날씨": {
        "en": "Dry season continues with comfortable weather",
        "ja": "乾季が続き、快適な天気",
        "zh": "干季持续，天气宜人",
    },
    "봄 시작, 따뜻한 날씨": {
        "en": "Spring begins with warm weather",
        "ja": "春の始まり、暖かい天気",
        "zh": "春天开始，天气转暖",
    },
    "따뜻하고 맑은 봄, 연꽃 시즌": {
        "en": "Warm and sunny spring — lotus flower season",
        "ja": "暖かく晴れた春、蓮の花シーズン",
        "zh": "温暖晴朗的春天，荷花盛开季节",
    },
    "더워지기 시작, 해변 시즌 시작": {
        "en": "Getting warmer — beach season begins",
        "ja": "暑くなり始め、ビーチシーズン開幕",
        "zh": "气温升高，海滩季节开始",
    },
    "우기 시작, 가끔 소나기": {
        "en": "Rainy season begins with occasional showers",
        "ja": "雨季が始まり、時々にわか雨",
        "zh": "雨季开始，偶有阵雨",
    },
    "여름 성수기, 해변과 야간 시장": {
        "en": "Peak summer season with beaches and night markets",
        "ja": "夏の繁忙期、ビーチとナイトマーケット",
        "zh": "夏季旺季，海滩与夜市两不误",
    },
    "태풍 시즌, 폭우와 강풍 주의": {
        "en": "Typhoon season — watch out for heavy rain and strong winds",
        "ja": "台風シーズン、暴雨と強風に注意",
        "zh": "台风季节，注意暴雨和强风",
    },
    "태풍 잦지만 선선해지는 가을": {
        "en": "Typhoons are still common but autumn brings cooler temperatures",
        "ja": "台風が多いが涼しくなる秋",
        "zh": "台风仍较频繁，但秋天气温开始转凉",
    },
    "가장 쾌적한 시기, 야외 관광 최적": {
        "en": "The most pleasant time of year — perfect for outdoor sightseeing",
        "ja": "最も快適な時期、屋外観光に最適",
        "zh": "全年最舒适的时期，户外观光最为适宜",
    },
    "선선한 가을, 야외 관광 최적": {
        "en": "Cool autumn — the best time for outdoor sightseeing",
        "ja": "涼しい秋、屋外観光に最適",
        "zh": "凉爽的秋天，户外观光的最佳时期",
    },
    "건기, 따뜻하고 쾌적한 겨울": {
        "en": "Dry season with warm and comfortable winter weather",
        "ja": "乾季、暖かく快適な冬",
        "zh": "干季，温暖舒适的冬日",
    },
    # Australia - sydney
    "한여름 폭염, 크리스마스와 연말 분위기": {
        "en": "Midsummer heat wave with Christmas and New Year atmosphere",
        "ja": "真夏の猛暑、クリスマスと年末ムード",
        "zh": "盛夏酷热，圣诞与新年气氛浓厚",
    },
    "한여름 지속, 해변 성수기 피크": {
        "en": "Midsummer continues — peak beach season",
        "ja": "真夏が続く、ビーチ繁忙期のピーク",
        "zh": "盛夏持续，海滩旺季达到高峰",
    },
    "여름 끝자락, 이스터 전 마지막 여름 느낌": {
        "en": "Tail end of summer — last taste of summer before Easter",
        "ja": "夏の終わり、イースター前の最後の夏の感覚",
        "zh": "夏末时节，复活节前最后的夏日气息",
    },
    "가을 시작, 선선하고 쾌적한 시드니": {
        "en": "Autumn begins — cool and comfortable Sydney",
        "ja": "秋の始まり、涼しく快適なシドニー",
        "zh": "秋天开始，悉尼天气凉爽宜人",
    },
    "가을 중반, 온화하고 맑은 야외 관광 시기": {
        "en": "Mid-autumn with mild, clear weather — great for outdoor sightseeing",
        "ja": "秋の中盤、穏やかで晴れた屋外観光の時期",
        "zh": "仲秋时节，温和晴朗，户外观光正当时",
    },
    "가을 끝자락, 서늘해지는 시드니": {
        "en": "Late autumn as Sydney starts to cool down",
        "ja": "秋の終わり、涼しくなるシドニー",
        "zh": "深秋时节，悉尼开始转凉",
    },
    "겨울 시작, 관광객 적고 저렴한 시기": {
        "en": "Winter begins — fewer tourists and lower prices",
        "ja": "冬の始まり、観光客が少なく安い時期",
        "zh": "冬季开始，游客减少，价格实惠",
    },
    "겨울 피크, 맑고 건조한 시드니 겨울": {
        "en": "Winter peak — clear and dry Sydney winter",
        "ja": "冬のピーク、晴れて乾燥したシドニーの冬",
        "zh": "冬季高峰，悉尼冬日晴朗干燥",
    },
    "겨울 끝자락, 봄 준비 중인 시드니": {
        "en": "Late winter as Sydney prepares for spring",
        "ja": "冬の終わり、春の準備をするシドニー",
        "zh": "冬末时节，悉尼正在为春天做准备",
    },
    "봄 시작, 재미슨 스트리트 자카란다 꽃 시즌": {
        "en": "Spring begins — jacaranda blooming season along the streets",
        "ja": "春の始まり、通りのジャカランダ開花シーズン",
        "zh": "春天开始，街道旁蓝花楹盛开的季节",
    },
    "봄 한가운데, 자카란다 보라빛 물결": {
        "en": "Mid-spring with waves of purple jacaranda blossoms",
        "ja": "春の中盤、ジャカランダの紫色の波",
        "zh": "春季正中，蓝花楹紫色花海蔚为壮观",
    },
    "초여름 시작, 야외 페스티벌 시즌": {
        "en": "Early summer begins — outdoor festival season",
        "ja": "初夏の始まり、屋外フェスティバルシーズン",
        "zh": "初夏来临，户外节庆活动季节开始",
    },
    # Australia - melbourne
    "한여름, 테니스 오픈과 해변 피크": {
        "en": "Midsummer with the Australian Open tennis and peak beach season",
        "ja": "真夏、テニスオープンとビーチのピーク",
        "zh": "盛夏时节，澳网公开赛与海滩旺季双重精彩",
    },
    "여름 성수기, 기온이 40°C에 달하는 폭염": {
        "en": "Peak summer with heat waves reaching 40°C",
        "ja": "夏の繁忙期、40°Cに達する熱波",
        "zh": "夏季旺季，热浪气温可高达40°C",
    },
    "여름 끝자락, 기온이 내려가기 시작": {
        "en": "Tail end of summer as temperatures begin to drop",
        "ja": "夏の終わり、気温が下がり始める",
        "zh": "夏末时节，气温开始下降",
    },
    "가을 시작, 맛있는 음식 축제 시즌": {
        "en": "Autumn begins — food festival season",
        "ja": "秋の始まり、おいしい食べ物のフェスティバルシーズン",
        "zh": "秋天开始，美食节庆活动季节到来",
    },
    "온화한 가을, 야라 밸리 와인 투어": {
        "en": "Mild autumn — perfect for Yarra Valley wine tours",
        "ja": "穏やかな秋、ヤラバレーワインツアー",
        "zh": "温和的秋天，雅拉谷葡萄酒之旅正当时",
    },
    "가을 끝자락, 주말 드라이브와 자연 탐방": {
        "en": "Late autumn — weekend drives and nature exploration",
        "ja": "秋の終わり、週末ドライブと自然探訪",
        "zh": "深秋时节，周末自驾与自然探索的好时光",
    },
    "겨울 시작, 쌀쌀하고 비 많음": {
        "en": "Winter begins — cool and wet conditions",
        "ja": "冬の始まり、肌寒く雨が多い",
        "zh": "冬季开始，天气凉爽多雨",
    },
    "겨울 피크, 오후 기온 13°C의 선선한 도시": {
        "en": "Winter peak with cool afternoon temperatures around 13°C",
        "ja": "冬のピーク、午後13°Cの涼しい都市",
        "zh": "冬季高峰，下午气温约13°C的清凉都市",
    },
    "겨울 끝자락, 봄 꽃이 피기 시작": {
        "en": "Late winter as spring flowers begin to bloom",
        "ja": "冬の終わり、春の花が咲き始める",
        "zh": "冬末时节，春花开始绽放",
    },
    "봄 시작, 멜버른 플라워 쇼 시즌": {
        "en": "Spring begins — Melbourne Flower Show season",
        "ja": "春の始まり、メルボルンフラワーショーシーズン",
        "zh": "春天开始，墨尔本花卉展季节",
    },
    "봄 피크, 스프링 카니발(경마 시즌)": {
        "en": "Spring peak — Spring Carnival (horse racing season)",
        "ja": "春のピーク、スプリングカーニバル（競馬シーズン）",
        "zh": "春季高峰，春季嘉年华（赛马季节）",
    },
    "초여름, 멜버른 크리켓 그라운드 이벤트 시즌": {
        "en": "Early summer — Melbourne Cricket Ground event season",
        "ja": "初夏、メルボルンクリケットグラウンドイベントシーズン",
        "zh": "初夏来临，墨尔本板球场赛事活动季节",
    },
    # Taiwan - taipei (additional summaries)
    "겨울, 안개와 비 잦고 10°C까지 떨어지는 추위": {
        "en": "Winter fog and frequent rain with temperatures dropping to 10°C",
        "ja": "冬の霧と頻繁な雨、10°Cまで下がる寒さ",
        "zh": "冬日雾气弥漫，频繁降雨，气温可降至10°C",
    },
    "설 연휴(춘절) 시즌, 쌀쌀하지만 축제 분위기": {
        "en": "Lunar New Year (Chunji) season — cool but festive atmosphere",
        "ja": "春節シーズン、肌寒いがお祝いムード",
        "zh": "春节假期季节，虽然凉爽但节日气氛浓厚",
    },
    "봄 시작, 양명산 벚꽃과 꽃축제": {
        "en": "Spring begins with cherry blossoms and flower festivals at Yangmingshan",
        "ja": "春の始まり、陽明山の桜と花祭り",
        "zh": "春天来临，阳明山樱花盛开，花卉节精彩纷呈",
    },
    "따뜻한 봄, 야시장 투어와 산책 최적기": {
        "en": "Warm spring — the perfect time for night market tours and strolling",
        "ja": "暖かい春、夜市ツアーと散歩に最適な時期",
        "zh": "温暖的春天，夜市游览和漫步的最佳时机",
    },
    "매화우(장마) 직전, 더위가 시작되는 시기": {
        "en": "Just before meiyu (plum rains) as the heat begins",
        "ja": "梅雨直前、暑さが始まる時期",
        "zh": "梅雨来临前，暑热开始的时节",
    },
    "장마 시작, 폭우가 잦은 시기": {
        "en": "Rainy season begins with frequent heavy rain",
        "ja": "梅雨が始まり、大雨が多い時期",
        "zh": "梅雨开始，暴雨频繁的时节",
    },
    "태풍 시즌과 극심한 고온다습": {
        "en": "Typhoon season with extreme heat and humidity",
        "ja": "台風シーズンと極度の高温多湿",
        "zh": "台风季节，高温高湿极为严酷",
    },
    "태풍 시즌 절정, 35°C 폭염": {
        "en": "Peak typhoon season with 35°C heat waves",
        "ja": "台風シーズン最盛期、35°Cの猛暑",
        "zh": "台风季节高峰，35°C酷热难耐",
    },
    "태풍 리스크 지속, 비 잦은 시기": {
        "en": "Typhoon risk persists with frequent rain",
        "ja": "台風リスクが続き、雨が多い時期",
        "zh": "台风风险持续，降雨频繁",
    },
    "건기 시작, 가을 단풍과 쾌적한 날씨": {
        "en": "Dry season begins with autumn foliage and pleasant weather",
        "ja": "乾季が始まり、秋の紅葉と快適な天気",
        "zh": "干季开始，秋叶绚烂，天气宜人",
    },
    "건기, 20°C의 쾌적한 가을 관광 최적기": {
        "en": "Dry season at 20°C — the best time for autumn sightseeing",
        "ja": "乾季、20°Cの快適な秋観光の最適期",
        "zh": "干季20°C，秋季观光的最佳时节",
    },
    "건기 지속, 쌀쌀하지만 야시장과 온천 매력": {
        "en": "Dry season continues — cool but with charming night markets and hot springs",
        "ja": "乾季が続き、肌寒いが夜市と温泉の魅力",
        "zh": "干季持续，虽有寒意，但夜市与温泉魅力十足",
    },
    # Taiwan - kaohsiung (additional summaries)
    "건기, 따뜻한 남부 날씨로 여행 적기": {
        "en": "Dry season with warm southern weather — a great time to travel",
        "ja": "乾季、暖かい南部の天気で旅行適期",
        "zh": "干季温暖的南部天气，出行好时节",
    },
    "건기, 봄 축제와 꽃시장": {
        "en": "Dry season with spring festivals and flower markets",
        "ja": "乾季、春祭りと花市場",
        "zh": "干季春日节庆与花市热闹非凡",
    },
    "건기 지속, 쾌적한 남부 관광": {
        "en": "Dry season continues — comfortable sightseeing in the south",
        "ja": "乾季が続き、快適な南部観光",
        "zh": "干季持续，南部观光舒适宜人",
    },
    "더워지기 시작하지만 아직 쾌적": {
        "en": "Getting warmer but still comfortable",
        "ja": "暑くなり始めているがまだ快適",
        "zh": "气温开始升高，但仍属舒适",
    },
    "우기 시작, 비가 늘어나는 시기": {
        "en": "Rainy season begins as rainfall increases",
        "ja": "雨季が始まり、雨が増える時期",
        "zh": "雨季开始，降雨量增多",
    },
    "우기와 태풍 시즌, 폭우 빈발": {
        "en": "Rainy season and typhoon season bring frequent heavy rain",
        "ja": "雨季と台風シーズン、大雨が頻繁",
        "zh": "雨季与台风季节交叠，暴雨频繁",
    },
    "태풍+우기, 폭염과 폭우 동시": {
        "en": "Typhoon plus rainy season — scorching heat and torrential rain simultaneously",
        "ja": "台風＋雨季、猛暑と豪雨が同時に",
        "zh": "台风加雨季，酷热与暴雨同时来袭",
    },
    # Australia - sydney (additional summaries)
    "한여름 성수기, 본다이 비치와 야외 축제": {
        "en": "Peak summer season with Bondi Beach and outdoor festivals",
        "ja": "真夏の繁忙期、ボンダイビーチと屋外フェスティバル",
        "zh": "夏季旺季，邦迪海滩与户外节庆热闹非凡",
    },
    "여름 지속, 시드니 마디그라 축제": {
        "en": "Summer continues with the Sydney Mardi Gras festival",
        "ja": "夏が続き、シドニーマルディグラ祭り",
        "zh": "夏季持续，悉尼狂欢节精彩纷呈",
    },
    "가을 시작, 아직 해변을 즐길 수 있는 시기": {
        "en": "Autumn begins — you can still enjoy the beaches",
        "ja": "秋の始まり、まだビーチを楽しめる時期",
        "zh": "秋天开始，仍可享受海滩时光",
    },
    "가을 단풍, 쾌적한 기온의 시드니": {
        "en": "Autumn foliage with comfortable temperatures in Sydney",
        "ja": "秋の紅葉、快適な気温のシドニー",
        "zh": "秋日红叶，悉尼气温宜人",
    },
    "가을 끝자락, 선선해지는 시기": {
        "en": "Late autumn as temperatures cool down",
        "ja": "秋の終わり、涼しくなる時期",
        "zh": "深秋时节，气温逐渐转凉",
    },
    "겨울 시작, 야외 활동이 줄어드는 시기": {
        "en": "Winter begins as outdoor activities decrease",
        "ja": "冬の始まり、屋外活動が減る時期",
        "zh": "冬季开始，户外活动逐渐减少",
    },
    "겨울 한가운데, 비비드 시드니 축제": {
        "en": "Midwinter with the Vivid Sydney festival",
        "ja": "冬の真っ只中、ビビッドシドニーフェスティバル",
        "zh": "隆冬时节，悉尼灯光音乐节（Vivid Sydney）精彩上演",
    },
    "겨울 끝자락, 봄이 오기 전 가장 추운 시기": {
        "en": "Late winter — the coldest period before spring arrives",
        "ja": "冬の終わり、春が来る前の最も寒い時期",
        "zh": "冬末时节，春天来临前最寒冷的时段",
    },
    "봄 시작, 꽃이 피고 기온이 올라가는 시기": {
        "en": "Spring begins as flowers bloom and temperatures rise",
        "ja": "春の始まり、花が咲き気温が上がる時期",
        "zh": "春天来临，百花盛开，气温回升",
    },
    "봄 한가운데, 야외 활동 최적기": {
        "en": "Mid-spring — the best time for outdoor activities",
        "ja": "春の真っ只中、屋外活動に最適な時期",
        "zh": "春季正中，户外活动的最佳时期",
    },
    "봄 끝자락, 여름 직전의 쾌적한 시기": {
        "en": "Late spring — a pleasant time just before summer",
        "ja": "春の終わり、夏直前の快適な時期",
        "zh": "晚春时节，夏天来临前的舒适时光",
    },
    "여름 시작, NYE 불꽃축제와 해변 시즌": {
        "en": "Summer begins with NYE fireworks and beach season",
        "ja": "夏の始まり、年越し花火とビーチシーズン",
        "zh": "夏季来临，新年烟火与海滩季节开幕",
    },
    # Australia - melbourne (additional summaries)
    "한여름, 호주 오픈 테니스 시즌": {
        "en": "Midsummer with the Australian Open tennis season",
        "ja": "真夏、全豪オープンテニスシーズン",
        "zh": "盛夏时节，澳大利亚网球公开赛赛季",
    },
    "여름 지속, 해변과 야외 바 시즌": {
        "en": "Summer continues with beaches and outdoor bar season",
        "ja": "夏が続き、ビーチと屋外バーシーズン",
        "zh": "夏季持续，海滩与户外酒吧季节正当时",
    },
    "가을 시작, F1 그랑프리 개최": {
        "en": "Autumn begins with the F1 Grand Prix",
        "ja": "秋の始まり、F1グランプリ開催",
        "zh": "秋天开始，F1大奖赛隆重举行",
    },
    "가을, 멜버른의 카페 문화를 즐기기 좋은 시기": {
        "en": "Autumn — a great time to enjoy Melbourne's café culture",
        "ja": "秋、メルボルンのカフェ文化を楽しむのに最適な時期",
        "zh": "秋天，品味墨尔本咖啡文化的好时光",
    },
    "쌀쌀해지는 초겨울, 실내 문화 활동 위주": {
        "en": "Early winter chill — indoor cultural activities are the focus",
        "ja": "肌寒くなる初冬、屋内文化活動が中心",
        "zh": "初冬转凉，以室内文化活动为主",
    },
    "겨울, 비가 잦고 바람 강한 시기": {
        "en": "Winter with frequent rain and strong winds",
        "ja": "冬、雨が多く風が強い時期",
        "zh": "冬季多雨且风势强劲",
    },
    "겨울 한가운데, 쌀쌀하고 비 오는 멜버른": {
        "en": "Midwinter — cool and rainy Melbourne",
        "ja": "冬の真っ只中、肌寒く雨のメルボルン",
        "zh": "隆冬时节，凉爽多雨的墨尔本",
    },
    "겨울 막바지, 봄 준비 시작": {
        "en": "Late winter as spring preparations begin",
        "ja": "冬の終わり、春の準備が始まる",
        "zh": "冬末时节，春天的准备工作开始",
    },
    "봄 시작, 가든 빅토리아 꽃 시즌": {
        "en": "Spring begins with Garden Victoria flower season",
        "ja": "春の始まり、ガーデンビクトリアの花シーズン",
        "zh": "春天开始，维多利亚花园花卉季节来临",
    },
    "봄 한가운데, 멜버른 컵 경마 시즌": {
        "en": "Mid-spring with the Melbourne Cup horse racing season",
        "ja": "春の真っ只中、メルボルンカップ競馬シーズン",
        "zh": "春季正中，墨尔本杯赛马季节",
    },
    "초여름, 야외 페스티벌의 시작": {
        "en": "Early summer with the start of outdoor festivals",
        "ja": "初夏、屋外フェスティバルの始まり",
        "zh": "初夏来临，户外节庆活动拉开帷幕",
    },
    # Australia - cairns (additional summaries)
    "건기, 외곽 열대우림과 그레이트배리어리프": {
        "en": "Dry season — nearby rainforest and Great Barrier Reef",
        "ja": "乾季、近郊の熱帯雨林とグレートバリアリーフ",
        "zh": "干季，周边热带雨林与大堡礁等您探索",
    },
    "건기 절정, 케언즈 최고의 여행 시기": {
        "en": "Peak dry season — the best time to visit Cairns",
        "ja": "乾季のピーク、ケアンズ最高の旅行時期",
        "zh": "干季高峰，游览凯恩斯的最佳时节",
    },
    "건기 끝자락, 아직 다이빙 최적": {
        "en": "End of dry season — still optimal for diving",
        "ja": "乾季の終わり、まだダイビングに最適",
        "zh": "干季尾声，仍是潜水的绝佳时机",
    },
    "우기 시작, 이따금 폭우": {
        "en": "Rainy season begins with occasional heavy downpours",
        "ja": "雨季が始まり、時々豪雨",
        "zh": "雨季开始，偶有暴雨来袭",
    },
    "우기 절정, 산호초 관람 제한": {
        "en": "Peak rainy season with reef viewing restrictions",
        "ja": "雨季のピーク、サンゴ礁観覧が制限",
        "zh": "雨季高峰，珊瑚礁观览受到限制",
    },
    "우기 마무리, 날씨 회복 시작": {
        "en": "Rainy season wraps up as weather starts to recover",
        "ja": "雨季の終わり、天気が回復し始める",
        "zh": "雨季收尾，天气开始逐渐好转",
    },
    "건기로 전환, 점점 쾌적해지는 시기": {
        "en": "Transitioning to dry season as conditions become increasingly pleasant",
        "ja": "乾季への移行、徐々に快適になる時期",
        "zh": "向干季过渡，天气愈发舒适宜人",
    },
    # Singapore remaining summaries
    "북동 몬순 시작, 비가 잦아지는 시기": {
        "en": "Northeast monsoon begins as rain becomes more frequent",
        "ja": "北東モンスーンが始まり、雨が多くなる時期",
        "zh": "东北季风开始，降雨频率增加",
    },
    "몬순 절정, 짧은 폭우가 자주 내리는 시기": {
        "en": "Monsoon peaks with frequent short but intense downpours",
        "ja": "モンスーンのピーク、短い集中豪雨が頻繁な時期",
        "zh": "季风高峰，频繁的短暂强降雨不断来袭",
    },
    # Australia - cairns
    "건기 시작, 열대우림 트레킹 최적기": {
        "en": "Dry season begins — ideal for rainforest trekking",
        "ja": "乾季が始まり、熱帯雨林トレッキングに最適",
        "zh": "干季开始，热带雨林徒步的最佳时机",
    },
    "건기, 그레이트배리어리프 다이빙 최적기": {
        "en": "Dry season — the best time for diving at the Great Barrier Reef",
        "ja": "乾季、グレートバリアリーフダイビング最適期",
        "zh": "干季，大堡礁潜水的最佳时期",
    },
    "건기 절정, 다이빙과 스노클링 최고 시야": {
        "en": "Peak dry season with the best visibility for diving and snorkeling",
        "ja": "乾季のピーク、ダイビングとシュノーケリングの視界が最高",
        "zh": "干季高峰，潜水与浮潜能见度达到最佳",
    },
    "건기 지속, 여행 최적기": {
        "en": "Dry season continues — prime travel time",
        "ja": "乾季が続き、旅行最適期",
        "zh": "干季持续，出行最佳时节",
    },
    "건기 끝자락, 아직 좋은 날씨": {
        "en": "Tail end of dry season with still-good weather",
        "ja": "乾季の終わり、まだ良い天気",
        "zh": "干季尾声，天气依然良好",
    },
    "우기 시작, 열대 폭우와 높은 습도": {
        "en": "Rainy season begins with tropical downpours and high humidity",
        "ja": "雨季が始まり、熱帯の豪雨と高い湿度",
        "zh": "雨季开始，热带暴雨来袭，湿度升高",
    },
    "우기, 무더위와 열대 폭우": {
        "en": "Rainy season with scorching heat and tropical downpours",
        "ja": "雨季、猛暑と熱帯の豪雨",
        "zh": "雨季，酷热与热带暴雨相伴",
    },
    "우기 절정, 산호초 투어 일부 제한": {
        "en": "Peak rainy season with some reef tour restrictions",
        "ja": "雨季のピーク、サンゴ礁ツアーが一部制限",
        "zh": "雨季高峰，珊瑚礁游览部分受限",
    },
    "우기 끝자락, 맑은 날이 늘어남": {
        "en": "End of rainy season as clear days become more frequent",
        "ja": "雨季の終わり、晴れの日が増える",
        "zh": "雨季尾声，晴天逐渐增多",
    },
    "건기 완전 진입, 다이빙 시야 최고": {
        "en": "Fully into dry season — the best diving visibility",
        "ja": "乾季に完全移行、ダイビングの視界が最高",
        "zh": "完全进入干季，潜水能见度达到最佳",
    },
}

# ============================================================
# FIELD TRANSLATIONS (highlights, cautions, events, tips, clothingAdvice)
# ============================================================

FIELD_TRANSLATIONS = {
    # Common highlights
    "겨울 스포츠에 적합한 시기": {
        "en": "Great time for winter sports",
        "ja": "ウィンタースポーツに最適な時期",
        "zh": "适合冬季运动的时期",
    },
    "일조시간이 길어 야외 활동에 좋음": {
        "en": "Long sunshine hours make it great for outdoor activities",
        "ja": "日照時間が長く、屋外活動に最適",
        "zh": "日照时间充足，非常适合户外活动",
    },
    "강수량이 적어 맑은 날이 많음": {
        "en": "Low rainfall means many clear sunny days",
        "ja": "降水量が少なく晴れの日が多い",
        "zh": "降雨量少，晴天居多",
    },
    "벚꽃(사쿠라) 시즌으로 일본 최고의 여행 시기": {
        "en": "Cherry blossom (sakura) season — the best time to travel Japan",
        "ja": "桜（サクラ）シーズン、日本旅行の最高の時期",
        "zh": "樱花（sakura）季节，日本旅行的最佳时期",
    },
    "쾌적한 기온": {
        "en": "Comfortable temperatures",
        "ja": "快適な気温",
        "zh": "气温宜人",
    },
    "여름 불꽃놀이(하나비) 시즌": {
        "en": "Summer fireworks (Hanabi) season",
        "ja": "夏の花火（ハナビ）シーズン",
        "zh": "夏季烟火（花火）季节",
    },
    "따뜻한 날씨로 해변 활동에 적합": {
        "en": "Warm weather ideal for beach activities",
        "ja": "暖かい天気でビーチ活動に最適",
        "zh": "天气温暖，非常适合海滩活动",
    },
    "단풍 시즌": {
        "en": "Autumn foliage season",
        "ja": "紅葉シーズン",
        "zh": "红叶季节",
    },
    "건기로 쾌적한 관광 시기": {
        "en": "Dry season makes for comfortable sightseeing",
        "ja": "乾季で快適な観光シーズン",
        "zh": "干季，观光游览十分舒适",
    },
    "송크란(태국 새해) 물 축제": {
        "en": "Songkran (Thai New Year) water festival",
        "ja": "ソンクラン（タイ新年）水かけ祭り",
        "zh": "宋干节（泰国新年）泼水节",
    },
    "건기에 선선한 날씨, 최적의 트레킹 시즌": {
        "en": "Cool dry season — the perfect trekking season",
        "ja": "乾季の涼しい天気、最高のトレッキングシーズン",
        "zh": "干季凉爽，最佳徒步探险季节",
    },
    "습도가 낮아 쾌적함": {
        "en": "Low humidity makes it very comfortable",
        "ja": "湿度が低く快適",
        "zh": "湿度低，体感舒适",
    },
    "태국에서 가장 뜨거운 송크란 축제": {
        "en": "The hottest Songkran festival in Thailand",
        "ja": "タイで最も熱いソンクラン祭り",
        "zh": "泰国最热闹的宋干节",
    },
    "건기 해변 시즌, 다이빙에 최적": {
        "en": "Dry season beach time — perfect for diving",
        "ja": "乾季のビーチシーズン、ダイビングに最適",
        "zh": "干季海滩季节，潜水最为适宜",
    },
    "비수기로 관광객이 적어 여유로움": {
        "en": "Off-season means fewer crowds and a more relaxed experience",
        "ja": "オフシーズンで観光客が少なく、ゆったり楽しめる",
        "zh": "淡季游客稀少，旅行更加悠闲自在",
    },
    "비수기 할인을 활용할 수 있는 시기": {
        "en": "Great time to take advantage of off-season discounts",
        "ja": "オフシーズン割引を活用できる時期",
        "zh": "可以享受淡季优惠的时期",
    },
    "설날(뗏) 축제 시즌": {
        "en": "Tet (Lunar New Year) festival season",
        "ja": "テト（旧正月）祭りシーズン",
        "zh": "春节（越南新年）节庆季节",
    },
    "선선하고 건조한 최적 관광시즌": {
        "en": "Cool and dry — the best sightseeing season",
        "ja": "涼しく乾燥した最高の観光シーズン",
        "zh": "凉爽干燥，最佳观光季节",
    },
    "건기, 야외 활동 최적": {
        "en": "Dry season — perfect for outdoor activities",
        "ja": "乾季、屋外活動に最適",
        "zh": "干季，户外活动最为适宜",
    },
    "맑고 따뜻한 해변 시즌": {
        "en": "Clear and warm beach season",
        "ja": "晴れて暖かいビーチシーズン",
        "zh": "晴朗温暖的海滩季节",
    },
    "해변 성수기": {
        "en": "Peak beach season",
        "ja": "ビーチの繁忙期",
        "zh": "海滩旺季",
    },
    "선선한 건기": {
        "en": "Cool dry season",
        "ja": "涼しい乾季",
        "zh": "凉爽的干季",
    },
    "건기 해변, 맑고 파도 잔잔": {
        "en": "Dry season beach — clear waters and gentle waves",
        "ja": "乾季のビーチ、澄んで波が穏やか",
        "zh": "干季海滩，海水清澈，波浪平静",
    },
    "시눌로그 축제 시즌": {
        "en": "Sinulog Festival season",
        "ja": "シヌログ祭りシーズン",
        "zh": "西努洛节季节",
    },
    "냐피(발리 새해) 전후": {
        "en": "Around Nyepi (Balinese New Year)",
        "ja": "ニュピ（バリの新年）前後",
        "zh": "临近尼皮节（巴厘岛新年）前后",
    },
    "건기 성수기, 다이빙/서핑 최적": {
        "en": "Dry season peak — perfect for diving and surfing",
        "ja": "乾季の繁忙期、ダイビング/サーフィンに最適",
        "zh": "干季旺季，潜水和冲浪最为适宜",
    },
    "맑은 건기, 린자니 화산 트레킹": {
        "en": "Clear dry season — Mt. Rinjani volcano trekking",
        "ja": "晴れた乾季、リンジャニ火山トレッキング",
        "zh": "晴朗干季，林扎尼火山徒步探险",
    },
    "중국 설날 치나타운 장식": {
        "en": "Chinese New Year Chinatown decorations",
        "ja": "中国新年のチャイナタウン装飾",
        "zh": "农历新年唐人街节日装饰",
    },
    "싱가포르 국경일 퍼레이드 시즌": {
        "en": "Singapore National Day Parade season",
        "ja": "シンガポール建国記念日パレードシーズン",
        "zh": "新加坡国庆日阅兵季节",
    },
    # Cautions
    "월 강수량 151mm로 우기에 해당": {
        "en": "Monthly rainfall of 151mm qualifies as rainy season",
        "ja": "月降水量151mmで雨季に相当",
        "zh": "月降雨量151mm，属于雨季",
    },
    "비 오는 날이 12일로 실내 대안 준비 권장": {
        "en": "12 rainy days in the month — have indoor backup plans ready",
        "ja": "月12日の雨日、室内代替案の準備を推奨",
        "zh": "月内雨天约12天，建议准备室内备选方案",
    },
    "비 오는 날이 10.8일로 실내 대안 준비 권장": {
        "en": "10.8 rainy days — have indoor backup plans ready",
        "ja": "10.8日の雨日、室内代替案の準備を推奨",
        "zh": "约10.8天雨天，建议准备室内备选方案",
    },
    "습도 82%로 불쾌지수 높음": {
        "en": "Humidity at 82% makes it feel quite uncomfortable",
        "ja": "湿度82%で不快指数が高い",
        "zh": "湿度82%，不适感指数较高",
    },
    "일조시간이 짧아 흐린 날이 많음": {
        "en": "Short sunshine hours mean many cloudy days",
        "ja": "日照時間が短く曇りの日が多い",
        "zh": "日照时间短，阴天较多",
    },
    "월 강수량 162mm로 우기에 해당": {
        "en": "Monthly rainfall of 162mm qualifies as rainy season",
        "ja": "月降水量162mmで雨季に相当",
        "zh": "月降雨量162mm，属于雨季",
    },
    "비 오는 날이 11.8일로 실내 대안 준비 권장": {
        "en": "11.8 rainy days — have indoor backup plans ready",
        "ja": "11.8日の雨日、室内代替案の準備を推奨",
        "zh": "约11.8天雨天，建议准备室内备选方案",
    },
    "습도가 71%로 다소 높음": {
        "en": "Humidity at 71% is somewhat high",
        "ja": "湿度71%でやや高い",
        "zh": "湿度71%，略偏高",
    },
    "월 강수량 168mm로 우기에 해당": {
        "en": "Monthly rainfall of 168mm qualifies as rainy season",
        "ja": "月降水量168mmで雨季に相当",
        "zh": "月降雨量168mm，属于雨季",
    },
    "비 오는 날이 13.4일로 실내 대안 준비 권장": {
        "en": "13.4 rainy days — have indoor backup plans ready",
        "ja": "13.4日の雨日、室内代替案の準備を推奨",
        "zh": "约13.4天雨天，建议准备室内备选方案",
    },
    "습도가 75%로 다소 높음": {
        "en": "Humidity at 75% is somewhat high",
        "ja": "湿度75%でやや高い",
        "zh": "湿度75%，略偏高",
    },
    "월 강수량 203mm로 우기에 해당": {
        "en": "Monthly rainfall of 203mm qualifies as rainy season",
        "ja": "月降水量203mmで雨季に相当",
        "zh": "月降雨量203mm，属于雨季",
    },
    "월 15.2일 비가 와 야외 일정에 유의": {
        "en": "15.2 rainy days — outdoor plans need flexibility",
        "ja": "15.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约15.2天雨天，户外行程需灵活安排",
    },
    "습도가 80%로 다소 높음": {
        "en": "Humidity at 80% is somewhat high",
        "ja": "湿度80%でやや高い",
        "zh": "湿度80%，略偏高",
    },
    "월 강수량 219mm로 우기에 해당": {
        "en": "Monthly rainfall of 219mm qualifies as rainy season",
        "ja": "月降水量219mmで雨季に相当",
        "zh": "月降雨量219mm，属于雨季",
    },
    "월 18일 비가 와 야외 일정에 유의": {
        "en": "18 rainy days — outdoor plans need flexibility",
        "ja": "18日の雨日、屋外日程に注意が必要",
        "zh": "月内约18天雨天，户外行程需灵活安排",
    },
    "습도가 79%로 다소 높음": {
        "en": "Humidity at 79% is somewhat high",
        "ja": "湿度79%でやや高い",
        "zh": "湿度79%，略偏高",
    },
    "강수량이 145mm로 우산 필수": {
        "en": "Rainfall of 145mm — umbrella essential",
        "ja": "降水量145mm、傘が必須",
        "zh": "降雨量145mm，雨伞必备",
    },
    "비 오는 날이 14.2일로 실내 대안 준비 권장": {
        "en": "14.2 rainy days — have indoor backup plans ready",
        "ja": "14.2日の雨日、室内代替案の準備を推奨",
        "zh": "约14.2天雨天，建议准备室内备选方案",
    },
    "습도가 78%로 다소 높음": {
        "en": "Humidity at 78% is somewhat high",
        "ja": "湿度78%でやや高い",
        "zh": "湿度78%，略偏高",
    },
    "월 강수량 188mm로 우기에 해당": {
        "en": "Monthly rainfall of 188mm qualifies as rainy season",
        "ja": "月降水量188mmで雨季に相当",
        "zh": "月降雨量188mm，属于雨季",
    },
    "비 오는 날이 15일로 실내 대안 준비 권장": {
        "en": "15 rainy days — have indoor backup plans ready",
        "ja": "15日の雨日、室内代替案の準備を推奨",
        "zh": "约15天雨天，建议准备室内备选方案",
    },
    "습도 81%로 불쾌지수 높음": {
        "en": "Humidity at 81% makes it feel quite uncomfortable",
        "ja": "湿度81%で不快指数が高い",
        "zh": "湿度81%，不适感指数较高",
    },
    "평균 최고기온 33°C로 더위에 주의": {
        "en": "Average high of 33°C — take precautions against the heat",
        "ja": "平均最高気温33°C、暑さに注意",
        "zh": "平均最高气温33°C，注意防暑",
    },
    "평균 최고기온 34°C로 더위에 주의": {
        "en": "Average high of 34°C — take precautions against the heat",
        "ja": "平均最高気温34°C、暑さに注意",
        "zh": "平均最高气温34°C，注意防暑",
    },
    "평균 최고기온 35°C로 더위에 주의": {
        "en": "Average high of 35°C — take precautions against the heat",
        "ja": "平均最高気温35°C、暑さに注意",
        "zh": "平均最高气温35°C，注意防暑",
    },
    "평균 최고기온 36°C로 더위에 주의": {
        "en": "Average high of 36°C — take precautions against the heat",
        "ja": "平均最高気温36°C、暑さに注意",
        "zh": "平均最高气温36°C，注意防暑",
    },
    "비 오는 날이 12.2일로 실내 대안 준비 권장": {
        "en": "12.2 rainy days — have indoor backup plans ready",
        "ja": "12.2日の雨日、室内代替案の準備を推奨",
        "zh": "约12.2天雨天，建议准备室内备选方案",
    },
    "습도가 73%로 다소 높음": {
        "en": "Humidity at 73% is somewhat high",
        "ja": "湿度73%でやや高い",
        "zh": "湿度73%，略偏高",
    },
    "월 강수량 158mm로 우기에 해당": {
        "en": "Monthly rainfall of 158mm qualifies as rainy season",
        "ja": "月降水量158mmで雨季に相当",
        "zh": "月降雨量158mm，属于雨季",
    },
    "월 19.6일 비가 와 야외 일정에 유의": {
        "en": "19.6 rainy days — outdoor plans need flexibility",
        "ja": "19.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约19.6天雨天，户外行程需灵活安排",
    },
    "습도가 76%로 다소 높음": {
        "en": "Humidity at 76% is somewhat high",
        "ja": "湿度76%でやや高い",
        "zh": "湿度76%，略偏高",
    },
    "월 강수량 156mm로 우기에 해당": {
        "en": "Monthly rainfall of 156mm qualifies as rainy season",
        "ja": "月降水量156mmで雨季に相当",
        "zh": "月降雨量156mm，属于雨季",
    },
    "월 24일 비가 와 야외 일정에 유의": {
        "en": "24 rainy days — outdoor plans need flexibility",
        "ja": "24日の雨日、屋外日程に注意が必要",
        "zh": "月内约24天雨天，户外行程需灵活安排",
    },
    "습도가 77%로 다소 높음": {
        "en": "Humidity at 77% is somewhat high",
        "ja": "湿度77%でやや高い",
        "zh": "湿度77%，略偏高",
    },
    "월 강수량 241mm로 우기에 해당": {
        "en": "Monthly rainfall of 241mm qualifies as rainy season",
        "ja": "月降水量241mmで雨季に相当",
        "zh": "月降雨量241mm，属于雨季",
    },
    "월 27.4일 비가 와 야외 일정에 유의": {
        "en": "27.4 rainy days — outdoor plans need significant flexibility",
        "ja": "27.4日の雨日、屋外日程に注意が必要",
        "zh": "月内约27.4天雨天，户外行程需充分灵活安排",
    },
    "습도 84%로 불쾌지수 높음": {
        "en": "Humidity at 84% makes it feel quite uncomfortable",
        "ja": "湿度84%で不快指数が高い",
        "zh": "湿度84%，不适感指数较高",
    },
    "월 강수량 217mm로 우기에 해당": {
        "en": "Monthly rainfall of 217mm qualifies as rainy season",
        "ja": "月降水量217mmで雨季に相当",
        "zh": "月降雨量217mm，属于雨季",
    },
    "월 26.6일 비가 와 야외 일정에 유의": {
        "en": "26.6 rainy days — outdoor plans need significant flexibility",
        "ja": "26.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约26.6天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 336mm로 우기에 해당": {
        "en": "Monthly rainfall of 336mm qualifies as rainy season",
        "ja": "月降水量336mmで雨季に相当",
        "zh": "月降雨量336mm，属于雨季",
    },
    "월 28일 비가 와 야외 일정에 유의": {
        "en": "28 rainy days — outdoor plans need significant flexibility",
        "ja": "28日の雨日、屋外日程に注意が必要",
        "zh": "月内约28天雨天，户外行程需充分灵活安排",
    },
    "습도 83%로 불쾌지수 높음": {
        "en": "Humidity at 83% makes it feel quite uncomfortable",
        "ja": "湿度83%で不快指数が高い",
        "zh": "湿度83%，不适感指数较高",
    },
    "월 강수량 290mm로 우기에 해당": {
        "en": "Monthly rainfall of 290mm qualifies as rainy season",
        "ja": "月降水量290mmで雨季に相当",
        "zh": "月降雨量290mm，属于雨季",
    },
    "월 21.8일 비가 와 야외 일정에 유의": {
        "en": "21.8 rainy days — outdoor plans need flexibility",
        "ja": "21.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约21.8天雨天，户外行程需灵活安排",
    },
    "비 오는 날이 11.2일로 실내 대안 준비 권장": {
        "en": "11.2 rainy days — have indoor backup plans ready",
        "ja": "11.2日の雨日、室内代替案の準備を推奨",
        "zh": "约11.2天雨天，建议准备室内备选方案",
    },
    "습도가 74%로 다소 높음": {
        "en": "Humidity at 74% is somewhat high",
        "ja": "湿度74%でやや高い",
        "zh": "湿度74%，略偏高",
    },
    "월 강수량 206mm로 우기에 해당": {
        "en": "Monthly rainfall of 206mm qualifies as rainy season",
        "ja": "月降水量206mmで雨季に相当",
        "zh": "月降雨量206mm，属于雨季",
    },
    "월 16.8일 비가 와 야외 일정에 유의": {
        "en": "16.8 rainy days — outdoor plans need flexibility",
        "ja": "16.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约16.8天雨天，户外行程需灵活安排",
    },
    "월 강수량 293mm로 우기에 해당": {
        "en": "Monthly rainfall of 293mm qualifies as rainy season",
        "ja": "月降水量293mmで雨季に相当",
        "zh": "月降雨量293mm，属于雨季",
    },
    "월 18일 비가 와 야외 일정에 유의": {
        "en": "18 rainy days — outdoor plans need flexibility",
        "ja": "18日の雨日、屋外日程に注意が必要",
        "zh": "月内约18天雨天，户外行程需灵活安排",
    },
    "습도가 80%로 다소 높음": {
        "en": "Humidity at 80% is somewhat high",
        "ja": "湿度80%でやや高い",
        "zh": "湿度80%，略偏高",
    },
    "월 강수량 288mm로 우기에 해당": {
        "en": "Monthly rainfall of 288mm qualifies as rainy season",
        "ja": "月降水量288mmで雨季に相当",
        "zh": "月降雨量288mm，属于雨季",
    },
    "월 20.6일 비가 와 야외 일정에 유의": {
        "en": "20.6 rainy days — outdoor plans need flexibility",
        "ja": "20.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约20.6天雨天，户外行程需灵活安排",
    },
    "월 강수량 406mm로 우기에 해당": {
        "en": "Monthly rainfall of 406mm qualifies as rainy season",
        "ja": "月降水量406mmで雨季に相当",
        "zh": "月降雨量406mm，属于雨季",
    },
    "월 24.8일 비가 와 야외 일정에 유의": {
        "en": "24.8 rainy days — outdoor plans need significant flexibility",
        "ja": "24.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约24.8天雨天，户外行程需充分灵活安排",
    },
    "습도 86%로 불쾌지수 높음": {
        "en": "Humidity at 86% makes it feel very uncomfortable",
        "ja": "湿度86%で不快指数が高い",
        "zh": "湿度86%，不适感较强",
    },
    "월 강수량 441mm로 우기에 해당": {
        "en": "Monthly rainfall of 441mm qualifies as rainy season",
        "ja": "月降水量441mmで雨季に相当",
        "zh": "月降雨量441mm，属于雨季",
    },
    "월 22.4일 비가 와 야외 일정에 유의": {
        "en": "22.4 rainy days — outdoor plans need flexibility",
        "ja": "22.4日の雨日、屋外日程に注意が必要",
        "zh": "月内约22.4天雨天，户外行程需灵活安排",
    },
    "월 강수량 197mm로 우기에 해당": {
        "en": "Monthly rainfall of 197mm qualifies as rainy season",
        "ja": "月降水量197mmで雨季に相当",
        "zh": "月降雨量197mm，属于雨季",
    },
    "비 오는 날이 12.6일로 실내 대안 준비 권장": {
        "en": "12.6 rainy days — have indoor backup plans ready",
        "ja": "12.6日の雨日、室内代替案の準備を推奨",
        "zh": "约12.6天雨天，建议准备室内备选方案",
    },
    "월 강수량 150mm로 우기에 해당": {
        "en": "Monthly rainfall of 150mm qualifies as rainy season",
        "ja": "月降水量150mmで雨季に相当",
        "zh": "月降雨量150mm，属于雨季",
    },
    "월 20.2일 비가 와 야외 일정에 유의": {
        "en": "20.2 rainy days — outdoor plans need flexibility",
        "ja": "20.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约20.2天雨天，户外行程需灵活安排",
    },
    "월 강수량 154mm로 우기에 해당": {
        "en": "Monthly rainfall of 154mm qualifies as rainy season",
        "ja": "月降水量154mmで雨季に相当",
        "zh": "月降雨量154mm，属于雨季",
    },
    "월 19.8일 비가 와 야외 일정에 유의": {
        "en": "19.8 rainy days — outdoor plans need flexibility",
        "ja": "19.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约19.8天雨天，户外行程需灵活安排",
    },
    "습도 85%로 불쾌지수 높음": {
        "en": "Humidity at 85% makes it feel very uncomfortable",
        "ja": "湿度85%で不快指数が高い",
        "zh": "湿度85%，不适感较强",
    },
    "비 오는 날이 13.4일로 실내 대안 준비 권장": {
        "en": "13.4 rainy days — have indoor backup plans ready",
        "ja": "13.4日の雨日、室内代替案の準備を推奨",
        "zh": "约13.4天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 11일로 실내 대안 준비 권장": {
        "en": "11 rainy days — have indoor backup plans ready",
        "ja": "11日の雨日、室内代替案の準備を推奨",
        "zh": "约11天雨天，建议准备室内备选方案",
    },
    "강수량이 104mm로 우산 필수": {
        "en": "Rainfall of 104mm — umbrella essential",
        "ja": "降水量104mm、傘が必須",
        "zh": "降雨量104mm，雨伞必备",
    },
    "비 오는 날이 12일로 실내 대안 준비 권장": {
        "en": "12 rainy days — have indoor backup plans ready",
        "ja": "12日の雨日、室内代替案の準備を推奨",
        "zh": "约12天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 10.2일로 실내 대안 준비 권장": {
        "en": "10.2 rainy days — have indoor backup plans ready",
        "ja": "10.2日の雨日、室内代替案の準備を推奨",
        "zh": "约10.2天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 14.2일로 실내 대안 준비 권장": {
        "en": "14.2 rainy days — have indoor backup plans ready",
        "ja": "14.2日の雨日、室内代替案の準備を推奨",
        "zh": "约14.2天雨天，建议准备室内备选方案",
    },
    "월 16일 비가 와 야외 일정에 유의": {
        "en": "16 rainy days — outdoor plans need flexibility",
        "ja": "16日の雨日、屋外日程に注意が必要",
        "zh": "月内约16天雨天，户外行程需灵活安排",
    },
    "월 강수량 280mm로 우기에 해당": {
        "en": "Monthly rainfall of 280mm qualifies as rainy season",
        "ja": "月降水量280mmで雨季に相当",
        "zh": "月降雨量280mm，属于雨季",
    },
    "월 22.6일 비가 와 야외 일정에 유의": {
        "en": "22.6 rainy days — outdoor plans need flexibility",
        "ja": "22.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约22.6天雨天，户外行程需灵活安排",
    },
    "월 강수량 628mm로 우기에 해당": {
        "en": "Monthly rainfall of 628mm qualifies as rainy season",
        "ja": "月降水量628mmで雨季に相当",
        "zh": "月降雨量628mm，属于雨季",
    },
    "월 강수량 374mm로 우기에 해당": {
        "en": "Monthly rainfall of 374mm qualifies as rainy season",
        "ja": "月降水量374mmで雨季に相当",
        "zh": "月降雨量374mm，属于雨季",
    },
    "월 23.6일 비가 와 야외 일정에 유의": {
        "en": "23.6 rainy days — outdoor plans need flexibility",
        "ja": "23.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约23.6天雨天，户外行程需灵活安排",
    },
    "월 강수량 353mm로 우기에 해당": {
        "en": "Monthly rainfall of 353mm qualifies as rainy season",
        "ja": "月降水量353mmで雨季に相当",
        "zh": "月降雨量353mm，属于雨季",
    },
    "월 25.8일 비가 와 야외 일정에 유의": {
        "en": "25.8 rainy days — outdoor plans need significant flexibility",
        "ja": "25.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约25.8天雨天，户外行程需充分灵活安排",
    },
    "비 오는 날이 12.4일로 실내 대안 준비 권장": {
        "en": "12.4 rainy days — have indoor backup plans ready",
        "ja": "12.4日の雨日、室内代替案の準備を推奨",
        "zh": "约12.4天雨天，建议准备室内备选方案",
    },
    "월 강수량 171mm로 우기에 해당": {
        "en": "Monthly rainfall of 171mm qualifies as rainy season",
        "ja": "月降水量171mmで雨季に相当",
        "zh": "月降雨量171mm，属于雨季",
    },
    "월 20.8일 비가 와 야외 일정에 유의": {
        "en": "20.8 rainy days — outdoor plans need flexibility",
        "ja": "20.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约20.8天雨天，户外行程需灵活安排",
    },
    "월 강수량 270mm로 우기에 해당": {
        "en": "Monthly rainfall of 270mm qualifies as rainy season",
        "ja": "月降水量270mmで雨季に相当",
        "zh": "月降雨量270mm，属于雨季",
    },
    "월 26.4일 비가 와 야외 일정에 유의": {
        "en": "26.4 rainy days — outdoor plans need significant flexibility",
        "ja": "26.4日の雨日、屋外日程に注意が必要",
        "zh": "月内约26.4天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 409mm로 우기에 해당": {
        "en": "Monthly rainfall of 409mm qualifies as rainy season",
        "ja": "月降水量409mmで雨季に相当",
        "zh": "月降雨量409mm，属于雨季",
    },
    "월 27.6일 비가 와 야외 일정에 유의": {
        "en": "27.6 rainy days — outdoor plans need significant flexibility",
        "ja": "27.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约27.6天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 282mm로 우기에 해당": {
        "en": "Monthly rainfall of 282mm qualifies as rainy season",
        "ja": "月降水量282mmで雨季に相当",
        "zh": "月降雨量282mm，属于雨季",
    },
    "월 26.2일 비가 와 야외 일정에 유의": {
        "en": "26.2 rainy days — outdoor plans need significant flexibility",
        "ja": "26.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约26.2天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 352mm로 우기에 해당": {
        "en": "Monthly rainfall of 352mm qualifies as rainy season",
        "ja": "月降水量352mmで雨季に相当",
        "zh": "月降雨量352mm，属于雨季",
    },
    "월 27.8일 비가 와 야외 일정에 유의": {
        "en": "27.8 rainy days — outdoor plans need significant flexibility",
        "ja": "27.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约27.8天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 307mm로 우기에 해당": {
        "en": "Monthly rainfall of 307mm qualifies as rainy season",
        "ja": "月降水量307mmで雨季に相当",
        "zh": "月降雨量307mm，属于雨季",
    },
    "강수량이 141mm로 우산 필수": {
        "en": "Rainfall of 141mm — umbrella essential",
        "ja": "降水量141mm、傘が必須",
        "zh": "降雨量141mm，雨伞必备",
    },
    "월 18.6일 비가 와 야외 일정에 유의": {
        "en": "18.6 rainy days — outdoor plans need flexibility",
        "ja": "18.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约18.6天雨天，户外行程需灵活安排",
    },
    "강수량이 136mm로 우산 필수": {
        "en": "Rainfall of 136mm — umbrella essential",
        "ja": "降水量136mm、傘が必須",
        "zh": "降雨量136mm，雨伞必备",
    },
    "월 17.2일 비가 와 야외 일정에 유의": {
        "en": "17.2 rainy days — outdoor plans need flexibility",
        "ja": "17.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约17.2天雨天，户外行程需灵活安排",
    },
    "월 강수량 249mm로 우기에 해당": {
        "en": "Monthly rainfall of 249mm qualifies as rainy season",
        "ja": "月降水量249mmで雨季に相当",
        "zh": "月降雨量249mm，属于雨季",
    },
    "월 26.2일 비가 와 야외 일정에 유의": {
        "en": "26.2 rainy days — outdoor plans need significant flexibility",
        "ja": "26.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约26.2天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 151mm로 우기에 해당": {
        "en": "Monthly rainfall of 151mm qualifies as rainy season",
        "ja": "月降水量151mmで雨季に相当",
        "zh": "月降雨量151mm，属于雨季",
    },
    "월 23.6일 비가 와 야외 일정에 유의": {
        "en": "23.6 rainy days — outdoor plans need flexibility",
        "ja": "23.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约23.6天雨天，户外行程需灵活安排",
    },
    "강수량이 114mm로 우산 필수": {
        "en": "Rainfall of 114mm — umbrella essential",
        "ja": "降水量114mm、傘が必須",
        "zh": "降雨量114mm，雨伞必备",
    },
    "월 20.6일 비가 와 야외 일정에 유의": {
        "en": "20.6 rainy days — outdoor plans need flexibility",
        "ja": "20.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约20.6天雨天，户外行程需灵活安排",
    },
    "강수량이 112mm로 우산 필수": {
        "en": "Rainfall of 112mm — umbrella essential",
        "ja": "降水量112mm、傘が必須",
        "zh": "降雨量112mm，雨伞必备",
    },
    "월 19.6일 비가 와 야외 일정에 유의": {
        "en": "19.6 rainy days — outdoor plans need flexibility",
        "ja": "19.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约19.6天雨天，户外行程需灵活安排",
    },
    "강수량이 126mm로 우산 필수": {
        "en": "Rainfall of 126mm — umbrella essential",
        "ja": "降水量126mm、傘が必須",
        "zh": "降雨量126mm，雨伞必备",
    },
    "월 22.2일 비가 와 야외 일정에 유의": {
        "en": "22.2 rainy days — outdoor plans need flexibility",
        "ja": "22.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约22.2天雨天，户外行程需灵活安排",
    },
    "월 강수량 190mm로 우기에 해당": {
        "en": "Monthly rainfall of 190mm qualifies as rainy season",
        "ja": "月降水量190mmで雨季に相当",
        "zh": "月降雨量190mm，属于雨季",
    },
    "월 26일 비가 와 야외 일정에 유의": {
        "en": "26 rainy days — outdoor plans need significant flexibility",
        "ja": "26日の雨日、屋外日程に注意が必要",
        "zh": "月内约26天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 310mm로 우기에 해당": {
        "en": "Monthly rainfall of 310mm qualifies as rainy season",
        "ja": "月降水量310mmで雨季に相当",
        "zh": "月降雨量310mm，属于雨季",
    },
    "월 28.6일 비가 와 야외 일정에 유의": {
        "en": "28.6 rainy days — outdoor plans need significant flexibility",
        "ja": "28.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约28.6天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 201mm로 우기에 해당": {
        "en": "Monthly rainfall of 201mm qualifies as rainy season",
        "ja": "月降水量201mmで雨季に相当",
        "zh": "月降雨量201mm，属于雨季",
    },
    "월 24.4일 비가 와 야외 일정에 유의": {
        "en": "24.4 rainy days — outdoor plans need significant flexibility",
        "ja": "24.4日の雨日、屋外日程に注意が必要",
        "zh": "月内约24.4天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 327mm로 우기에 해당": {
        "en": "Monthly rainfall of 327mm qualifies as rainy season",
        "ja": "月降水量327mmで雨季に相当",
        "zh": "月降雨量327mm，属于雨季",
    },
    "월 강수량 417mm로 우기에 해당": {
        "en": "Monthly rainfall of 417mm qualifies as rainy season",
        "ja": "月降水量417mmで雨季に相当",
        "zh": "月降雨量417mm，属于雨季",
    },
    "월 28.8일 비가 와 야외 일정에 유의": {
        "en": "28.8 rainy days — outdoor plans need significant flexibility",
        "ja": "28.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约28.8天雨天，户外行程需充分灵活安排",
    },
    "습도 87%로 불쾌지수 높음": {
        "en": "Humidity at 87% makes it feel very uncomfortable",
        "ja": "湿度87%で不快指数が高い",
        "zh": "湿度87%，不适感明显",
    },
    "월 강수량 230mm로 우기에 해당": {
        "en": "Monthly rainfall of 230mm qualifies as rainy season",
        "ja": "月降水量230mmで雨季に相当",
        "zh": "月降雨量230mm，属于雨季",
    },
    "월 강수량 318mm로 우기에 해당": {
        "en": "Monthly rainfall of 318mm qualifies as rainy season",
        "ja": "月降水量318mmで雨季に相当",
        "zh": "月降雨量318mm，属于雨季",
    },
    "월 29.2일 비가 와 야외 일정에 유의": {
        "en": "29.2 rainy days — outdoor plans need significant flexibility",
        "ja": "29.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约29.2天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 223mm로 우기에 해당": {
        "en": "Monthly rainfall of 223mm qualifies as rainy season",
        "ja": "月降水量223mmで雨季に相当",
        "zh": "月降雨量223mm，属于雨季",
    },
    "월 22.8일 비가 와 야외 일정에 유의": {
        "en": "22.8 rainy days — outdoor plans need flexibility",
        "ja": "22.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约22.8天雨天，户外行程需灵活安排",
    },
    "강수량이 122mm로 우산 필수": {
        "en": "Rainfall of 122mm — umbrella essential",
        "ja": "降水量122mm、傘が必須",
        "zh": "降雨量122mm，雨伞必备",
    },
    "월 19.2일 비가 와 야외 일정에 유의": {
        "en": "19.2 rainy days — outdoor plans need flexibility",
        "ja": "19.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约19.2天雨天，户外行程需灵活安排",
    },
    "강수량이 119mm로 우산 필수": {
        "en": "Rainfall of 119mm — umbrella essential",
        "ja": "降水量119mm、傘が必須",
        "zh": "降雨量119mm，雨伞必备",
    },
    "월 15.4일 비가 와 야외 일정에 유의": {
        "en": "15.4 rainy days — outdoor plans need flexibility",
        "ja": "15.4日の雨日、屋外日程に注意が必要",
        "zh": "月内约15.4天雨天，户外行程需灵活安排",
    },
    "월 강수량 156mm로 우기에 해당": {
        "en": "Monthly rainfall of 156mm qualifies as rainy season",
        "ja": "月降水量156mmで雨季に相当",
        "zh": "月降雨量156mm，属于雨季",
    },
    "월 17.6일 비가 와 야외 일정에 유의": {
        "en": "17.6 rainy days — outdoor plans need flexibility",
        "ja": "17.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约17.6天雨天，户外行程需灵活安排",
    },
    "월 강수량 221mm로 우기에 해당": {
        "en": "Monthly rainfall of 221mm qualifies as rainy season",
        "ja": "月降水量221mmで雨季に相当",
        "zh": "月降雨量221mm，属于雨季",
    },
    "월 강수량 288mm로 우기에 해당": {
        "en": "Monthly rainfall of 288mm qualifies as rainy season",
        "ja": "月降水量288mmで雨季に相当",
        "zh": "月降雨量288mm，属于雨季",
    },
    "월 27일 비가 와 야외 일정에 유의": {
        "en": "27 rainy days — outdoor plans need significant flexibility",
        "ja": "27日の雨日、屋外日程に注意が必要",
        "zh": "月内约27天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 311mm로 우기에 해당": {
        "en": "Monthly rainfall of 311mm qualifies as rainy season",
        "ja": "月降水量311mmで雨季に相当",
        "zh": "月降雨量311mm，属于雨季",
    },
    "월 29일 비가 와 야외 일정에 유의": {
        "en": "29 rainy days — outdoor plans need significant flexibility",
        "ja": "29日の雨日、屋外日程に注意が必要",
        "zh": "月内约29天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 250mm로 우기에 해당": {
        "en": "Monthly rainfall of 250mm qualifies as rainy season",
        "ja": "月降水量250mmで雨季に相当",
        "zh": "月降雨量250mm，属于雨季",
    },
    "월 강수량 256mm로 우기에 해당": {
        "en": "Monthly rainfall of 256mm qualifies as rainy season",
        "ja": "月降水量256mmで雨季に相当",
        "zh": "月降雨量256mm，属于雨季",
    },
    "월 27.2일 비가 와 야외 일정에 유의": {
        "en": "27.2 rainy days — outdoor plans need significant flexibility",
        "ja": "27.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约27.2天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 347mm로 우기에 해당": {
        "en": "Monthly rainfall of 347mm qualifies as rainy season",
        "ja": "月降水量347mmで雨季に相当",
        "zh": "月降雨量347mm，属于雨季",
    },
    "월 29.6일 비가 와 야외 일정에 유의": {
        "en": "29.6 rainy days — outdoor plans need significant flexibility",
        "ja": "29.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约29.6天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 212mm로 우기에 해당": {
        "en": "Monthly rainfall of 212mm qualifies as rainy season",
        "ja": "月降水量212mmで雨季に相当",
        "zh": "月降雨量212mm，属于雨季",
    },
    "월 26.8일 비가 와 야외 일정에 유의": {
        "en": "26.8 rainy days — outdoor plans need significant flexibility",
        "ja": "26.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约26.8天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 246mm로 우기에 해당": {
        "en": "Monthly rainfall of 246mm qualifies as rainy season",
        "ja": "月降水量246mmで雨季に相当",
        "zh": "月降雨量246mm，属于雨季",
    },
    "월 강수량 284mm로 우기에 해당": {
        "en": "Monthly rainfall of 284mm qualifies as rainy season",
        "ja": "月降水量284mmで雨季に相当",
        "zh": "月降雨量284mm，属于雨季",
    },
    "월 30일 비가 와 야외 일정에 유의": {
        "en": "30 rainy days — outdoor plans need significant flexibility",
        "ja": "30日の雨日、屋外日程に注意が必要",
        "zh": "月内约30天雨天，户外行程需充分灵活安排",
    },
    "습도 93%로 불쾌지수 높음": {
        "en": "Humidity at 93% makes it feel extremely uncomfortable",
        "ja": "湿度93%で不快指数が非常に高い",
        "zh": "湿度93%，不适感极强",
    },
    "월 강수량 221mm로 우기에 해당": {
        "en": "Monthly rainfall of 221mm qualifies as rainy season",
        "ja": "月降水量221mmで雨季に相当",
        "zh": "月降雨量221mm，属于雨季",
    },
    "월 28일 비가 와 야외 일정에 유의": {
        "en": "28 rainy days — outdoor plans need significant flexibility",
        "ja": "28日の雨日、屋外日程に注意が必要",
        "zh": "月内约28天雨天，户外行程需充分灵活安排",
    },
    "습도 92%로 불쾌지수 높음": {
        "en": "Humidity at 92% makes it feel extremely uncomfortable",
        "ja": "湿度92%で不快指数が非常に高い",
        "zh": "湿度92%，不适感极强",
    },
    "월 강수량 291mm로 우기에 해당": {
        "en": "Monthly rainfall of 291mm qualifies as rainy season",
        "ja": "月降水量291mmで雨季に相当",
        "zh": "月降雨量291mm，属于雨季",
    },
    "월 강수량 163mm로 우기에 해당": {
        "en": "Monthly rainfall of 163mm qualifies as rainy season",
        "ja": "月降水量163mmで雨季に相当",
        "zh": "月降雨量163mm，属于雨季",
    },
    "습도 90%로 불쾌지수 높음": {
        "en": "Humidity at 90% makes it feel extremely uncomfortable",
        "ja": "湿度90%で不快指数が非常に高い",
        "zh": "湿度90%，不适感极强",
    },
    "강수량이 116mm로 우산 필수": {
        "en": "Rainfall of 116mm — umbrella essential",
        "ja": "降水量116mm、傘が必須",
        "zh": "降雨量116mm，雨伞必备",
    },
    "월 25일 비가 와 야외 일정에 유의": {
        "en": "25 rainy days — outdoor plans need significant flexibility",
        "ja": "25日の雨日、屋外日程に注意が必要",
        "zh": "月内约25天雨天，户外行程需充分灵活安排",
    },
    "강수량이 101mm로 우산 필수": {
        "en": "Rainfall of 101mm — umbrella essential",
        "ja": "降水量101mm、傘が必須",
        "zh": "降雨量101mm，雨伞必备",
    },
    "월 23.2일 비가 와 야외 일정에 유의": {
        "en": "23.2 rainy days — outdoor plans need flexibility",
        "ja": "23.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约23.2天雨天，户外行程需灵活安排",
    },
    "습도 91%로 불쾌지수 높음": {
        "en": "Humidity at 91% makes it feel extremely uncomfortable",
        "ja": "湿度91%で不快指数が非常に高い",
        "zh": "湿度91%，不适感极强",
    },
    "월 21.2일 비가 와 야외 일정에 유의": {
        "en": "21.2 rainy days — outdoor plans need flexibility",
        "ja": "21.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约21.2天雨天，户外行程需灵活安排",
    },
    "월 23일 비가 와 야외 일정에 유의": {
        "en": "23 rainy days — outdoor plans need flexibility",
        "ja": "23日の雨日、屋外日程に注意が必要",
        "zh": "月内约23天雨天，户外行程需灵活安排",
    },
    "강수량이 135mm로 우산 필수": {
        "en": "Rainfall of 135mm — umbrella essential",
        "ja": "降水量135mm、傘が必須",
        "zh": "降雨量135mm，雨伞必备",
    },
    "월 강수량 277mm로 우기에 해당": {
        "en": "Monthly rainfall of 277mm qualifies as rainy season",
        "ja": "月降水量277mmで雨季に相当",
        "zh": "月降雨量277mm，属于雨季",
    },
    "월 29.2일 비가 와 야외 일정에 유의": {
        "en": "29.2 rainy days — outdoor plans need significant flexibility",
        "ja": "29.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约29.2天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 175mm로 우기에 해당": {
        "en": "Monthly rainfall of 175mm qualifies as rainy season",
        "ja": "月降水量175mmで雨季に相当",
        "zh": "月降雨量175mm，属于雨季",
    },
    "월 25.4일 비가 와 야외 일정에 유의": {
        "en": "25.4 rainy days — outdoor plans need significant flexibility",
        "ja": "25.4日の雨日、屋外日程に注意が必要",
        "zh": "月内约25.4天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 198mm로 우기에 해당": {
        "en": "Monthly rainfall of 198mm qualifies as rainy season",
        "ja": "月降水量198mmで雨季に相当",
        "zh": "月降雨量198mm，属于雨季",
    },
    "월 25.2일 비가 와 야외 일정에 유의": {
        "en": "25.2 rainy days — outdoor plans need significant flexibility",
        "ja": "25.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约25.2天雨天，户外行程需充分灵活安排",
    },
    "월 21일 비가 와 야외 일정에 유의": {
        "en": "21 rainy days — outdoor plans need flexibility",
        "ja": "21日の雨日、屋外日程に注意が必要",
        "zh": "月内约21天雨天，户外行程需灵活安排",
    },
    "강수량이 109mm로 우산 필수": {
        "en": "Rainfall of 109mm — umbrella essential",
        "ja": "降水量109mm、傘が必須",
        "zh": "降雨量109mm，雨伞必备",
    },
    "비 오는 날이 14.6일로 실내 대안 준비 권장": {
        "en": "14.6 rainy days — have indoor backup plans ready",
        "ja": "14.6日の雨日、室内代替案の準備を推奨",
        "zh": "约14.6天雨天，建议准备室内备选方案",
    },
    "월 16.8일 비가 와 야외 일정에 유의": {
        "en": "16.8 rainy days — outdoor plans need flexibility",
        "ja": "16.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约16.8天雨天，户外行程需灵活安排",
    },
    "습도 80%로 불쾌지수 높음": {
        "en": "Humidity at 80% makes it feel uncomfortable",
        "ja": "湿度80%で不快指数が高い",
        "zh": "湿度80%，不适感较明显",
    },
    "비 오는 날이 11.6일로 실내 대안 준비 권장": {
        "en": "11.6 rainy days — have indoor backup plans ready",
        "ja": "11.6日の雨日、室内代替案の準備を推奨",
        "zh": "约11.6天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 12.6일로 실내 대안 준비 권장": {
        "en": "12.6 rainy days — have indoor backup plans ready",
        "ja": "12.6日の雨日、室内代替案の準備を推奨",
        "zh": "约12.6天雨天，建议准备室内备选方案",
    },
    "강수량이 120mm로 우산 필수": {
        "en": "Rainfall of 120mm — umbrella essential",
        "ja": "降水量120mm、傘が必須",
        "zh": "降雨量120mm，雨伞必备",
    },
    "월 18.2일 비가 와 야외 일정에 유의": {
        "en": "18.2 rainy days — outdoor plans need flexibility",
        "ja": "18.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约18.2天雨天，户外行程需灵活安排",
    },
    "월 강수량 204mm로 우기에 해당": {
        "en": "Monthly rainfall of 204mm qualifies as rainy season",
        "ja": "月降水量204mmで雨季に相当",
        "zh": "月降雨量204mm，属于雨季",
    },
    "월 23.2일 비가 와 야외 일정에 유의": {
        "en": "23.2 rainy days — outdoor plans need flexibility",
        "ja": "23.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约23.2天雨天，户外行程需灵活安排",
    },
    "월 강수량 286mm로 우기에 해당": {
        "en": "Monthly rainfall of 286mm qualifies as rainy season",
        "ja": "月降水量286mmで雨季に相当",
        "zh": "月降雨量286mm，属于雨季",
    },
    "월 강수량 343mm로 우기에 해당": {
        "en": "Monthly rainfall of 343mm qualifies as rainy season",
        "ja": "月降水量343mmで雨季に相当",
        "zh": "月降雨量343mm，属于雨季",
    },
    "월 28.4일 비가 와 야외 일정에 유의": {
        "en": "28.4 rainy days — outdoor plans need significant flexibility",
        "ja": "28.4日の雨日、屋外日程に注意が必要",
        "zh": "月内约28.4天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 268mm로 우기에 해당": {
        "en": "Monthly rainfall of 268mm qualifies as rainy season",
        "ja": "月降水量268mmで雨季に相当",
        "zh": "月降雨量268mm，属于雨季",
    },
    "월 강수량 278mm로 우기에 해당": {
        "en": "Monthly rainfall of 278mm qualifies as rainy season",
        "ja": "月降水量278mmで雨季に相当",
        "zh": "月降雨量278mm，属于雨季",
    },
    "월 29.4일 비가 와 야외 일정에 유의": {
        "en": "29.4 rainy days — outdoor plans need significant flexibility",
        "ja": "29.4日の雨日、屋外日程に注意が必要",
        "zh": "月内约29.4天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 214mm로 우기에 해당": {
        "en": "Monthly rainfall of 214mm qualifies as rainy season",
        "ja": "月降水量214mmで雨季に相当",
        "zh": "月降雨量214mm，属于雨季",
    },
    "월 강수량 181mm로 우기에 해당": {
        "en": "Monthly rainfall of 181mm qualifies as rainy season",
        "ja": "月降水量181mmで雨季に相当",
        "zh": "月降雨量181mm，属于雨季",
    },
    "월 강수량 152mm로 우기에 해당": {
        "en": "Monthly rainfall of 152mm qualifies as rainy season",
        "ja": "月降水量152mmで雨季に相当",
        "zh": "月降雨量152mm，属于雨季",
    },
    "비 오는 날이 14.2일로 실내 대안 준비 권장": {
        "en": "14.2 rainy days — have indoor backup plans ready",
        "ja": "14.2日の雨日、室内代替案の準備を推奨",
        "zh": "约14.2天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 13.6일로 실내 대안 준비 권장": {
        "en": "13.6 rainy days — have indoor backup plans ready",
        "ja": "13.6日の雨日、室内代替案の準備を推奨",
        "zh": "约13.6天雨天，建议准备室内备选方案",
    },
    "강수량이 119mm로 우산 필수": {
        "en": "Rainfall of 119mm — umbrella essential",
        "ja": "降水量119mm、傘が必須",
        "zh": "降雨量119mm，雨伞必备",
    },
    "월 16.8일 비가 와 야외 일정에 유의": {
        "en": "16.8 rainy days — outdoor plans need flexibility",
        "ja": "16.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约16.8天雨天，户外行程需灵活安排",
    },
    "월 강수량 175mm로 우기에 해당": {
        "en": "Monthly rainfall of 175mm qualifies as rainy season",
        "ja": "月降水量175mmで雨季に相当",
        "zh": "月降雨量175mm，属于雨季",
    },
    "월 강수量 251mm로 우기에 해당": {
        "en": "Monthly rainfall of 251mm qualifies as rainy season",
        "ja": "月降水量251mmで雨季に相当",
        "zh": "月降雨量251mm，属于雨季",
    },
    "월 강수량 251mm로 우기에 해당": {
        "en": "Monthly rainfall of 251mm qualifies as rainy season",
        "ja": "月降水量251mmで雨季に相当",
        "zh": "月降雨量251mm，属于雨季",
    },
    "월 강수량 271mm로 우기에 해당": {
        "en": "Monthly rainfall of 271mm qualifies as rainy season",
        "ja": "月降水量271mmで雨季に相当",
        "zh": "月降雨量271mm，属于雨季",
    },
    "월 27.6일 비가 와 야외 일정에 유의": {
        "en": "27.6 rainy days — outdoor plans need significant flexibility",
        "ja": "27.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约27.6天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 295mm로 우기에 해당": {
        "en": "Monthly rainfall of 295mm qualifies as rainy season",
        "ja": "月降水量295mmで雨季に相当",
        "zh": "月降雨量295mm，属于雨季",
    },
    "월 강수량 115mm로 우산 필수": {
        "en": "Rainfall of 115mm — umbrella essential",
        "ja": "降水量115mm、傘が必須",
        "zh": "降雨量115mm，雨伞必备",
    },
    "강수량이 115mm로 우산 필수": {
        "en": "Rainfall of 115mm — umbrella essential",
        "ja": "降水量115mm、傘が必須",
        "zh": "降雨量115mm，雨伞必备",
    },
    "월 19.8일 비가 와 야외 일정에 유의": {
        "en": "19.8 rainy days — outdoor plans need flexibility",
        "ja": "19.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约19.8天雨天，户外行程需灵活安排",
    },
    "월 강수량 233mm로 우기에 해당": {
        "en": "Monthly rainfall of 233mm qualifies as rainy season",
        "ja": "月降水量233mmで雨季に相当",
        "zh": "月降雨量233mm，属于雨季",
    },
    "월 25.4일 비가 와 야외 일정에 유의": {
        "en": "25.4 rainy days — outdoor plans need significant flexibility",
        "ja": "25.4日の雨日、屋外日程に注意が必要",
        "zh": "月内约25.4天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 288mm로 우기에 해당": {
        "en": "Monthly rainfall of 288mm qualifies as rainy season",
        "ja": "月降水量288mmで雨季に相当",
        "zh": "月降雨量288mm，属于雨季",
    },
    "월 강수량 329mm로 우기에 해당": {
        "en": "Monthly rainfall of 329mm qualifies as rainy season",
        "ja": "月降水量329mmで雨季に相当",
        "zh": "月降雨量329mm，属于雨季",
    },
    "월 389mm로 우기에 해당": {
        "en": "Monthly rainfall of 389mm qualifies as rainy season",
        "ja": "月降水量389mmで雨季に相当",
        "zh": "月降雨量389mm，属于雨季",
    },
    "월 강수량 389mm로 우기에 해당": {
        "en": "Monthly rainfall of 389mm qualifies as rainy season",
        "ja": "月降水量389mmで雨季に相当",
        "zh": "月降雨量389mm，属于雨季",
    },
    "월 강수량 256mm로 우기에 해당": {
        "en": "Monthly rainfall of 256mm qualifies as rainy season",
        "ja": "月降水量256mmで雨季に相当",
        "zh": "月降雨量256mm，属于雨季",
    },
    "월 23.6일 비가 와 야외 일정에 유의": {
        "en": "23.6 rainy days — outdoor plans need flexibility",
        "ja": "23.6日の雨日、屋外日程に注意が必要",
        "zh": "月内约23.6天雨天，户外行程需灵活安排",
    },
    "월 강수량 276mm로 우기에 해당": {
        "en": "Monthly rainfall of 276mm qualifies as rainy season",
        "ja": "月降水量276mmで雨季に相当",
        "zh": "月降雨量276mm，属于雨季",
    },
    "월 25.8일 비가 와 야외 일정에 유의": {
        "en": "25.8 rainy days — outdoor plans need significant flexibility",
        "ja": "25.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约25.8天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 300mm로 우기에 해당": {
        "en": "Monthly rainfall of 300mm qualifies as rainy season",
        "ja": "月降水量300mmで雨季に相当",
        "zh": "月降雨量300mm，属于雨季",
    },
    "월 강수량 311mm로 우기에 해당": {
        "en": "Monthly rainfall of 311mm qualifies as rainy season",
        "ja": "月降水量311mmで雨季に相当",
        "zh": "月降雨量311mm，属于雨季",
    },
    "월 27.4일 비가 와 야외 일정에 유의": {
        "en": "27.4 rainy days — outdoor plans need significant flexibility",
        "ja": "27.4日の雨日、屋外日程に注意が必要",
        "zh": "月内约27.4天雨天，户外行程需充分灵活安排",
    },
    "비 오는 날이 10.6일로 실내 대안 준비 권장": {
        "en": "10.6 rainy days — have indoor backup plans ready",
        "ja": "10.6日の雨日、室内代替案の準備を推奨",
        "zh": "约10.6天雨天，建议准备室内备选方案",
    },
    "강수량이 112mm로 우산 필수": {
        "en": "Rainfall of 112mm — umbrella essential",
        "ja": "降水量112mm、傘が必須",
        "zh": "降雨量112mm，雨伞必备",
    },
    "월 강수량 211mm로 우기에 해당": {
        "en": "Monthly rainfall of 211mm qualifies as rainy season",
        "ja": "月降水量211mmで雨季に相当",
        "zh": "月降雨量211mm，属于雨季",
    },
    "월 25.8일 비가 와 야외 일정에 유의": {
        "en": "25.8 rainy days — outdoor plans need significant flexibility",
        "ja": "25.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约25.8天雨天，户外行程需充分灵活安排",
    },
    "습도 84%로 불쾌지수 높음": {
        "en": "Humidity at 84% makes it feel quite uncomfortable",
        "ja": "湿度84%で不快指数が高い",
        "zh": "湿度84%，不适感较强",
    },
    "월 강수량 192mm로 우기에 해당": {
        "en": "Monthly rainfall of 192mm qualifies as rainy season",
        "ja": "月降水量192mmで雨季に相当",
        "zh": "月降雨量192mm，属于雨季",
    },
    "월 강수량 205mm로 우기에 해당": {
        "en": "Monthly rainfall of 205mm qualifies as rainy season",
        "ja": "月降水量205mmで雨季に相当",
        "zh": "月降雨量205mm，属于雨季",
    },
    "월 23.8일 비가 와 야외 일정에 유의": {
        "en": "23.8 rainy days — outdoor plans need flexibility",
        "ja": "23.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约23.8天雨天，户外行程需灵活安排",
    },
    "습도 85%로 불쾌지수 높음": {
        "en": "Humidity at 85% makes it feel very uncomfortable",
        "ja": "湿度85%で不快指数が高い",
        "zh": "湿度85%，不适感较强",
    },
    "습도 86%로 불쾌지수 높음": {
        "en": "Humidity at 86% makes it feel very uncomfortable",
        "ja": "湿度86%で不快指数が高い",
        "zh": "湿度86%，不适感较强",
    },
    "월 강수량 272mm로 우기에 해당": {
        "en": "Monthly rainfall of 272mm qualifies as rainy season",
        "ja": "月降水量272mmで雨季に相当",
        "zh": "月降雨量272mm，属于雨季",
    },
    "월 강수량 306mm로 우기에 해당": {
        "en": "Monthly rainfall of 306mm qualifies as rainy season",
        "ja": "月降水量306mmで雨季に相当",
        "zh": "月降雨量306mm，属于雨季",
    },
    "습도 88%로 불쾌지수 높음": {
        "en": "Humidity at 88% makes it feel very uncomfortable",
        "ja": "湿度88%で不快指数が高い",
        "zh": "湿度88%，不适感较强",
    },
    "월 강수량 295mm로 우기에 해당": {
        "en": "Monthly rainfall of 295mm qualifies as rainy season",
        "ja": "月降水量295mmで雨季に相当",
        "zh": "月降雨量295mm，属于雨季",
    },
    "강수량이 142mm로 우산 필수": {
        "en": "Rainfall of 142mm — umbrella essential",
        "ja": "降水量142mm、傘が必須",
        "zh": "降雨量142mm，雨伞必备",
    },
    "월 18.2일 비가 와 야외 일정에 유의": {
        "en": "18.2 rainy days — outdoor plans need flexibility",
        "ja": "18.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约18.2天雨天，户外行程需灵活安排",
    },
    "비 오는 날이 10일로 실내 대안 준비 권장": {
        "en": "10 rainy days — have indoor backup plans ready",
        "ja": "10日の雨日、室内代替案の準備を推奨",
        "zh": "约10天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 11.3일로 실내 대안 준비 권장": {
        "en": "11.3 rainy days — have indoor backup plans ready",
        "ja": "11.3日の雨日、室内代替案の準備を推奨",
        "zh": "约11.3天雨天，建议准备室内备选方案",
    },
    # All remaining missing translations
    "단풍이 물드는 가을, 맑고 쾌적한 날씨": {
        "en": "Autumn colors arrive with clear, comfortable weather",
        "ja": "紅葉が色づく秋、晴れて過ごしやすい天気",
        "zh": "秋叶渐染，天气晴朗宜人",
    },
    "단풍 절정, 가을 축제와 일루미네이션 시작": {
        "en": "Peak autumn foliage with fall festivals and illuminations beginning",
        "ja": "紅葉最盛期、秋祭りとイルミネーションが始まる",
        "zh": "红叶盛极，秋日祭典与灯饰活动相继开幕",
    },
    "쌀쌀한 겨울이지만 연말 분위기와 일루미네이션": {
        "en": "Chilly winter but lively year-end atmosphere and illuminations",
        "ja": "肌寒い冬だが、年末ムードとイルミネーションが輝く",
        "zh": "寒冬时节，年末气氛浓厚，灯饰璀璨夺目",
    },
    "단풍과 일루미네이션의 계절": {
        "en": "Season of autumn leaves and illuminations",
        "ja": "紅葉とイルミネーションの季節",
        "zh": "红叶与灯饰交相辉映的季节",
    },
    "단풍 시즌 (11~12월)": {
        "en": "Autumn foliage season (November–December)",
        "ja": "紅葉シーズン（11〜12月）",
        "zh": "红叶季节（11-12月）",
    },
    "도쿄 크리스마스 일루미네이션": {
        "en": "Tokyo Christmas illuminations",
        "ja": "東京クリスマスイルミネーション",
        "zh": "东京圣诞灯饰",
    },
    "월 강수량 232mm로 우기에 해당": {
        "en": "Monthly rainfall of 232mm qualifies as rainy season",
        "ja": "月降水量232mmで雨季に相当",
        "zh": "月降雨量232mm，属于雨季",
    },
    "월 강수량 236mm로 우기에 해당": {
        "en": "Monthly rainfall of 236mm qualifies as rainy season",
        "ja": "月降水量236mmで雨季に相当",
        "zh": "月降雨量236mm，属于雨季",
    },
    "월 강수량 375mm로 우기에 해당": {
        "en": "Monthly rainfall of 375mm qualifies as rainy season",
        "ja": "月降水量375mmで雨季に相当",
        "zh": "月降雨量375mm，属于雨季",
    },
    "월 강수량 424mm로 우기에 해당": {
        "en": "Monthly rainfall of 424mm qualifies as rainy season",
        "ja": "月降水量424mmで雨季に相当",
        "zh": "月降雨量424mm，属于雨季",
    },
    "월 30.2일 비가 와 야외 일정에 유의": {
        "en": "30.2 rainy days — outdoor plans need significant flexibility",
        "ja": "30.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约30.2天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 416mm로 우기에 해당": {
        "en": "Monthly rainfall of 416mm qualifies as rainy season",
        "ja": "月降水量416mmで雨季に相当",
        "zh": "月降雨量416mm，属于雨季",
    },
    "월 강수량 220mm로 우기에 해당": {
        "en": "Monthly rainfall of 220mm qualifies as rainy season",
        "ja": "月降水量220mmで雨季に相当",
        "zh": "月降雨量220mm，属于雨季",
    },
    "월 19일 비가 와 야외 일정에 유의": {
        "en": "19 rainy days — outdoor plans need flexibility",
        "ja": "19日の雨日、屋外日程に注意が必要",
        "zh": "月内约19天雨天，户外行程需灵活安排",
    },
    "습도 89%로 불쾌지수 높음": {
        "en": "Humidity at 89% makes it feel very uncomfortable",
        "ja": "湿度89%で不快指数が高い",
        "zh": "湿度89%，不适感较强",
    },
    "월 24.2일 비가 와 야외 일정에 유의": {
        "en": "24.2 rainy days — outdoor plans need significant flexibility",
        "ja": "24.2日の雨日、屋外日程に注意が必要",
        "zh": "月内约24.2天雨天，户外行程需充分灵活安排",
    },
    "북동 몬순 시작, 비 많아지는 시기": {
        "en": "Northeast monsoon begins as rain becomes more frequent",
        "ja": "北東モンスーンが始まり、雨が多くなる時期",
        "zh": "东北季风来袭，降雨量逐渐增多",
    },
    "월 강수량 402mm로 우기에 해당": {
        "en": "Monthly rainfall of 402mm qualifies as rainy season",
        "ja": "月降水量402mmで雨季に相当",
        "zh": "月降雨量402mm，属于雨季",
    },
    "몬순 피크, 크리스마스 일루미네이션": {
        "en": "Monsoon peak month with Christmas illuminations brightening the city",
        "ja": "モンスーンのピーク、クリスマスイルミネーションが輝く",
        "zh": "季风高峰期，圣诞灯饰点亮城市",
    },
    "현지 일상을 경험하기 좋은 시기": {
        "en": "A great time to experience local everyday life",
        "ja": "現地の日常を体験するのに良い時期",
        "zh": "体验当地日常生活的好时机",
    },
    "봄꽃과 청명한 날씨": {
        "en": "Spring flowers and clear weather",
        "ja": "春の花と澄んだ天気",
        "zh": "春花盛开，天气清朗",
    },
    "맑고 선선한 가을": {
        "en": "Clear and cool autumn",
        "ja": "晴れて涼しい秋",
        "zh": "晴朗凉爽的秋天",
    },
    "건기 따뜻한 겨울": {
        "en": "Warm dry-season winter",
        "ja": "乾季の暖かい冬",
        "zh": "干季温暖的冬天",
    },
    "벚꽃 시즌 (3월)": {
        "en": "Cherry blossom season (March)",
        "ja": "桜シーズン（3月）",
        "zh": "樱花季（3月）",
    },
    "월 강수량 259mm로 우기에 해당": {
        "en": "Monthly rainfall of 259mm qualifies as rainy season",
        "ja": "月降水量259mmで雨季に相当",
        "zh": "月降雨量259mm，属于雨季",
    },
    "월 18.8일 비가 와 야외 일정에 유의": {
        "en": "18.8 rainy days — outdoor plans need flexibility",
        "ja": "18.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约18.8天雨天，户外行程需灵活安排",
    },
    "강수량이 144mm로 우산 필수": {
        "en": "Rainfall of 144mm — umbrella essential",
        "ja": "降水量144mm、傘が必須",
        "zh": "降雨量144mm，雨伞必备",
    },
    "월 강수량 196mm로 우기에 해당": {
        "en": "Monthly rainfall of 196mm qualifies as rainy season",
        "ja": "月降水量196mmで雨季に相当",
        "zh": "月降雨量196mm，属于雨季",
    },
    "호주의 여름, 해변과 야외 활동 최적": {
        "en": "Australian summer — perfect for beaches and outdoor activities",
        "ja": "オーストラリアの夏、ビーチと屋外活動に最適",
        "zh": "澳大利亚夏天，海滩和户外活动最为适宜",
    },
    "시드니 새해 불꽃놀이 (12월 31일)": {
        "en": "Sydney New Year's Eve fireworks (December 31)",
        "ja": "シドニー年越し花火（12月31日）",
        "zh": "悉尼新年烟火（12月31日）",
    },
    "호주 데이 (1월 26일)": {
        "en": "Australia Day (January 26)",
        "ja": "オーストラリアデー（1月26日）",
        "zh": "澳大利亚国庆日（1月26日）",
    },
    "강수량이 125mm로 우산 필수": {
        "en": "Rainfall of 125mm — umbrella essential",
        "ja": "降水量125mm、傘が必須",
        "zh": "降雨量125mm，雨伞必备",
    },
    "월 16.2일 비가 와 야외 일정에 유의": {
        "en": "16.2 rainy days — outdoor plans need flexibility",
        "ja": "16.2日の雨日、屋外日程に注意が必要",
        "zh": "月내약16.2天雨天，户外行程需灵활安排",
    },
    "가을 시작, 쾌적한 날씨": {
        "en": "Autumn begins with pleasant weather",
        "ja": "秋の始まり、快適な天気",
        "zh": "秋天开始，天气宜人",
    },
    "월 강수량 186mm로 우기에 해당": {
        "en": "Monthly rainfall of 186mm qualifies as rainy season",
        "ja": "月降水量186mmで雨季に相当",
        "zh": "月降雨量186mm，属于雨季",
    },
    "습도가 70%로 다소 높음": {
        "en": "Humidity at 70% is somewhat high",
        "ja": "湿度70%でやや高い",
        "zh": "湿度70%，略偏高",
    },
    # Taiwan cautions
    "비 오는 날이 13일로 실내 대안 준비 권장": {
        "en": "13 rainy days — have indoor backup plans ready",
        "ja": "13日の雨日、室内代替案の準備を推奨",
        "zh": "约13天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 13.6일로 실내 대안 준비 권장": {
        "en": "13.6 rainy days — have indoor backup plans ready",
        "ja": "13.6日の雨日、室内代替案の準備を推奨",
        "zh": "约13.6天雨天，建议准备室内备选方案",
    },
    # Australia cautions
    "강수량이 103mm로 우산 필수": {
        "en": "Rainfall of 103mm — umbrella essential",
        "ja": "降水量103mm、傘が必須",
        "zh": "降雨量103mm，雨伞必备",
    },
    "비 오는 날이 14일로 실내 대안 준비 권장": {
        "en": "14 rainy days — have indoor backup plans ready",
        "ja": "14日の雨日、室内代替案の準備を推奨",
        "zh": "约14天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 11.4일로 실내 대안 준비 권장": {
        "en": "11.4 rainy days — have indoor backup plans ready",
        "ja": "11.4日の雨日、室内代替案の準備を推奨",
        "zh": "约11.4天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 10.4일로 실내 대안 준비 권장": {
        "en": "10.4 rainy days — have indoor backup plans ready",
        "ja": "10.4日の雨日、室内代替案の準備を推奨",
        "zh": "约10.4天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 15.4일로 실내 대안 준비 권장": {
        "en": "15.4 rainy days — have indoor backup plans ready",
        "ja": "15.4日の雨日、室内代替案の準備を推奨",
        "zh": "约15.4天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 16.2일로 실내 대안 준비 권장": {
        "en": "16.2 rainy days — have indoor backup plans ready",
        "ja": "16.2日の雨日、室内代替案の準備を推奨",
        "zh": "约16.2天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 16.6일로 실내 대안 준비 권장": {
        "en": "16.6 rainy days — have indoor backup plans ready",
        "ja": "16.6日の雨日、室内代替案の準備を推奨",
        "zh": "约16.6天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 13.2일로 실내 대안 준비 권장": {
        "en": "13.2 rainy days — have indoor backup plans ready",
        "ja": "13.2日の雨日、室内代替案の準備を推奨",
        "zh": "约13.2天雨天，建议准备室内备选方案",
    },
    "비 오는 날이 12.2일로 실내 대안 준비 권장": {
        "en": "12.2 rainy days — have indoor backup plans ready",
        "ja": "12.2日の雨日、室内代替案の準備を推奨",
        "zh": "약12.2天雨天，建议准备室内备选方案",
    },
    "강수량이 121mm로 우산 필수": {
        "en": "Rainfall of 121mm — umbrella essential",
        "ja": "降水量121mm、傘が必須",
        "zh": "降雨量121mm，雨伞必备",
    },
    "월 강수량 257mm로 우기에 해당": {
        "en": "Monthly rainfall of 257mm qualifies as rainy season",
        "ja": "月降水量257mmで雨季に相当",
        "zh": "月降雨量257mm，属于雨季",
    },
    "월 24.4일 비가 와 야외 일정에 유의": {
        "en": "24.4 rainy days — outdoor plans need significant flexibility",
        "ja": "24.4日の雨日、屋外日程に注意が必要",
        "zh": "月内约24.4天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 282mm로 우기에 해당": {
        "en": "Monthly rainfall of 282mm qualifies as rainy season",
        "ja": "月降水量282mmで雨季に相当",
        "zh": "月降雨量282mm，属于雨季",
    },
    "월 27.2일 비가 와 야외 일정에 유의": {
        "en": "27.2 rainy days — outdoor plans need significant flexibility",
        "ja": "27.2日の雨日、屋外日程に注意が必要",
        "zh": "월内约27.2天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 338mm로 우기에 해당": {
        "en": "Monthly rainfall of 338mm qualifies as rainy season",
        "ja": "月降水量338mmで雨季に相当",
        "zh": "月降雨量338mm，属于雨季",
    },
    "월 29.8일 비가 와 야외 일정에 유의": {
        "en": "29.8 rainy days — outdoor plans need significant flexibility",
        "ja": "29.8日の雨日、屋外日程に注意が必要",
        "zh": "月内约29.8天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 309mm로 우기에 해당": {
        "en": "Monthly rainfall of 309mm qualifies as rainy season",
        "ja": "月降水量309mmで雨季に相当",
        "zh": "月降雨量309mm，属于雨季",
    },
    "월 29일 비가 와 야외 일정에 유의": {
        "en": "29 rainy days — outdoor plans need significant flexibility",
        "ja": "29日の雨日、屋外日程に注意が必要",
        "zh": "月内约29天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 393mm로 우기에 해당": {
        "en": "Monthly rainfall of 393mm qualifies as rainy season",
        "ja": "月降水量393mmで雨季に相当",
        "zh": "月降雨量393mm，属于雨季",
    },
    "월 30일 비가 와 야외 일정에 유의": {
        "en": "30 rainy days — outdoor plans need significant flexibility",
        "ja": "30日の雨日、屋外日程に注意が必要",
        "zh": "月内约30天雨天，户外行程需充分灵活安排",
    },
    "월 강수량 367mm로 우기에 해당": {
        "en": "Monthly rainfall of 367mm qualifies as rainy season",
        "ja": "月降水量367mmで雨季に相当",
        "zh": "月降雨量367mm，属于雨季",
    },
    "월 28.4일 비가 와 야외 일정에 유의": {
        "en": "28.4 rainy days — outdoor plans need significant flexibility",
        "ja": "28.4日の雨日、屋外日程に注意が必要",
        "zh": "月内约28.4天雨天，户外行程需充分灵活安排",
    },
    # Events
    "벚꽃 시즌 (3월 말~4월 초)": {
        "en": "Cherry blossom season (late March to early April)",
        "ja": "桜シーズン（3月末〜4月初旬）",
        "zh": "樱花季（3月下旬至4月初）",
    },
    "우에노 공원 벚꽃 축제": {
        "en": "Ueno Park cherry blossom festival",
        "ja": "上野公園の桜まつり",
        "zh": "上野公园樱花节",
    },
    "스미다강 불꽃놀이 (7월)": {
        "en": "Sumida River Fireworks Festival (July)",
        "ja": "隅田川花火大会（7月）",
        "zh": "隅田川烟火大会（7月）",
    },
    "여름 마츠리": {
        "en": "Summer matsuri (festivals)",
        "ja": "夏祭り",
        "zh": "夏日祭典",
    },
    "로이끄라통 (11월)": {
        "en": "Loy Krathong (November)",
        "ja": "ロイクラトン（11月）",
        "zh": "水灯节（11月）",
    },
    "송크란 대비 건기 여행": {
        "en": "Dry season travel ahead of Songkran",
        "ja": "ソンクラン前の乾季旅行",
        "zh": "宋干节前的干季旅行",
    },
    "송크란 축제 (4월 13~15일)": {
        "en": "Songkran Festival (April 13–15)",
        "ja": "ソンクラン祭り（4月13〜15日）",
        "zh": "宋干节（4月13-15日）",
    },
    "이펭/로이끄라통 (11월)": {
        "en": "Yi Peng / Loy Krathong (November)",
        "ja": "イーペン/ロイクラトン（11月）",
        "zh": "彝鹏节/水灯节（11月）",
    },
    "치앙마이 플라워 페스티벌 (2월)": {
        "en": "Chiang Mai Flower Festival (February)",
        "ja": "チェンマイフラワーフェスティバル（2月）",
        "zh": "清迈花卉节（2月）",
    },
    "송크란 축제 (4월)": {
        "en": "Songkran Festival (April)",
        "ja": "ソンクラン祭り（4月）",
        "zh": "宋干节（4月）",
    },
    "건기 시즌": {
        "en": "Dry season",
        "ja": "乾季シーズン",
        "zh": "干季时节",
    },
    "푸켓 킹스컵 레가타 (12월)": {
        "en": "Phuket King's Cup Regatta (December)",
        "ja": "プーケットキングスカップレガッタ（12月）",
        "zh": "普吉岛国王杯帆船赛（12月）",
    },
    "뗏(구정) 연휴 (1~2월)": {
        "en": "Tet (Lunar New Year) holiday (January–February)",
        "ja": "テト（旧正月）連休（1〜2月）",
        "zh": "春节（农历新年）假期（1-2月）",
    },
    "하노이 꽃 축제": {
        "en": "Hanoi Flower Festival",
        "ja": "ハノイフラワーフェスティバル",
        "zh": "河内花卉节",
    },
    "하노이 구시가 가을 여행 적기": {
        "en": "Best time to explore the Hanoi Old Quarter in autumn",
        "ja": "ハノイ旧市街の秋旅行に最適",
        "zh": "秋季游览河内古街区的好时机",
    },
    "뗏(구정) 연휴 (1~2월)": {
        "en": "Tet (Lunar New Year) holiday (January–February)",
        "ja": "テト（旧正月）連休（1〜2月）",
        "zh": "春节（农历新年）假期（1-2月）",
    },
    "다낭 국제 불꽃놀이 (4~6월)": {
        "en": "Da Nang International Fireworks Festival (April–June)",
        "ja": "ダナン国際花火大会（4〜6月）",
        "zh": "岘港国际烟火节（4-6月）",
    },
    "다낭 국제 불꽃놀이 대회 결선": {
        "en": "Da Nang International Fireworks Festival final",
        "ja": "ダナン国際花火大会決勝",
        "zh": "岘港国际烟火节决赛",
    },
    "마닐라 국제 영화제 (1월)": {
        "en": "Manila International Film Festival (January)",
        "ja": "マニラ国際映画祭（1月）",
        "zh": "马尼拉国际电影节（1月）",
    },
    "보라카이 아리아 다이빙 페스티벌": {
        "en": "Boracay Ariel Diving Festival",
        "ja": "ボラカイ・アリエルダイビングフェスティバル",
        "zh": "长滩岛阿里尔潜水节",
    },
    "시눌로그 축제 (1월 셋째 주 일요일)": {
        "en": "Sinulog Festival (third Sunday of January)",
        "ja": "シヌログ祭り（1月第3日曜日）",
        "zh": "西努洛节（1月第三个星期日）",
    },
    "냐피 — 발리 침묵의 날 (3~4월)": {
        "en": "Nyepi — Balinese Day of Silence (March–April)",
        "ja": "ニュピ — バリの沈黙の日（3〜4月）",
        "zh": "尼皮节 — 巴厘岛沉默日（3-4月）",
    },
    "발리 아츠 페스티벌 (6~7월)": {
        "en": "Bali Arts Festival (June–July)",
        "ja": "バリアーツフェスティバル（6〜7月）",
        "zh": "巴厘岛艺术节（6-7月）",
    },
    "우붓 음식 축제": {
        "en": "Ubud Food Festival",
        "ja": "ウブドフードフェスティバル",
        "zh": "乌布美食节",
    },
    "린자니 트레킹 최적기": {
        "en": "Best season for Mt. Rinjani trekking",
        "ja": "リンジャニ山トレッキング最適期",
        "zh": "林扎尼火山徒步的最佳时期",
    },
    "중국 설날 (1~2월)": {
        "en": "Chinese New Year (January–February)",
        "ja": "中国正月（1〜2月）",
        "zh": "农历新年（1-2月）",
    },
    "싱가포르 리버 홍바오": {
        "en": "Singapore River Hongbao",
        "ja": "シンガポール・リバー・ホンバオ",
        "zh": "新加坡河畔红包嘉年华",
    },
    "싱가포르 내셔널 데이 (8월 9일)": {
        "en": "Singapore National Day (August 9)",
        "ja": "シンガポール建国記念日（8月9日）",
        "zh": "新加坡国庆日（8月9日）",
    },
    "그레이트 싱가포르 세일": {
        "en": "Great Singapore Sale",
        "ja": "グレートシンガポールセール",
        "zh": "新加坡大减价",
    },
    # Tips
    "보온 용품과 핫팩 준비": {
        "en": "Bring warm accessories and hand warmers",
        "ja": "防寒グッズとカイロを準備",
        "zh": "准备保暖用品和暖手宝",
    },
    "선글라스와 모자 챙기기": {
        "en": "Bring sunglasses and a hat",
        "ja": "サングラスと帽子を忘れずに",
        "zh": "备好太阳镜和帽子",
    },
    "접이식 우산이나 우비 챙기기": {
        "en": "Bring a folding umbrella or rain poncho",
        "ja": "折りたたみ傘またはレインコートを準備",
        "zh": "携带折叠雨伞或雨衣",
    },
    "냉방이 잘 되는 숙소 선택 권장": {
        "en": "Choose well air-conditioned accommodation",
        "ja": "エアコンの効いた宿泊施設を選ぶことを推奨",
        "zh": "建议选择空调良好的住宿",
    },
    # Clothing advice
    "패딩, 두꺼운 코트, 방한용품 필수": {
        "en": "Down jacket, thick coat, and winter gear essential",
        "ja": "ダウンジャケット、厚手のコート、防寒用品必須",
        "zh": "羽绒服、厚外套、防寒用品必备",
    },
    "코트, 목도리, 장갑. 보온 레이어 필요": {
        "en": "Coat, scarf, and gloves. Warm layering needed",
        "ja": "コート、マフラー、手袋。保温レイヤーが必要",
        "zh": "大衣、围巾、手套，需要保暖分层穿搭",
    },
    "재킷, 니트, 긴바지. 아우터 필수": {
        "en": "Jacket, knitwear, and long pants. Outer layer essential",
        "ja": "ジャケット、ニット、長ズボン。アウター必須",
        "zh": "夹克、针织衫、长裤，外套必备",
    },
    "긴팔, 가벼운 재킷. 레이어드 추천": {
        "en": "Long sleeves and a light jacket. Layering recommended",
        "ja": "長袖と軽いジャケット。重ね着がおすすめ",
        "zh": "长袖衣物和轻便夹克，推荐分层穿搭",
    },
    "얇은 긴팔, 가디건. 아침저녁 쌀쌀할 수 있음": {
        "en": "Thin long sleeves and cardigan. Can be cool in the morning and evening",
        "ja": "薄手の長袖とカーディガン。朝夕は肌寒いことも",
        "zh": "薄长袖和开衫，早晚可能较凉",
    },
    "반팔, 얇은 긴바지. 자외선 차단 필수": {
        "en": "Short sleeves and light long pants. UV protection essential",
        "ja": "半袖と薄手の長ズボン。紫外線対策必須",
        "zh": "短袖和薄长裤，防晒必不可少",
    },
    "반팔, 반바지, 가벼운 원피스. 통풍 잘 되는 소재 추천": {
        "en": "T-shirts, shorts, light dresses. Breathable fabrics recommended",
        "ja": "半袖、ショートパンツ、軽いワンピース。通気性の良い素材がおすすめ",
        "zh": "短袖、短裤、轻便连衣裙，推荐透气材质",
    },
    # Taiwan specific
    "천등 축제": {
        "en": "Sky Lantern Festival",
        "ja": "天灯祭り",
        "zh": "天灯节",
    },
    "타이완 등불 축제 (핑시, 2월)": {
        "en": "Taiwan Lantern Festival (Pingxi, February)",
        "ja": "台湾ランタンフェスティバル（平溪、2月）",
        "zh": "台湾元宵灯会（平溪，2月）",
    },
    "타이완 등불 축제 (2월)": {
        "en": "Taiwan Lantern Festival (February)",
        "ja": "台湾ランタンフェスティバル（2月）",
        "zh": "台湾元宵灯会（2月）",
    },
    "타이루거 협곡 트레킹 시즌": {
        "en": "Taroko Gorge trekking season",
        "ja": "太魯閣峡谷トレッキングシーズン",
        "zh": "太鲁阁峡谷徒步季节",
    },
    "가오슝 빛의 축제 (1~2월)": {
        "en": "Kaohsiung Light Festival (January–February)",
        "ja": "高雄ライトフェスティバル（1〜2月）",
        "zh": "高雄灯光节（1-2月）",
    },
    # Australia events
    "시드니 신년 불꽃놀이": {
        "en": "Sydney New Year's Eve fireworks",
        "ja": "シドニー年越し花火",
        "zh": "悉尼新年烟火",
    },
    "오스트레일리안 오픈 테니스 (1월)": {
        "en": "Australian Open tennis (January)",
        "ja": "全豪オープンテニス（1月）",
        "zh": "澳大利亚网球公开赛（1月）",
    },
    "멜버른 푸드앤와인 페스티벌": {
        "en": "Melbourne Food and Wine Festival",
        "ja": "メルボルンフード&ワインフェスティバル",
        "zh": "墨尔本美食与葡萄酒节",
    },
    "그레이트배리어리프 다이빙 시즌": {
        "en": "Great Barrier Reef diving season",
        "ja": "グレートバリアリーフダイビングシーズン",
        "zh": "大堡礁潜水季节",
    },
    "케언즈 마르디그라 (6~7월)": {
        "en": "Cairns Mardi Gras (June–July)",
        "ja": "ケアンズマルディグラ（6〜7月）",
        "zh": "凯恩斯狂欢节（6-7月）",
    },
}


def translate_text(text, translations_dict):
    """Translate a single string, returning multilingual object."""
    if text in translations_dict:
        t = translations_dict[text]
        return {"ko": text, "en": t["en"], "ja": t["ja"], "zh": t["zh"]}
    else:
        # Return with placeholder translations if not found
        return {"ko": text, "en": text, "ja": text, "zh": text}


def translate_list(items, translations_dict):
    """Translate a list of strings."""
    return {
        "ko": items,
        "en": [translations_dict.get(item, {}).get("en", item) for item in items],
        "ja": [translations_dict.get(item, {}).get("ja", item) for item in items],
        "zh": [translations_dict.get(item, {}).get("zh", item) for item in items],
    }


def translate_entry(entry):
    """Convert a single travel comment entry to multilingual format."""
    result = {
        "regionId": entry["regionId"],
        "month": entry["month"],
        "rating": entry["rating"],
        "summary": translate_text(entry["summary"], SUMMARY_TRANSLATIONS),
        "highlights": translate_list(entry.get("highlights", []), FIELD_TRANSLATIONS),
        "cautions": translate_list(entry.get("cautions", []), FIELD_TRANSLATIONS),
        "events": translate_list(entry.get("events", []), FIELD_TRANSLATIONS),
        "tips": translate_list(entry.get("tips", []), FIELD_TRANSLATIONS),
        "clothingAdvice": translate_text(entry.get("clothingAdvice", ""), FIELD_TRANSLATIONS),
        "crowdLevel": entry["crowdLevel"],
        "priceLevel": entry["priceLevel"],
    }
    return result


def process_file(country):
    filepath = os.path.join(DATA_DIR, f"{country}.json")
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    translated = [translate_entry(entry) for entry in data]

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(translated, f, ensure_ascii=False, indent=2)

    print(f"Processed {country}.json: {len(translated)} entries")

    # Check for untranslated strings
    untranslated = []
    for entry in translated:
        for field in ["summary", "clothingAdvice"]:
            val = entry[field]
            if isinstance(val, dict) and val.get("en") == val.get("ko"):
                untranslated.append(f"  {entry['regionId']} month={entry['month']} {field}: {val['ko']}")
        for field in ["highlights", "cautions", "events", "tips"]:
            val = entry[field]
            if isinstance(val, dict):
                for i, ko_item in enumerate(val.get("ko", [])):
                    if ko_item and val.get("en", [])[i:i+1] == [ko_item]:
                        untranslated.append(f"  {entry['regionId']} month={entry['month']} {field}[{i}]: {ko_item}")

    if untranslated:
        print(f"  WARNING: {len(untranslated)} untranslated strings in {country}.json:")
        for u in untranslated[:10]:
            print(u)

    return len(untranslated)


COUNTRIES = ["japan", "thailand", "vietnam", "philippines", "indonesia", "singapore", "taiwan", "australia"]

total_untranslated = 0
for country in COUNTRIES:
    total_untranslated += process_file(country)

print(f"\nDone! Total untranslated strings: {total_untranslated}")
