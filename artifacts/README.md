# Thai dla Polaków

Prosta mobilna aplikacja webowa z gotowymi frazesami polsko-tajskimi.

## Funkcje

- Kategorie: Pozdrowienia, Jedzenie, Kierunki, Transport, Zakupy, Hotel, Nagłe wypadki, Liczby, Podstawowe
- Interaktywne szablony (np. "Chcę [kurczak/wołowina/...]", "Gdzie jest [toaleta/hotel/...]")
- Wybór płci mówiącego (mężczyzna ครับ / kobieta ค่ะ) – automatycznie dostosowuje cząstki grzecznościowe
- Duży skrypt tajski + wymowa (romanizacja)
- Przycisk "Posłuchaj" (Web Speech API, język th-TH)
- Mobile-first, gotowe pod Cloudflare Pages

## Lokalne uruchomienie

Otwórz `index.html` w przeglądarce (lub użyj prostego serwera):

```bash
npx serve .
# lub
python -m http.server 8000
```

## Wdrożenie na Cloudflare Pages

1. Utwórz nowy projekt na Cloudflare Pages
2. Połącz z repozytorium Git (lub użyj Direct Upload)
3. Build command: *(puste)*
4. Output directory: `/` (lub folder z plikami)
5. Deploy!

Pliki do wgrania:
- `index.html`
- `styles.css`
- `app.js`
- `data.js`

## Rozszerzanie

Dane frazesów znajdują się w `data.js`. Łatwo dodać nowe kategorie, frazy lub opcje do szablonów.

## Uwagi

- Wymowa jest przybliżona (romanizacja z oznaczeniami tonów). Najlepiej ćwiczyć z native speakerem lub nagraniami.
- Synteza mowy zależy od przeglądarki i systemu (Android/Chrome zwykle działa dobrze z th-TH).
