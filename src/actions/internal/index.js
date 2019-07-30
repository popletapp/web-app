import {
  MODAL_POP,
  MODAL_PUSH,
  POPOUT_PUSH,
  POPOUT_POP,
  TOOLTIP_PUSH,
  CLEAR_TOOLTIPS
} from '../../constants/ActionTypes';

export const createModal = (id, modal) => ({
  type: MODAL_PUSH,
  id,
  modal
});

export const popTopModal = () => ({
  type: MODAL_POP
});

export const createPopout = (id, popout) => ({
  type: POPOUT_PUSH,
  id,
  popout
});

export const popTopPopout = () => ({
  type: POPOUT_POP
});

export const createTooltip = (id, tooltip) => ({
  type: TOOLTIP_PUSH,
  id,
  tooltip
});

export const clearTooltips = () => ({
  type: CLEAR_TOOLTIPS
});
