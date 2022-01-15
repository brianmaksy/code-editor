import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[]; // order of different cells 
  data: {
    [key: string]: Cell;
  }
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SAVE_CELLS_ERROR:
      state.error = action.payload;
      return state;
    case ActionType.FETCH_CELLS:
      state.loading = true;
      state.error = null;
      return state;
    // changes state of data to be the cells we fetch from user's specified file. 
    case ActionType.FETCH_CELLS_COMPLETE:
      state.order = action.payload.map(cell => cell.id);
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellsState['data']);
      return state;
    case ActionType.FETCH_CELLS_ERROR:
      state.loading = false;
      state.error = action.payload;
      return state;

    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;

      state.data[id].content = content;
      return; // to not fall through to other cases, but not needed strictly speaking 
    case ActionType.DELETE_CELL:
      // to delete from both order[] and data{} 
      delete state.data[action.payload];

      // immer's filter function. Returns the new order array. 
      state.order = state.order.filter(id => id !== action.payload) // returns false on the id we don't want to keep 
      return;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id) // first time it returns true 
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return;
      }
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id; // moves to place of   original cell 

      return;
    case ActionType.INSERT_CELL_AFTER: {
      const cell: Cell = {
        content: '',
        type: action.payload.type,
        id: randomId(),
      };
      state.data[cell.id] = cell;
      const index = state.order.findIndex(id => id === action.payload.id)
      if (index < 0) {
        state.order.unshift(cell.id); // add to start 
      } else {
        state.order.splice(index + 1, 0, cell.id);
      }

      return;
    }
    default:
      return state;
  }
}, initialState
);

const randomId = () => {
  return Math.random().toString(36).substring(2, 5);
};

export default reducer;

