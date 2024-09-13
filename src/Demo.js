import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMicrophone } from 'react-icons/fa';
import ChatAI from './ChatAI';

const Dictaphone = () => {
  const [messages, setMessages] = useState([]); // Lưu các tin nhắn chat
  const {
    interimTranscript,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const chatAI = ChatAI({ messages, setMessages }); // Sử dụng ChatAI
  const chatboxRef = useRef(null); // Tạo ref cho khung chat

  // Lưu finalTranscript vào danh sách tin nhắn khi nó thay đổi
  useEffect(() => {
    if (finalTranscript) {
      setMessages((prevMessages) => [...prevMessages, finalTranscript]);
      chatAI.run(finalTranscript); // Gọi hàm ChatAI khi có finalTranscript
      resetTranscript(); // Reset sau khi lưu
    }
  }, [finalTranscript, chatAI, resetTranscript]);

  // Cuộn xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages,interimTranscript]); // Cuộn xuống khi danh sách messages thay đổi

  // Kiểm tra nếu trình duyệt không hỗ trợ Web Speech API
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  // Bắt đầu nghe
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, interimResults: true });
  };

  // Dừng nghe
  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleReset = () => {
    resetTranscript(); // Reset transcript
    setMessages([]); // Xóa tất cả tin nhắn
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Chatbox with Speech Recognition</h5>
        </div>
        <div
          className="card-body"
          ref={chatboxRef} // Gắn ref vào khung chat
          style={{ maxHeight: '300px', overflowY: 'auto' }}
        >
          {/* Hiển thị các tin nhắn */}
          <div className="chatbox">
            {messages.map((message, index) => (
              <div key={index} className={`alert ${message.sender === 'bot' ? 'alert-info' : 'alert-secondary'}`}>
                  {message.text}
              </div>
            ))}

            {/* Hiển thị kết quả tạm thời */}
            {interimTranscript && (
              <div className="alert alert-warning">
                {interimTranscript} {/* Kết quả tạm thời */}
              </div>
            )}
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <button
            className="btn btn-primary"
            onMouseDown={startListening}
            onMouseUp={stopListening}
          >
            <FaMicrophone /> Hold to Talk
          </button>
          <button className="btn btn-danger" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dictaphone;
