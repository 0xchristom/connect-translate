import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Utensils, c as ShoppingBag, d as HeartPulse, f as Hash, i as Volume2, l as Search, m as BedDouble, n as X, p as Car, r as Waypoints, s as Star, t as Zap, u as MessageSquare } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Ol3BizwU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var particle$1 = {
	m: {
		s: "ครับ",
		sp: "kráp",
		q: "ครับ",
		qp: "kráp"
	},
	f: {
		s: "ค่ะ",
		sp: "khâ",
		q: "คะ",
		qp: "khá"
	}
};
function renderPhrase(phrase, speaker) {
	const bit = particle$1[speaker];
	const thP = phrase.question ? bit.q : bit.s;
	const prP = phrase.question ? bit.qp : bit.sp;
	return {
		thai: phrase.th.replaceAll("{p}", thP),
		pron: phrase.pron.replaceAll("{p}", prP)
	};
}
var categories = [
	{
		id: "szybkie",
		name: "Szybkie",
		phrases: [
			{
				id: "hi",
				pl: "Cześć",
				th: "สวัสดี{p}",
				pron: "sà-wàt-dii {p}",
				group: "Rozmowa"
			},
			{
				id: "thanks",
				pl: "Dziękuję",
				th: "ขอบคุณ{p}",
				pron: "khàwp-khun {p}",
				group: "Rozmowa"
			},
			{
				id: "sorry",
				pl: "Przepraszam",
				th: "ขอโทษ{p}",
				pron: "khɔ̌ɔ-thôot {p}",
				group: "Rozmowa"
			},
			{
				id: "ok",
				pl: "Nie ma sprawy",
				th: "ไม่เป็นไร{p}",
				pron: "mâi bpen rai {p}",
				group: "Rozmowa"
			},
			{
				id: "yes",
				pl: "Tak",
				th: "ใช่{p}",
				pron: "châi {p}",
				group: "Rozmowa"
			},
			{
				id: "no",
				pl: "Nie",
				th: "ไม่ใช่{p}",
				pron: "mâi châi {p}",
				group: "Rozmowa"
			},
			{
				id: "understand",
				pl: "Nie rozumiem",
				th: "ไม่เข้าใจ{p}",
				pron: "mâi khâo jai {p}",
				group: "Rozmowa"
			},
			{
				id: "slow",
				pl: "Mów wolniej",
				th: "พูดช้าๆ หน่อย{p}",
				pron: "phûut cháa-cháa nɔ̀i {p}",
				group: "Rozmowa"
			},
			{
				id: "this",
				pl: "Chcę to",
				th: "เอาอันนี้{p}",
				pron: "ao an níi {p}",
				group: "Jedzenie",
				note: "Wskaż palcem."
			},
			{
				id: "mild",
				pl: "Nieostre",
				th: "ไม่เผ็ด{p}",
				pron: "mâi phèt {p}",
				group: "Jedzenie"
			},
			{
				id: "water",
				pl: "Woda",
				th: "ขอน้ำเปล่า{p}",
				pron: "khɔ̌ɔ náam bplàao {p}",
				group: "Jedzenie"
			},
			{
				id: "bill",
				pl: "Rachunek",
				th: "เช็คบิล{p}",
				pron: "chék bin {p}",
				group: "Jedzenie"
			},
			{
				id: "toilet",
				pl: "Gdzie jest toaleta?",
				th: "ห้องน้ำอยู่ที่ไหน{p}",
				pron: "hông náam yùu thîi nǎi {p}",
				question: true,
				group: "Droga"
			},
			{
				id: "stop",
				pl: "Zatrzymaj tutaj",
				th: "จอดตรงนี้{p}",
				pron: "jàwt dtrong níi {p}",
				group: "Droga"
			},
			{
				id: "howmuch",
				pl: "Ile to kosztuje?",
				th: "เท่าไหร่{p}",
				pron: "tâo-rài {p}",
				question: true,
				group: "Droga"
			},
			{
				id: "meter",
				pl: "Włącz licznik",
				th: "เปิดมิเตอร์ด้วย{p}",
				pron: "bpòet mí-dtôe dûuai {p}",
				group: "Droga"
			},
			{
				id: "help",
				pl: "Pomocy",
				th: "ช่วยด้วย",
				pron: "chûuai dûuai",
				group: "Awaria"
			}
		]
	},
	{
		id: "jedzenie",
		name: "Jedzenie",
		phrases: [
			{
				id: "want-chicken",
				pl: "Chcę kurczaka",
				th: "เอาไก่{p}",
				pron: "ao gài {p}",
				group: "Chcę"
			},
			{
				id: "want-beef",
				pl: "Chcę wołowinę",
				th: "เอาเนื้อ{p}",
				pron: "ao nʉ́a {p}",
				group: "Chcę"
			},
			{
				id: "want-pork",
				pl: "Chcę wieprzowinę",
				th: "เอาหมู{p}",
				pron: "ao mǔu {p}",
				group: "Chcę"
			},
			{
				id: "want-fish",
				pl: "Chcę rybę",
				th: "เอาปลา{p}",
				pron: "ao bplaa {p}",
				group: "Chcę"
			},
			{
				id: "want-shrimp",
				pl: "Chcę krewetki",
				th: "เอากุ้ง{p}",
				pron: "ao gûng {p}",
				group: "Chcę"
			},
			{
				id: "want-veg",
				pl: "Jem wege (jay)",
				th: "กินเจ{p}",
				pron: "gin jay {p}",
				group: "Chcę",
				note: "Bez mięsa i nabiału."
			},
			{
				id: "want-padthai",
				pl: "Chcę pad thai",
				th: "เอาผัดไทย{p}",
				pron: "ao phàt thai {p}",
				group: "Chcę"
			},
			{
				id: "want-friedrice",
				pl: "Chcę ryż smażony",
				th: "เอาข้าวผัด{p}",
				pron: "ao khâao phàt {p}",
				group: "Chcę"
			},
			{
				id: "want-tomyum",
				pl: "Chcę tom yum",
				th: "เอาต้มยำ{p}",
				pron: "ao dtôm yam {p}",
				group: "Chcę"
			},
			{
				id: "want-greencurry",
				pl: "Chcę zielone curry",
				th: "เอาแกงเขียวหวาน{p}",
				pron: "ao gaeng khǐaw wǎan {p}",
				group: "Chcę"
			},
			{
				id: "menu",
				pl: "Menu",
				th: "ขอเมนูหน่อย{p}",
				pron: "khɔ̌ɔ mee-nuu nɔ̀i {p}",
				group: "Przy stole"
			},
			{
				id: "notspicy",
				pl: "Nieostre",
				th: "ไม่เผ็ด{p}",
				pron: "mâi phèt {p}",
				group: "Ostrość"
			},
			{
				id: "littlespicy",
				pl: "Trochę ostre",
				th: "เผ็ดนิดหน่อย{p}",
				pron: "phèt nít nɔ̀i {p}",
				group: "Ostrość"
			},
			{
				id: "nospicy-atall",
				pl: "Bez chili",
				th: "ไม่ใส่พริก{p}",
				pron: "mâi sài phrík {p}",
				group: "Ostrość"
			},
			{
				id: "isspicy",
				pl: "Czy jest ostre?",
				th: "เผ็ดไหม{p}",
				pron: "phèt mǎi {p}",
				question: true,
				group: "Ostrość"
			},
			{
				id: "nocoriander",
				pl: "Bez kolendry",
				th: "ไม่ใส่ผักชี{p}",
				pron: "mâi sài phàk-chii {p}",
				group: "Ostrość"
			},
			{
				id: "water2",
				pl: "Woda",
				th: "ขอน้ำเปล่า{p}",
				pron: "khɔ̌ɔ náam bplàao {p}",
				group: "Przy stole"
			},
			{
				id: "delicious",
				pl: "Pyszne",
				th: "อร่อยมาก{p}",
				pron: "à-ròi mâak {p}",
				group: "Przy stole"
			},
			{
				id: "full",
				pl: "Jestem pełny",
				th: "อิ่มแล้ว{p}",
				pron: "ìm láew {p}",
				group: "Przy stole"
			},
			{
				id: "bill2",
				pl: "Rachunek",
				th: "เช็คบิล{p}",
				pron: "chék bin {p}",
				group: "Przy stole"
			},
			{
				id: "this2",
				pl: "Chcę to",
				th: "เอาอันนี้{p}",
				pron: "ao an níi {p}",
				group: "Przy stole",
				note: "Wskaż palcem."
			}
		]
	},
	{
		id: "kierunki",
		name: "Kierunki",
		phrases: [
			{
				id: "where-toilet",
				pl: "Gdzie jest toaleta?",
				th: "ห้องน้ำอยู่ที่ไหน{p}",
				pron: "hông náam yùu thîi nǎi {p}",
				question: true,
				group: "Gdzie"
			},
			{
				id: "where-hotel",
				pl: "Gdzie jest hotel?",
				th: "โรงแรมอยู่ที่ไหน{p}",
				pron: "rohng raem yùu thîi nǎi {p}",
				question: true,
				group: "Gdzie"
			},
			{
				id: "where-station",
				pl: "Gdzie jest stacja?",
				th: "สถานีอยู่ที่ไหน{p}",
				pron: "sà-thǎa-nii yùu thîi nǎi {p}",
				question: true,
				group: "Gdzie"
			},
			{
				id: "where-airport",
				pl: "Gdzie jest lotnisko?",
				th: "สนามบินอยู่ที่ไหน{p}",
				pron: "sà-nǎam bin yùu thîi nǎi {p}",
				question: true,
				group: "Gdzie"
			},
			{
				id: "where-pharmacy",
				pl: "Gdzie jest apteka?",
				th: "ร้านขายยาอยู่ที่ไหน{p}",
				pron: "ráan khǎai yaa yùu thîi nǎi {p}",
				question: true,
				group: "Gdzie"
			},
			{
				id: "where-hospital",
				pl: "Gdzie jest szpital?",
				th: "โรงพยาบาลอยู่ที่ไหน{p}",
				pron: "rohng phá-yaa-baan yùu thîi nǎi {p}",
				question: true,
				group: "Gdzie"
			},
			{
				id: "left",
				pl: "W lewo",
				th: "เลี้ยวซ้าย{p}",
				pron: "líeow sáai {p}",
				group: "Jak jechać"
			},
			{
				id: "right",
				pl: "W prawo",
				th: "เลี้ยวขวา{p}",
				pron: "líeow khwǎa {p}",
				group: "Jak jechać"
			},
			{
				id: "straight",
				pl: "Prosto",
				th: "ตรงไป{p}",
				pron: "dtrong bpai {p}",
				group: "Jak jechać"
			},
			{
				id: "here",
				pl: "Zatrzymaj tutaj",
				th: "จอดตรงนี้{p}",
				pron: "jàwt dtrong níi {p}",
				group: "Jak jechać"
			},
			{
				id: "far",
				pl: "Czy to daleko?",
				th: "ไกลไหม{p}",
				pron: "glai mǎi {p}",
				question: true,
				group: "Jak jechać"
			},
			{
				id: "lost",
				pl: "Zgubiłem się",
				th: "หลงทาง{p}",
				pron: "lǒng thaang {p}",
				group: "Jak jechać"
			}
		]
	},
	{
		id: "transport",
		name: "Taxi",
		phrases: [
			{
				id: "go-airport",
				pl: "Na lotnisko",
				th: "ไปสนามบิน{p}",
				pron: "bpai sà-nǎam bin {p}",
				group: "Dokąd"
			},
			{
				id: "go-hotel",
				pl: "Do hotelu",
				th: "ไปโรงแรม{p}",
				pron: "bpai rohng raem {p}",
				group: "Dokąd"
			},
			{
				id: "go-station",
				pl: "Na stację",
				th: "ไปสถานี{p}",
				pron: "bpai sà-thǎa-nii {p}",
				group: "Dokąd"
			},
			{
				id: "go-siam",
				pl: "Do Siam",
				th: "ไปสยาม{p}",
				pron: "bpai sà-yǎam {p}",
				group: "Dokąd"
			},
			{
				id: "meter2",
				pl: "Włącz licznik",
				th: "เปิดมิเตอร์ด้วย{p}",
				pron: "bpòet mí-dtôe dûuai {p}",
				group: "W aucie"
			},
			{
				id: "stop2",
				pl: "Zatrzymaj tutaj",
				th: "จอดตรงนี้{p}",
				pron: "jàwt dtrong níi {p}",
				group: "W aucie"
			},
			{
				id: "left2",
				pl: "W lewo",
				th: "เลี้ยวซ้าย{p}",
				pron: "líeow sáai {p}",
				group: "W aucie"
			},
			{
				id: "right2",
				pl: "W prawo",
				th: "เลี้ยวขวา{p}",
				pron: "líeow khwǎa {p}",
				group: "W aucie"
			},
			{
				id: "straight2",
				pl: "Prosto",
				th: "ตรงไป{p}",
				pron: "dtrong bpai {p}",
				group: "W aucie"
			},
			{
				id: "howmuch-taxi",
				pl: "Ile to kosztuje?",
				th: "เท่าไหร่{p}",
				pron: "tâo-rài {p}",
				question: true,
				group: "W aucie"
			}
		]
	},
	{
		id: "zakupy",
		name: "Zakupy",
		phrases: [
			{
				id: "price",
				pl: "Ile to kosztuje?",
				th: "ราคาเท่าไหร่{p}",
				pron: "raa-khaa tâo-rài {p}",
				question: true,
				group: "Cena"
			},
			{
				id: "expensive",
				pl: "Za drogo",
				th: "แพงไป{p}",
				pron: "phaaeng bpai {p}",
				group: "Cena"
			},
			{
				id: "discount",
				pl: "Taniej?",
				th: "ลดหน่อยได้ไหม{p}",
				pron: "lót nàwy dâi mǎi {p}",
				question: true,
				group: "Cena"
			},
			{
				id: "take-this",
				pl: "Biorę to",
				th: "เอาอันนี้{p}",
				pron: "ao an níi {p}",
				group: "Cena",
				note: "Wskaż palcem."
			},
			{
				id: "looking",
				pl: "Tylko oglądam",
				th: "แค่ดู{p}",
				pron: "khâae duu {p}",
				group: "Cena"
			},
			{
				id: "bag",
				pl: "Do torby",
				th: "ใส่ถุง{p}",
				pron: "sài thǔng {p}",
				group: "Cena"
			}
		]
	},
	{
		id: "hotel",
		name: "Hotel",
		phrases: [
			{
				id: "booking",
				pl: "Mam rezerwację",
				th: "จองไว้แล้ว{p}",
				pron: "jɔɔng wái láew {p}",
				group: "Recepcja"
			},
			{
				id: "key",
				pl: "Klucz",
				th: "ขอกุญแจหน่อย{p}",
				pron: "khɔ̌ɔ gun-jae nɔ̀i {p}",
				group: "Recepcja"
			},
			{
				id: "wifi",
				pl: "Jakie jest hasło do Wi-Fi?",
				th: "รหัสไวไฟคืออะไร{p}",
				pron: "rá-hàt wai-fai khʉʉ à-rai {p}",
				question: true,
				group: "Recepcja"
			},
			{
				id: "checkout",
				pl: "Wymeldowanie",
				th: "เช็คเอาท์{p}",
				pron: "chék àot {p}",
				group: "Recepcja"
			},
			{
				id: "towel",
				pl: "Ręcznik",
				th: "ขอผ้าเช็ดตัวหน่อย{p}",
				pron: "khɔ̌ɔ phâa chét dtuua nɔ̀i {p}",
				group: "Pokój"
			}
		]
	},
	{
		id: "pomoc",
		name: "Pomoc",
		phrases: [
			{
				id: "help2",
				pl: "Pomocy",
				th: "ช่วยด้วย",
				pron: "chûuai dûuai",
				group: "Teraz"
			},
			{
				id: "police",
				pl: "Policja",
				th: "โทรตำรวจ",
				pron: "thoo dtam-rùat",
				group: "Teraz",
				note: "Numer 191."
			},
			{
				id: "doctor",
				pl: "Potrzebuję lekarza",
				th: "ต้องการหมอ{p}",
				pron: "dtông-gaan mɔ̌ɔ {p}",
				group: "Teraz"
			},
			{
				id: "hospital",
				pl: "Szpital",
				th: "โรงพยาบาล",
				pron: "rohng phá-yaa-baan",
				group: "Teraz"
			},
			{
				id: "sick",
				pl: "Źle się czuję",
				th: "ไม่สบาย{p}",
				pron: "mâi sà-baai {p}",
				group: "Teraz"
			},
			{
				id: "pharmacy2",
				pl: "Apteka",
				th: "ร้านขายยา",
				pron: "ráan khǎai yaa",
				group: "Teraz"
			}
		]
	},
	{
		id: "liczby",
		name: "Liczby",
		phrases: [
			{
				id: "n1",
				pl: "1",
				th: "หนึ่ง",
				pron: "nèung",
				group: "0–10"
			},
			{
				id: "n2",
				pl: "2",
				th: "สอง",
				pron: "sǒng",
				group: "0–10"
			},
			{
				id: "n3",
				pl: "3",
				th: "สาม",
				pron: "sǎam",
				group: "0–10"
			},
			{
				id: "n4",
				pl: "4",
				th: "สี่",
				pron: "sìi",
				group: "0–10"
			},
			{
				id: "n5",
				pl: "5",
				th: "ห้า",
				pron: "hâa",
				group: "0–10"
			},
			{
				id: "n6",
				pl: "6",
				th: "หก",
				pron: "hòk",
				group: "0–10"
			},
			{
				id: "n7",
				pl: "7",
				th: "เจ็ด",
				pron: "jèt",
				group: "0–10"
			},
			{
				id: "n8",
				pl: "8",
				th: "แปด",
				pron: "bpàet",
				group: "0–10"
			},
			{
				id: "n9",
				pl: "9",
				th: "เก้า",
				pron: "gâo",
				group: "0–10"
			},
			{
				id: "n10",
				pl: "10",
				th: "สิบ",
				pron: "sìp",
				group: "0–10"
			},
			{
				id: "n20",
				pl: "20",
				th: "ยี่สิบ",
				pron: "yîi-sìp",
				group: "Więcej",
				note: "Nie „song sìp”."
			},
			{
				id: "n100",
				pl: "100",
				th: "ร้อย",
				pron: "rói",
				group: "Więcej"
			},
			{
				id: "n1000",
				pl: "1000",
				th: "พัน",
				pron: "phan",
				group: "Więcej"
			}
		]
	},
	{
		id: "grzecznosc",
		name: "Grzeczność",
		phrases: [
			{
				id: "hi2",
				pl: "Cześć",
				th: "สวัสดี{p}",
				pron: "sà-wàt-dii {p}",
				group: "Dzień"
			},
			{
				id: "howareyou",
				pl: "Jak się masz?",
				th: "สบายดีไหม{p}",
				pron: "sà-baai dii mǎi {p}",
				question: true,
				group: "Dzień"
			},
			{
				id: "imfine",
				pl: "Wszystko dobrze",
				th: "สบายดี{p}",
				pron: "sà-baai dii {p}",
				group: "Dzień"
			},
			{
				id: "thanks2",
				pl: "Dziękuję",
				th: "ขอบคุณ{p}",
				pron: "khàwp-khun {p}",
				group: "Dzień"
			},
			{
				id: "thanks-much",
				pl: "Bardzo dziękuję",
				th: "ขอบคุณมาก{p}",
				pron: "khàwp-khun mâak {p}",
				group: "Dzień"
			},
			{
				id: "sorry2",
				pl: "Przepraszam",
				th: "ขอโทษ{p}",
				pron: "khɔ̌ɔ-thôot {p}",
				group: "Dzień"
			},
			{
				id: "noproblem",
				pl: "Nie ma sprawy",
				th: "ไม่เป็นไร{p}",
				pron: "mâi bpen rai {p}",
				group: "Dzień"
			},
			{
				id: "bye",
				pl: "Do widzenia",
				th: "ลาก่อน{p}",
				pron: "laa-gɔ̀ɔn {p}",
				group: "Dzień"
			},
			{
				id: "nicetomeet",
				pl: "Miło cię poznać",
				th: "ยินดีที่ได้รู้จัก{p}",
				pron: "yin-dii thîi dâai rúu-jàk {p}",
				group: "Dzień"
			},
			{
				id: "no-thai",
				pl: "Nie mówię po tajsku",
				th: "พูดภาษาไทยไม่ได้{p}",
				pron: "phûut phaa-sǎa thai mâi dâi {p}",
				group: "Dzień"
			},
			{
				id: "english",
				pl: "Mówisz po angielsku?",
				th: "พูดภาษาอังกฤษได้ไหม{p}",
				pron: "phûut phaa-sǎa ang-grìt dâi mǎi {p}",
				question: true,
				group: "Dzień"
			}
		]
	}
];
var particle = {
	m: {
		th: "ครับ",
		say: "krap",
		gloss: "cząstka grzeczności. Ton wysoki i krótki."
	},
	f: {
		th: "ค่ะ",
		say: "kha",
		gloss: "cząstka grzeczności. Ton w dół."
	},
	q: {
		th: "คะ",
		say: "kha",
		gloss: "cząstka w pytaniu. Ton w górę."
	}
};
var P = {
	th: "{p}",
	say: "",
	gloss: ""
};
function w(th, say, gloss) {
	return {
		th,
		say,
		gloss
	};
}
function where(th, say, gloss) {
	return [
		w(th, say, gloss),
		w("อยู่", "ju", "znajduje się. Ton niski."),
		w("ที่ไหน", "ti-naj", "gdzie. „ti” niski, „naj” w górę."),
		P
	];
}
function here() {
	return [
		w("จอด", "dżot", "zatrzymaj. Ton niski."),
		w("ตรงนี้", "trong-ni", "tutaj. „ni” ton wysoki."),
		P
	];
}
function meter() {
	return [
		w("เปิด", "poet", "włącz. Ton niski."),
		w("มิเตอร์", "mi-to", "licznik. „mi” wysoki."),
		w("ด้วย", "duaj", "też / proszę. Ton opadający."),
		P
	];
}
function help() {
	return [w("ช่วย", "czuaj", "pomóż. Ton opadający."), w("ด้วย", "duaj", "proszę. Ton opadający.")];
}
var WORDS = {
	hi: [w("สวัสดี", "sa-wat-di", "cześć. Tony: niski, niski, równy."), P],
	hi2: [w("สวัสดี", "sa-wat-di", "cześć. Tony: niski, niski, równy."), P],
	thanks: [w("ขอบคุณ", "kap-kun", "dziękuję. Ton opadający, potem równy."), P],
	thanks2: [w("ขอบคุณ", "kap-kun", "dziękuję. Ton opadający, potem równy."), P],
	"thanks-much": [
		w("ขอบคุณ", "kap-kun", "dziękuję."),
		w("มาก", "mak", "bardzo. Ton opadający."),
		P
	],
	sorry: [w("ขอโทษ", "ko-tot", "przepraszam. Ton w górę, potem w dół."), P],
	sorry2: [w("ขอโทษ", "ko-tot", "przepraszam. Ton w górę, potem w dół."), P],
	ok: [
		w("ไม่", "maj", "nie. Ton opadający."),
		w("เป็น", "pen", "jest. Ton niski."),
		w("ไร", "raj", "sprawa. Ton równy."),
		P
	],
	noproblem: [
		w("ไม่", "maj", "nie. Ton opadający."),
		w("เป็น", "pen", "jest. Ton niski."),
		w("ไร", "raj", "sprawa. Ton równy."),
		P
	],
	yes: [w("ใช่", "czaj", "tak. Ton opadający."), P],
	no: [
		w("ไม่", "maj", "nie. Ton opadający."),
		w("ใช่", "czaj", "tak. Ton opadający."),
		P
	],
	understand: [
		w("ไม่", "maj", "nie."),
		w("เข้าใจ", "kao-dżaj", "rozumieć. Ton opadający, potem równy."),
		P
	],
	slow: [
		w("พูด", "put", "mówić. Ton opadający."),
		w("ช้าๆ", "cza-cza", "wolno. Ton w górę, dwa razy."),
		w("หน่อย", "noj", "trochę. Ton niski."),
		P
	],
	this: [
		w("เอา", "ao", "biorę. Ton równy."),
		w("อันนี้", "an-ni", "to. „ni” ton wysoki."),
		P
	],
	this2: [
		w("เอา", "ao", "biorę. Ton równy."),
		w("อันนี้", "an-ni", "to. „ni” ton wysoki."),
		P
	],
	"take-this": [
		w("เอา", "ao", "biorę."),
		w("อันนี้", "an-ni", "to."),
		P
	],
	mild: [
		w("ไม่", "maj", "nie."),
		w("เผ็ด", "pet", "ostre. Ton wysoki."),
		P
	],
	notspicy: [
		w("ไม่", "maj", "nie."),
		w("เผ็ด", "pet", "ostre. Ton wysoki."),
		P
	],
	water: [
		w("ขอ", "ko", "proszę. Ton w górę."),
		w("น้ำเปล่า", "nam-plao", "woda. „nam” wysoki, „plao” niski."),
		P
	],
	water2: [
		w("ขอ", "ko", "proszę."),
		w("น้ำเปล่า", "nam-plao", "woda niegazowana."),
		P
	],
	bill: [
		w("เช็ค", "czek", "sprawdzić."),
		w("บิล", "bin", "rachunek. Ton równy."),
		P
	],
	bill2: [
		w("เช็ค", "czek", "sprawdzić."),
		w("บิล", "bin", "rachunek."),
		P
	],
	toilet: where("ห้องน้ำ", "hong-nam", "toaleta. „nam” ton wysoki."),
	"where-toilet": where("ห้องน้ำ", "hong-nam", "toaleta."),
	stop: here(),
	stop2: here(),
	here: here(),
	howmuch: [w("เท่าไหร่", "tao-raj", "ile. Ton opadający, potem opadający."), P],
	"howmuch-taxi": [w("เท่าไหร่", "tao-raj", "ile."), P],
	meter: meter(),
	meter2: meter(),
	help: help(),
	help2: help(),
	"want-chicken": [
		w("เอา", "ao", "biorę."),
		w("ไก่", "gaj", "kurczak. Ton opadający."),
		P
	],
	"want-beef": [
		w("เอา", "ao", "biorę."),
		w("เนื้อ", "nya", "wołowina. Usta zaokrąglone, ton wysoki."),
		P
	],
	"want-pork": [
		w("เอา", "ao", "biorę."),
		w("หมู", "mu", "wieprzowina. Ton w górę."),
		P
	],
	"want-fish": [
		w("เอา", "ao", "biorę."),
		w("ปลา", "pla", "ryba. Ton równy."),
		P
	],
	"want-shrimp": [
		w("เอา", "ao", "biorę."),
		w("กุ้ง", "gung", "krewetka. Ton opadający."),
		P
	],
	"want-veg": [
		w("กิน", "gin", "jem. Ton równy."),
		w("เจ", "dżej", "wege bez mięsa. Ton równy."),
		P
	],
	"want-padthai": [
		w("เอา", "ao", "biorę."),
		w("ผัดไทย", "pat-taj", "pad thai. „pat” niski."),
		P
	],
	"want-friedrice": [
		w("เอา", "ao", "biorę."),
		w("ข้าวผัด", "kao-pat", "ryż smażony."),
		P
	],
	"want-tomyum": [
		w("เอา", "ao", "biorę."),
		w("ต้มยำ", "tom-jam", "tom yum."),
		P
	],
	"want-greencurry": [
		w("เอา", "ao", "biorę."),
		w("แกงเขียวหวาน", "geng-kiao-łan", "zielone curry. „kiao” i „łan” w górę."),
		P
	],
	menu: [
		w("ขอ", "ko", "proszę."),
		w("เมนู", "me-nu", "menu. Ton równy."),
		w("หน่อย", "noj", "trochę."),
		P
	],
	littlespicy: [
		w("เผ็ด", "pet", "ostre."),
		w("นิดหน่อย", "nit-noj", "troszeczkę."),
		P
	],
	"nospicy-atall": [
		w("ไม่", "maj", "nie."),
		w("ใส่", "saj", "dodawać. Ton niski."),
		w("พริก", "prik", "chili. Ton wysoki."),
		P
	],
	isspicy: [
		w("เผ็ด", "pet", "ostre."),
		w("ไหม", "maj", "czy? Ton w górę, nie opadający."),
		P
	],
	nocoriander: [
		w("ไม่", "maj", "nie."),
		w("ใส่", "saj", "dodawać."),
		w("ผักชี", "pak-czi", "kolendra."),
		P
	],
	delicious: [
		w("อร่อย", "a-roj", "pyszne. Ton niski, potem opadający."),
		w("มาก", "mak", "bardzo."),
		P
	],
	full: [
		w("อิ่ม", "im", "syty. Ton niski."),
		w("แล้ว", "laew", "już. Ton wysoki."),
		P
	],
	"where-hotel": where("โรงแรม", "rong-raem", "hotel."),
	"where-station": where("สถานี", "sa-ta-ni", "stacja."),
	"where-airport": where("สนามบิน", "sa-nam-bin", "lotnisko."),
	"where-pharmacy": where("ร้านขายยา", "ran-kaj-ja", "apteka. „kaj” ton w górę."),
	"where-hospital": where("โรงพยาบาล", "rong-pa-ja-ban", "szpital."),
	left: [
		w("เลี้ยว", "liao", "skręć. Ton wysoki."),
		w("ซ้าย", "saj", "lewo. Ton wysoki."),
		P
	],
	left2: [
		w("เลี้ยว", "liao", "skręć."),
		w("ซ้าย", "saj", "lewo."),
		P
	],
	right: [
		w("เลี้ยว", "liao", "skręć."),
		w("ขวา", "kwa", "prawo. Ton w górę."),
		P
	],
	right2: [
		w("เลี้ยว", "liao", "skręć."),
		w("ขวา", "kwa", "prawo."),
		P
	],
	straight: [
		w("ตรง", "trong", "prosto. Ton równy."),
		w("ไป", "paj", "idź. Ton równy."),
		P
	],
	straight2: [
		w("ตรง", "trong", "prosto."),
		w("ไป", "paj", "idź."),
		P
	],
	far: [
		w("ไกล", "glaj", "daleko. Ton równy."),
		w("ไหม", "maj", "czy? Ton w górę."),
		P
	],
	lost: [
		w("หลง", "long", "zgubić się. Ton w górę."),
		w("ทาง", "tang", "droga. Ton równy."),
		P
	],
	"go-airport": [
		w("ไป", "paj", "jechać."),
		w("สนามบิน", "sa-nam-bin", "lotnisko."),
		P
	],
	"go-hotel": [
		w("ไป", "paj", "jechać."),
		w("โรงแรม", "rong-raem", "hotel."),
		P
	],
	"go-station": [
		w("ไป", "paj", "jechać."),
		w("สถานี", "sa-ta-ni", "stacja."),
		P
	],
	"go-siam": [
		w("ไป", "paj", "jechać."),
		w("สยาม", "sa-jam", "Siam. „jam” ton w górę."),
		P
	],
	price: [
		w("ราคา", "ra-ka", "cena. Ton równy."),
		w("เท่าไหร่", "tao-raj", "ile."),
		P
	],
	expensive: [
		w("แพง", "peng", "drogo. Ton równy."),
		w("ไป", "paj", "za bardzo."),
		P
	],
	discount: [
		w("ลด", "lot", "obniżyć. Ton wysoki."),
		w("หน่อย", "noj", "trochę."),
		w("ได้", "daj", "można. Ton opadający."),
		w("ไหม", "maj", "czy? Ton w górę."),
		P
	],
	looking: [
		w("แค่", "ke", "tylko. Ton opadający."),
		w("ดู", "du", "oglądać. Ton równy."),
		P
	],
	bag: [
		w("ใส่", "saj", "włożyć."),
		w("ถุง", "tung", "torba. Ton w górę."),
		P
	],
	booking: [
		w("จอง", "dżong", "rezerwować. Ton równy."),
		w("ไว้", "waj", "już ustalone. Ton wysoki."),
		w("แล้ว", "laew", "już."),
		P
	],
	key: [
		w("ขอ", "ko", "proszę."),
		w("กุญแจ", "gun-dże", "klucz."),
		w("หน่อย", "noj", "trochę."),
		P
	],
	wifi: [
		w("รหัส", "ra-hat", "kod. Ton wysoki, potem niski."),
		w("ไวไฟ", "waj-faj", "wi-fi."),
		w("คือ", "ky", "to jest. Usta zaokrąglone, ton równy."),
		w("อะไร", "a-raj", "co."),
		P
	],
	checkout: [w("เช็คเอาท์", "czek-aut", "wymeldowanie."), P],
	towel: [
		w("ขอ", "ko", "proszę."),
		w("ผ้า", "pa", "tkanina. Ton opadający."),
		w("เช็ดตัว", "czet-tua", "ręcznik do ciała."),
		w("หน่อย", "noj", "trochę."),
		P
	],
	police: [w("โทร", "to", "dzwonić. Ton równy."), w("ตำรวจ", "tam-ruat", "policja. „ruat” ton niski.")],
	doctor: [
		w("ต้องการ", "tong-gan", "potrzebuję."),
		w("หมอ", "mo", "lekarz. Ton w górę."),
		P
	],
	hospital: [w("โรงพยาบาล", "rong-pa-ja-ban", "szpital.")],
	sick: [
		w("ไม่", "maj", "nie."),
		w("สบาย", "sa-baj", "dobrze się czuć. Ton niski, potem równy."),
		P
	],
	pharmacy2: [
		w("ร้าน", "ran", "sklep. Ton wysoki."),
		w("ขาย", "kaj", "sprzedawać. Ton w górę."),
		w("ยา", "ja", "lekarstwo. Ton równy.")
	],
	n1: [w("หนึ่ง", "nung", "jeden. Ton niski.")],
	n2: [w("สอง", "song", "dwa. Ton w górę.")],
	n3: [w("สาม", "sam", "trzy. Ton w górę.")],
	n4: [w("สี่", "si", "cztery. Ton niski.")],
	n5: [w("ห้า", "ha", "pięć. Ton opadający.")],
	n6: [w("หก", "hok", "sześć. Ton niski.")],
	n7: [w("เจ็ด", "dżet", "siedem. Ton niski.")],
	n8: [w("แปด", "pet", "osiem. Ton niski. Inne niż „pet” = ostre.")],
	n9: [w("เก้า", "gao", "dziewięć. Ton opadający.")],
	n10: [w("สิบ", "sip", "dziesięć. Ton niski.")],
	n20: [w("ยี่", "ji", "dwa przed dziesiątką. Ton opadający."), w("สิบ", "sip", "dziesięć. Nie mów „song sip”.")],
	n100: [w("ร้อย", "roj", "sto. Ton wysoki.")],
	n1000: [w("พัน", "pan", "tysiąc. Ton równy.")],
	howareyou: [
		w("สบายดี", "sa-baj-di", "wszystko dobrze?"),
		w("ไหม", "maj", "czy? Ton w górę."),
		P
	],
	imfine: [w("สบายดี", "sa-baj-di", "dobrze."), P],
	bye: [w("ลาก่อน", "la-gon", "do widzenia. Ton równy, potem niski."), P],
	nicetomeet: [
		w("ยินดี", "jin-di", "miło."),
		w("ที่ได้", "ti-daj", "że mogłem."),
		w("รู้จัก", "ru-dżak", "poznać."),
		P
	],
	"no-thai": [
		w("พูด", "put", "mówić."),
		w("ภาษา", "pa-sa", "język. „sa” ton w górę."),
		w("ไทย", "taj", "tajski. Ton równy."),
		w("ไม่ได้", "maj-daj", "nie umiem."),
		P
	],
	english: [
		w("พูด", "put", "mówić."),
		w("ภาษา", "pa-sa", "język."),
		w("อังกฤษ", "ang-grit", "angielski. „grit” ton niski."),
		w("ได้ไหม", "daj-maj", "czy umiesz? „maj” w górę."),
		P
	]
};
function coachWords(phrase, speaker) {
	const raw = WORDS[phrase.id] ?? [];
	const bit = speaker === "m" ? particle.m : phrase.question ? particle.q : particle.f;
	return raw.map((word) => word.th === "{p}" ? {
		th: bit.th,
		say: bit.say,
		gloss: bit.gloss
	} : word);
}
function sayLine(phrase, speaker) {
	return coachWords(phrase, speaker).map((word) => word.say).join(" ");
}
var audioMap = {
	"กิน": "f75afbf51fc1.mp3",
	"กินเจครับ": "5b5889cc43c4.mp3",
	"กินเจค่ะ": "fa969200fd26.mp3",
	"กุญแจ": "f53896531502.mp3",
	"กุ้ง": "e22d0c2603b2.mp3",
	"ขวา": "4bd1fc4f3d39.mp3",
	"ขอ": "7306e1707ee6.mp3",
	"ขอกุญแจหน่อยครับ": "573749e7aded.mp3",
	"ขอกุญแจหน่อยค่ะ": "5975e173b6c8.mp3",
	"ขอน้ำเปล่าครับ": "71b98454b105.mp3",
	"ขอน้ำเปล่าค่ะ": "60d763d48a7c.mp3",
	"ขอบคุณ": "87eeb6a8c32c.mp3",
	"ขอบคุณครับ": "a1dc6a926588.mp3",
	"ขอบคุณค่ะ": "319fdb565247.mp3",
	"ขอบคุณมากครับ": "5d8686e80ba2.mp3",
	"ขอบคุณมากค่ะ": "88ea83d42792.mp3",
	"ขอผ้าเช็ดตัวหน่อยครับ": "14369c229374.mp3",
	"ขอผ้าเช็ดตัวหน่อยค่ะ": "f58848fdbac6.mp3",
	"ขอเมนูหน่อยครับ": "ad10f1a38fb3.mp3",
	"ขอเมนูหน่อยค่ะ": "c00f7656b392.mp3",
	"ขอโทษ": "fd047e167960.mp3",
	"ขอโทษครับ": "443f84590d4b.mp3",
	"ขอโทษค่ะ": "af1d0a2fd7f2.mp3",
	"ขาย": "1e878b5c4074.mp3",
	"ข้าวผัด": "ae75112c4761.mp3",
	"ครับ": "2dce0151d656.mp3",
	"คะ": "e8945e760d45.mp3",
	"คือ": "0ef67cd768e4.mp3",
	"ค่ะ": "fbd3f12059e6.mp3",
	"จอง": "74e3a9d360a6.mp3",
	"จองไว้แล้วครับ": "003c4d1cfa31.mp3",
	"จองไว้แล้วค่ะ": "7a08bf0f0dd2.mp3",
	"จอด": "9bbe12dd1ee2.mp3",
	"จอดตรงนี้ครับ": "166a550ba3c6.mp3",
	"จอดตรงนี้ค่ะ": "e34037a4bbc5.mp3",
	"ช่วย": "d570b4454f43.mp3",
	"ช่วยด้วย": "a1d4cce0fd3d.mp3",
	"ช้าๆ": "26edc60ee2f1.mp3",
	"ซ้าย": "9bb0d0531bae.mp3",
	"ดู": "27ef78088a1e.mp3",
	"ด้วย": "ec3c1d66d693.mp3",
	"ตรง": "29801ba5f6ec.mp3",
	"ตรงนี้": "3c8e82267ff1.mp3",
	"ตรงไปครับ": "7729fc867f48.mp3",
	"ตรงไปค่ะ": "666a05add89c.mp3",
	"ตำรวจ": "22d0079f545e.mp3",
	"ต้มยำ": "a2fc6b6b032b.mp3",
	"ต้องการ": "986558813ba1.mp3",
	"ต้องการหมอครับ": "2102cbd8a06e.mp3",
	"ต้องการหมอค่ะ": "011730852860.mp3",
	"ถุง": "12482644ee13.mp3",
	"ทาง": "7db9aa59de8a.mp3",
	"ที่ได้": "9c649122e767.mp3",
	"ที่ไหน": "9feec3cf081c.mp3",
	"นิดหน่อย": "a7aef1949488.mp3",
	"น้ำเปล่า": "5703cf14a8db.mp3",
	"บิล": "14331dfcfa80.mp3",
	"ปลา": "241ba57e92ed.mp3",
	"ผักชี": "e01249905635.mp3",
	"ผัดไทย": "49f552655e1c.mp3",
	"ผ้า": "180c430da1f2.mp3",
	"พริก": "88c0fa7ffb2d.mp3",
	"พัน": "1cff8b0fe181.mp3",
	"พูด": "5bc9b7819e8b.mp3",
	"พูดช้าๆ หน่อยครับ": "cfbefc559e27.mp3",
	"พูดช้าๆ หน่อยค่ะ": "631c6f66f036.mp3",
	"พูดภาษาอังกฤษได้ไหมครับ": "65b6f06132dd.mp3",
	"พูดภาษาอังกฤษได้ไหมคะ": "ccb65cb3daf2.mp3",
	"พูดภาษาไทยไม่ได้ครับ": "e4592f5f1e5b.mp3",
	"พูดภาษาไทยไม่ได้ค่ะ": "c517b68dabc4.mp3",
	"ภาษา": "485e684ba650.mp3",
	"มาก": "8d2b538d3c4a.mp3",
	"มิเตอร์": "aa57f4f540a2.mp3",
	"ยา": "9db6d07c01c5.mp3",
	"ยินดี": "84a6c3aed0fd.mp3",
	"ยินดีที่ได้รู้จักครับ": "75178810430c.mp3",
	"ยินดีที่ได้รู้จักค่ะ": "9f954a3b69ce.mp3",
	"ยี่": "b4528a145f9b.mp3",
	"ยี่สิบ": "62beb0e4ae38.mp3",
	"รหัส": "e53901d0f5c4.mp3",
	"รหัสไวไฟคืออะไรครับ": "035525cf5dba.mp3",
	"รหัสไวไฟคืออะไรคะ": "8281e8d9df81.mp3",
	"ราคา": "90f8318d4f9e.mp3",
	"ราคาเท่าไหร่ครับ": "c4cd81b17462.mp3",
	"ราคาเท่าไหร่คะ": "1ebf7ded231b.mp3",
	"รู้จัก": "0f02bea766b4.mp3",
	"ร้อย": "f570d4ce2288.mp3",
	"ร้าน": "0ff21b9cd6a6.mp3",
	"ร้านขายยา": "9fd02100924c.mp3",
	"ร้านขายยาอยู่ที่ไหนครับ": "9ef921470fec.mp3",
	"ร้านขายยาอยู่ที่ไหนคะ": "8f2ff6a3ad25.mp3",
	"ลด": "b9fe26b64c76.mp3",
	"ลดหน่อยได้ไหมครับ": "5c58984522c6.mp3",
	"ลดหน่อยได้ไหมคะ": "2345afb44551.mp3",
	"ลาก่อน": "bf0a0836c47e.mp3",
	"ลาก่อนครับ": "26992a9860a3.mp3",
	"ลาก่อนค่ะ": "afadb3882611.mp3",
	"สถานี": "69c0dcc02ba7.mp3",
	"สถานีอยู่ที่ไหนครับ": "874bce6cc35a.mp3",
	"สถานีอยู่ที่ไหนคะ": "6cfee3579b97.mp3",
	"สนามบิน": "e0188c94459a.mp3",
	"สนามบินอยู่ที่ไหนครับ": "a5b3506a1bc1.mp3",
	"สนามบินอยู่ที่ไหนคะ": "b2a89d7586cf.mp3",
	"สบาย": "431e1902da00.mp3",
	"สบายดี": "d34a46e071e5.mp3",
	"สบายดีครับ": "ddb4f1125027.mp3",
	"สบายดีค่ะ": "448a1e8b34bd.mp3",
	"สบายดีไหมครับ": "27461689898d.mp3",
	"สบายดีไหมคะ": "00964a266472.mp3",
	"สยาม": "cedeb606b0e9.mp3",
	"สวัสดี": "c7bcb12d8b1e.mp3",
	"สวัสดีครับ": "8ab6d7aa5798.mp3",
	"สวัสดีค่ะ": "8bb5cd7fbc00.mp3",
	"สอง": "1b6312dfb0dc.mp3",
	"สาม": "4a988146cba0.mp3",
	"สิบ": "e58a65066c5d.mp3",
	"สี่": "f3824698d62a.mp3",
	"หก": "6b34cc3722dc.mp3",
	"หนึ่ง": "27ff8aebddfd.mp3",
	"หน่อย": "690b0837ce72.mp3",
	"หมอ": "b7a7cc65af00.mp3",
	"หมู": "69f470e8af93.mp3",
	"หลง": "d20d40907f7e.mp3",
	"หลงทางครับ": "937dc25497b9.mp3",
	"หลงทางค่ะ": "292a4afe4236.mp3",
	"ห้องน้ำ": "089cf102a2fc.mp3",
	"ห้องน้ำอยู่ที่ไหนครับ": "35642a9b91ea.mp3",
	"ห้องน้ำอยู่ที่ไหนคะ": "e49c86f53bdd.mp3",
	"ห้า": "8af79cb3e9c1.mp3",
	"อยู่": "906ad03eb0ea.mp3",
	"อร่อย": "b0aa12723eb1.mp3",
	"อร่อยมากครับ": "cd6d8b5d6db0.mp3",
	"อร่อยมากค่ะ": "33771a3726fd.mp3",
	"อะไร": "b63888f23292.mp3",
	"อังกฤษ": "548ccd8431f5.mp3",
	"อันนี้": "c1d4a4751171.mp3",
	"อิ่ม": "e1e28e354d87.mp3",
	"อิ่มแล้วครับ": "f2285b030879.mp3",
	"อิ่มแล้วค่ะ": "fa15fcace93d.mp3",
	"เก้า": "6d375c8d4d56.mp3",
	"เข้าใจ": "474d9aa750c2.mp3",
	"เจ": "499cba80c074.mp3",
	"เจ็ด": "8939c3186613.mp3",
	"เช็ค": "7f846e66b033.mp3",
	"เช็คบิลครับ": "ce9c1169db4a.mp3",
	"เช็คบิลค่ะ": "209100f034a1.mp3",
	"เช็คเอาท์": "1979dad5ac11.mp3",
	"เช็คเอาท์ครับ": "d490b9aed715.mp3",
	"เช็คเอาท์ค่ะ": "0baf22823a5d.mp3",
	"เช็ดตัว": "f9cbaf17f0f0.mp3",
	"เท่าไหร่": "e8c762951b22.mp3",
	"เท่าไหร่ครับ": "8210eb2918fe.mp3",
	"เท่าไหร่คะ": "8f5fa9c3ed55.mp3",
	"เนื้อ": "2a9aa587b0ab.mp3",
	"เปิด": "22aadbcdfd23.mp3",
	"เปิดมิเตอร์ด้วยครับ": "6d929be381f2.mp3",
	"เปิดมิเตอร์ด้วยค่ะ": "91347a560bd3.mp3",
	"เป็น": "f15d6f0da2ab.mp3",
	"เผ็ด": "f29312f51251.mp3",
	"เผ็ดนิดหน่อยครับ": "9c59521ca9bc.mp3",
	"เผ็ดนิดหน่อยค่ะ": "b38525fa54c4.mp3",
	"เผ็ดไหมครับ": "d7a7797e8a3c.mp3",
	"เผ็ดไหมคะ": "14b1832923e7.mp3",
	"เมนู": "62d123cbab58.mp3",
	"เลี้ยว": "2e1ac5394ff0.mp3",
	"เลี้ยวขวาครับ": "d52579cfe29d.mp3",
	"เลี้ยวขวาค่ะ": "c4dc438a5769.mp3",
	"เลี้ยวซ้ายครับ": "652c82f060f3.mp3",
	"เลี้ยวซ้ายค่ะ": "db27a92644a1.mp3",
	"เอา": "bd47c8ff3ddf.mp3",
	"เอากุ้งครับ": "9b0ef4978fc1.mp3",
	"เอากุ้งค่ะ": "6bdc874be851.mp3",
	"เอาข้าวผัดครับ": "c901024de7f2.mp3",
	"เอาข้าวผัดค่ะ": "693c5a112025.mp3",
	"เอาต้มยำครับ": "5c7699235c5c.mp3",
	"เอาต้มยำค่ะ": "9f4edbea8234.mp3",
	"เอาปลาครับ": "d5c3f19f6784.mp3",
	"เอาปลาค่ะ": "e5c8ee49422b.mp3",
	"เอาผัดไทยครับ": "30b40f1b6e1b.mp3",
	"เอาผัดไทยค่ะ": "29cb72c2a838.mp3",
	"เอาหมูครับ": "0bebce952b92.mp3",
	"เอาหมูค่ะ": "021eee3e0118.mp3",
	"เอาอันนี้ครับ": "c41d2b8849c7.mp3",
	"เอาอันนี้ค่ะ": "76cdbe4a60bd.mp3",
	"เอาเนื้อครับ": "f60dacc3819c.mp3",
	"เอาเนื้อค่ะ": "284ca442691b.mp3",
	"เอาแกงเขียวหวานครับ": "fbba72bc390e.mp3",
	"เอาแกงเขียวหวานค่ะ": "b92aa05f817d.mp3",
	"เอาไก่ครับ": "a604737fd971.mp3",
	"เอาไก่ค่ะ": "3a388dababfb.mp3",
	"แกงเขียวหวาน": "bcf139f58c22.mp3",
	"แค่": "dae1c3ab25ee.mp3",
	"แค่ดูครับ": "daa262306e50.mp3",
	"แค่ดูค่ะ": "79a4e1264ca4.mp3",
	"แปด": "b3cad9ee482d.mp3",
	"แพง": "0f8da0e4d226.mp3",
	"แพงไปครับ": "981213d0e243.mp3",
	"แพงไปค่ะ": "5090ff991e90.mp3",
	"แล้ว": "354ea34dd510.mp3",
	"โทร": "cf0900aad2f2.mp3",
	"โทรตำรวจ": "6e66edbae2af.mp3",
	"โรงพยาบาล": "0635f16b796a.mp3",
	"โรงพยาบาลอยู่ที่ไหนครับ": "f113ff134391.mp3",
	"โรงพยาบาลอยู่ที่ไหนคะ": "fa222fd681ca.mp3",
	"โรงแรม": "e62e33d9272b.mp3",
	"โรงแรมอยู่ที่ไหนครับ": "3cead05e912b.mp3",
	"โรงแรมอยู่ที่ไหนคะ": "2a0cf6b5e856.mp3",
	"ใช่": "2d09568c105e.mp3",
	"ใช่ครับ": "3874b8d0778d.mp3",
	"ใช่ค่ะ": "7b6a0b4b7557.mp3",
	"ใส่": "f3f7661e54bd.mp3",
	"ใส่ถุงครับ": "792da170ee1c.mp3",
	"ใส่ถุงค่ะ": "6574117a97f9.mp3",
	"ไกล": "04a8a6e58b0e.mp3",
	"ไกลไหมครับ": "8fa74d7b118b.mp3",
	"ไกลไหมคะ": "14bd7ffc649a.mp3",
	"ไก่": "29230e883044.mp3",
	"ได้": "d45e7f861da0.mp3",
	"ได้ไหม": "4acd8848ca39.mp3",
	"ไทย": "7160c86e7097.mp3",
	"ไป": "ed56a62b357b.mp3",
	"ไปสถานีครับ": "fce1c2ba6933.mp3",
	"ไปสถานีค่ะ": "59d3c0f4c166.mp3",
	"ไปสนามบินครับ": "8cb164d82b94.mp3",
	"ไปสนามบินค่ะ": "4f29e123d484.mp3",
	"ไปสยามครับ": "99d9f9ae1cee.mp3",
	"ไปสยามค่ะ": "8cf7170bbad1.mp3",
	"ไปโรงแรมครับ": "b1c626390c35.mp3",
	"ไปโรงแรมค่ะ": "562d02fe0246.mp3",
	"ไม่": "d73fba748e7c.mp3",
	"ไม่สบายครับ": "f4c63907b727.mp3",
	"ไม่สบายค่ะ": "cf2a280e9613.mp3",
	"ไม่เข้าใจครับ": "758045e29764.mp3",
	"ไม่เข้าใจค่ะ": "1ae96a1da368.mp3",
	"ไม่เป็นไรครับ": "4ef1f5e1065d.mp3",
	"ไม่เป็นไรค่ะ": "8afeaba7312b.mp3",
	"ไม่เผ็ดครับ": "25077bf17253.mp3",
	"ไม่เผ็ดค่ะ": "49acba47ae25.mp3",
	"ไม่ใช่ครับ": "88d04d18d3b0.mp3",
	"ไม่ใช่ค่ะ": "d75cb85a3290.mp3",
	"ไม่ใส่ผักชีครับ": "495b35e3ba85.mp3",
	"ไม่ใส่ผักชีค่ะ": "f12d0f5096a3.mp3",
	"ไม่ใส่พริกครับ": "1272a0e2a05f.mp3",
	"ไม่ใส่พริกค่ะ": "3f17032b6f16.mp3",
	"ไม่ได้": "7870ebb563b3.mp3",
	"ไร": "eee0e744abda.mp3",
	"ไวไฟ": "c01b4a3f72ea.mp3",
	"ไว้": "59f2ed4182cf.mp3",
	"ไหม": "4a80f2d01629.mp3"
};
var audio = null;
var current = null;
var listeners = /* @__PURE__ */ new Set();
var errors = /* @__PURE__ */ new Set();
function emit(text) {
	current = text;
	for (const listener of listeners) listener(text);
}
function fail(message) {
	for (const listener of errors) listener(message);
}
function engineSpeak(text) {
	const synth = window.speechSynthesis;
	if (!synth) return false;
	const utter = new SpeechSynthesisUtterance(text);
	utter.lang = "th-TH";
	utter.rate = .86;
	const voice = synth.getVoices().find((item) => item.lang.toLowerCase().startsWith("th")) ?? null;
	if (voice) utter.voice = voice;
	utter.onend = () => emit(null);
	utter.onerror = () => {
		emit(null);
		fail("Ta przeglądarka nie ma głosu tajskiego.");
	};
	if (synth.speaking || synth.pending) synth.cancel();
	window.setTimeout(() => {
		if (synth.paused) synth.resume();
		synth.speak(utter);
	}, 60);
	return true;
}
function playThai(text) {
	fail(null);
	if (current === text && audio && !audio.paused) {
		audio.pause();
		emit(null);
		return;
	}
	const file = audioMap[text];
	if (!file) {
		emit(text);
		if (!engineSpeak(text)) {
			emit(null);
			fail("Brak nagrania tego słowa.");
		}
		return;
	}
	if (!audio) audio = new Audio();
	audio.pause();
	audio.src = "/audio/" + file;
	audio.onended = () => emit(null);
	audio.onerror = () => {
		emit(null);
		if (!engineSpeak(text)) fail("Nie udało się odtworzyć nagrania.");
	};
	emit(text);
	audio.play().catch(() => {
		emit(null);
		if (!engineSpeak(text)) fail("Przeglądarka zablokowała dźwięk.");
	});
}
function onPlaying(listener) {
	listeners.add(listener);
	listener(current);
	return () => {
		listeners.delete(listener);
	};
}
function onPlayError(listener) {
	errors.add(listener);
	return () => {
		errors.delete(listener);
	};
}
var SPEAKER_KEY = "powiedz-speaker";
var FAV_KEY = "powiedz-favs";
var LAST_KEY = "powiedz-last";
var ICONS = {
	szybkie: Zap,
	jedzenie: Utensils,
	kierunki: Waypoints,
	transport: Car,
	zakupy: ShoppingBag,
	hotel: BedDouble,
	pomoc: HeartPulse,
	liczby: Hash,
	grzecznosc: MessageSquare
};
function allPhrases() {
	return categories.flatMap((category) => category.phrases.map((phrase) => ({
		...phrase,
		categoryId: category.id,
		categoryName: category.name
	})));
}
function speakThai(text) {
	playThai(text);
}
function Phrasebook() {
	const pool = (0, import_react.useMemo)(allPhrases, []);
	const [speaker, setSpeaker] = (0, import_react.useState)("m");
	const [favs, setFavs] = (0, import_react.useState)([]);
	const [categoryId, setCategoryId] = (0, import_react.useState)("szybkie");
	const [phraseId, setPhraseId] = (0, import_react.useState)(categories[0].phrases[0].id);
	const [query, setQuery] = (0, import_react.useState)("");
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [playing, setPlaying] = (0, import_react.useState)(null);
	const [playError, setPlayError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => onPlaying(setPlaying), []);
	(0, import_react.useEffect)(() => onPlayError(setPlayError), []);
	(0, import_react.useEffect)(() => {
		const savedSpeaker = localStorage.getItem(SPEAKER_KEY);
		if (savedSpeaker === "m" || savedSpeaker === "f") setSpeaker(savedSpeaker);
		const savedFavs = localStorage.getItem(FAV_KEY);
		if (savedFavs) try {
			const parsed = JSON.parse(savedFavs);
			if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) setFavs(parsed);
		} catch {}
		const last = localStorage.getItem(LAST_KEY);
		if (last) {
			const found = pool.find((phrase) => phrase.id === last);
			if (found) {
				setPhraseId(found.id);
				setCategoryId(found.categoryId);
			}
		}
		setHydrated(true);
	}, [pool]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(SPEAKER_KEY, speaker);
	}, [speaker, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(FAV_KEY, JSON.stringify(favs));
	}, [favs, hydrated]);
	const favoritePhrases = (0, import_react.useMemo)(() => favs.map((id) => pool.find((phrase) => phrase.id === id)).filter((phrase) => Boolean(phrase)), [favs, pool]);
	const activeCategory = categoryId === "moje" ? {
		id: "moje",
		name: "Moje",
		phrases: favoritePhrases
	} : categories.find((category) => category.id === categoryId) ?? categories[0];
	const q = query.trim().toLowerCase();
	const visible = q ? pool.filter((phrase) => phrase.pl.toLowerCase().includes(q) || sayLine(phrase, speaker).toLowerCase().includes(q) || phrase.th.replaceAll("{p}", "").includes(query.trim()) || phrase.categoryName.toLowerCase().includes(q)) : activeCategory.phrases.map((phrase) => ({
		...phrase,
		categoryId: activeCategory.id,
		categoryName: activeCategory.name
	}));
	const current = pool.find((phrase) => phrase.id === phraseId) ?? pool[0];
	const spoken = renderPhrase(current, speaker);
	const howToSay = sayLine(current, speaker);
	const favored = favs.includes(current.id);
	function openPhrase(phrase) {
		setPhraseId(phrase.id);
		localStorage.setItem(LAST_KEY, phrase.id);
		if (phrase.categoryId !== "moje") setCategoryId(phrase.categoryId);
	}
	function selectCategory(id) {
		setQuery("");
		setCategoryId(id);
		const first = (id === "moje" ? favoritePhrases : categories.find((category) => category.id === id)?.phrases ?? [])[0];
		if (!first) return;
		setPhraseId(first.id);
		localStorage.setItem(LAST_KEY, first.id);
	}
	function step(delta) {
		if (visible.length === 0) return;
		const index = Math.max(0, visible.findIndex((phrase) => phrase.id === current.id));
		const next = visible[(index + delta + visible.length) % visible.length];
		openPhrase(next);
	}
	function toggleFav() {
		setFavs((prev) => prev.includes(current.id) ? prev.filter((id) => id !== current.id) : [current.id, ...prev]);
	}
	let lastGroup = "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex h-dvh max-w-5xl flex-col bg-bg text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 border-b border-line bg-surface px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted",
						children: "Powiedz to"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex rounded-md bg-bg p-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-9 flex-1 rounded-sm text-sm font-medium " + (speaker === "m" ? "bg-accent text-accent-fg" : "text-muted"),
							onClick: () => setSpeaker("m"),
							children: "Mężczyzna"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-9 flex-1 rounded-sm text-sm font-medium " + (speaker === "f" ? "bg-accent text-accent-fg" : "text-muted"),
							onClick: () => setSpeaker("f"),
							children: "Kobieta"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex h-11 min-w-0 flex-1 items-center gap-2 rounded-md border border-line bg-bg px-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "size-4 shrink-0 text-muted",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (event) => setQuery(event.target.value),
							placeholder: "Szukaj zdania",
							className: "w-full bg-transparent text-sm outline-none placeholder:text-muted",
							"aria-label": "Szukaj zdania"
						}),
						query ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Wyczyść",
							onClick: () => setQuery(""),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 text-muted" })
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col md:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex shrink-0 flex-col bg-card text-card-fg " + (expanded ? "min-h-0 flex-1" : "h-80 md:h-auto md:w-[46%]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "phrase-in flex min-h-0 flex-1 flex-col justify-between px-5 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-card-muted",
									children: current.pl
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": favored ? "Usuń z moich" : "Zapisz w moich",
									onClick: toggleFav,
									className: "grid size-11 place-items-center rounded-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
										className: "size-5",
										fill: favored ? "currentColor" : "none"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center font-medium leading-tight " + (expanded ? "text-6xl" : "text-4xl"),
								children: spoken.thai
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-center text-base font-medium",
									children: ["Powiedz: ", howToSay]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-sm text-card-muted",
									children: spoken.pron
								}),
								current.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-center text-sm text-card-muted",
									children: current.note
								}) : null
							] })
						]
					}, current.id + speaker), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2 px-3 pb-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 rounded-md bg-surface/10 text-sm font-medium",
								onClick: () => step(-1),
								children: "Poprzednie"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex h-11 items-center justify-center gap-2 rounded-md bg-accent-fg text-sm font-medium text-ink",
								onClick: () => playThai(spoken.thai),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
									className: "size-4",
									"aria-hidden": "true"
								}), playing === spoken.thai ? "Stop" : "Posłuchaj"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 rounded-md bg-surface/10 text-sm font-medium",
								onClick: () => step(1),
								children: "Następne"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "col-span-3 h-11 rounded-md border border-card-muted/40 text-sm font-medium",
								onClick: () => setExpanded((value) => !value),
								children: expanded ? "Wróć do listy" : "Pokaż osobie — cały ekran"
							}),
							playError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "col-span-3 text-center text-xs text-card-muted",
								children: playError
							}) : null
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "min-h-0 flex-1 overflow-y-auto bg-bg " + (expanded ? "hidden md:block" : ""),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordCoach, {
						phrase: current,
						speaker
					}, current.id + speaker), visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 py-8 text-center text-sm text-muted",
						children: categoryId === "moje" && !q ? "Gwiazdka na karcie zapisuje zdanie tutaj, żeby było pod ręką." : "Nic nie pasuje. Spróbuj innego słowa."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: visible.map((phrase) => {
						const showGroup = !q && phrase.group && phrase.group !== lastGroup;
						if (phrase.group) lastGroup = phrase.group;
						const active = phrase.id === current.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [showGroup ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-4 pt-4 pb-1 text-xs font-medium tracking-wide text-muted",
							children: phrase.group
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => openPhrase(phrase),
							className: "flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left " + (active ? "bg-accent text-accent-fg" : "bg-surface"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-base font-medium",
									children: phrase.pl
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm " + (active ? "text-accent-fg/80" : "text-muted"),
									children: sayLine(phrase, speaker)
								})]
							}), q ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs " + (active ? "text-accent-fg/80" : "text-muted"),
								children: phrase.categoryName
							}) : null]
						})] }, phrase.id + phrase.categoryId);
					}) })]
				})]
			}),
			expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto border-t border-line bg-surface px-2 py-2 md:hidden",
				children: visible.map((phrase) => {
					const active = phrase.id === current.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => openPhrase(phrase),
						className: "h-11 shrink-0 rounded-md px-3 text-sm font-medium " + (active ? "bg-accent text-accent-fg" : "text-ink"),
						children: phrase.pl
					}, phrase.id);
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex gap-1 overflow-x-auto border-t border-line bg-surface px-2 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockButton, {
					label: "Moje",
					active: categoryId === "moje" && !q,
					onClick: () => selectCategory("moje"),
					icon: Star
				}), categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockButton, {
					label: category.name,
					active: categoryId === category.id && !q,
					onClick: () => selectCategory(category.id),
					icon: ICONS[category.id] ?? Zap
				}, category.id))]
			})
		]
	});
}
function WordCoach({ phrase, speaker }) {
	const words = coachWords(phrase, speaker);
	const [index, setIndex] = (0, import_react.useState)(0);
	const word = words[index];
	if (!word) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sticky top-0 z-10 border-b border-line bg-surface px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium text-muted",
				children: "Jak powiedzieć — stuknij słowo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex gap-2 overflow-x-auto",
				children: words.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setIndex(i);
						speakThai(item.th);
					},
					className: "h-14 shrink-0 rounded-md px-3 text-left " + (i === index ? "bg-accent text-accent-fg" : "bg-bg text-ink"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-medium",
						children: item.say
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs " + (i === index ? "text-accent-fg/80" : "text-muted"),
						children: item.th
					})]
				}, item.th + String(i)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm",
				children: word.gloss
			})
		]
	});
}
function DockButton({ label, active, onClick, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex h-14 min-w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md px-2 text-xs font-medium " + (active ? "bg-accent text-accent-fg" : "text-muted"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-4",
			"aria-hidden": "true"
		}), label]
	});
}
var SplitComponent = Phrasebook;
//#endregion
export { SplitComponent as component };
