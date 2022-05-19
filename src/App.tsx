import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { invoke } from '@tauri-apps/api';
import { open } from '@tauri-apps/api/dialog';
import { emit, listen } from '@tauri-apps/api/event';

function App() {
  const [count, setCount] = useState(0);

  const executeCommand = () => {
    invoke('simple_command');
  };

  const executeCommandWithMessage = () => {
    invoke('command_with_message', { message: 'noripi10' }).then((response) => {
      console.log('command_with_message_response', response);
    });
  };

  const executeCommandWithObject = () => {
    invoke('command_with_object', { message: { field_str: 'some message', field_u32: 12 } }).then((message) => {
      console.log('command_with_object_response', message);
    });
  };

  const executeCommandWithErr = () => {
    Promise.all(
      [0, 1, 2, 3, 4].map((arg) => {
        invoke('command_with_error', { arg }).then((message) => {
          console.log('command_with_err_response', message);
        });
      })
    );
  };

  const executeCommandAsync = () => {
    invoke('async_command', { arg: 14 }).then((message) => {
      console.log('async_command', message);
    });
  };

  const openDialog = () => {
    open().then((files) => console.log(files));
  };

  const emitMessage = () => {
    emit('front-to-back', 'hello from front');
  };

  useEffect(() => {
    let unlisten: any;
    const f = async () => {
      unlisten = await listen('back-to-front', (event) => {
        console.log(`back-to-front ${event.payload} ${new Date()}`);
      });
    };
    f();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>Hello World On Vite + React!</p>

        <button type='button' onClick={() => setCount((count) => count + 1)}>
          count is: {count}
        </button>
        <button onClick={executeCommand}>command execute!</button>
        <button onClick={executeCommandWithMessage}>command with message execute!</button>
        <button onClick={executeCommandWithObject}>command with object execute!</button>
        <button onClick={executeCommandWithErr}>command with err execute!</button>
        <button onClick={executeCommandAsync}>command async execute!</button>
        <button onClick={openDialog}>open dialog!</button>
        <button onClick={emitMessage}>emit message!</button>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
            Learn React
          </a>
          {' | '}
          <a
            className='App-link'
            href='https://vitejs.dev/guide/features.html'
            target='_blank'
            rel='noopener noreferrer'
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
