export function countryLanguage(code) {
  const country = String(code || '').toUpperCase();
  if (['DE', 'AT', 'CH', 'LI', 'LU'].includes(country)) return 'de';
  if (['RU', 'BY', 'KZ', 'KG'].includes(country)) return 'ru';
  if (['IR', 'AF', 'TJ'].includes(country)) return 'fa';
  if (country === 'TR') return 'tr';
  if (['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'YE', 'IQ', 'JO', 'LB', 'SY', 'PS', 'EG', 'LY', 'TN', 'DZ', 'MA', 'MR', 'SD', 'SO', 'DJ', 'KM', 'TD'].includes(country)) return 'ar';
  return 'en';
}

const languageLinks = document.querySelectorAll('[data-language-link]');
if (languageLinks.length) {
  let preferred;
  try { preferred = localStorage.getItem('ersan-language'); } catch {}
  const go = (locale) => {
    if (!locale || locale === 'en') return;
    const link = [...languageLinks].find((item) => item.dataset.locale === locale);
    if (link) location.replace(link.href);
  };
  if (preferred) {
    go(preferred);
  } else {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    fetch('https://ipwho.is/', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data?.success) go(countryLanguage(data.country_code)); })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));
  }
}
