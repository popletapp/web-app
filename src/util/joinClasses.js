export default (existingClasses, ...newClasses) => {
  return existingClasses.split(' ').concat(newClasses.filter(Boolean)).join(' ');
};
