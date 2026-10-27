export type Speaker = "m" | "f";

/** Odpowiedź, którą rozmówca może wskazać na ekranie, gdy angielski nie działa. */
export type Answer = { th: string; pl: string };

export type Phrase = {
  id: string;
  /** Polski; `{em|am}` = forma męska | żeńska, zależnie od tego, kto mówi. */
  pl: string;
  th: string;
  pron: string;
  question?: boolean;
  note?: string;
  group?: string;
  /** Typowe odpowiedzi do wskazania palcem w trybie „Pokaż osobie”. */
  answers?: readonly Answer[];
  /** Rozmówca wpisuje kwotę na klawiaturze. */
  price?: boolean;
};

export type Category = {
  id: string;
  name: string;
  phrases: Phrase[];
};

const particle = {
  m: { s: "ครับ", sp: "khráp", q: "ครับ", qp: "khráp" },
  f: { s: "ค่ะ", sp: "khâ", q: "คะ", qp: "khá" },
} as const;

export function renderPhrase(phrase: Phrase, speaker: Speaker) {
  const bit = particle[speaker];
  const thP = phrase.question ? bit.q : bit.s;
  const prP = phrase.question ? bit.qp : bit.sp;
  return {
    // Po „นะ” kobieta mówi „คะ” (wysoki ton), nie „ค่ะ” — „นะค่ะ” to częsty błąd.
    thai: phrase.th.replaceAll("นะ{p}", "นะ" + bit.q).replaceAll("{p}", thP),
    pron: phrase.pron.replaceAll("ná {p}", "ná " + bit.qp).replaceAll("{p}", prP),
  };
}

/** Polski tekst w formie mówiącego: „Zgubił{em|am} się” → „Zgubiłem się” / „Zgubiłam się”. */
export function polish(phrase: Pick<Phrase, "pl">, speaker: Speaker) {
  return phrase.pl.replace(/\{([^|{}]*)\|([^|{}]*)\}/g, (_, male: string, female: string) =>
    speaker === "m" ? male : female,
  );
}

// Tajowie odpowiadają, powtarzając czasownik z pytania: ได้ / ไม่ได้, มี / ไม่มี.
const CAN: readonly Answer[] = [
  { th: "ได้", pl: "Tak, można" },
  { th: "ไม่ได้", pl: "Nie, nie można" },
];

const HAVE: readonly Answer[] = [
  { th: "มี", pl: "Jest, mamy" },
  { th: "ไม่มี", pl: "Nie ma" },
  { th: "หมดแล้ว", pl: "Już się skończyło" },
];

const WHERE: readonly Answer[] = [
  { th: "ตรงไป", pl: "Prosto" },
  { th: "เลี้ยวซ้าย", pl: "W lewo" },
  { th: "เลี้ยวขวา", pl: "W prawo" },
  { th: "ตรงนั้น", pl: "Tam" },
  { th: "ข้างหลัง", pl: "Z tyłu" },
  { th: "ชั้นบน", pl: "Piętro wyżej" },
  { th: "ไกล", pl: "Daleko" },
  { th: "ไม่รู้", pl: "Nie wiem" },
];

const FAR: readonly Answer[] = [
  { th: "ใกล้มาก", pl: "Bardzo blisko" },
  { th: "ไม่ไกล เดินไปได้", pl: "Niedaleko, dojdziesz pieszo" },
  { th: "ไกล ต้องนั่งรถ", pl: "Daleko, trzeba jechać" },
];

const SPICY: readonly Answer[] = [
  { th: "ไม่เผ็ด", pl: "Nieostre" },
  { th: "เผ็ดนิดหน่อย", pl: "Trochę ostre" },
  { th: "เผ็ดมาก", pl: "Bardzo ostre" },
];

const CARD: readonly Answer[] = [
  { th: "ได้", pl: "Tak, kartą można" },
  { th: "เงินสดเท่านั้น", pl: "Tylko gotówka" },
  { th: "สแกนจ่ายได้", pl: "Można kodem QR" },
];

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
      { id: "thanks", pl: "Dziękuję", th: "ขอบคุณ{p}", pron: "khɔ̀ɔp-khun {p}", group: "Rozmowa" },
      { id: "thanks-casual", pl: "Dzięki", th: "ขอบคุณนะ{p}", pron: "khɔ̀ɔp-khun ná {p}", group: "Rozmowa" },
      { id: "sorry", pl: "Przepraszam", th: "ขอโทษ{p}", pron: "khɔ̌ɔ-thôot {p}", group: "Rozmowa" },
      { id: "ok", pl: "Nie ma sprawy", th: "ไม่เป็นไร{p}", pron: "mâi bpen rai {p}", group: "Rozmowa" },
      { id: "yes", pl: "Tak, zgadza się", th: "ใช่{p}", pron: "châi {p}", group: "Rozmowa" },
      {
        id: "no",
        pl: "Nie, to nie tak",
        th: "ไม่ใช่{p}",
        pron: "mâi châi {p}",
        group: "Rozmowa",
        note: "„Nie, nie chcę” to ไม่เอา — w Odpowiedziach.",
      },
      { id: "understand", pl: "Nie rozumiem", th: "ไม่เข้าใจ{p}", pron: "mâi khâo jai {p}", group: "Rozmowa" },
      {
        id: "learning",
        pl: "Mówię tylko trochę i jeszcze się uczę",
        th: "พูดไทยได้นิดหน่อย กำลังเรียนอยู่{p}",
        pron: "phûut thai dâi nít-nɔ̀i gam-lang rian yùu {p}",
        group: "Rozmowa",
      },
      { id: "slow", pl: "Mów wolniej", th: "พูดช้าๆ หน่อย{p}", pron: "phûut cháa-cháa nɔ̀i {p}", group: "Rozmowa" },
      { id: "this", pl: "Chcę to", th: "เอาอันนี้{p}", pron: "ao an níi {p}", group: "Jedzenie", note: "Wskaż palcem." },
      { id: "mild", pl: "Nieostre", th: "ไม่เผ็ด{p}", pron: "mâi phèt {p}", group: "Jedzenie" },
      { id: "water", pl: "Poproszę wodę", th: "ขอน้ำเปล่า{p}", pron: "khɔ̌ɔ náam bplàao {p}", group: "Jedzenie" },
      { id: "bill", pl: "Poproszę rachunek", th: "เช็คบิล{p}", pron: "chék bin {p}", group: "Jedzenie" },
      {
        id: "toilet",
        pl: "Gdzie jest toaleta?",
        th: "ห้องน้ำอยู่ที่ไหน{p}",
        pron: "hɔ̂ng náam yùu thîi nǎi {p}",
        question: true,
        group: "Droga",
        answers: WHERE,
      },
      { id: "stop", pl: "Zatrzymaj tutaj", th: "จอดตรงนี้{p}", pron: "jɔ̀ɔt dtrong níi {p}", group: "Droga" },
      {
        id: "howmuch",
        pl: "Ile to kosztuje?",
        th: "เท่าไหร่{p}",
        pron: "thâo-rài {p}",
        question: true,
        group: "Droga",
        price: true,
      },
      { id: "meter", pl: "Włącz licznik", th: "เปิดมิเตอร์ด้วย{p}", pron: "bpòet mí-dtôe dûuai {p}", group: "Droga" },
      { id: "help", pl: "Pomocy", th: "ช่วยด้วย", pron: "chûuai dûuai", group: "Awaria" },
    ],
  },
  {
    id: "odpowiedzi",
    name: "Odpowiedzi",
    phrases: [
      {
        id: "from-poland",
        pl: "Jestem z Polski",
        th: "มาจากโปแลนด์{p}",
        pron: "maa jàak bpoo-laen {p}",
        group: "O mnie",
      },
      {
        id: "first-time",
        pl: "Jestem tu pierwszy raz",
        th: "มาครั้งแรก{p}",
        pron: "maa khráng râek {p}",
        group: "O mnie",
      },
      {
        id: "holiday",
        pl: "Jestem na wakacjach",
        th: "มาเที่ยว{p}",
        pron: "maa thîao {p}",
        group: "O mnie",
      },
      { id: "yes-please", pl: "Tak, poproszę", th: "เอา{p}", pron: "ao {p}", group: "Tak / nie" },
      {
        id: "no-thanks",
        pl: "Nie, dziękuję",
        th: "ไม่เอา{p}",
        pron: "mâi ao {p}",
        group: "Tak / nie",
      },
      { id: "ok-good", pl: "Dobrze, może być", th: "ได้{p}", pron: "dâi {p}", group: "Tak / nie" },
      {
        id: "eat-here",
        pl: "Na miejscu",
        th: "กินที่นี่{p}",
        pron: "gin thîi nîi {p}",
        group: "Zamówienie",
      },
      {
        id: "takeaway",
        pl: "Na wynos",
        th: "กลับบ้าน{p}",
        pron: "glàp bâan {p}",
        group: "Zamówienie",
      },
      {
        id: "no-ice",
        pl: "Bez lodu",
        th: "ไม่ใส่น้ำแข็ง{p}",
        pron: "mâi sài náam-khǎeng {p}",
        group: "Zamówienie",
      },
      {
        id: "less-sweet",
        pl: "Mniej słodkie",
        th: "หวานน้อย{p}",
        pron: "wǎan nɔ́ɔi {p}",
        group: "Zamówienie",
      },
      {
        id: "one-person",
        pl: "Jedna osoba",
        th: "คนเดียว{p}",
        pron: "khon diao {p}",
        group: "Zamówienie",
      },
      {
        id: "two-people",
        pl: "Dwie osoby",
        th: "สองคน{p}",
        pron: "sɔ̌ɔng khon {p}",
        group: "Zamówienie",
      },
      {
        id: "cash",
        pl: "Płacę gotówką",
        th: "จ่ายเงินสด{p}",
        pron: "jàai ngoen sòt {p}",
        group: "Płatność",
      },
      {
        id: "card",
        pl: "Mogę zapłacić kartą?",
        th: "รูดบัตรได้ไหม{p}",
        pron: "rûut bàt dâi mǎi {p}",
        question: true,
        group: "Płatność",
        answers: CARD,
      },
      {
        id: "repeat",
        pl: "Możesz powtórzyć?",
        th: "พูดอีกทีได้ไหม{p}",
        pron: "phûut ìik thii dâi mǎi {p}",
        question: true,
        group: "Nie rozumiem",
      },
      {
        id: "write-down",
        pl: "Napisz mi to",
        th: "เขียนให้หน่อย{p}",
        pron: "khǐan hâi nɔ̀i {p}",
        group: "Nie rozumiem",
        note: "Podaj telefon albo kartkę.",
      },
      {
        id: "show-map",
        pl: "Pokaż mi na mapie",
        th: "ชี้ในแผนที่ให้หน่อย{p}",
        pron: "chíi nai phǎen-thîi hâi nɔ̀i {p}",
        group: "Nie rozumiem",
        note: "Otwórz mapę w telefonie i podaj rozmówcy.",
      },
      { id: "dont-know", pl: "Nie wiem", th: "ไม่รู้{p}", pron: "mâi rúu {p}", group: "Nie rozumiem" },
      {
        id: "wait",
        pl: "Chwileczkę",
        th: "รอสักครู่{p}",
        pron: "rɔɔ sàk khrûu {p}",
        group: "Nie rozumiem",
        note: "Gdy szukasz zdania w telefonie.",
      },
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
      {
        id: "no-meat",
        pl: "Nie jem mięsa",
        th: "ไม่กินเนื้อสัตว์{p}",
        pron: "mâi gin nʉ́a-sàt {p}",
        group: "Chcę",
        note: "Wegetariańsko. Sos rybny może się trafić — dopytaj.",
      },
      {
        id: "want-veg",
        pl: "Jem wegańsko (jay)",
        th: "กินเจ{p}",
        pron: "gin jee {p}",
        group: "Chcę",
        note: "Kuchnia „jay”: bez mięsa, nabiału, jajek, czosnku i cebuli.",
      },
      { id: "want-padthai", pl: "Chcę pad thai", th: "เอาผัดไทย{p}", pron: "ao phàt thai {p}", group: "Chcę" },
      { id: "want-friedrice", pl: "Chcę ryż smażony", th: "เอาข้าวผัด{p}", pron: "ao khâao phàt {p}", group: "Chcę" },
      { id: "want-tomyum", pl: "Chcę tom yum", th: "เอาต้มยำ{p}", pron: "ao dtôm yam {p}", group: "Chcę" },
      { id: "want-greencurry", pl: "Chcę zielone curry", th: "เอาแกงเขียวหวาน{p}", pron: "ao gaeng khǐao wǎan {p}", group: "Chcę" },
      { id: "menu", pl: "Poproszę menu", th: "ขอเมนูหน่อย{p}", pron: "khɔ̌ɔ mee-nuu nɔ̀i {p}", group: "Przy stole" },
      { id: "notspicy", pl: "Nieostre", th: "ไม่เผ็ด{p}", pron: "mâi phèt {p}", group: "Ostrość" },
      { id: "littlespicy", pl: "Trochę ostre", th: "เผ็ดนิดหน่อย{p}", pron: "phèt nít-nɔ̀i {p}", group: "Ostrość" },
      { id: "nospicy-atall", pl: "Bez chili", th: "ไม่ใส่พริก{p}", pron: "mâi sài phrík {p}", group: "Ostrość" },
      {
        id: "isspicy",
        pl: "Czy jest ostre?",
        th: "เผ็ดไหม{p}",
        pron: "phèt mǎi {p}",
        question: true,
        group: "Ostrość",
        answers: SPICY,
      },
      { id: "nocoriander", pl: "Bez kolendry", th: "ไม่ใส่ผักชี{p}", pron: "mâi sài phàk-chii {p}", group: "Ostrość" },
      {
        id: "allergy-peanut",
        pl: "Mam alergię na orzeszki",
        th: "แพ้ถั่วลิสง{p}",
        pron: "pháe thùa-lí-sǒng {p}",
        group: "Alergie i dodatki",
        note: "Orzeszki ziemne są w pad thai, satay i wielu sosach.",
      },
      {
        id: "allergy-seafood",
        pl: "Mam alergię na owoce morza",
        th: "แพ้อาหารทะเล{p}",
        pron: "pháe aa-hǎan thá-lee {p}",
        group: "Alergie i dodatki",
        note: "Sos rybny i pasta krewetkowa są prawie wszędzie.",
      },
      { id: "no-msg", pl: "Bez glutaminianu (MSG)", th: "ไม่ใส่ผงชูรส{p}", pron: "mâi sài phǒng-chuu-rót {p}", group: "Alergie i dodatki" },
      { id: "no-sugar", pl: "Bez cukru", th: "ไม่ใส่น้ำตาล{p}", pron: "mâi sài náam-dtaan {p}", group: "Alergie i dodatki" },
      { id: "water2", pl: "Poproszę wodę", th: "ขอน้ำเปล่า{p}", pron: "khɔ̌ɔ náam bplàao {p}", group: "Przy stole" },
      { id: "delicious", pl: "Bardzo smaczne", th: "อร่อยมาก{p}", pron: "à-rɔ̀i mâak {p}", group: "Przy stole" },
      { id: "very-delicious", pl: "Przepyszne", th: "อร่อยมากๆ{p}", pron: "à-rɔ̀i mâak-mâak {p}", group: "Przy stole" },
      { id: "full", pl: "Najadł{em|am} się", th: "อิ่มแล้ว{p}", pron: "ìm láew {p}", group: "Przy stole" },
      { id: "bill2", pl: "Poproszę rachunek", th: "เช็คบิล{p}", pron: "chék bin {p}", group: "Przy stole" },
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
        pron: "hɔ̂ng náam yùu thîi nǎi {p}",
        question: true,
        group: "Gdzie",
        answers: WHERE,
      },
      {
        id: "where-hotel",
        pl: "Gdzie jest hotel?",
        th: "โรงแรมอยู่ที่ไหน{p}",
        pron: "roong raem yùu thîi nǎi {p}",
        question: true,
        group: "Gdzie",
        answers: WHERE,
      },
      {
        id: "where-station",
        pl: "Gdzie jest stacja?",
        th: "สถานีอยู่ที่ไหน{p}",
        pron: "sà-thǎa-nii yùu thîi nǎi {p}",
        question: true,
        group: "Gdzie",
        answers: WHERE,
      },
      {
        id: "where-airport",
        pl: "Gdzie jest lotnisko?",
        th: "สนามบินอยู่ที่ไหน{p}",
        pron: "sà-nǎam bin yùu thîi nǎi {p}",
        question: true,
        group: "Gdzie",
        answers: WHERE,
      },
      {
        id: "where-pharmacy",
        pl: "Gdzie jest apteka?",
        th: "ร้านขายยาอยู่ที่ไหน{p}",
        pron: "ráan khǎai yaa yùu thîi nǎi {p}",
        question: true,
        group: "Gdzie",
        answers: WHERE,
      },
      {
        id: "where-hospital",
        pl: "Gdzie jest szpital?",
        th: "โรงพยาบาลอยู่ที่ไหน{p}",
        pron: "roong phá-yaa-baan yùu thîi nǎi {p}",
        question: true,
        group: "Gdzie",
        answers: WHERE,
      },
      {
        id: "where-atm",
        pl: "Gdzie jest bankomat?",
        th: "ตู้เอทีเอ็มอยู่ที่ไหน{p}",
        pron: "dtûu ee-thii-em yùu thîi nǎi {p}",
        question: true,
        group: "Gdzie",
        answers: WHERE,
      },
      {
        id: "where-711",
        pl: "Gdzie jest 7-Eleven?",
        th: "เซเว่นอยู่ที่ไหน{p}",
        pron: "see-wên yùu thîi nǎi {p}",
        question: true,
        group: "Gdzie",
        answers: WHERE,
        note: "Sklep całodobowy: woda, karta SIM, przekąski, bankomat.",
      },
      { id: "left", pl: "W lewo", th: "เลี้ยวซ้าย{p}", pron: "líao sáai {p}", group: "Jak jechać" },
      { id: "right", pl: "W prawo", th: "เลี้ยวขวา{p}", pron: "líao khwǎa {p}", group: "Jak jechać" },
      { id: "straight", pl: "Prosto", th: "ตรงไป{p}", pron: "dtrong bpai {p}", group: "Jak jechać" },
      { id: "here", pl: "Zatrzymaj tutaj", th: "จอดตรงนี้{p}", pron: "jɔ̀ɔt dtrong níi {p}", group: "Jak jechać" },
      {
        id: "far",
        pl: "Czy to daleko?",
        th: "ไกลไหม{p}",
        pron: "glai mǎi {p}",
        question: true,
        group: "Jak jechać",
        answers: FAR,
      },
      { id: "lost", pl: "Zgubił{em|am} się", th: "หลงทาง{p}", pron: "lǒng thaang {p}", group: "Jak jechać" },
    ],
  },
  {
    id: "transport",
    name: "Taxi",
    phrases: [
      { id: "go-airport", pl: "Na lotnisko", th: "ไปสนามบิน{p}", pron: "bpai sà-nǎam bin {p}", group: "Dokąd" },
      { id: "go-hotel", pl: "Do hotelu", th: "ไปโรงแรม{p}", pron: "bpai roong raem {p}", group: "Dokąd" },
      { id: "go-station", pl: "Na stację", th: "ไปสถานี{p}", pron: "bpai sà-thǎa-nii {p}", group: "Dokąd" },
      { id: "go-siam", pl: "Do Siam", th: "ไปสยาม{p}", pron: "bpai sà-yǎam {p}", group: "Dokąd" },
      {
        id: "go-here",
        pl: "Jedziemy tutaj",
        th: "ไปที่นี่{p}",
        pron: "bpai thîi nîi {p}",
        group: "Dokąd",
        note: "Pokaż adres albo pinezkę na mapie.",
      },
      {
        id: "howmuch-here",
        pl: "Ile kosztuje kurs tutaj?",
        th: "ไปที่นี่เท่าไหร่{p}",
        pron: "bpai thîi nîi thâo-rài {p}",
        question: true,
        group: "Dokąd",
        price: true,
        note: "Pokaż adres. Tuk-tuk i motocykl: cenę ustal przed jazdą.",
      },
      { id: "meter2", pl: "Włącz licznik", th: "เปิดมิเตอร์ด้วย{p}", pron: "bpòet mí-dtôe dûuai {p}", group: "W aucie" },
      { id: "stop2", pl: "Zatrzymaj tutaj", th: "จอดตรงนี้{p}", pron: "jɔ̀ɔt dtrong níi {p}", group: "W aucie" },
      { id: "left2", pl: "W lewo", th: "เลี้ยวซ้าย{p}", pron: "líao sáai {p}", group: "W aucie" },
      { id: "right2", pl: "W prawo", th: "เลี้ยวขวา{p}", pron: "líao khwǎa {p}", group: "W aucie" },
      { id: "straight2", pl: "Prosto", th: "ตรงไป{p}", pron: "dtrong bpai {p}", group: "W aucie" },
      { id: "slower", pl: "Proszę jechać wolniej", th: "ขับช้าๆ หน่อย{p}", pron: "khàp cháa-cháa nɔ̀i {p}", group: "W aucie" },
      { id: "wait-here", pl: "Proszę tu poczekać", th: "รอตรงนี้สักครู่{p}", pron: "rɔɔ dtrong níi sàk khrûu {p}", group: "W aucie" },
      {
        id: "howmuch-taxi",
        pl: "Ile to kosztuje?",
        th: "เท่าไหร่{p}",
        pron: "thâo-rài {p}",
        question: true,
        group: "W aucie",
        price: true,
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
        pron: "raa-khaa thâo-rài {p}",
        question: true,
        group: "Cena",
        price: true,
      },
      { id: "expensive", pl: "Za drogo", th: "แพงไป{p}", pron: "phaeng bpai {p}", group: "Cena" },
      {
        id: "thanks-no",
        pl: "Dzięki, ale nie, za drogo",
        th: "ขอบคุณนะ{p} แต่ไม่เอา แพงไป",
        pron: "khɔ̀ɔp-khun ná {p} dtàe mâi ao phaeng bpai",
        group: "Cena",
      },
      {
        id: "discount",
        pl: "Taniej?",
        th: "ลดหน่อยได้ไหม{p}",
        pron: "lót nɔ̀i dâi mǎi {p}",
        question: true,
        group: "Cena",
        answers: CAN,
        price: true,
        note: "Na targu tak. W sklepie z metkami raczej nie.",
      },
      { id: "take-this", pl: "Biorę to", th: "เอาอันนี้{p}", pron: "ao an níi {p}", group: "Cena", note: "Wskaż palcem." },
      { id: "looking", pl: "Tylko oglądam", th: "ดูเฉยๆ{p}", pron: "duu chǒei-chǒei {p}", group: "Cena" },
      {
        id: "try-on",
        pl: "Mogę przymierzyć?",
        th: "ลองได้ไหม{p}",
        pron: "lɔɔng dâi mǎi {p}",
        question: true,
        group: "Towar",
        answers: CAN,
      },
      {
        id: "bigger",
        pl: "Jest większy rozmiar?",
        th: "มีไซซ์ใหญ่กว่านี้ไหม{p}",
        pron: "mii sai yài gwàa níi mǎi {p}",
        question: true,
        group: "Towar",
        answers: HAVE,
      },
      { id: "bag", pl: "Proszę do torebki", th: "ใส่ถุง{p}", pron: "sài thǔng {p}", group: "Towar" },
      { id: "no-bag", pl: "Bez torebki", th: "ไม่เอาถุง{p}", pron: "mâi ao thǔng {p}", group: "Towar" },
      { id: "no-change", pl: "Nie mam drobnych", th: "ไม่มีเงินย่อย{p}", pron: "mâi mii ngoen yɔ̂i {p}", group: "Płacę" },
      { id: "keep-change", pl: "Reszty nie trzeba", th: "ไม่ต้องทอน{p}", pron: "mâi dtɔ̂ng thɔɔn {p}", group: "Płacę" },
    ],
  },
  {
    id: "hotel",
    name: "Hotel",
    phrases: [
      { id: "booking", pl: "Mam rezerwację", th: "จองไว้แล้ว{p}", pron: "jɔɔng wái láew {p}", group: "Recepcja" },
      { id: "key", pl: "Poproszę klucz", th: "ขอกุญแจหน่อย{p}", pron: "khɔ̌ɔ gun-jae nɔ̀i {p}", group: "Recepcja" },
      {
        id: "wifi",
        pl: "Jakie jest hasło do Wi-Fi?",
        th: "รหัสไวไฟคืออะไร{p}",
        pron: "rá-hàt wai-fai khʉʉ à-rai {p}",
        question: true,
        group: "Recepcja",
        note: "Najprościej podać telefon, żeby wpisali.",
      },
      {
        id: "breakfast",
        pl: "Czy śniadanie jest wliczone?",
        th: "รวมอาหารเช้าไหม{p}",
        pron: "ruam aa-hǎan cháao mǎi {p}",
        question: true,
        group: "Recepcja",
        answers: [
          { th: "รวม", pl: "Tak, jest wliczone" },
          { th: "ไม่รวม", pl: "Nie, płaci się osobno" },
        ],
      },
      {
        id: "luggage",
        pl: "Mogę zostawić bagaż?",
        th: "ฝากกระเป๋าได้ไหม{p}",
        pron: "fàak grà-bpǎo dâi mǎi {p}",
        question: true,
        group: "Recepcja",
        answers: CAN,
      },
      { id: "checkout", pl: "Chcę się wymeldować", th: "ขอเช็คเอาท์{p}", pron: "khɔ̌ɔ chék-áo {p}", group: "Recepcja" },
      {
        id: "towel",
        pl: "Poproszę ręcznik",
        th: "ขอผ้าเช็ดตัวหน่อย{p}",
        pron: "khɔ̌ɔ phâa chét dtuua nɔ̀i {p}",
        group: "Pokój",
      },
      { id: "ac-broken", pl: "Klimatyzacja nie działa", th: "แอร์เสีย{p}", pron: "ae sǐa {p}", group: "Pokój" },
      { id: "no-hot-water", pl: "Nie ma ciepłej wody", th: "ไม่มีน้ำร้อน{p}", pron: "mâi mii náam rɔ́ɔn {p}", group: "Pokój" },
    ],
  },
  {
    id: "pomoc",
    name: "Pomoc",
    phrases: [
      { id: "help2", pl: "Pomocy", th: "ช่วยด้วย", pron: "chûuai dûuai", group: "Teraz" },
      {
        id: "police",
        pl: "Proszę wezwać policję",
        th: "ช่วยเรียกตำรวจหน่อย{p}",
        pron: "chûuai rîak dtam-rùat nɔ̀i {p}",
        group: "Teraz",
        note: "Policja 191. Policja turystyczna 1155 — mówi po angielsku.",
      },
      {
        id: "ambulance",
        pl: "Proszę wezwać karetkę",
        th: "ช่วยเรียกรถพยาบาลหน่อย{p}",
        pron: "chûuai rîak rót phá-yaa-baan nɔ̀i {p}",
        group: "Teraz",
        note: "Pogotowie 1669.",
      },
      { id: "doctor", pl: "Muszę iść do lekarza", th: "ต้องไปหาหมอ{p}", pron: "dtɔ̂ng bpai hǎa mɔ̌ɔ {p}", group: "Teraz" },
      {
        id: "hospital",
        pl: "Do szpitala, proszę",
        th: "ไปโรงพยาบาล{p}",
        pron: "bpai roong phá-yaa-baan {p}",
        group: "Teraz",
        note: "Do taksówkarza.",
      },
      { id: "sick", pl: "Źle się czuję", th: "ไม่สบาย{p}", pron: "mâi sà-baai {p}", group: "Teraz" },
      { id: "pharmacy2", pl: "Apteka", th: "ร้านขายยา", pron: "ráan khǎai yaa", group: "Teraz" },
      { id: "stomach", pl: "Boli mnie brzuch", th: "ปวดท้อง{p}", pron: "bpùat thɔ́ɔng {p}", group: "Objawy" },
      { id: "diarrhea", pl: "Mam biegunkę", th: "ท้องเสีย{p}", pron: "thɔ́ɔng sǐa {p}", group: "Objawy" },
      { id: "fever", pl: "Mam gorączkę", th: "เป็นไข้{p}", pron: "bpen khâi {p}", group: "Objawy" },
      { id: "headache", pl: "Boli mnie głowa", th: "ปวดหัว{p}", pron: "bpùat hǔa {p}", group: "Objawy" },
      {
        id: "lost-passport",
        pl: "Zgubił{em|am} paszport",
        th: "ทำพาสปอร์ตหาย{p}",
        pron: "tham pháat-sà-bpɔ̀ɔt hǎai {p}",
        group: "Kłopoty",
        note: "Zgłoś na policji turystycznej (1155), potem w ambasadzie RP w Bangkoku.",
      },
      { id: "stolen", pl: "Okradziono mnie", th: "โดนขโมย{p}", pron: "doon khà-mooi {p}", group: "Kłopoty" },
    ],
  },
  {
    id: "liczby",
    name: "Liczby",
    phrases: [
      { id: "n1", pl: "1", th: "หนึ่ง", pron: "nʉ̀ng", group: "1–10" },
      { id: "n2", pl: "2", th: "สอง", pron: "sɔ̌ɔng", group: "1–10" },
      { id: "n3", pl: "3", th: "สาม", pron: "sǎam", group: "1–10" },
      { id: "n4", pl: "4", th: "สี่", pron: "sìi", group: "1–10" },
      { id: "n5", pl: "5", th: "ห้า", pron: "hâa", group: "1–10" },
      { id: "n6", pl: "6", th: "หก", pron: "hòk", group: "1–10" },
      { id: "n7", pl: "7", th: "เจ็ด", pron: "jèt", group: "1–10" },
      { id: "n8", pl: "8", th: "แปด", pron: "bpàet", group: "1–10" },
      { id: "n9", pl: "9", th: "เก้า", pron: "gâo", group: "1–10" },
      { id: "n10", pl: "10", th: "สิบ", pron: "sìp", group: "1–10" },
      { id: "n11", pl: "11", th: "สิบเอ็ด", pron: "sìp-èt", group: "11–1000", note: "Na końcu „et”, nie „nyng” — tak samo 21, 31…" },
      { id: "n20", pl: "20", th: "ยี่สิบ", pron: "yîi-sìp", group: "11–1000", note: "Nie „song sìp”." },
      { id: "n50", pl: "50", th: "ห้าสิบ", pron: "hâa-sìp", group: "11–1000" },
      { id: "n100", pl: "100", th: "ร้อย", pron: "rɔ́ɔi", group: "11–1000" },
      { id: "n200", pl: "200", th: "สองร้อย", pron: "sɔ̌ɔng-rɔ́ɔi", group: "11–1000" },
      { id: "n300", pl: "300", th: "สามร้อย", pron: "sǎam-rɔ́ɔi", group: "11–1000" },
      { id: "n400", pl: "400", th: "สี่ร้อย", pron: "sìi-rɔ́ɔi", group: "11–1000" },
      { id: "n500", pl: "500", th: "ห้าร้อย", pron: "hâa-rɔ́ɔi", group: "11–1000" },
      { id: "n600", pl: "600", th: "หกร้อย", pron: "hòk-rɔ́ɔi", group: "11–1000" },
      { id: "n700", pl: "700", th: "เจ็ดร้อย", pron: "jèt-rɔ́ɔi", group: "11–1000" },
      { id: "n800", pl: "800", th: "แปดร้อย", pron: "bpàet-rɔ́ɔi", group: "11–1000" },
      { id: "n900", pl: "900", th: "เก้าร้อย", pron: "gâo-rɔ́ɔi", group: "11–1000" },
      { id: "n1000", pl: "1000", th: "พัน", pron: "phan", group: "11–1000" },
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
        answers: [
          { th: "สบายดี", pl: "Dobrze" },
          { th: "ไม่ค่อยสบาย", pl: "Niezbyt dobrze" },
        ],
      },
      { id: "imfine", pl: "Wszystko dobrze", th: "สบายดี{p}", pron: "sà-baai dii {p}", group: "Dzień" },
      { id: "thanks2", pl: "Dziękuję", th: "ขอบคุณ{p}", pron: "khɔ̀ɔp-khun {p}", group: "Dzień" },
      { id: "thanks-casual2", pl: "Dzięki", th: "ขอบคุณนะ{p}", pron: "khɔ̀ɔp-khun ná {p}", group: "Dzień" },
      { id: "thanks-much", pl: "Bardzo dziękuję", th: "ขอบคุณมาก{p}", pron: "khɔ̀ɔp-khun mâak {p}", group: "Dzień" },
      { id: "sorry2", pl: "Przepraszam", th: "ขอโทษ{p}", pron: "khɔ̌ɔ-thôot {p}", group: "Dzień" },
      { id: "noproblem", pl: "Nie ma sprawy", th: "ไม่เป็นไร{p}", pron: "mâi bpen rai {p}", group: "Dzień" },
      {
        id: "bye",
        pl: "Do widzenia",
        th: "ไปก่อนนะ{p}",
        pron: "bpai gɔ̀ɔn ná {p}",
        group: "Dzień",
        note: "Dosłownie „idę już”. Można też po prostu สวัสดี.",
      },
      { id: "nicetomeet", pl: "Miło cię poznać", th: "ยินดีที่ได้รู้จัก{p}", pron: "yin-dii thîi dâi rúu-jàk {p}", group: "Dzień" },
      { id: "no-thai", pl: "Nie mówię po tajsku", th: "พูดภาษาไทยไม่ได้{p}", pron: "phûut phaa-sǎa thai mâi dâi {p}", group: "Dzień" },
      {
        id: "learning2",
        pl: "Mówię tylko trochę i jeszcze się uczę",
        th: "พูดไทยได้นิดหน่อย กำลังเรียนอยู่{p}",
        pron: "phûut thai dâi nít-nɔ̀i gam-lang rian yùu {p}",
        group: "Dzień",
      },
      {
        id: "english",
        pl: "Mówisz po angielsku?",
        th: "พูดภาษาอังกฤษได้ไหม{p}",
        pron: "phûut phaa-sǎa ang-grìt dâi mǎi {p}",
        question: true,
        group: "Dzień",
        answers: [
          { th: "ได้", pl: "Tak" },
          { th: "นิดหน่อย", pl: "Trochę" },
          { th: "ไม่ได้", pl: "Nie" },
        ],
      },
    ],
  },
];

export function categoryById(id: string) {
  return categories.find((category) => category.id === id) ?? categories[0];
}
