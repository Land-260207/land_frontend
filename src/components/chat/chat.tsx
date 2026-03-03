import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { chatSocket } from "../../common/socket";
import type { chatType } from "../../common/types/chat.type";
import { formatInTimeZone } from "date-fns-tz";
import { ko } from "date-fns/locale";

const Chat = () => {
  const [messages, setMessages] = useState<chatType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const [message, setMessage] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEnterDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      chatSocket.emit('message', message);
      setMessage('');
    }
  };

  useEffect(() => {
    chatSocket.connect();

    chatSocket.on('new_message', (data) => {
      setMessages(data.messages);
    });

    if (!hasScrolled.current) {
      setTimeout(() => {
        scrollToBottom();
        hasScrolled.current = true;
      }, 1500);
    }

    return () => {
      chatSocket.close();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="absolute left-[25%] bottom-12 h-[27.5%] w-[50%] rounded-xl flex flex-col items-start pointer-events-none space-y-5">
      <div className="w-full h-full p-2 shadow-xl pointer-events-auto bg-white/80 rounded-xl">
        <div className="w-full h-[85%] p-3 overflow-y-auto">
          <ul>
            {messages.map((message) => {
              const formattedDate = formatInTimeZone(message.created_at, "Asia/Seoul", "M월 d일 hh:mm", { locale: ko });
              
              return (
                <li key={message.id} className="flex justify-between">
                  <span className="w-[100%]">
                    <p>{message.User?.username}: {message.message}</p>
                  </span>
                  <p className="w-[16%]">{formattedDate}</p>
                </li>
              );
            })}
            
            <div ref={messagesEndRef} />
          </ul>
        </div>
        <div className="w-full h-[15%]">
          <input
            type="text"
            value={message}
            className="w-full h-full px-4 bg-transparent focus:outline-none"
            placeholder="메시지 입력"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => handleEnterDown(e)}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;