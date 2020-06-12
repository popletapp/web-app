export default (mouseBounds, rect2, boardBoundary = true) => {
    let mouseX = mouseBounds.x;
    let mouseY = mouseBounds.y;
    if (boardBoundary) {
        mouseX -= 200;
        mouseY -= 130;
    }

    const obj = {
        left: mouseX < rect2.position.x + rect2.size.width,
        right: mouseX > rect2.position.x,
        bottom: mouseY < rect2.position.y + rect2.size.height,
        top: mouseY > rect2.position.y
    }

    return { overlapping: (obj.left && 
        obj.right && 
        obj.bottom && 
        obj.top), obj };
}