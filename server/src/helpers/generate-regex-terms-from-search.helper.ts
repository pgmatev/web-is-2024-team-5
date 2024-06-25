export function generateRegexTermsFromSearch(search?: string) {
  if (!search) {
    return [/.*/];
  }

  const terms = search
    .split(' ')
    .map((term) => term.trim())
    .filter((term) => term.length > 0);

  return terms.map((term) => new RegExp(term, 'i'));
}
