import { RootState } from './../reducers/index';
import { Dispatch } from 'redux';
import { Action } from '../actions';
import { saveCells } from '../action-creators';
import { ActionType } from '../action-types';


// Middleware fn is a fn that returns a fn that returns a fn
export const persistMiddleware = ({
  dispatch,
  getState
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState
}) => {
  let timer: any;
  // a function taking in action and returning void 
  return (next: (action: Action) => void) => {
    return (action: Action) => {
      // forward on every single action 
      next(action);

      if ([ActionType.MOVE_CELL,
      ActionType.UPDATE_CELL,
      ActionType.INSERT_CELL_AFTER,
      ActionType.DELETE_CELL]
        .includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          saveCells()(dispatch, getState);
        }, 250);
      }
    };
  };
};