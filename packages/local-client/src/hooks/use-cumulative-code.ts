import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    // get data and order then iterate over all cells 
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const showFunc =
      `
      import _React from 'react';
      import _ReactDOM from 'react-dom';
      var show = (value) => {
        const root = document.querySelector('#root');
        if (typeof value === 'object') {
          if (value.$$typeof && value.props) {
            _ReactDOM.render(value, root);
          } else {
          root.innerHTML = JSON.stringify(value);
          }
        } else {
          root.innerHTML = value;
        }
      };
    `;
    // var can be defined as many times as possible. 
    const showFuncNoop = 'var show = () => {}';
    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === 'code') {
        // add to current cell 
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          // this must be a previous cell 
          cumulativeCode.push(showFuncNoop); // var show is replaced by the one in showFuncNoop
        }
        cumulativeCode.push(c.content);
      }
      // stop when id equals to current cell id 
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  }).join('\n'); // a string instead of an array of strings 

};