import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import ChatList from './chatList';
import ChatPanel from './chatPanel';

function Chat() {
  const chatState = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const [input, setInput] = useState('');

  useEffect(() => {
    axios.post('http://localhost:5000/api/chat', { messages: [{ role: 'system', content: 'You are a helpful assistant.' }] })
      .then(response => {
        console.log('Initial messages:', response.data.messages); // Add logging
        dispatch({ type: 'ADD_MESSAGES', messages: response.data.messages });
        console.log('Current chat state:', chatState.messages);
      })
      .catch(error => {
        console.error('An error occurred while fetching the initial messages:', error);
      });
  }, []);

  const onSendMessage = () => {
    const messages = [...chatState.messages, { role: 'user', content: input }];
    console.log('Updated messages:', messages); // Add logging
    axios.post('http://localhost:5000/api/chat', { messages })
      .then(response => {
        console.log('Received response:', response.data);
        dispatch({ type: 'ADD_MESSAGES', messages: response.data.messages });
      })
      .catch(error => {
        console.error('An error occurred while sending the message:', error);
      });
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <ChatList messages={chatState.messages} />
      <ChatPanel onSendMessage={onSendMessage} input={input} setInput={setInput} />
    </div>
  );
}

export default Chat;
