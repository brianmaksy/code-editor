import { useState, useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './/preview';
import Resizable from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import './code-cell.css';
import { useCumulativeCode } from '../hooks/use-cumulative-code';

interface CodeCellProps {
  cell: Cell
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [autorender, setAutorender] = useState("true");
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    // prevent needless timeOut on first load. 
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }

    if (autorender == "true") {
      const timer = setTimeout(async () => {
        createBundle(cell.id, cumulativeCode)
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
    // turn off dependency check
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [cumulativeCode, cell.id, createBundle]);



  const onClick = async () => {
    createBundle(cell.id, cell.content);
  };

  const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutorender(e.currentTarget.value);
  };

  const toggleOps = [
    { view: "on", value: "true" },
    { view: "off", value: "false" }
  ];


  return (
    <div>
      <Resizable direction="vertical">
        <div style={{ height: 'calc(100% - 10px)', display: 'flex', flexDirection: 'row' }}>
          <Resizable direction="horizontal">
            <CodeEditor
              initialValue={cell.content}
              onChange={(value) => updateCell(cell.id, value)}
            />

          </Resizable>
          <div className="progress-wrapper">
            {
              // not cell.loading 
              !bundle || bundle.loading ? (
                <div className="progress-cover">
                  <progress className="progress is-small is-primary" max="100">
                    Loading
                  </progress>
                </div>
              ) : (
                <Preview code={bundle.code} bundlingStatus={bundle.err} />
              )
            }
          </div>

        </div>
      </Resizable>
      <br></br>
      <div>
        {toggleOps.map(({ view: title, value: trueOrFalse }: any) => {
          return (
            <label key={title}>
              <input

                type="radio"
                value={trueOrFalse}
                checked={trueOrFalse === autorender}
                onChange={(e) => onRadioChange(e)}
              />
              Auto-rendering {title} {' '}
            </label>
          );
        })}
      </div>
      <div>
        {autorender == "false" &&
          <button onClick={onClick}>Submit</button>
        }
      </div>
    </div>
  );

};

export default CodeCell;

