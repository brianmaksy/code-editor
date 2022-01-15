import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

export const useActions = () => {
  const dispatch = useDispatch();


  // bind action only one time. Similar to useEffect and useState used together 
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);

};


