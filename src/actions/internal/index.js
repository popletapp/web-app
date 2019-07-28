import {
  MODAL_POP,
  MODAL_PUSH,
  POPOUT_PUSH,
  POPOUT_POP
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
