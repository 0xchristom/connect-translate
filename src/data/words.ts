import type { Phrase, Speaker } from "@/data/phrases";

export type CoachWord = {
  th: string;
  say: string;
  gloss: string;
};

const particle = {
  m: { th: "ครับ", say: "krap", gloss: "cząstka grzeczności. Ton wysoki i krótki." },
  f: { th: "ค่ะ", say: "kha", gloss: "cząstka grzeczności. Ton w dół." },
  q: { th: "คะ", say: "kha", gloss: "cząstka w pytaniu. Ton w górę." },
} as const;

const P: CoachWord = { th: "{p}", say: "", gloss: "" };

function w(th: string, say: string, gloss: string): CoachWord {
  return { th, say, gloss };
}

function where(th: string, say: string, gloss: string): CoachWord[] {
  return [
    w(th, say, gloss),
    w("อยู่", "ju", "znajduje się. Ton niski."),
    w("ที่ไหน", "ti-naj", "gdzie. „ti” niski, „naj” w górę."),
    P,
  ];
}

function here(): CoachWord[] {
  return [w("จอด", "dżot", "zatrzymaj. Ton niski."), w("ตรงนี้", "trong-ni", "tutaj. „ni” ton wysoki."), P];
}

function meter(): CoachWord[] {
  return [w("เปิด", "poet", "włącz. Ton niski."), w("มิเตอร์", "mi-to", "licznik. „mi” wysoki."), w("ด้วย", "duaj", "też / proszę. Ton opadający."), P];
}

function help(): CoachWord[] {
  return [w("ช่วย", "czuaj", "pomóż. Ton opadający."), w("ด้วย", "duaj", "proszę. Ton opadający.")];
}

const WORDS: Record<string, CoachWord[]> = {
  hi: [w("สวัสดี", "sa-wat-di", "cześć. Tony: niski, niski, równy."), P],
  hi2: [w("สวัสดี", "sa-wat-di", "cześć. Tony: niski, niski, równy."), P],
  "good-day": [w("สวัสดี", "sa-wat-di", "dzień dobry. To samo co cześć, cały dzień."), P],
  "good-day2": [w("สวัสดี", "sa-wat-di", "dzień dobry. To samo co cześć, cały dzień."), P],
  thanks: [w("ขอบคุณ", "kap-kun", "dziękuję. Ton opadający, potem równy."), P],
  thanks2: [w("ขอบคุณ", "kap-kun", "dziękuję. Ton opadający, potem równy."), P],
  "thanks-casual": [
    w("ขอบคุณ", "kap-kun", "dziękuję."),
    w("นะ", "na", "łagodzi: dzięki, nie sztywno. Ton wysoki."),
    P,
  ],
  "thanks-casual2": [
    w("ขอบคุณ", "kap-kun", "dziękuję."),
    w("นะ", "na", "łagodzi: dzięki, nie sztywno. Ton wysoki."),
    P,
  ],
  "thanks-much": [
    w("ขอบคุณ", "kap-kun", "dziękuję."),
    w("มาก", "mak", "bardzo. Ton opadający."),
    P,
  ],
  sorry: [w("ขอโทษ", "ko-tot", "przepraszam. Ton w górę, potem w dół."), P],
  sorry2: [w("ขอโทษ", "ko-tot", "przepraszam. Ton w górę, potem w dół."), P],
  ok: [
    w("ไม่", "maj", "nie. Ton opadający."),
    w("เป็น", "pen", "jest. Ton niski."),
    w("ไร", "raj", "sprawa. Ton równy."),
    P,
  ],
  noproblem: [
    w("ไม่", "maj", "nie. Ton opadający."),
    w("เป็น", "pen", "jest. Ton niski."),
    w("ไร", "raj", "sprawa. Ton równy."),
    P,
  ],
  yes: [w("ใช่", "czaj", "tak. Ton opadający."), P],
  no: [
    w("ไม่", "maj", "nie. Ton opadający."),
    w("ใช่", "czaj", "tak. Ton opadający."),
    P,
  ],
  understand: [
    w("ไม่", "maj", "nie."),
    w("เข้าใจ", "kao-dżaj", "rozumieć. Ton opadający, potem równy."),
    P,
  ],
  slow: [
    w("พูด", "put", "mówić. Ton opadający."),
    w("ช้าๆ", "cza-cza", "wolno. Ton w górę, dwa razy."),
    w("หน่อย", "noj", "trochę. Ton niski."),
    P,
  ],
  this: [w("เอา", "ao", "biorę. Ton równy."), w("อันนี้", "an-ni", "to. „ni” ton wysoki."), P],
  this2: [w("เอา", "ao", "biorę. Ton równy."), w("อันนี้", "an-ni", "to. „ni” ton wysoki."), P],
  "take-this": [w("เอา", "ao", "biorę."), w("อันนี้", "an-ni", "to."), P],
  mild: [w("ไม่", "maj", "nie."), w("เผ็ด", "pet", "ostre. Ton wysoki."), P],
  notspicy: [w("ไม่", "maj", "nie."), w("เผ็ด", "pet", "ostre. Ton wysoki."), P],
  water: [w("ขอ", "ko", "proszę. Ton w górę."), w("น้ำเปล่า", "nam-plao", "woda. „nam” wysoki, „plao” niski."), P],
  water2: [w("ขอ", "ko", "proszę."), w("น้ำเปล่า", "nam-plao", "woda niegazowana."), P],
  bill: [w("เช็ค", "czek", "sprawdzić."), w("บิล", "bin", "rachunek. Ton równy."), P],
  bill2: [w("เช็ค", "czek", "sprawdzić."), w("บิล", "bin", "rachunek."), P],
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
  "want-chicken": [w("เอา", "ao", "biorę."), w("ไก่", "gaj", "kurczak. Ton opadający."), P],
  "want-beef": [w("เอา", "ao", "biorę."), w("เนื้อ", "nya", "wołowina. Usta zaokrąglone, ton wysoki."), P],
  "want-pork": [w("เอา", "ao", "biorę."), w("หมู", "mu", "wieprzowina. Ton w górę."), P],
  "want-fish": [w("เอา", "ao", "biorę."), w("ปลา", "pla", "ryba. Ton równy."), P],
  "want-shrimp": [w("เอา", "ao", "biorę."), w("กุ้ง", "gung", "krewetka. Ton opadający."), P],
  "want-veg": [w("กิน", "gin", "jem. Ton równy."), w("เจ", "dżej", "wege bez mięsa. Ton równy."), P],
  "want-padthai": [w("เอา", "ao", "biorę."), w("ผัดไทย", "pat-taj", "pad thai. „pat” niski."), P],
  "want-friedrice": [w("เอา", "ao", "biorę."), w("ข้าวผัด", "kao-pat", "ryż smażony."), P],
  "want-tomyum": [w("เอา", "ao", "biorę."), w("ต้มยำ", "tom-jam", "tom yum."), P],
  "want-greencurry": [w("เอา", "ao", "biorę."), w("แกงเขียวหวาน", "geng-kiao-łan", "zielone curry. „kiao” i „łan” w górę."), P],
  menu: [w("ขอ", "ko", "proszę."), w("เมนู", "me-nu", "menu. Ton równy."), w("หน่อย", "noj", "trochę."), P],
  littlespicy: [w("เผ็ด", "pet", "ostre."), w("นิดหน่อย", "nit-noj", "troszeczkę."), P],
  "nospicy-atall": [w("ไม่", "maj", "nie."), w("ใส่", "saj", "dodawać. Ton niski."), w("พริก", "prik", "chili. Ton wysoki."), P],
  isspicy: [w("เผ็ด", "pet", "ostre."), w("ไหม", "maj", "czy? Ton w górę, nie opadający."), P],
  nocoriander: [w("ไม่", "maj", "nie."), w("ใส่", "saj", "dodawać."), w("ผักชี", "pak-czi", "kolendra."), P],
  delicious: [w("อร่อย", "a-roj", "pyszne. Ton niski, potem opadający."), w("มาก", "mak", "bardzo."), P],
  "very-delicious": [
    w("อร่อย", "a-roj", "pyszne."),
    w("มากๆ", "mak-mak", "bardzo, z naciskiem. Ton opadający, dwa razy."),
    P,
  ],
  full: [w("อิ่ม", "im", "syty. Ton niski."), w("แล้ว", "laew", "już. Ton wysoki."), P],
  "where-hotel": where("โรงแรม", "rong-raem", "hotel."),
  "where-station": where("สถานี", "sa-ta-ni", "stacja."),
  "where-airport": where("สนามบิน", "sa-nam-bin", "lotnisko."),
  "where-pharmacy": where("ร้านขายยา", "ran-kaj-ja", "apteka. „kaj” ton w górę."),
  "where-hospital": where("โรงพยาบาล", "rong-pa-ja-ban", "szpital."),
  left: [w("เลี้ยว", "liao", "skręć. Ton wysoki."), w("ซ้าย", "saj", "lewo. Ton wysoki."), P],
  left2: [w("เลี้ยว", "liao", "skręć."), w("ซ้าย", "saj", "lewo."), P],
  right: [w("เลี้ยว", "liao", "skręć."), w("ขวา", "kwa", "prawo. Ton w górę."), P],
  right2: [w("เลี้ยว", "liao", "skręć."), w("ขวา", "kwa", "prawo."), P],
  straight: [w("ตรง", "trong", "prosto. Ton równy."), w("ไป", "paj", "idź. Ton równy."), P],
  straight2: [w("ตรง", "trong", "prosto."), w("ไป", "paj", "idź."), P],
  far: [w("ไกล", "glaj", "daleko. Ton równy."), w("ไหม", "maj", "czy? Ton w górę."), P],
  lost: [w("หลง", "long", "zgubić się. Ton w górę."), w("ทาง", "tang", "droga. Ton równy."), P],
  "go-airport": [w("ไป", "paj", "jechać."), w("สนามบิน", "sa-nam-bin", "lotnisko."), P],
  "go-hotel": [w("ไป", "paj", "jechać."), w("โรงแรม", "rong-raem", "hotel."), P],
  "go-station": [w("ไป", "paj", "jechać."), w("สถานี", "sa-ta-ni", "stacja."), P],
  "go-siam": [w("ไป", "paj", "jechać."), w("สยาม", "sa-jam", "Siam. „jam” ton w górę."), P],
  price: [w("ราคา", "ra-ka", "cena. Ton równy."), w("เท่าไหร่", "tao-raj", "ile."), P],
  expensive: [w("แพง", "peng", "drogo. Ton równy."), w("ไป", "paj", "za bardzo."), P],
  "thanks-no": [
    w("ขอบคุณ", "kap-kun", "dzięki."),
    w("นะ", "na", "łagodzi. Ton wysoki."),
    P,
    w("แต่", "tae", "ale. Ton opadający."),
    w("ไม่", "maj", "nie."),
    w("เอา", "ao", "biorę."),
    w("แพง", "peng", "drogo."),
    w("ไป", "paj", "za bardzo."),
  ],
  discount: [
    w("ลด", "lot", "obniżyć. Ton wysoki."),
    w("หน่อย", "noj", "trochę."),
    w("ได้", "daj", "można. Ton opadający."),
    w("ไหม", "maj", "czy? Ton w górę."),
    P,
  ],
  looking: [w("แค่", "ke", "tylko. Ton opadający."), w("ดู", "du", "oglądać. Ton równy."), P],
  bag: [w("ใส่", "saj", "włożyć."), w("ถุง", "tung", "torba. Ton w górę."), P],
  booking: [w("จอง", "dżong", "rezerwować. Ton równy."), w("ไว้", "waj", "już ustalone. Ton wysoki."), w("แล้ว", "laew", "już."), P],
  key: [w("ขอ", "ko", "proszę."), w("กุญแจ", "gun-dże", "klucz."), w("หน่อย", "noj", "trochę."), P],
  wifi: [
    w("รหัส", "ra-hat", "kod. Ton wysoki, potem niski."),
    w("ไวไฟ", "waj-faj", "wi-fi."),
    w("คือ", "ky", "to jest. Usta zaokrąglone, ton równy."),
    w("อะไร", "a-raj", "co."),
    P,
  ],
  checkout: [w("เช็คเอาท์", "czek-aut", "wymeldowanie."), P],
  towel: [
    w("ขอ", "ko", "proszę."),
    w("ผ้า", "pa", "tkanina. Ton opadający."),
    w("เช็ดตัว", "czet-tua", "ręcznik do ciała."),
    w("หน่อย", "noj", "trochę."),
    P,
  ],
  police: [w("โทร", "to", "dzwonić. Ton równy."), w("ตำรวจ", "tam-ruat", "policja. „ruat” ton niski.")],
  doctor: [w("ต้องการ", "tong-gan", "potrzebuję."), w("หมอ", "mo", "lekarz. Ton w górę."), P],
  hospital: [w("โรงพยาบาล", "rong-pa-ja-ban", "szpital.")],
  sick: [w("ไม่", "maj", "nie."), w("สบาย", "sa-baj", "dobrze się czuć. Ton niski, potem równy."), P],
  pharmacy2: [w("ร้าน", "ran", "sklep. Ton wysoki."), w("ขาย", "kaj", "sprzedawać. Ton w górę."), w("ยา", "ja", "lekarstwo. Ton równy.")],
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
  n50: [w("ห้า", "ha", "pięć. Ton opadający."), w("สิบ", "sip", "dziesiąt. Ton niski.")],
  n100: [w("ร้อย", "roj", "sto. Ton wysoki.")],
  n200: [w("สอง", "song", "dwa. Ton w górę."), w("ร้อย", "roj", "sto. Ton wysoki.")],
  n300: [w("สาม", "sam", "trzy. Ton w górę."), w("ร้อย", "roj", "sto.")],
  n400: [w("สี่", "si", "cztery. Ton niski."), w("ร้อย", "roj", "sto.")],
  n500: [w("ห้า", "ha", "pięć. Ton opadający."), w("ร้อย", "roj", "sto.")],
  n600: [w("หก", "hok", "sześć. Ton niski."), w("ร้อย", "roj", "sto.")],
  n700: [w("เจ็ด", "dżet", "siedem. Ton niski."), w("ร้อย", "roj", "sto.")],
  n800: [w("แปด", "pet", "osiem. Ton niski."), w("ร้อย", "roj", "sto.")],
  n900: [w("เก้า", "gao", "dziewięć. Ton opadający."), w("ร้อย", "roj", "sto.")],
  n1000: [w("พัน", "pan", "tysiąc. Ton równy.")],
  howareyou: [w("สบายดี", "sa-baj-di", "wszystko dobrze?"), w("ไหม", "maj", "czy? Ton w górę."), P],
  imfine: [w("สบายดี", "sa-baj-di", "dobrze."), P],
  bye: [w("ลาก่อน", "la-gon", "do widzenia. Ton równy, potem niski."), P],
  nicetomeet: [
    w("ยินดี", "jin-di", "miło."),
    w("ที่ได้", "ti-daj", "że mogłem."),
    w("รู้จัก", "ru-dżak", "poznać."),
    P,
  ],
  "no-thai": [
    w("พูด", "put", "mówić."),
    w("ภาษา", "pa-sa", "język. „sa” ton w górę."),
    w("ไทย", "taj", "tajski. Ton równy."),
    w("ไม่ได้", "maj-daj", "nie umiem."),
    P,
  ],
  learning: [
    w("พูดไทย", "put-taj", "mówić po tajsku."),
    w("ได้", "daj", "umiem. Ton opadający."),
    w("นิดหน่อย", "nit-noj", "tylko troszkę."),
    w("และ", "lae", "i. Ton wysoki."),
    w("กำลัง", "gam-lang", "właśnie, w trakcie."),
    w("เรียน", "rian", "uczyć się."),
    w("อยู่", "ju", "ciągle. Ton niski."),
    P,
  ],
  learning2: [
    w("พูดไทย", "put-taj", "mówić po tajsku."),
    w("ได้", "daj", "umiem. Ton opadający."),
    w("นิดหน่อย", "nit-noj", "tylko troszkę."),
    w("และ", "lae", "i. Ton wysoki."),
    w("กำลัง", "gam-lang", "właśnie, w trakcie."),
    w("เรียน", "rian", "uczyć się."),
    w("อยู่", "ju", "ciągle. Ton niski."),
    P,
  ],
  "from-poland": [
    w("มา", "ma", "przyjechać. Ton równy."),
    w("จาก", "dżak", "z, od. Ton niski."),
    w("โปแลนด์", "po-laen", "Polska."),
    P,
  ],
  "first-time": [
    w("มา", "ma", "przyjechać."),
    w("ครั้งแรก", "krang-raek", "pierwszy raz. Oba tony wysokie."),
    P,
  ],
  holiday: [
    w("มา", "ma", "przyjechać."),
    w("เที่ยว", "tiao", "zwiedzać, na wakacje. Ton opadający."),
    P,
  ],
  "yes-please": [w("เอา", "ao", "chcę, biorę. Ton równy."), P],
  "no-thanks": [
    w("ไม่", "maj", "nie. Ton opadający."),
    w("เอา", "ao", "chcę. Razem: nie chcę."),
    P,
  ],
  "ok-good": [w("ได้", "daj", "może być, da się. Ton opadający."), P],
  "eat-here": [
    w("กิน", "gin", "jeść. Ton równy."),
    w("ที่นี่", "ti-ni", "tutaj. „ni” opadający."),
    P,
  ],
  takeaway: [
    w("กลับ", "glap", "wracać. Ton niski."),
    w("บ้าน", "ban", "dom. Ton opadający. Razem: na wynos."),
    P,
  ],
  "no-ice": [
    w("ไม่", "maj", "nie."),
    w("ใส่", "saj", "dodawać. Ton niski."),
    w("น้ำแข็ง", "nam-keng", "lód. „keng” w górę."),
    P,
  ],
  "less-sweet": [
    w("หวาน", "łan", "słodkie. Ton w górę."),
    w("น้อย", "noj", "mało. Ton wysoki."),
    P,
  ],
  "one-person": [
    w("คน", "kon", "osoba. Ton równy."),
    w("เดียว", "diao", "jeden, sam. Ton równy."),
    P,
  ],
  "two-people": [w("สอง", "song", "dwa. Ton w górę."), w("คน", "kon", "osoba."), P],
  cash: [
    w("จ่าย", "dżaj", "płacić. Ton niski."),
    w("เงินสด", "ngen-sot", "gotówka. „sot” niski."),
    P,
  ],
  card: [
    w("จ่าย", "dżaj", "płacić."),
    w("บัตร", "bat", "karta. Ton niski."),
    w("ได้ไหม", "daj-maj", "czy można? „maj” w górę."),
    P,
  ],
  repeat: [
    w("พูด", "put", "mówić. Ton opadający."),
    w("อีกที", "ik-ti", "jeszcze raz."),
    w("ได้ไหม", "daj-maj", "czy możesz?"),
    P,
  ],
  "write-down": [
    w("เขียน", "kian", "napisać. Ton w górę."),
    w("ให้", "haj", "dla mnie. Ton opadający."),
    w("หน่อย", "noj", "proszę, troszkę."),
    P,
  ],
  english: [
    w("พูด", "put", "mówić."),
    w("ภาษา", "pa-sa", "język."),
    w("อังกฤษ", "ang-grit", "angielski. „grit” ton niski."),
    w("ได้ไหม", "daj-maj", "czy umiesz? „maj” w górę."),
    P,
  ],
};

export function coachWords(phrase: Phrase, speaker: Speaker): CoachWord[] {
  const raw = WORDS[phrase.id] ?? [];
  const bit = speaker === "m" ? particle.m : phrase.question ? particle.q : particle.f;
  return raw.map((word) => (word.th === "{p}" ? { th: bit.th, say: bit.say, gloss: bit.gloss } : word));
}

export const joins = [
  { pl: "i", th: "และ", say: "lae", gloss: "i. Ton wysoki. Między słowami albo zdaniami." },
  { pl: "lub", th: "หรือ", say: "ry", gloss: "lub. Usta lekko zaokrąglone, ton w górę." },
  { pl: "oraz", th: "และก็", say: "lae-go", gloss: "oraz, i też. Doklejasz drugie zdanie." },
] as const;

export function sayLine(phrase: Phrase, speaker: Speaker) {
  return coachWords(phrase, speaker)
    .map((word) => word.say)
    .join(" ");
}
