// Thai-Polish Phrasebook Data
// Pronunciation uses practical romanization with tone marks where helpful (à low, â falling, á high, ǎ rising, unmarked mid)

const appData = {
  categories: [
    {
      id: "greetings",
      name: "Pozdrowienia",
      icon: "👋",
      description: "Podstawowe pozdrowienia i grzeczności",
      items: [
        {
          type: "phrase",
          polish: "Cześć / Dzień dobry (mężczyzna)",
          thai: "สวัสดีครับ",
          pron: "sà-wàt-dii kráp",
          note: "Zawsze dodawaj cząstkę grzecznościową. 'kráp' jeśli jesteś mężczyzną."
        },
        {
          type: "phrase",
          polish: "Cześć / Dzień dobry (kobieta)",
          thai: "สวัสดีค่ะ",
          pron: "sà-wàt-dii khâ",
          note: "'khâ' jeśli jesteś kobietą. Używaj z uśmiechem!"
        },
        {
          type: "phrase",
          polish: "Dziękuję (mężczyzna)",
          thai: "ขอบคุณครับ",
          pron: "khàwp-khun kráp",
          note: "Najważniejsza fraza. Używaj często."
        },
        {
          type: "phrase",
          polish: "Dziękuję (kobieta)",
          thai: "ขอบคุณค่ะ",
          pron: "khàwp-khun khâ",
          note: ""
        },
        {
          type: "phrase",
          polish: "Przepraszam / Przepraszam",
          thai: "ขอโทษครับ/ค่ะ",
          pron: "khɔ̌ɔ-thôot kráp / khâ",
          note: "Dla przeprosin i zwrócenia uwagi."
        },
        {
          type: "phrase",
          polish: "Nie ma sprawy / Proszę",
          thai: "ไม่เป็นไร",
          pron: "mâi bpen rai",
          note: "Odpowiedź na dziękuję lub przepraszam. Bardzo ważne w kulturze tajskiej."
        },
        {
          type: "phrase",
          polish: "Jak się masz? (m/k)",
          thai: "สบายดีไหมครับ/คะ",
          pron: "sà-baai dii mǎi kráp / khá",
          note: "Dosłownie 'czy jesteś wygodny/zdrowy?'"
        },
        {
          type: "phrase",
          polish: "Dobrze, dziękuję",
          thai: "สบายดี ขอบคุณครับ/ค่ะ",
          pron: "sà-baai dii khàwp-khun kráp / khâ",
          note: ""
        },
        {
          type: "phrase",
          polish: "Do widzenia",
          thai: "ลาก่อนครับ/ค่ะ",
          pron: "laa-gɔ̀ɔn kráp / khâ",
          note: "Można też użyć สวัสดี przy pożegnaniu."
        },
        {
          type: "phrase",
          polish: "Tak",
          thai: "ใช่",
          pron: "châi",
          note: "Lub ครับ/ค่ะ w odpowiedzi."
        },
        {
          type: "phrase",
          polish: "Nie",
          thai: "ไม่ใช่",
          pron: "mâi châi",
          note: ""
        },
        {
          type: "phrase",
          polish: "Nie rozumiem",
          thai: "ไม่เข้าใจ",
          pron: "mâi khâo jai",
          note: ""
        },
        {
          type: "phrase",
          polish: "Mów wolniej proszę",
          thai: "พูดช้าๆ หน่อย",
          pron: "phûut cháa-cháa nɔ̀i",
          note: ""
        }
      ]
    },
    {
      id: "food",
      name: "Jedzenie",
      icon: "🍜",
      description: "Zamawianie jedzenia i napojów",
      items: [
        {
          type: "template",
          polish: "Chcę [jedzenie]",
          baseThai: "เอา",
          basePron: "ao",
          addParticle: true,
          options: [
            { polish: "Kurczak", thai: "ไก่", pron: "gài" },
            { polish: "Wołowina", thai: "เนื้อ", pron: "nʉ́a" },
            { polish: "Wieprzowina", thai: "หมู", pron: "mǔu" },
            { polish: "Ryba", thai: "ปลา", pron: "bplaa" },
            { polish: "Krewetki", thai: "กุ้ง", pron: "gûng" },
            { polish: "Wegetariańskie (jay)", thai: "เจ", pron: "jay" },
            { polish: "Pad Thai", thai: "ผัดไทย", pron: "phàt thai" },
            { polish: "Ryż smażony", thai: "ข้าวผัด", pron: "khâao phàt" },
            { polish: "Tom Yum", thai: "ต้มยำ", pron: "dtôm yam" },
            { polish: "Zielone curry", thai: "แกงเขียวหวาน", pron: "gaeng khǐaw wǎan" }
          ]
        },
        {
          type: "phrase",
          polish: "Nieostre proszę",
          thai: "ไม่เผ็ดครับ/ค่ะ",
          pron: "mâi phèt kráp / khâ",
          note: "Ważne! Tajskie 'nieostre' może być nadal ostre dla Polaka. Poproś o mniej."
        },
        {
          type: "phrase",
          polish: "Trochę ostre",
          thai: "เผ็ดนิดหน่อยครับ/ค่ะ",
          pron: "phèt nít nɔ̀i kráp / khâ",
          note: "Bezpieczny wybór dla większości."
        },
        {
          type: "phrase",
          polish: "Czy jest ostre?",
          thai: "เผ็ดไหมครับ/คะ",
          pron: "phèt mǎi kráp / khá",
          note: ""
        },
        {
          type: "phrase",
          polish: "Menu proszę",
          thai: "ขอเมนูหน่อยครับ/ค่ะ",
          pron: "khɔ̌ɔ mee-nuu nɔ̀i kráp / khâ",
          note: ""
        },
        {
          type: "phrase",
          polish: "Wodę proszę",
          thai: "ขอน้ำเปล่าครับ/ค่ะ",
          pron: "khɔ̌ɔ náam bplàao kráp / khâ",
          note: ""
        },
        {
          type: "phrase",
          polish: "Rachunek proszę",
          thai: "เช็คบิลครับ/ค่ะ",
          pron: "chék bin kráp / khâ",
          note: "Albo 'เก็บตังค์' (gep dtang)"
        },
        {
          type: "phrase",
          polish: "Pyszne!",
          thai: "อร่อย",
          pron: "à-ròi",
          note: "Tajowie lubią słyszeć pochwały jedzenia."
        },
        {
          type: "phrase",
          polish: "Jestem pełny/a",
          thai: "อิ่มแล้ว",
          pron: "ìm láew",
          note: ""
        },
        {
          type: "phrase",
          polish: "Bez kolendry",
          thai: "ไม่ใส่ผักชี",
          pron: "mâi sài phàk-chii",
          note: "Kolendra jest powszechna, wiele osób jej nie lubi."
        }
      ]
    },
    {
      id: "directions",
      name: "Kierunki",
      icon: "🗺️",
      description: "Pytanie o drogę i nawigacja",
      items: [
        {
          type: "template",
          polish: "Gdzie jest [miejsce]?",
          baseThai: "",
          basePron: "",
          suffixThai: "อยู่ที่ไหน",
          suffixPron: "yùu thîi nǎi",
          addParticle: false,
          options: [
            { polish: "Toaleta", thai: "ห้องน้ำ", pron: "hông náam" },
            { polish: "Hotel", thai: "โรงแรม", pron: "rohng raem" },
            { polish: "Stacja BTS/MRT", thai: "สถานี", pron: "sà-thǎa-nii" },
            { polish: "Lotnisko", thai: "สนามบิน", pron: "sà-nǎam bin" },
            { polish: "Szpital", thai: "โรงพยาบาล", pron: "rohng phá-yaa-baan" },
            { polish: "Apteka", thai: "ร้านขายยา", pron: "ráan khǎai yaa" },
            { polish: "Policja", thai: "สถานีตำรวจ", pron: "sà-thǎa-nii dtam-rùat" },
            { polish: "Bank / ATM", thai: "ธนาคาร / ตู้เอทีเอ็ม", pron: "thá-naa-khaan / tûu e-tii-em" }
          ]
        },
        {
          type: "phrase",
          polish: "W lewo",
          thai: "เลี้ยวซ้าย",
          pron: "líeow sáai",
          note: ""
        },
        {
          type: "phrase",
          polish: "W prawo",
          thai: "เลี้ยวขวา",
          pron: "líeow khwǎa",
          note: ""
        },
        {
          type: "phrase",
          polish: "Prosto",
          thai: "ตรงไป",
          pron: "dtrong bpai",
          note: ""
        },
        {
          type: "phrase",
          polish: "Zatrzymaj tutaj",
          thai: "จอดตรงนี้ / หยุดตรงนี้",
          pron: "jàwt dtrong níi / yùt dtrong níi",
          note: "Dla taksówki lub tuk-tuka."
        },
        {
          type: "phrase",
          polish: "Jak daleko?",
          thai: "ไกลไหม",
          pron: "glai mǎi",
          note: ""
        },
        {
          type: "phrase",
          polish: "Jestem zagubiony",
          thai: "หลงทาง",
          pron: "lǒng thaang",
          note: "Albo 'ผม/ฉันหลงทาง'"
        }
      ]
    },
    {
      id: "transport",
      name: "Transport",
      icon: "🚕",
      description: "Taksówki, tuk-tuk, BTS",
      items: [
        {
          type: "template",
          polish: "Jedź do [miejsce]",
          baseThai: "ไป",
          basePron: "bpai",
          addParticle: true,
          options: [
            { polish: "Lotnisko", thai: "สนามบิน", pron: "sà-nǎam bin" },
            { polish: "Siam Paragon", thai: "สยามพารากอน", pron: "sà-yǎam paa-raa-gɔɔn" },
            { polish: "Khao San Road", thai: "ถนนข้าวสาร", pron: "thà-nǒn khâao sǎan" },
            { polish: "Grand Palace", thai: "พระบรมมหาราชวัง", pron: "phrá bò-rom má-hǎa râat-chá-wang" },
            { polish: "Mój hotel", thai: "โรงแรมของผม/ฉัน", pron: "rohng raem khɔ̌ɔng phǒm / chǎn" }
          ]
        },
        {
          type: "phrase",
          polish: "Włącz licznik proszę",
          thai: "เปิดมิเตอร์ด้วยครับ/ค่ะ",
          pron: "bpòet mí-dtôe dûuai kráp / khâ",
          note: "Zawsze proś o meter w taksówce w Bangkoku!"
        },
        {
          type: "phrase",
          polish: "Ile to kosztuje?",
          thai: "เท่าไหร่",
          pron: "tâo-rài",
          note: "Albo 'ราคาเท่าไหร่'"
        },
        {
          type: "phrase",
          polish: "Zatrzymaj tutaj",
          thai: "จอดตรงนี้ครับ/ค่ะ",
          pron: "jàwt dtrong níi kráp / khâ",
          note: ""
        }
      ]
    },
    {
      id: "shopping",
      name: "Zakupy",
      icon: "🛍️",
      description: "Targowanie i zakupy",
      items: [
        {
          type: "phrase",
          polish: "Ile to kosztuje?",
          thai: "ราคาเท่าไหร่",
          pron: "raa-khaa tâo-rài",
          note: ""
        },
        {
          type: "phrase",
          polish: "Za drogo",
          thai: "แพงไป",
          pron: "phaaeng bpai",
          note: ""
        },
        {
          type: "phrase",
          polish: "Możesz obniżyć cenę?",
          thai: "ลดหน่อยได้ไหม",
          pron: "lót nàwy dâi mái",
          note: "Na targach zawsze można się targować."
        },
        {
          type: "phrase",
          polish: "Wezmę to",
          thai: "เอาอันนี้",
          pron: "ao an níi",
          note: "Wskaż na przedmiot."
        },
        {
          type: "phrase",
          polish: "Tylko oglądam",
          thai: "แค่ดู",
          pron: "khâae duu",
          note: ""
        }
      ]
    },
    {
      id: "hotel",
      name: "Hotel",
      icon: "🏨",
      description: "W hotelu",
      items: [
        {
          type: "phrase",
          polish: "Mam rezerwację",
          thai: "จองไว้แล้ว",
          pron: "jɔɔng wái láew",
          note: ""
        },
        {
          type: "phrase",
          polish: "Klucz proszę",
          thai: "ขอกุญแจหน่อย",
          pron: "khɔ̌ɔ kun-jae nɔ̀i",
          note: ""
        },
        {
          type: "phrase",
          polish: "WiFi hasło?",
          thai: "รหัส WiFi คืออะไร",
          pron: "rá-hàt WiFi khʉʉ à-rai",
          note: ""
        },
        {
          type: "phrase",
          polish: "Check-out",
          thai: "เช็คเอาท์",
          pron: "chék-àot",
          note: ""
        }
      ]
    },
    {
      id: "emergency",
      name: "Nagłe wypadki",
      icon: "🚨",
      description: "Pomoc i awarie",
      items: [
        {
          type: "phrase",
          polish: "Pomocy!",
          thai: "ช่วยด้วย",
          pron: "chûuai dûuai",
          note: "Krzycz głośno jeśli potrzeba."
        },
        {
          type: "phrase",
          polish: "Zadzwoń na policję",
          thai: "โทรตำรวจ",
          pron: "thoo dtam-rùat",
          note: "Numer alarmowy: 191"
        },
        {
          type: "phrase",
          polish: "Potrzebuję lekarza",
          thai: "ต้องการหมอ",
          pron: "tɔ̂ng-gaan mɔ̌ɔ",
          note: ""
        },
        {
          type: "phrase",
          polish: "Szpital",
          thai: "โรงพยาบาล",
          pron: "rohng phá-yaa-baan",
          note: ""
        },
        {
          type: "phrase",
          polish: "Jestem chory/a",
          thai: "ไม่สบาย",
          pron: "mâi sà-baai",
          note: ""
        }
      ]
    },
    {
      id: "numbers",
      name: "Liczby",
      icon: "🔢",
      description: "Podstawowe liczby",
      items: [
        { type: "phrase", polish: "1", thai: "หนึ่ง", pron: "nèung", note: "" },
        { type: "phrase", polish: "2", thai: "สอง", pron: "sǒng", note: "" },
        { type: "phrase", polish: "3", thai: "สาม", pron: "sǎam", note: "" },
        { type: "phrase", polish: "4", thai: "สี่", pron: "sìi", note: "" },
        { type: "phrase", polish: "5", thai: "ห้า", pron: "hâa", note: "555 to śmiech w internecie!" },
        { type: "phrase", polish: "6", thai: "หก", pron: "hòk", note: "" },
        { type: "phrase", polish: "7", thai: "เจ็ด", pron: "jèt", note: "" },
        { type: "phrase", polish: "8", thai: "แปด", pron: "bpàet", note: "" },
        { type: "phrase", polish: "9", thai: "เก้า", pron: "gâo", note: "" },
        { type: "phrase", polish: "10", thai: "สิบ", pron: "sìp", note: "" },
        { type: "phrase", polish: "20", thai: "ยี่สิบ", pron: "yîi-sìp", note: "Wyjątek! Nie 'song-sip'" },
        { type: "phrase", polish: "100", thai: "ร้อย", pron: "rói", note: "" },
        { type: "phrase", polish: "1000", thai: "พัน", pron: "phan", note: "" }
      ]
    },
    {
      id: "basic",
      name: "Podstawowe",
      icon: "💬",
      description: "Inne przydatne słowa",
      items: [
        {
          type: "phrase",
          polish: "Ile to kosztuje?",
          thai: "เท่าไหร่",
          pron: "tâo-rài",
          note: ""
        },
        {
          type: "phrase",
          polish: "Gdzie?",
          thai: "ที่ไหน",
          pron: "thîi nǎi",
          note: ""
        },
        {
          type: "phrase",
          polish: "Kiedy?",
          thai: "เมื่อไหร่",
          pron: "mʉ̂a-rài",
          note: ""
        },
        {
          type: "phrase",
          polish: "Dlaczego?",
          thai: "ทำไม",
          pron: "tham-mai",
          note: ""
        },
        {
          type: "phrase",
          polish: "Proszę",
          thai: "กรุณา",
          pron: "gà-rú-naa",
          note: "Rzadziej używane niż cząstki ครับ/ค่ะ"
        },
        {
          type: "phrase",
          polish: "Nie mówię po tajsku",
          thai: "พูดภาษาไทยไม่ได้",
          pron: "phûut phaa-sǎa thai mâi dâi",
          note: ""
        }
      ]
    }
  ]
};

// Export for use in app.js (if module) or global
if (typeof module !== 'undefined') module.exports = appData;
else window.appData = appData;
