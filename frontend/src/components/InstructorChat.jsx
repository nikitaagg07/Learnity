/*import React, { useState, useEffect } from 'react';
import socket from '../services/socket';
import axios from 'axios';

const InstructorChat = ({ currentUserId, currentUserRole }) => {
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket.on('messageReceived', (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    socket.on('typing', () => setIsTyping(true));
    socket.on('stopTyping', () => setIsTyping(false));
  }, []);

  const joinRoom = async (id) => {
    setRoomId(id);
    socket.emit('joinRoom', id);

    const { data } = await axios.get(`http://localhost:5000/api/chat/messages/${id}`);
    setMessages(data);
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;
    socket.emit('stopTyping', roomId);

    const { data } = await axios.post('http://localhost:5000/api/chat/send-message', {
      chatRoomId: roomId,
      senderId: currentUserId,
      senderModel: currentUserRole,
      content: message
    });

    socket.emit('newMessage', data);
    setMessage('');
  };

  const handleTyping = () => {
    socket.emit('typing', roomId);
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.sender?.FName || msg.sender?.name}:</b> {msg.content}
            {msg.fileUrl && <a href={`http://localhost:5000${msg.fileUrl}`} target="_blank">File</a>}
          </div>
        ))}
        {isTyping && <p>Someone is typing...</p>}
      </div>

      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        onKeyPress={handleTyping}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default InstructorChat;*/



/*import React, { useState, useEffect } from 'react';
import socket from '../services/socket';
import axios from 'axios';

const InstructorChat = ({ currentUserId, currentUserRole }) => {
  const [rooms, setRooms] = useState([]);  // Holds the chat rooms if necessary
  const [messages, setMessages] = useState([]);  // Holds the messages for the current room
  const [message, setMessage] = useState('');  // The current message being typed
  const [roomId, setRoomId] = useState('');  // ID of the current room
  const [isTyping, setIsTyping] = useState(false);  // To show "someone is typing..." message
  const currentUserId = localStorage.getItem('userId');
  const currentUserRole = localStorage.getItem('role');
  // This will listen for new messages and typing events from the backend
  useEffect(() => {
    socket.on('messageReceived', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);  // Add the new message to the messages state
    });

    socket.on('typing', () => setIsTyping(true));  // Show typing indicator
    socket.on('stopTyping', () => setIsTyping(false));  // Hide typing indicator

    return () => {
      socket.off('messageReceived');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, []);

  // Function to join a room
  const joinRoom = async (id) => {
    setRoomId(id);  // Set the room ID
    socket.emit('joinRoom', id);  // Notify server that the client is joining the room

    // Fetch the existing messages for the room
    const { data } = await axios.get(`http://localhost:5000/api/chat/messages/${id}`);
    setMessages(data);
  };

  // Function to handle sending a message
  /*const sendMessage = async () => {
    if (message.trim() === '' || !roomId || !currentUserId || !currentUserRole) {
      console.error('Missing required fields');
      return;  // Don't send the message if any required field is missing
    }

    socket.emit('stopTyping', roomId);  // Stop typing indicator

    // Send the message to the backend
    const { data } = await axios.post('http://localhost:5000/api/chat/send-message', {
      chatRoomId: roomId,
      senderId: currentUserId,
      senderModel: currentUserRole,
      content: message
    });

    socket.emit('newMessage', data);  // Notify all connected clients of the new message
    setMessage('');  // Clear the message input field
  };*/

  /*const sendMessage = async () => {
    console.log("roomId:", roomId);
    console.log("currentUserId:", currentUserId);
    console.log("currentUserRole:", currentUserRole);
  
    if (message.trim() === '' || !roomId || !currentUserId || !currentUserRole) {
      console.error('Missing required fields');
      return;  // Don't send the message if any required field is missing
    }
  
    socket.emit('stopTyping', roomId);  // Stop typing indicator
  
    // Send the message to the backend
    const { data } = await axios.post('http://localhost:5000/api/chat/send-message', {
      chatRoomId: roomId,
      senderId: currentUserId,
      senderModel: currentUserRole,
      content: message
    });
  
    socket.emit('newMessage', data);  // Notify all connected clients of the new message
    setMessage('');  // Clear the message input field
  };
  

  // Function to handle typing event
  const handleTyping = () => {
    socket.emit('typing', roomId);  // Notify backend that the user is typing
  };


  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.sender?.FName || msg.sender?.name}:</b> {msg.content}
            {msg.fileUrl && <a href={`http://localhost:5000${msg.fileUrl}`} target="_blank" rel="noopener noreferrer">File</a>}
          </div>
        ))}
        {isTyping && <p>Someone is typing...</p>}
      </div>

      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        onKeyPress={handleTyping}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default InstructorChat;*/



/*import React, { useState, useEffect } from 'react';
import socket from '../services/socket';
import axios from 'axios';

const ChatPage = () => {
  // State variables for userId, role, rooms, messages, and other chat-related states
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [rooms, setRooms] = useState([]);  // Holds the chat rooms if necessary
  const [messages, setMessages] = useState([]);  // Holds the messages for the current room
  const [message, setMessage] = useState('');  // The current message being typed
  const [roomId, setRoomId] = useState('');  // ID of the current room
  const [isTyping, setIsTyping] = useState(false);  // To show "someone is typing..." message

  // Fetch userId and role from localStorage when the component mounts
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    
    setCurrentUserId(userId);
    setCurrentUserRole(role);
  }, []); // Empty dependency array to run this once on mount

  // This will listen for new messages and typing events from the backend
  useEffect(() => {
    socket.on('messageReceived', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);  // Add the new message to the messages state
    });

    socket.on('typing', () => setIsTyping(true));  // Show typing indicator
    socket.on('stopTyping', () => setIsTyping(false));  // Hide typing indicator

    return () => {
      socket.off('messageReceived');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, []);

  // Function to join a room
  const joinRoom = async (id) => {
    if (!id) {
      console.error('Room ID is missing');
      return;
    }
    setRoomId(id);  // Set the room ID
    socket.emit('joinRoom', id);  // Notify server that the client is joining the room

    // Fetch the existing messages for the room
    const { data } = await axios.get(`http://localhost:5000/api/chat/messages/${id}`);
    setMessages(data);
  };

  // Function to handle sending a message
  const sendMessage = async () => {
    console.log("roomId:", roomId); 
    console.log("currentUserId:", currentUserId);
    console.log("currentUserRole:", currentUserRole);
    if (message.trim() === '' || !roomId || !currentUserId || !currentUserRole) {
      console.error('Missing required fields');
      return;  // Don't send the message if any required field is missing
    }

    socket.emit('stopTyping', roomId);  // Stop typing indicator

    // Send the message to the backend
    const { data } = await axios.post('http://localhost:5000/api/chat/send-message', {
      chatRoomId: roomId,
      senderId: currentUserId,
      senderModel: currentUserRole,
      content: message
    });

    socket.emit('newMessage', data);  // Notify all connected clients of the new message
    setMessage('');  // Clear the message input field
  };

  // Function to handle typing event
  const handleTyping = () => {
    socket.emit('typing', roomId);  // Notify backend that the user is typing
  };

  return (
    <div>
      <h2>Chat Room</h2>

     

     

      {/* Message input *//*}
      <div>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          onKeyPress={handleTyping}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;*/




// frontend/src/pages/ChatPage.jsx

/*import React, { useState, useEffect } from 'react';
import socket from '../services/socket';
import axios from 'axios';

const InstructorChat = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [rooms, setRooms] = useState([]);  
  const [messages, setMessages] = useState([]);  
  const [message, setMessage] = useState('');  
  const [roomId, setRoomId] = useState('');  
  const [isTyping, setIsTyping] = useState(false);  
  const [typingUser, setTypingUser] = useState('');
  const [selectedRoomName, setSelectedRoomName] = useState(''); 

  // 1. Load user info
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    setCurrentUserId(userId);
    setCurrentUserRole(role);
  }, []);

  // 2. Fetch All Chat Rooms (where user is a member)
  useEffect(() => {
    if (currentUserId) {
      fetchRooms();
    }
  }, [currentUserId]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/chat/user-rooms/${currentUserId}`);
      setRooms(data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  // 3. Listen to incoming messages
  useEffect(() => {
    socket.on('messageReceived', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on('typing', ({ roomId: typingRoomId, user }) => {
      if (typingRoomId === roomId) {
        setTypingUser(user);
        setIsTyping(true);
      }
    });

    socket.on('stopTyping', ({ roomId: typingRoomId }) => {
      if (typingRoomId === roomId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off('messageReceived');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [roomId]);

  // Join a Room
  const joinRoom = async (id, roomName) => {
    if (!id) {
      console.error('Room ID is missing');
      return;
    }
    setRoomId(id);
    setSelectedRoomName(roomName);
    socket.emit('joinRoom', id);

    const { data } = await axios.get(`http://localhost:5000/api/chat/messages/${id}`);
    setMessages(data);
  };

  // Send Message
  const sendMessage = async () => {
    console.log("roomId:", roomId);
    console.log("currentUserId:", currentUserId);
    console.log("currentUserRole:", currentUserRole);
    if (message.trim() === '' || !roomId || !currentUserId || !currentUserRole) {
      console.error('Missing required fields');
      return;
    }

    socket.emit('stopTyping', { roomId });

    const { data } = await axios.post('http://localhost:5000/api/chat/send-message', {
      chatRoomId: roomId,
      senderId: currentUserId,
      senderModel: currentUserRole,
      content: message
    });

    socket.emit('newMessage', data);

    setMessage('');
  };

  const handleTyping = () => {
    socket.emit('typing', { roomId, user: currentUserRole });
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Left Sidebar: Chat Rooms *//*}
      <div style={{ width: '25%', borderRight: '1px solid gray', padding: '10px' }}>
        <h3>Your Chat Rooms</h3>
        {rooms.map((room) => (
          <div key={room._id} style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => joinRoom(room._id, room.name || 'Private Chat')}>
            {room.name || 'Private Chat'}
          </div>
        ))}
      </div>

      {/* Right Side: Messages *//*}
      <div style={{ flex: 1, padding: '10px' }}>
        <h3>{selectedRoomName || 'Select a Room'}</h3>

        {/* Messages *//*}
        <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid black', padding: '10px' }}>
          {messages.map((msg, idx) => (
            <div key={idx}>
              <b>{msg.sender?.FName || msg.sender?.name || 'Unknown'}:</b> {msg.content}
              {msg.fileUrl && <a href={`http://localhost:5000${msg.fileUrl}`} target="_blank" rel="noopener noreferrer">File</a>}
            </div>
          ))}
          {isTyping && <p><i>{typingUser} is typing...</i></p>}
        </div>

        {/* Send Message *//*}
        <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleTyping}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default InstructorChat;*/










import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Paperclip } from 'lucide-react';

const socket = io('http://localhost:5000'); // Replace with production URL if needed

const InstructorChat = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [typingUser, setTypingUser] = useState('');
  const [file, setFile] = useState(null);
  const chatEndRef = useRef(null);

  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('instructorName') || localStorage.getItem('learnerName');

  useEffect(() => {
    fetchRooms();

    socket.on('receive_message', (msg) => {
      if (msg.chatRoom === currentRoomId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on('typing', (userName) => setTypingUser(userName));
    socket.on('stop_typing', () => setTypingUser(''));
    socket.on('read_message', (user) => console.log('Read by', user));

    return () => socket.disconnect();
  }, [currentRoomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRooms = async () => {
    const res = await axios.get(`http://localhost:5000/api/chatrooms/${userId}`);
    setChatRooms(res.data);
  };

  const fetchMessages = async (roomId) => {
    setCurrentRoomId(roomId);
    const res = await axios.get(`http://localhost:5000/api/messages/${roomId}`);
    setMessages(res.data);
    socket.emit('join_room', roomId);
    socket.emit('read_message', { chatRoomId: roomId, userId });
  };

  const handleSend = async () => {
    if (!messageInput.trim() && !file) return;
    const formData = new FormData();
    formData.append('chatRoomId', currentRoomId);
    formData.append('senderId', userId);
    formData.append('senderModel', role === 'learner' ? 'Learner' : 'Instructor');
    formData.append('content', messageInput);
    if (file) formData.append('file', file);

    const res = await axios.post('http://localhost:5000/api/message', formData);
    socket.emit('send_message', { chatRoomId: currentRoomId, message: res.data });
    setMessageInput('');
    setFile(null);
  };

  const handleTyping = () => {
    socket.emit('typing', { chatRoomId: currentRoomId, senderName: name });
    setTimeout(() => socket.emit('stop_typing', { chatRoomId: currentRoomId }), 3000);
  };

  return (
    <div className="flex h-[90vh] w-full">
      <div className="w-1/3 p-4 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chat Rooms</h2>
        {chatRooms.map((room) => (
          <Card
            key={room._id}
            onClick={() => fetchMessages(room._id)}
            className={`mb-2 cursor-pointer hover:bg-gray-100 ${currentRoomId === room._id ? 'bg-gray-200' : ''}`}
          >
            <CardContent className="p-4">
              {room.isGroupChat ? room.chatName : 'Private Chat'}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="w-2/3 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-2">
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-2">
              <strong>{msg.senderModel}</strong>: {msg.content}
              {msg.file && (
                <div>
                  <a href={`http://localhost:5000${msg.file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Download File
                  </a>
                </div>
              )}
            </div>
          ))}
          {typingUser && <p className="text-sm text-gray-500">{typingUser} is typing...</p>}
          <div ref={chatEndRef} />
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type a message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleTyping}
            className="flex-1"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Paperclip />
          </label>
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default InstructorChat;
