export default () => {
  const container = document.querySelector('.members-list');
  if (container.style.display) {
    container.style.display = null;
  } else {
    container.style.display = 'none';
  }
};
