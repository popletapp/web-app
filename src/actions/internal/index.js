import {
  MODAL_POP,
  MODAL_PUSH,
  POPOUT_ADD,
  POPOUT_REMOVE,
  TOOLTIP_PUSH,
  CLEAR_TOOLTIPS,
  CONTEXT_MENU_ADD,
  CONTEXT_MENU_REMOVE
} from '../../constants/ActionTypes';

export const createModal = (id, modal) => ({
  type: MODAL_PUSH,
  id,
  modal
});

export const popTopModal = () => ({
  type: MODAL_POP
});

export const createPopout = (id, popout, options) => ({
  type: POPOUT_ADD,
  id,
  popout,
  options
});

export const removePopout = () => ({
  type: POPOUT_REMOVE
});

export const createContextMenu = (id, items, position) => ({
  type: CONTEXT_MENU_ADD,
  id,
  items,
  position
});

export const removeContextMenu = () => ({
  type: CONTEXT_MENU_REMOVE
});

export const createTooltip = (id, tooltip) => ({
  type: TOOLTIP_PUSH,
  id,
  tooltip
});

export const clearTooltips = () => ({
  type: CLEAR_TOOLTIPS
});
