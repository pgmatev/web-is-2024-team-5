export function generateRegexTermsFromSearch(search: string) {
  const terms = search
    .split(' ')
    .map((term) => term.trim())
    .filter((term) => term.length > 0);

  if (terms.length === 0) {
    return [];
  }

  return terms.map((term) => new RegExp(term, 'i'));
}
