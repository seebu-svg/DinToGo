import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { chatAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  MessageCircle, Search, Send, Loader, X, ChevronLeft,
  Smile, Image as ImageIcon, MoreVertical, Phone, Video,
} from 'lucide-react';

const demoChats = [
  {
    id: 1, name: 'Ahmed Khan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    lastMessage: 'Sounds great! See you at 7 PM', lastTime: '2 min ago', unread: 2, online: true,
    messages: [
      { id: 1, text: 'Hey! Are you coming to the Italian dinner tonight?', sent: false, time: '6:30 PM' },
      { id: 2, text: 'Yes! Really excited about it. What time should I be there?', sent: true, time: '6:32 PM' },
      { id: 3, text: '7 PM at La Terrazza. I\'ll reserve a table for 6.', sent: false, time: '6:33 PM' },
      { id: 4, text: 'Perfect, I\'ll bring some friends if that\'s okay?', sent: true, time: '6:35 PM' },
      { id: 5, text: 'Sounds great! See you at 7 PM', sent: false, time: '6:36 PM' },
    ],
  },
  {
    id: 2, name: 'Sara Ali', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    lastMessage: 'The BBQ dinner was amazing!', lastTime: '1 hour ago', unread: 0, online: true,
    messages: [
      { id: 1, text: 'How was the BBQ dinner last night?', sent: true, time: '10:00 AM' },
      { id: 2, text: 'The BBQ dinner was amazing! Best brisket I\'ve had in Lahore.', sent: false, time: '10:15 AM' },
      { id: 3, text: 'We should do it again next month!', sent: true, time: '10:16 AM' },
    ],
  },
  {
    id: 3, name: 'Foodieshehryar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    lastMessage: 'Check out my new dinner event', lastTime: '3 hours ago', unread: 1, online: false,
    messages: [
      { id: 1, text: 'Hey Ahsan! I\'m hosting a sushi night next week.', sent: false, time: '2:00 PM' },
      { id: 2, text: 'Would love for you to join!', sent: false, time: '2:00 PM' },
      { id: 3, text: 'Check out my new dinner event', sent: false, time: '2:01 PM' },
    ],
  },
  {
    id: 4, name: 'Fatima Noor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    lastMessage: 'Thanks for the recommendation!', lastTime: 'Yesterday', unread: 0, online: false,
    messages: [
      { id: 1, text: 'Have you tried the new vegan place in Gulberg?', sent: true, time: 'Yesterday' },
      { id: 2, text: 'Thanks for the recommendation! Going there this weekend.', sent: false, time: 'Yesterday' },
    ],
  },
  {
    id: 5, name: 'Dinner Group - Italian Night', avatar: null,
    lastMessage: 'Bilal: I\'m bringing the wine!', lastTime: 'Yesterday', unread: 5, online: false, isGroup: true,
    messages: [
      { id: 1, text: 'Everyone confirmed for Saturday?', sent: false, time: 'Yesterday', sender: 'Ahmed' },
      { id: 2, text: 'Yes! Can\'t wait', sent: true, time: 'Yesterday' },
      { id: 3, text: 'I\'m bringing the wine!', sent: false, time: 'Yesterday', sender: 'Bilal' },
    ],
  },
];

const MessagesPage = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [search, setSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    chatAPI.getMyChats().then(res => {
      const items = res.data?.data || [];
      setChats(items.length > 0 ? items : demoChats);
    }).catch(() => {
      setChats(demoChats);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat]);

  const handleSend = () => {
    if (!newMessage.trim() || !activeChat) return;
    const updatedChats = chats.map(c =>
      c.id === activeChat.id
        ? {
            ...c,
            messages: [...c.messages, { id: Date.now(), text: newMessage.trim(), sent: true, time: 'Now' }],
            lastMessage: newMessage.trim(),
            lastTime: 'Now',
          }
        : c
    );
    setChats(updatedChats);
    setActiveChat(updatedChats.find(c => c.id === activeChat.id));
    setNewMessage('');
  };

  const filteredChats = chats.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));
  const totalUnread = chats.reduce((sum, c) => sum + (c.unread || 0), 0);

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-charcoal-900 mb-1.5">Messages</h1>
        <p className="text-charcoal-400 text-sm">Chat with fellow diners, coordinate dinners, and stay connected.</p>
      </div>

      <div className="card overflow-hidden flex" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        {/* Chat List */}
        <div className={`${activeChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-r border-charcoal-100 shrink-0`}>
          {/* Search */}
          <div className="p-4 border-b border-charcoal-100">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 bg-cream-50 border border-charcoal-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
          </div>

          {/* Chat Items */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-12"><Loader className="w-6 h-6 text-brand-500 animate-spin" /></div>
            ) : filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-charcoal-50 ${
                    activeChat?.id === chat.id ? 'bg-brand-50' : 'hover:bg-cream-50'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {chat.avatar ? (
                      <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                        {chat.name?.charAt(0)}
                      </div>
                    )}
                    {chat.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-charcoal-900 truncate">{chat.name}</p>
                      <span className="text-[10px] text-charcoal-400 shrink-0 ml-2">{chat.lastTime}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-charcoal-400 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="ml-2 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle size={32} className="text-charcoal-200 mx-auto mb-2" />
                <p className="text-sm text-charcoal-400">No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        {activeChat ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-charcoal-100 bg-white">
              <button onClick={() => setActiveChat(null)} className="md:hidden p-1 text-charcoal-400 hover:text-charcoal-600">
                <ChevronLeft size={20} />
              </button>
              <div className="relative">
                {activeChat.avatar ? (
                  <img src={activeChat.avatar} alt={activeChat.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                    {activeChat.name?.charAt(0)}
                  </div>
                )}
                {activeChat.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-charcoal-900 truncate">{activeChat.name}</p>
                <p className="text-[10px] text-charcoal-400">{activeChat.online ? 'Online' : 'Offline'}</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-50 rounded-lg transition-colors"><Phone size={16} /></button>
                <button className="p-2 text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-50 rounded-lg transition-colors"><Video size={16} /></button>
                <button className="p-2 text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-50 rounded-lg transition-colors"><MoreVertical size={16} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream-50/50">
              {activeChat.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${msg.sent ? 'order-1' : ''}`}>
                    {!msg.sent && msg.sender && (
                      <p className="text-[10px] font-semibold text-charcoal-500 mb-0.5 ml-1">{msg.sender}</p>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sent
                        ? 'bg-brand-500 text-white rounded-br-md'
                        : 'bg-white text-charcoal-800 border border-charcoal-100 rounded-bl-md'
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-[10px] text-charcoal-400 mt-0.5 ${msg.sent ? 'text-right mr-1' : 'ml-1'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-charcoal-100 bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2 text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-50 rounded-lg transition-colors"><ImageIcon size={18} /></button>
                <button className="p-2 text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-50 rounded-lg transition-colors"><Smile size={18} /></button>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-cream-50/50">
            <div className="text-center">
              <MessageCircle size={48} className="text-charcoal-200 mx-auto mb-3" />
              <p className="text-charcoal-400 font-medium">Select a conversation</p>
              <p className="text-charcoal-300 text-sm mt-1">Choose from your existing chats or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
