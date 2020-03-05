const diff = require('diff');
export default (original, modified) => {
  const diffed = diff.diffWordsWithSpace(original, modified);
  return diffed;
}