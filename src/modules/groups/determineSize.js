import { getNotesInGroup } from './../';

export default (group) => {
  const largest = { width: 100, height: 150 };
  for (const compare of getNotesInGroup(group.items)) {
    if (compare) {
      const newWidth = (compare.position.x + compare.size.width) + 100;
      const newHeight = (compare.position.y + compare.size.height) + 150;
      if (largest.width < newWidth) {
        largest.width = newWidth;
      }
      if (largest.height < newHeight) {
        largest.height = newHeight;
      }
    }
  }

  group.size = largest;
  return group.size;
};
