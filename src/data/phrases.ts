export type Speaker = "m" | "f";

export type Phrase = {
  id: string;
  pl: string;
  th: string;
  pron: string;
  question?: boolean;
  note?: string;
  group?: string;
};

export type Category = {
  id: string;
  name: string;
  phrases: Phrase[];
};

const particle = {
  m: { s: "ครับ", sp: "kráp", q: "ครับ", qp: "kráp" },
  f: { s: "ค่ะ", sp: "khâ", q: "คะ", qp: "khá" },
} as const;

export function renderPhrase(phrase: Phrase, speaker: Speaker) {
  const bit = particle[speaker];
  const thP = phrase.question ? bit.q : bit.s;
  const prP = phrase.question ? bit.qp : bit.sp;
  return {
    thai: phrase.th.replaceAll("{p}", thP),
    pron: phrase.pron.replaceAll("{p}", prP),
  };
}

export const categories: Category[] = [
  {
    id: "szybkie",
    name: "Szybkie",
    phrases: [
      { id: "hi", pl: "Cześć", th: "สวัสดี{p}", pron: "sà-wàt-dii {p}", group: "Rozmowa" },
      {
        id: "good-day",
        pl: "Dzień dobry",
        th: "สวัสดี{p}",
        pron: "sà-wàt-dii {p}",
        group: "Rozmowa",
        note: "Tak samo jak cześć. Mówi się cały dzień.",
      },
      { id: "thanks", pl: "Dziękuję", th: "ขอบคุณ{p}", pron: "khàwp-khun {p}", group: "Rozmowa" },
      { id: "thanks-casual", pl: "Dzięki", th: "ขอบคุณนะ{p}", pron: "khàwp-khun ná {p}", group: "Rozmowa" },
      { id: "sorry", pl: "Przepraszam", th: "ขอโทษ{p}", pron: "khɔ̌ɔ-thôot {p}", group: "Rozmowa" },
      { id: "ok", pl: "Nie ma sprawy", th: "ไม่เป็นไร{p}", pron: "mâi bpen rai {p}", group: "Rozmowa" },
      { id: "yes", pl: "Tak", th: "ใช่{p}", pron: "châi {p}", group: "Rozmowa" },
      { id: "no", pl: "Nie", th: "ไม่ใช่{p}", pron: "mâi châi {p}", group: "Rozmowa" },
      { id: "understand", pl: "Nie rozumiem", th: "ไม่เข้าใจ{p}", pron: "mâi khâo jai {p}", group: "Rozmowa" },
      {
        id: "learning",
        pl: "Mówię tylko trochę i jeszcze się uczę",
        th: "พูดไทยได้นิดหน่อย และกำลังเรียนอยู่{p}",
        pron: "phûut thai dâai nít-nɔ̀i láe gam-lang rian yùu {p}",
        group: "Rozmowa",
      },
      { id: "slow", pl: "Mów wolniej", th: "พูดช้าๆ หน่อย{p}", pron: "phûut cháa-cháa nɔ̀i {p}", group: "Rozmowa" },
      { id: "this", pl: "Chcę to", th: "เอาอันนี้{p}", pron: "ao an níi {p}", group: "Jedzenie", note: "Wskaż palcem." },
      { id: "mild", pl: "Nieostre", th: "ไม่เผ็ด{p}", pron: "mâi phèt {p}", group: "Jedzenie" },
      { id: "water", pl: "Woda", th: "ขอน้ำเปล่า{p}", pron: "khɔ̌ɔ náam bplàao {p}", group: "Jedzenie" },
      { id: "bill", pl: "Rachunek", th: "เช็คบิล{p}", pron: "chék bin {p}", group: "Jedzenie" },
      {
        id: "toilet",
        pl: "Gdzie jest toaleta?",
        th: "ห้องน้ำอยู่ที่ไหน{p}",
        pron: "hông náam yùu thîi nǎi {p}",
        question: true,
        group: "Droga",
      },
      { id: "stop", pl: "Zatrzymaj tutaj", th: "จอดตรงนี้{p}", pron: "jàwt dtrong níi {p}", group: "Droga" },
      {
        id: "howmuch",
        pl: "Ile to kosztuje?",
        th: "เท่าไหร่{p}",
        pron: "tâo-rài {p}",
        question: true,
        group: "Droga",
      },
      { id: "meter", pl: "Włącz licznik", th: "เปิดมิเตอร์ด้วย{p}", pron: "bpòet mí-dtôe dûuai {p}", group: "Droga" },
      { id: "help", pl: "Pomocy", th: "ช่วยด้วย", pron: "chûuai dûuai", group: "Awaria" },
    ],
  },
  {
    id: "jedzenie",
    name: "Jedzenie",
    phrases: [
      { id: "want-chicken", pl: "Chcę kurczaka", th: "เอาไก่{p}", pron: "ao gài {p}", group: "Chcę" },
      { id: "want-beef", pl: "Chcę wołowinę", th: "เอาเนื้อ{p}", pron: "ao nʉ́a {p}", group: "Chcę" },
      { id: "want-pork", pl: "Chcę wieprzowinę", th: "เอาหมู{p}", pron: "ao mǔu {p}", group: "Chcę" },
      { id: "want-fish", pl: "Chcę rybę", th: "เอาปลา{p}", pron: "ao bplaa {p}", group: "Chcę" },
      { id: "want-shrimp", pl: "Chcę krewetki", th: "เอากุ้ง{p}", pron: "ao gûng {p}", group: "Chcę" },
      { id: "want-veg", pl: "Jem wege (jay)", th: "กินเจ{p}", pron: "gin jay {p}", group: "Chcę", note: "Bez mięsa i nabiału." },
      { id: "want-padthai", pl: "Chcę pad thai", th: "เอาผัดไทย{p}", pron: "ao phàt thai {p}", group: "Chcę" },
      { id: "want-friedrice", pl: "Chcę ryż smażony", th: "เอาข้าวผัด{p}", pron: "ao khâao phàt {p}", group: "Chcę" },
      { id: "want-tomyum", pl: "Chcę tom yum", th: "เอาต้มยำ{p}", pron: "ao dtôm yam {p}", group: "Chcę" },
      { id: "want-greencurry", pl: "Chcę zielone curry", th: "เอาแกงเขียวหวาน{p}", pron: "ao gaeng khǐaw wǎan {p}", group: "Chcę" },
      { id: "menu", pl: "Menu", th: "ขอเมนูหน่อย{p}", pron: "khɔ̌ɔ mee-nuu nɔ̀i {p}", group: "Przy stole" },
      { id: "notspicy", pl: "Nieostre", th: "ไม่เผ็ด{p}", pron: "mâi phèt {p}", group: "Ostrość" },
      { id: "littlespicy", pl: "Trochę ostre", th: "เผ็ดนิดหน่อย{p}", pron: "phèt nít nɔ̀i {p}", group: "Ostrość" },
      { id: "nospicy-atall", pl: "Bez chili", th: "ไม่ใส่พริก{p}", pron: "mâi sài phrík {p}", group: "Ostrość" },
      {
        id: "isspicy",
        pl: "Czy jest ostre?",
        th: "เผ็ดไหม{p}",
        pron: "phèt mǎi {p}",
        question: true,
        group: "Ostrość",
      },
      { id: "nocoriander", pl: "Bez kolendry", th: "ไม่ใส่ผักชี{p}", pron: "mâi sài phàk-chii {p}", group: "Ostrość" },
      { id: "water2", pl: "Woda", th: "ขอน้ำเปล่า{p}", pron: "khɔ̌ɔ náam bplàao {p}", group: "Przy stole" },
      { id: "delicious", pl: "Pyszne", th: "อร่อยมาก{p}", pron: "à-ròi mâak {p}", group: "Przy stole" },
      { id: "very-delicious", pl: "Bardzo pyszne", th: "อร่อยมากๆ{p}", pron: "à-ròi mâak-mâak {p}", group: "Przy stole" },
      { id: "full", pl: "Jestem pełny", th: "อิ่มแล้ว{p}", pron: "ìm láew {p}", group: "Przy stole" },
      { id: "bill2", pl: "Rachunek", th: "เช็คบิล{p}", pron: "chék bin {p}", group: "Przy stole" },
      { id: "this2", pl: "Chcę to", th: "เอาอันนี้{p}", pron: "ao an níi {p}", group: "Przy stole", note: "Wskaż palcem." },
    ],
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
        group: "Gdzie",
      },
      {
        id: "where-hotel",
        pl: "Gdzie jest hotel?",
        th: "โรงแรมอยู่ที่ไหน{p}",
        pron: "rohng raem yùu thîi nǎi {p}",
        question: true,
        group: "Gdzie",
      },
      {
        id: "where-station",
        pl: "Gdzie jest stacja?",
        th: "สถานีอยู่ที่ไหน{p}",
        pron: "sà-thǎa-nii yùu thîi nǎi {p}",
        question: true,
        group: "Gdzie",
      },
      {
        id: "where-airport",
        pl: "Gdzie jest lotnisko?",
        th: "สนามบินอยู่ที่ไหน{p}",
        pron: "sà-nǎam bin yùu thîi nǎi {p}",
        question: true,
        group: "Gdzie",
      },
      {
        id: "where-pharmacy",
        pl: "Gdzie jest apteka?",
        th: "ร้านขายยาอยู่ที่ไหน{p}",
        pron: "ráan khǎai yaa yùu thîi nǎi {p}",
        question: true,
        group: "Gdzie",
      },
      {
        id: "where-hospital",
        pl: "Gdzie jest szpital?",
        th: "โรงพยาบาลอยู่ที่ไหน{p}",
        pron: "rohng phá-yaa-baan yùu thîi nǎi {p}",
        question: true,
        group: "Gdzie",
      },
      { id: "left", pl: "W lewo", th: "เลี้ยวซ้าย{p}", pron: "líeow sáai {p}", group: "Jak jechać" },
      { id: "right", pl: "W prawo", th: "เลี้ยวขวา{p}", pron: "líeow khwǎa {p}", group: "Jak jechać" },
      { id: "straight", pl: "Prosto", th: "ตรงไป{p}", pron: "dtrong bpai {p}", group: "Jak jechać" },
      { id: "here", pl: "Zatrzymaj tutaj", th: "จอดตรงนี้{p}", pron: "jàwt dtrong níi {p}", group: "Jak jechać" },
      {
        id: "far",
        pl: "Czy to daleko?",
        th: "ไกลไหม{p}",
        pron: "glai mǎi {p}",
        question: true,
        group: "Jak jechać",
      },
      { id: "lost", pl: "Zgubiłem się", th: "หลงทาง{p}", pron: "lǒng thaang {p}", group: "Jak jechać" },
    ],
  },
  {
    id: "transport",
    name: "Taxi",
    phrases: [
      { id: "go-airport", pl: "Na lotnisko", th: "ไปสนามบิน{p}", pron: "bpai sà-nǎam bin {p}", group: "Dokąd" },
      { id: "go-hotel", pl: "Do hotelu", th: "ไปโรงแรม{p}", pron: "bpai rohng raem {p}", group: "Dokąd" },
      { id: "go-station", pl: "Na stację", th: "ไปสถานี{p}", pron: "bpai sà-thǎa-nii {p}", group: "Dokąd" },
      { id: "go-siam", pl: "Do Siam", th: "ไปสยาม{p}", pron: "bpai sà-yǎam {p}", group: "Dokąd" },
      { id: "meter2", pl: "Włącz licznik", th: "เปิดมิเตอร์ด้วย{p}", pron: "bpòet mí-dtôe dûuai {p}", group: "W aucie" },
      { id: "stop2", pl: "Zatrzymaj tutaj", th: "จอดตรงนี้{p}", pron: "jàwt dtrong níi {p}", group: "W aucie" },
      { id: "left2", pl: "W lewo", th: "เลี้ยวซ้าย{p}", pron: "líeow sáai {p}", group: "W aucie" },
      { id: "right2", pl: "W prawo", th: "เลี้ยวขวา{p}", pron: "líeow khwǎa {p}", group: "W aucie" },
      { id: "straight2", pl: "Prosto", th: "ตรงไป{p}", pron: "dtrong bpai {p}", group: "W aucie" },
      {
        id: "howmuch-taxi",
        pl: "Ile to kosztuje?",
        th: "เท่าไหร่{p}",
        pron: "tâo-rài {p}",
        question: true,
        group: "W aucie",
      },
    ],
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
        group: "Cena",
      },
      { id: "expensive", pl: "Za drogo", th: "แพงไป{p}", pron: "phaaeng bpai {p}", group: "Cena" },
      {
        id: "thanks-no",
        pl: "Dzięki, ale nie, za drogo",
        th: "ขอบคุณนะ{p} แต่ไม่เอา แพงไป",
        pron: "khàwp-khun ná {p} dtàae mâi ao phaaeng bpai",
        group: "Cena",
      },
      {
        id: "discount",
        pl: "Taniej?",
        th: "ลดหน่อยได้ไหม{p}",
        pron: "lót nàwy dâi mǎi {p}",
        question: true,
        group: "Cena",
      },
      { id: "take-this", pl: "Biorę to", th: "เอาอันนี้{p}", pron: "ao an níi {p}", group: "Cena", note: "Wskaż palcem." },
      { id: "looking", pl: "Tylko oglądam", th: "แค่ดู{p}", pron: "khâae duu {p}", group: "Cena" },
      { id: "bag", pl: "Do torby", th: "ใส่ถุง{p}", pron: "sài thǔng {p}", group: "Cena" },
    ],
  },
  {
    id: "hotel",
    name: "Hotel",
    phrases: [
      { id: "booking", pl: "Mam rezerwację", th: "จองไว้แล้ว{p}", pron: "jɔɔng wái láew {p}", group: "Recepcja" },
      { id: "key", pl: "Klucz", th: "ขอกุญแจหน่อย{p}", pron: "khɔ̌ɔ gun-jae nɔ̀i {p}", group: "Recepcja" },
      {
        id: "wifi",
        pl: "Jakie jest hasło do Wi-Fi?",
        th: "รหัสไวไฟคืออะไร{p}",
        pron: "rá-hàt wai-fai khʉʉ à-rai {p}",
        question: true,
        group: "Recepcja",
      },
      { id: "checkout", pl: "Wymeldowanie", th: "เช็คเอาท์{p}", pron: "chék àot {p}", group: "Recepcja" },
      {
        id: "towel",
        pl: "Ręcznik",
        th: "ขอผ้าเช็ดตัวหน่อย{p}",
        pron: "khɔ̌ɔ phâa chét dtuua nɔ̀i {p}",
        group: "Pokój",
      },
    ],
  },
  {
    id: "pomoc",
    name: "Pomoc",
    phrases: [
      { id: "help2", pl: "Pomocy", th: "ช่วยด้วย", pron: "chûuai dûuai", group: "Teraz" },
      { id: "police", pl: "Policja", th: "โทรตำรวจ", pron: "thoo dtam-rùat", group: "Teraz", note: "Numer 191." },
      { id: "doctor", pl: "Potrzebuję lekarza", th: "ต้องการหมอ{p}", pron: "dtông-gaan mɔ̌ɔ {p}", group: "Teraz" },
      { id: "hospital", pl: "Szpital", th: "โรงพยาบาล", pron: "rohng phá-yaa-baan", group: "Teraz" },
      { id: "sick", pl: "Źle się czuję", th: "ไม่สบาย{p}", pron: "mâi sà-baai {p}", group: "Teraz" },
      { id: "pharmacy2", pl: "Apteka", th: "ร้านขายยา", pron: "ráan khǎai yaa", group: "Teraz" },
    ],
  },
  {
    id: "liczby",
    name: "Liczby",
    phrases: [
      { id: "n1", pl: "1", th: "หนึ่ง", pron: "nèung", group: "1–10" },
      { id: "n2", pl: "2", th: "สอง", pron: "sǒng", group: "1–10" },
      { id: "n3", pl: "3", th: "สาม", pron: "sǎam", group: "1–10" },
      { id: "n4", pl: "4", th: "สี่", pron: "sìi", group: "1–10" },
      { id: "n5", pl: "5", th: "ห้า", pron: "hâa", group: "1–10" },
      { id: "n6", pl: "6", th: "หก", pron: "hòk", group: "1–10" },
      { id: "n7", pl: "7", th: "เจ็ด", pron: "jèt", group: "1–10" },
      { id: "n8", pl: "8", th: "แปด", pron: "bpàet", group: "1–10" },
      { id: "n9", pl: "9", th: "เก้า", pron: "gâo", group: "1–10" },
      { id: "n10", pl: "10", th: "สิบ", pron: "sìp", group: "1–10" },
      { id: "n20", pl: "20", th: "ยี่สิบ", pron: "yîi-sìp", group: "20–1000", note: "Nie „song sìp”." },
      { id: "n50", pl: "50", th: "ห้าสิบ", pron: "hâa-sìp", group: "20–1000" },
      { id: "n100", pl: "100", th: "ร้อย", pron: "rói", group: "20–1000" },
      { id: "n200", pl: "200", th: "สองร้อย", pron: "sǒng-rói", group: "20–1000" },
      { id: "n300", pl: "300", th: "สามร้อย", pron: "sǎam-rói", group: "20–1000" },
      { id: "n400", pl: "400", th: "สี่ร้อย", pron: "sìi-rói", group: "20–1000" },
      { id: "n500", pl: "500", th: "ห้าร้อย", pron: "hâa-rói", group: "20–1000" },
      { id: "n600", pl: "600", th: "หกร้อย", pron: "hòk-rói", group: "20–1000" },
      { id: "n700", pl: "700", th: "เจ็ดร้อย", pron: "jèt-rói", group: "20–1000" },
      { id: "n800", pl: "800", th: "แปดร้อย", pron: "bpàet-rói", group: "20–1000" },
      { id: "n900", pl: "900", th: "เก้าร้อย", pron: "gâo-rói", group: "20–1000" },
      { id: "n1000", pl: "1000", th: "พัน", pron: "phan", group: "20–1000" },
    ],
  },
  {
    id: "grzecznosc",
    name: "Grzeczność",
    phrases: [
      { id: "hi2", pl: "Cześć", th: "สวัสดี{p}", pron: "sà-wàt-dii {p}", group: "Dzień" },
      {
        id: "good-day2",
        pl: "Dzień dobry",
        th: "สวัสดี{p}",
        pron: "sà-wàt-dii {p}",
        group: "Dzień",
        note: "Tak samo jak cześć. Mówi się cały dzień.",
      },
      {
        id: "howareyou",
        pl: "Jak się masz?",
        th: "สบายดีไหม{p}",
        pron: "sà-baai dii mǎi {p}",
        question: true,
        group: "Dzień",
      },
      { id: "imfine", pl: "Wszystko dobrze", th: "สบายดี{p}", pron: "sà-baai dii {p}", group: "Dzień" },
      { id: "thanks2", pl: "Dziękuję", th: "ขอบคุณ{p}", pron: "khàwp-khun {p}", group: "Dzień" },
      { id: "thanks-casual2", pl: "Dzięki", th: "ขอบคุณนะ{p}", pron: "khàwp-khun ná {p}", group: "Dzień" },
      { id: "thanks-much", pl: "Bardzo dziękuję", th: "ขอบคุณมาก{p}", pron: "khàwp-khun mâak {p}", group: "Dzień" },
      { id: "sorry2", pl: "Przepraszam", th: "ขอโทษ{p}", pron: "khɔ̌ɔ-thôot {p}", group: "Dzień" },
      { id: "noproblem", pl: "Nie ma sprawy", th: "ไม่เป็นไร{p}", pron: "mâi bpen rai {p}", group: "Dzień" },
      { id: "bye", pl: "Do widzenia", th: "ลาก่อน{p}", pron: "laa-gɔ̀ɔn {p}", group: "Dzień" },
      { id: "nicetomeet", pl: "Miło cię poznać", th: "ยินดีที่ได้รู้จัก{p}", pron: "yin-dii thîi dâai rúu-jàk {p}", group: "Dzień" },
      { id: "no-thai", pl: "Nie mówię po tajsku", th: "พูดภาษาไทยไม่ได้{p}", pron: "phûut phaa-sǎa thai mâi dâi {p}", group: "Dzień" },
      {
        id: "learning2",
        pl: "Mówię tylko trochę i jeszcze się uczę",
        th: "พูดไทยได้นิดหน่อย และกำลังเรียนอยู่{p}",
        pron: "phûut thai dâai nít-nɔ̀i láe gam-lang rian yùu {p}",
        group: "Dzień",
      },
      { id: "english", pl: "Mówisz po angielsku?", th: "พูดภาษาอังกฤษได้ไหม{p}", pron: "phûut phaa-sǎa ang-grìt dâi mǎi {p}", question: true, group: "Dzień" },
    ],
  },
];

export function categoryById(id: string) {
  return categories.find((category) => category.id === id) ?? categories[0];
}
