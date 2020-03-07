import { hasClass } from './';

export default (element, className) => {
  do {
    if (hasClass(element, className)) return element;
    element = element.parentElement || element.parentNode;
  } while (element !== null && element.nodeType === 1);
  return false;
}