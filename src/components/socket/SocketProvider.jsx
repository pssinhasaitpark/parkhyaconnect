
// import React, { useEffect, createContext, useState } from 'react';
// import { io } from 'socket.io-client';
// import { useDispatch } from 'react-redux';
// import { setSocketConnected, addMessage, deleteMessage } from '../../redux/messagesSlice';

// const SocketContext = createContext();

// const SocketProvider = ({ children, userId }) => {
//   const dispatch = useDispatch();
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io('http://192.168.0.152:8000', {
//       transports: ['websocket', 'polling'],
//       auth: { token: localStorage.getItem('token') },
//     });

//     newSocket.on('connect', () => {
//       console.log('Socket connected:', newSocket.id);
//       dispatch(setSocketConnected(true));
//     });

//     newSocket.on('disconnect', () => {
//       console.log('Socket disconnected');
//       dispatch(setSocketConnected(false));
//     });

//     newSocket.on('messageUpdated', (updatedMessage) => {
//       dispatch(addMessage(updatedMessage));
//     });

//     newSocket.on('messageDeleted', (messageId) => {
//       dispatch(deleteMessage(messageId));
//     });

//     newSocket.on('receiveMessage', (newMessage) => {
//       dispatch(addMessage(newMessage));
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//       console.log("Socket disconnected on component unmount");
//     };
//   }, [dispatch]);

//   const sendMessage = (messageData) => {
//     if (socket && socket.connected) {
//       socket.emit('sendMessage', messageData);
//     }
//   };

//   const updateMessage = (messageData) => {
//     if (socket && socket.connected) {
//       socket.emit('updateMessage', messageData);
//     }
//   };

//   const deleteMessageSocket = (messageId) => {
//     if (socket && socket.connected) {
//       socket.emit('deleteMessage', messageId);
//     }
//   };

//   return (
//     <SocketContext.Provider value={{ sendMessage, updateMessage, deleteMessageSocket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export { SocketContext, SocketProvider };