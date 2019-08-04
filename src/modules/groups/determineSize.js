import { getNotesInGroup } from './../';

export default (group) => {
  const largest = { width: 0, height: 0 };
  for (const compare of getNotesInGroup(group.items)) {
    const newWidth = (compare.position.x + compare.size.width) + 100;
    const newHeight = (compare.position.y + compare.size.height) + 150;
    if (largest.width < newWidth) {
      largest.width = newWidth;
    }
    if (largest.height < newHeight) {
      largest.height = newHeight;
    }
  }
  group.size = largest;
  return group.size;
};
