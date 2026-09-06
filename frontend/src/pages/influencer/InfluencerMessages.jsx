import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  MessageCircle, Search, Send, Loader, Users, Phone, Video,
  MoreHorizontal, Image, Smile, Paperclip, ChevronLeft,
} from 'lucide-react';
import { format } from 'date-fns';

const InfluencerMessages = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const messagesEnd = useRef(null);

  useEffect(() => {
    chatAPI.getMyChats().then(res => {
      setChats(Array.isArray(res.data?.data) ? res.data.data : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeChat) {
      chatAPI.getById(activeChat.id).then(res => {
        setMessages(Array.isArray(res.data?.data?.messages) ? res.data.data.messages : []);
        chatAPI.markRead(activeChat.id).catch(() => {});
      }).catch(() => setMessages([]));
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim() || !activeChat) return;
    setSending(true);
    try {
      const res = await chatAPI.sendMessage(activeChat.id, { content: newMsg.trim() });
      setMessages(prev => [...prev, res.data?.data || { content: newMsg.trim(), senderId: user.id, createdAt: new Date() }]);
      setNewMsg('');
    } catch { /* silent */ }
    setSending(false);
  };

  const getOtherUser = (chat) => {
    const members = chat.members || [];
    const other = members.find(m => (m.id || m) !== user?.id);
    return other || { name: chat.name || 'Group Chat', avatar: '' };
  };

  const filtered = search
    ? chats.filter(c => getOtherUser(c).name?.toLowerCase().includes(search.toLowerCase()))
    : chats;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={28} className="text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="flex h-full">
        {/* Chat List */}
        <div className={`w-full md:w-80 border-r border-charcoal-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-charcoal-100">
            <h2 className="font-bold text-charcoal-900 mb-3">Messages</h2>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="text-center py-12 px-4">
                <MessageCircle size={36} className="text-charcoal-200 mx-auto mb-2" />
                <p className="text-sm text-charcoal-400">No conversations yet.</p>
              </div>
            )}
            {filtered.map(chat => {
              const other = getOtherUser(chat);
              const isActive = activeChat?.id === chat.id;
              const unread = chat.unreadCount || 0;
              return (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full flex items-center gap-3 p-4 border-b border-charcoal-50 transition-colors ${
                    isActive ? 'bg-brand-50' : 'hover:bg-cream-50'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0 overflow-hidden">
                    {other.avatar ? (
                      <img src={other.avatar} alt={other.name} className="w-full h-full object-cover" />
                    ) : (
                      other.name?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-charcoal-900 truncate">{other.name}</p>
                      {chat.lastMessage && (
                        <span className="text-[10px] text-charcoal-400 shrink-0">
                          {format(new Date(chat.lastMessage.createdAt || chat.updatedAt), 'h:mm a')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-charcoal-400 truncate">
                      {chat.lastMessage?.content || 'Start a conversation'}
                    </p>
                  </div>
                  {unread > 0 && (
                    <span className="w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Chat */}
        <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b border-charcoal-100">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-1 text-charcoal-400 hover:text-charcoal-700">
                  <ChevronLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0 overflow-hidden">
                  {getOtherUser(activeChat).avatar ? (
                    <img src={getOtherUser(activeChat).avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getOtherUser(activeChat).name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-charcoal-900">{getOtherUser(activeChat).name}</p>
                  <p className="text-[10px] text-green-500 font-medium">Online</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-50 rounded-lg transition-colors">
                    <Phone size={18} />
                  </button>
                  <button className="p-2 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-50 rounded-lg transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => {
                  const isMine = (msg.senderId || msg.sender?.id) === user?.id;
                  return (
                    <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        isMine
                          ? 'bg-brand-500 text-white rounded-br-md'
                          : 'bg-cream-50 text-charcoal-700 rounded-bl-md'
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${isMine ? 'text-white/60' : 'text-charcoal-400'}`}>
                          {format(new Date(msg.createdAt), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEnd} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-charcoal-100">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-charcoal-400 hover:text-charcoal-700 transition-colors">
                    <Paperclip size={18} />
                  </button>
                  <input
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !newMsg.trim()}
                    className="p-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors disabled:opacity-50"
                  >
                    {sending ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle size={48} className="text-charcoal-200 mx-auto mb-3" />
                <p className="text-sm text-charcoal-400">Select a conversation to start chatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfluencerMessages;
