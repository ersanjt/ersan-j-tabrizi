export function countryLanguage(code) {
  const country = String(code || '').toUpperCase();
  if (['DE', 'AT', 'CH', 'LI', 'LU'].includes(country)) return 'de';
  if (['RU', 'BY', 'KZ', 'KG'].includes(country)) return 'ru';
  if (['IR', 'AF', 'TJ'].includes(country)) return 'fa';
  if (country === 'TR') return 'tr';
  if (['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'YE', 'IQ', 'JO', 'LB', 'SY', 'PS', 'EG', 'LY', 'TN', 'DZ', 'MA', 'MR', 'SD', 'SO', 'DJ', 'KM', 'TD'].includes(country)) return 'ar';
  return 'en';
}

const supported = new Set(['en', 'de', 'ru', 'ar', 'fa', 'tr']);
const languageLinks = [...document.querySelectorAll('[data-language-link]')];
const recommendation = document.querySelector('[data-language-recommendation]');
const messages = {
  en: 'Recommended for you',
  de: 'Für Sie empfohlen',
  ru: 'Рекомендуем',
  ar: 'مقترحة لك',
  fa: 'پیشنهاد برای شما',
  tr: 'Sizin için önerilen'
};

function normalize(value) {
  const code = String(value || '').toLowerCase().split('-')[0];
  return supported.has(code) ? code : '';
}

function savedLanguage() {
  try {
    const stored = normalize(localStorage.getItem('ersan-language'));
    if (stored) return stored;
  } catch {}
  const cookie = document.cookie.match(/(?:^|;\s*)ersan-language=([a-z]{2})/i);
  return normalize(cookie?.[1]);
}

function recommend(locale) {
  const code = normalize(locale) || 'en';
  languageLinks.forEach((link) => {
    const active = link.dataset.locale === code;
    link.classList.toggle('is-recommended', active);
    if (active) link.setAttribute('aria-describedby', 'language-recommendation');
    else link.removeAttribute('aria-describedby');
  });
  if (recommendation) recommendation.textContent = messages[code];
}

languageLinks.forEach((link) => link.addEventListener('click', () => {
  const locale = normalize(link.dataset.locale);
  try { localStorage.setItem('ersan-language', locale); } catch {}
  document.cookie = `ersan-language=${locale}; Max-Age=31536000; Path=/; SameSite=Lax`;
}));

const saved = savedLanguage();
const browser = normalize(navigator.languages?.[0] || navigator.language);
if (saved || browser) {
  recommend(saved || browser);
} else {
  recommend('en');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  fetch('https://ipwho.is/', { signal: controller.signal })
    .then((response) => response.ok ? response.json() : null)
    .then((data) => { if (data?.success) recommend(countryLanguage(data.country_code)); })
    .catch(() => {})
    .finally(() => clearTimeout(timeout));
}
