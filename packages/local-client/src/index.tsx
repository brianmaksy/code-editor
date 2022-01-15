import 'bulmaswatch/superhero/bulmaswatch.min.css';
import ReactDOM from 'react-dom';
// import CodeCell from './components/code-cell';
import { Provider } from 'react-redux';
import CellList from './components/cell-list';
import { store } from './state';
// import TextEditor from './components/text-editor';


const App = () => {

  return (
    <Provider store={store}>
      <div>
        <h1>TEST</h1>
        <CellList />
      </div>
    </Provider>
  );
};


ReactDOM.render(<App />, document.querySelector('#root'));