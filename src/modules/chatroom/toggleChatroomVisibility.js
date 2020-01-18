export default () => {
  const container = document.querySelector('.chatroom-container');
  if (container.style.display) {
    container.style.display = null;
    container.classList.add('chatroom-entering');
    setTimeout(() => {
      container.classList.remove('chatroom-entering');
    }, 550);
  } else {
    container.classList.add('chatroom-exiting');
    setTimeout(() => {
      container.classList.remove('chatroom-exiting');
      container.style.display = 'none';
    }, 550);
  }
};
