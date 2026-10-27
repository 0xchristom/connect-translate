import type { Phrase, Speaker } from "@/data/phrases";

export type CoachWord = {
  th: string;
  say: string;
  gloss: string;
};

const particle = {
  m: { th: "ครับ", say: "krap", gloss: "cząstka grzeczności. Ton wysoki i krótki." },
  f: { th: "ค่ะ", say: "kha", gloss: "cząstka grzeczności. Ton opadający." },
  q: { th: "คะ", say: "kha", gloss: "cząstka w pytaniu i po „na”. Ton wysoki." },
} as const;

const P: CoachWord = { th: "{p}", say: "", gloss: "" };

function w(th: string, say: string, gloss: string): CoachWord {
  return { th, say, gloss };
}

function where(th: string, say: string, gloss: string): CoachWord[] {
  return [
    w(th, say, gloss),
    w("อยู่", "ju", "znajduje się. Ton niski."),
    w("ที่ไหน", "ti-naj", "gdzie. „ti” opadający, „naj” w górę."),
    P,
  ];
}

function here(): CoachWord[] {
  return [w("จอด", "dżot", "zatrzymaj. Ton niski."), w("ตรงนี้", "trong-ni", "tutaj. „ni” ton wysoki."), P];
}

function meter(): CoachWord[] {
  return [w("เปิด", "poet", "włącz. Ton niski."), w("มิเตอร์", "mi-te", "licznik. „mi” wysoki."), w("ด้วย", "duaj", "też / proszę. Ton opadający."), P];
}

function help(): CoachWord[] {
  return [w("ช่วย", "czuaj", "pomóż. Ton opadający."), w("ด้วย", "duaj", "proszę. Ton opadający.")];
}

function learning(): CoachWord[] {
  return [
    w("พูดไทย", "put-taj", "mówić po tajsku."),
    w("ได้", "daj", "umiem. Ton opadający."),
    w("นิดหน่อย", "nit-noj", "tylko troszkę."),
    w("กำลัง", "gam-lang", "właśnie, w trakcie."),
    w("เรียน", "rian", "uczyć się."),
    w("อยู่", "ju", "ciągle. Ton niski."),
    P,
  ];
}

const WORDS: Record<string, CoachWord[]> = {
  hi: [w("สวัสดี", "sa-wat-di", "cześć. Tony: niski, niski, równy."), P],
  hi2: [w("สวัสดี", "sa-wat-di", "cześć. Tony: niski, niski, równy."), P],
  "good-day": [w("สวัสดี", "sa-wat-di", "dzień dobry. To samo co cześć, cały dzień."), P],
  "good-day2": [w("สวัสดี", "sa-wat-di", "dzień dobry. To samo co cześć, cały dzień."), P],
  thanks: [w("ขอบคุณ", "kop-kun", "dziękuję. Ton niski, potem równy."), P],
  thanks2: [w("ขอบคุณ", "kop-kun", "dziękuję. Ton niski, potem równy."), P],
  "thanks-casual": [
    w("ขอบคุณ", "kop-kun", "dziękuję."),
    w("นะ", "na", "łagodzi: dzięki, nie sztywno. Ton wysoki."),
    P,
  ],
  "thanks-casual2": [
    w("ขอบคุณ", "kop-kun", "dziękuję."),
    w("นะ", "na", "łagodzi: dzięki, nie sztywno. Ton wysoki."),
    P,
  ],
  "thanks-much": [
    w("ขอบคุณ", "kop-kun", "dziękuję."),
    w("มาก", "mak", "bardzo. Ton opadający."),
    P,
  ],
  sorry: [w("ขอโทษ", "ko-tot", "przepraszam. Ton w górę, potem w dół."), P],
  sorry2: [w("ขอโทษ", "ko-tot", "przepraszam. Ton w górę, potem w dół."), P],
  ok: [
    w("ไม่", "maj", "nie. Ton opadający."),
    w("เป็น", "pen", "jest. Ton równy."),
    w("ไร", "raj", "sprawa. Ton równy."),
    P,
  ],
  noproblem: [
    w("ไม่", "maj", "nie. Ton opadający."),
    w("เป็น", "pen", "jest. Ton równy."),
    w("ไร", "raj", "sprawa. Ton równy."),
    P,
  ],
  yes: [w("ใช่", "czaj", "tak, zgadza się. Ton opadający."), P],
  no: [
    w("ไม่", "maj", "nie. Ton opadający."),
    w("ใช่", "czaj", "zgadza się. Razem: to nie tak."),
    P,
  ],
  understand: [
    w("ไม่", "maj", "nie."),
    w("เข้าใจ", "kao-dżaj", "rozumieć. Ton opadający, potem równy."),
    P,
  ],
  slow: [
    w("พูด", "put", "mówić. Ton opadający."),
    w("ช้าๆ", "cza-cza", "wolno. Ton wysoki, dwa razy."),
    w("หน่อย", "noj", "trochę. Ton niski."),
    P,
  ],
  this: [w("เอา", "ao", "biorę. Ton równy."), w("อันนี้", "an-ni", "to. „ni” ton wysoki."), P],
  this2: [w("เอา", "ao", "biorę. Ton równy."), w("อันนี้", "an-ni", "to. „ni” ton wysoki."), P],
  "take-this": [w("เอา", "ao", "biorę."), w("อันนี้", "an-ni", "to."), P],
  mild: [w("ไม่", "maj", "nie."), w("เผ็ด", "pet", "ostre. Ton niski."), P],
  notspicy: [w("ไม่", "maj", "nie."), w("เผ็ด", "pet", "ostre. Ton niski."), P],
  water: [w("ขอ", "ko", "poproszę. Ton w górę."), w("น้ำเปล่า", "nam-plao", "woda. „nam” wysoki, „plao” niski."), P],
  water2: [w("ขอ", "ko", "poproszę."), w("น้ำเปล่า", "nam-plao", "woda niegazowana."), P],
  bill: [w("เช็ค", "czek", "sprawdzić. Ton wysoki."), w("บิล", "bin", "rachunek. Ton równy."), P],
  bill2: [w("เช็ค", "czek", "sprawdzić."), w("บิล", "bin", "rachunek."), P],
  toilet: where("ห้องน้ำ", "hong-nam", "toaleta. „hong” opadający, „nam” wysoki."),
  "where-toilet": where("ห้องน้ำ", "hong-nam", "toaleta."),
  stop: here(),
  stop2: here(),
  here: here(),
  howmuch: [w("เท่าไหร่", "tao-raj", "ile. Ton opadający, potem niski."), P],
  "howmuch-taxi": [w("เท่าไหร่", "tao-raj", "ile."), P],
  meter: meter(),
  meter2: meter(),
  help: help(),
  help2: help(),
  "want-chicken": [w("เอา", "ao", "biorę."), w("ไก่", "gaj", "kurczak. Ton niski."), P],
  "want-beef": [w("เอา", "ao", "biorę."), w("เนื้อ", "nya", "wołowina. „y” z rozciągniętymi ustami, ton wysoki."), P],
  "want-pork": [w("เอา", "ao", "biorę."), w("หมู", "mu", "wieprzowina. Ton w górę."), P],
  "want-fish": [w("เอา", "ao", "biorę."), w("ปลา", "pla", "ryba. Ton równy."), P],
  "want-shrimp": [w("เอา", "ao", "biorę."), w("กุ้ง", "gung", "krewetka. Ton opadający."), P],
  "no-meat": [
    w("ไม่", "maj", "nie."),
    w("กิน", "gin", "jem. Ton równy."),
    w("เนื้อสัตว์", "nya-sat", "mięso. „nya” wysoki, „sat” niski."),
    P,
  ],
  "want-veg": [w("กิน", "gin", "jem. Ton równy."), w("เจ", "dże", "kuchnia jay: wegańska. Długie „e”, ton równy."), P],
  "want-padthai": [w("เอา", "ao", "biorę."), w("ผัดไทย", "pat-taj", "pad thai. „pat” niski."), P],
  "want-friedrice": [w("เอา", "ao", "biorę."), w("ข้าวผัด", "kao-pat", "ryż smażony. „kao” opadający."), P],
  "want-tomyum": [w("เอา", "ao", "biorę."), w("ต้มยำ", "tom-jam", "tom yum. „tom” opadający."), P],
  "want-greencurry": [w("เอา", "ao", "biorę."), w("แกงเขียวหวาน", "geng-kiao-łan", "zielone curry. „kiao” i „łan” w górę."), P],
  menu: [w("ขอ", "ko", "poproszę."), w("เมนู", "me-nu", "menu. Ton równy."), w("หน่อย", "noj", "trochę."), P],
  littlespicy: [w("เผ็ด", "pet", "ostre."), w("นิดหน่อย", "nit-noj", "troszeczkę. „nit” wysoki, „noj” niski."), P],
  "nospicy-atall": [w("ไม่", "maj", "nie."), w("ใส่", "saj", "dodawać. Ton niski."), w("พริก", "prik", "chili. Ton wysoki."), P],
  isspicy: [w("เผ็ด", "pet", "ostre."), w("ไหม", "maj", "czy? Ton w górę, nie opadający."), P],
  nocoriander: [w("ไม่", "maj", "nie."), w("ใส่", "saj", "dodawać."), w("ผักชี", "pak-czi", "kolendra."), P],
  "allergy-peanut": [
    w("แพ้", "pe", "mam alergię. Ton wysoki."),
    w("ถั่วลิสง", "tua-li-song", "orzeszki ziemne. „song” w górę."),
    P,
  ],
  "allergy-seafood": [
    w("แพ้", "pe", "mam alergię. Ton wysoki."),
    w("อาหารทะเล", "a-han-ta-le", "owoce morza. „han” w górę."),
    P,
  ],
  "no-msg": [w("ไม่", "maj", "nie."), w("ใส่", "saj", "dodawać."), w("ผงชูรส", "pong-czu-rot", "glutaminian, MSG."), P],
  "no-sugar": [w("ไม่", "maj", "nie."), w("ใส่", "saj", "dodawać."), w("น้ำตาล", "nam-tan", "cukier. „nam” wysoki."), P],
  delicious: [w("อร่อย", "a-roj", "pyszne. Ton niski, potem niski."), w("มาก", "mak", "bardzo."), P],
  "very-delicious": [
    w("อร่อย", "a-roj", "pyszne."),
    w("มากๆ", "mak-mak", "bardzo, z naciskiem. Ton opadający, dwa razy."),
    P,
  ],
  full: [w("อิ่ม", "im", "syty. Ton niski."), w("แล้ว", "laew", "już. Ton wysoki."), P],
  "where-hotel": where("โรงแรม", "rong-raem", "hotel."),
  "where-station": where("สถานี", "sa-ta-ni", "stacja."),
  "where-airport": where("สนามบิน", "sa-nam-bin", "lotnisko. „nam” w górę."),
  "where-pharmacy": where("ร้านขายยา", "ran-kaj-ja", "apteka. „kaj” ton w górę."),
  "where-hospital": where("โรงพยาบาล", "rong-pa-ja-ban", "szpital."),
  "where-atm": where("ตู้เอทีเอ็ม", "tu-e-ti-em", "bankomat. „tu” opadający."),
  "where-711": where("เซเว่น", "se-wen", "7-Eleven. „wen” opadający."),
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
  "go-here": [w("ไป", "paj", "jechać."), w("ที่นี่", "ti-ni", "tutaj, tu. Oba opadające."), P],
  "howmuch-here": [
    w("ไป", "paj", "jechać."),
    w("ที่นี่", "ti-ni", "tutaj."),
    w("เท่าไหร่", "tao-raj", "ile."),
    P,
  ],
  slower: [
    w("ขับ", "kap", "prowadzić. Ton niski."),
    w("ช้าๆ", "cza-cza", "wolno. Ton wysoki, dwa razy."),
    w("หน่อย", "noj", "trochę."),
    P,
  ],
  "wait-here": [
    w("รอ", "ro", "czekać. Ton równy."),
    w("ตรงนี้", "trong-ni", "tutaj."),
    w("สักครู่", "sak-kru", "chwilę. „sak” niski, „kru” opadający."),
    P,
  ],
  price: [w("ราคา", "ra-ka", "cena. Ton równy."), w("เท่าไหร่", "tao-raj", "ile."), P],
  expensive: [w("แพง", "peng", "drogo. Ton równy."), w("ไป", "paj", "za bardzo."), P],
  "thanks-no": [
    w("ขอบคุณ", "kop-kun", "dzięki."),
    w("นะ", "na", "łagodzi. Ton wysoki."),
    P,
    w("แต่", "te", "ale. Ton niski."),
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
  looking: [w("ดู", "du", "oglądać. Ton równy."), w("เฉยๆ", "czoej-czoej", "tylko tak, bez celu. Ton w górę, dwa razy."), P],
  "try-on": [w("ลอง", "long", "spróbować, przymierzyć. Ton równy."), w("ได้ไหม", "daj-maj", "czy można?"), P],
  bigger: [
    w("มี", "mi", "jest, macie. Ton równy."),
    w("ไซซ์", "saj", "rozmiar."),
    w("ใหญ่", "jaj", "duży. Ton niski."),
    w("กว่า", "kwa", "bardziej. Ton niski."),
    w("นี้", "ni", "ten. Ton wysoki."),
    w("ไหม", "maj", "czy?"),
    P,
  ],
  bag: [w("ใส่", "saj", "włożyć."), w("ถุง", "tung", "torba. Ton w górę."), P],
  "no-bag": [w("ไม่", "maj", "nie."), w("เอา", "ao", "chcę."), w("ถุง", "tung", "torba."), P],
  "no-change": [
    w("ไม่", "maj", "nie."),
    w("มี", "mi", "mam."),
    w("เงินย่อย", "ngen-joj", "drobne. „joj” opadający."),
    P,
  ],
  "keep-change": [
    w("ไม่", "maj", "nie."),
    w("ต้อง", "tong", "trzeba. Ton opadający."),
    w("ทอน", "ton", "wydawać resztę. Ton równy."),
    P,
  ],
  booking: [w("จอง", "dżong", "rezerwować. Ton równy."), w("ไว้", "waj", "już ustalone. Ton wysoki."), w("แล้ว", "laew", "już."), P],
  key: [w("ขอ", "ko", "poproszę."), w("กุญแจ", "gun-dże", "klucz."), w("หน่อย", "noj", "trochę."), P],
  wifi: [
    w("รหัส", "ra-hat", "kod. Ton wysoki, potem niski."),
    w("ไวไฟ", "waj-faj", "wi-fi."),
    w("คือ", "ky", "to jest. „y” z rozciągniętymi ustami, ton równy."),
    w("อะไร", "a-raj", "co."),
    P,
  ],
  breakfast: [
    w("รวม", "ruam", "wliczone. Ton równy."),
    w("อาหารเช้า", "a-han-czao", "śniadanie. „czao” wysoki."),
    w("ไหม", "maj", "czy?"),
    P,
  ],
  luggage: [
    w("ฝาก", "fak", "zostawić na przechowanie. Ton niski."),
    w("กระเป๋า", "gra-pao", "torba, bagaż. „pao” w górę."),
    w("ได้ไหม", "daj-maj", "czy można?"),
    P,
  ],
  checkout: [w("ขอ", "ko", "poproszę."), w("เช็คเอาท์", "czek-ao", "wymeldowanie."), P],
  towel: [
    w("ขอ", "ko", "poproszę."),
    w("ผ้า", "pa", "tkanina. Ton opadający."),
    w("เช็ดตัว", "czet-tua", "do wycierania ciała."),
    w("หน่อย", "noj", "trochę."),
    P,
  ],
  "ac-broken": [w("แอร์", "e", "klimatyzacja. Ton równy."), w("เสีย", "sia", "zepsuta. Ton w górę."), P],
  "no-hot-water": [
    w("ไม่", "maj", "nie."),
    w("มี", "mi", "ma."),
    w("น้ำร้อน", "nam-ron", "ciepła woda. Oba wysokie."),
    P,
  ],
  police: [
    w("ช่วย", "czuaj", "proszę, pomóż. Ton opadający."),
    w("เรียก", "riak", "wezwać. Ton opadający."),
    w("ตำรวจ", "tam-ruat", "policja. „ruat” ton niski."),
    w("หน่อย", "noj", "trochę."),
    P,
  ],
  ambulance: [
    w("ช่วย", "czuaj", "proszę, pomóż."),
    w("เรียก", "riak", "wezwać."),
    w("รถพยาบาล", "rot-pa-ja-ban", "karetka. „rot” wysoki."),
    w("หน่อย", "noj", "trochę."),
    P,
  ],
  doctor: [
    w("ต้อง", "tong", "muszę. Ton opadający."),
    w("ไป", "paj", "iść."),
    w("หา", "ha", "do, odwiedzić. Ton w górę."),
    w("หมอ", "mo", "lekarz. Ton w górę."),
    P,
  ],
  hospital: [w("ไป", "paj", "jechać."), w("โรงพยาบาล", "rong-pa-ja-ban", "szpital."), P],
  sick: [w("ไม่", "maj", "nie."), w("สบาย", "sa-baj", "dobrze się czuć. Ton niski, potem równy."), P],
  pharmacy2: [w("ร้าน", "ran", "sklep. Ton wysoki."), w("ขาย", "kaj", "sprzedawać. Ton w górę."), w("ยา", "ja", "lekarstwo. Ton równy.")],
  stomach: [w("ปวด", "puat", "boli. Ton niski."), w("ท้อง", "tong", "brzuch. Ton wysoki."), P],
  diarrhea: [w("ท้อง", "tong", "brzuch. Ton wysoki."), w("เสีย", "sia", "zepsuty. Ton w górę."), P],
  fever: [w("เป็น", "pen", "mam. Ton równy."), w("ไข้", "kaj", "gorączka. Ton opadający."), P],
  headache: [w("ปวด", "puat", "boli. Ton niski."), w("หัว", "hua", "głowa. Ton w górę."), P],
  "lost-passport": [
    w("ทำ", "tam", "zrobić. Ton równy."),
    w("พาสปอร์ต", "pas-port", "paszport."),
    w("หาย", "haj", "zginąć. Ton w górę."),
    P,
  ],
  stolen: [w("โดน", "don", "spotkało mnie. Ton równy."), w("ขโมย", "ka-moj", "kradzież. „moj” w górę."), P],
  n1: [w("หนึ่ง", "nyng", "jeden. Ton niski. „y” z rozciągniętymi ustami.")],
  n2: [w("สอง", "song", "dwa. Ton w górę.")],
  n3: [w("สาม", "sam", "trzy. Ton w górę.")],
  n4: [w("สี่", "si", "cztery. Ton niski.")],
  n5: [w("ห้า", "ha", "pięć. Ton opadający.")],
  n6: [w("หก", "hok", "sześć. Ton niski.")],
  n7: [w("เจ็ด", "dżet", "siedem. Ton niski.")],
  n8: [w("แปด", "peet", "osiem. Ton niski. Długie, otwarte „e” i „p” bez chuchnięcia — inaczej niż „pet” (ostre).")],
  n9: [w("เก้า", "gao", "dziewięć. Ton opadający.")],
  n10: [w("สิบ", "sip", "dziesięć. Ton niski.")],
  n11: [w("สิบ", "sip", "dziesięć. Ton niski."), w("เอ็ด", "et", "jeden na końcu liczby. Ton niski.")],
  n20: [w("ยี่", "ji", "dwa przed dziesiątką. Ton opadający."), w("สิบ", "sip", "dziesięć. Nie mów „song sip”.")],
  n50: [w("ห้า", "ha", "pięć. Ton opadający."), w("สิบ", "sip", "dziesiąt. Ton niski.")],
  n100: [w("ร้อย", "roj", "sto. Ton wysoki.")],
  n200: [w("สอง", "song", "dwa. Ton w górę."), w("ร้อย", "roj", "sto. Ton wysoki.")],
  n300: [w("สาม", "sam", "trzy. Ton w górę."), w("ร้อย", "roj", "sto.")],
  n400: [w("สี่", "si", "cztery. Ton niski."), w("ร้อย", "roj", "sto.")],
  n500: [w("ห้า", "ha", "pięć. Ton opadający."), w("ร้อย", "roj", "sto.")],
  n600: [w("หก", "hok", "sześć. Ton niski."), w("ร้อย", "roj", "sto.")],
  n700: [w("เจ็ด", "dżet", "siedem. Ton niski."), w("ร้อย", "roj", "sto.")],
  n800: [w("แปด", "peet", "osiem. Ton niski."), w("ร้อย", "roj", "sto.")],
  n900: [w("เก้า", "gao", "dziewięć. Ton opadający."), w("ร้อย", "roj", "sto.")],
  n1000: [w("พัน", "pan", "tysiąc. Ton równy.")],
  howareyou: [w("สบายดี", "sa-baj-di", "wszystko dobrze?"), w("ไหม", "maj", "czy? Ton w górę."), P],
  imfine: [w("สบายดี", "sa-baj-di", "dobrze."), P],
  bye: [
    w("ไป", "paj", "idę. Ton równy."),
    w("ก่อน", "gon", "już, najpierw. Ton niski."),
    w("นะ", "na", "łagodzi. Ton wysoki."),
    P,
  ],
  nicetomeet: [
    w("ยินดี", "jin-di", "miło."),
    w("ที่ได้", "ti-daj", "że mogę (dosłownie)."),
    w("รู้จัก", "ru-dżak", "poznać. „ru” wysoki, „dżak” niski."),
    P,
  ],
  "no-thai": [
    w("พูด", "put", "mówić."),
    w("ภาษา", "pa-sa", "język. „sa” ton w górę."),
    w("ไทย", "taj", "tajski. Ton równy."),
    w("ไม่ได้", "maj-daj", "nie umiem."),
    P,
  ],
  learning: learning(),
  learning2: learning(),
  "from-poland": [
    w("มา", "ma", "przyjechać. Ton równy."),
    w("จาก", "dżak", "z, od. Ton niski."),
    w("โปแลนด์", "po-laen", "Polska."),
    P,
  ],
  "first-time": [
    w("มา", "ma", "przyjechać."),
    w("ครั้งแรก", "krang-raek", "pierwszy raz. „krang” wysoki, „raek” opadający."),
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
    w("ที่นี่", "ti-ni", "tutaj. Oba opadające."),
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
    w("รูด", "rut", "przeciągnąć (kartę). Ton opadający."),
    w("บัตร", "bat", "karta. Ton niski."),
    w("ได้ไหม", "daj-maj", "czy można? „maj” w górę."),
    P,
  ],
  repeat: [
    w("พูด", "put", "mówić. Ton opadający."),
    w("อีกที", "ik-ti", "jeszcze raz. „ik” niski."),
    w("ได้ไหม", "daj-maj", "czy możesz?"),
    P,
  ],
  "write-down": [
    w("เขียน", "kian", "napisać. Ton w górę."),
    w("ให้", "haj", "dla mnie. Ton opadający."),
    w("หน่อย", "noj", "proszę, troszkę."),
    P,
  ],
  "show-map": [
    w("ชี้", "czi", "wskazać. Ton wysoki."),
    w("ใน", "naj", "w, na. Ton równy."),
    w("แผนที่", "pen-ti", "mapa. „pen” w górę, „ti” opadający."),
    w("ให้", "haj", "dla mnie."),
    w("หน่อย", "noj", "proszę."),
    P,
  ],
  "dont-know": [w("ไม่", "maj", "nie."), w("รู้", "ru", "wiem. Ton wysoki."), P],
  wait: [
    w("รอ", "ro", "czekać. Ton równy."),
    w("สักครู่", "sak-kru", "chwilę. „sak” niski, „kru” opadający."),
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
  return raw.map((word, index) => {
    if (word.th !== "{p}") return word;
    // Po „นะ” kobieta mówi „คะ”, tak jak w pytaniu (por. renderPhrase).
    const soft = phrase.question || raw[index - 1]?.th === "นะ";
    const bit = speaker === "m" ? particle.m : soft ? particle.q : particle.f;
    return { th: bit.th, say: bit.say, gloss: bit.gloss };
  });
}

export const joins = [
  { pl: "i", th: "และ", say: "lae", gloss: "i. Ton wysoki. Między słowami albo zdaniami." },
  { pl: "lub", th: "หรือ", say: "ry", gloss: "lub. „y” z rozciągniętymi ustami, ton w górę." },
  { pl: "oraz", th: "และก็", say: "lae-go", gloss: "oraz, i też. Doklejasz drugie zdanie." },
] as const;

export function sayLine(phrase: Phrase, speaker: Speaker) {
  return coachWords(phrase, speaker)
    .map((word) => word.say)
    .join(" ");
}
