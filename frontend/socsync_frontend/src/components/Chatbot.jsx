// components/ChatBot.jsx
import { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: inputMessage, isBot: false }]);
    
    try {
      const response = await axios.post('/api/chat', {
        message: inputMessage
      });

      // Add bot response
      setMessages(prev => [...prev, { 
        text: response.data.reply,
        isBot: true,
        table_data: response.data.table_data // For structured responses
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting to the server.",
        isBot: true 
      }]);
    }
    
    setInputMessage('');
  };

  const renderResponse = (msg) => {
    if (msg.table_data) {
      return (
        <div className="ai-table">
          <table>
            <thead>
              <tr>
                {Object.keys(msg.table_data[0]).map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {msg.table_data.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((value, j) => (
                    <td key={j}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return msg.text;
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                {renderResponse(msg)}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about events..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
      <div 
        className="chat-icon"
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundImage: "url('../assets/chatbot.png')" }}
      />
    </div>
  );
};

export default ChatBot;