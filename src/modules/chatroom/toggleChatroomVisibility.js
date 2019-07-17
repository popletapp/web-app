export default () => {
  const container = document.querySelector('.chatroom-container');
  if (container.style.display) {
    container.style.display = null;
  } else {
    container.style.display = 'none';
  }
}