import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  name: string;
  specialty: string;
  avatar_url: string;
}

interface Message {
  id: number;
  sender_id: number;
  content: string;
  message_type: string;
  file_url?: string;
  file_name?: string;
  created_at: string;
}

interface Chat {
  id: number;
  otherUser: User;
  lastMessage?: string;
  unread?: number;
}

export default function ChatInterface() {
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId] = useState(7);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mockUsers: User[] = [
      { id: 1, name: 'Д-р Иванова А.С.', specialty: 'Ревматолог', avatar_url: '' },
      { id: 2, name: 'Д-р Смирнов П.В.', specialty: 'Пульмонолог', avatar_url: '' },
      { id: 3, name: 'Д-р Петрова Е.М.', specialty: 'Клинический фармаколог', avatar_url: '' },
      { id: 4, name: 'Д-р Козлов И.П.', specialty: 'Кардиолог', avatar_url: '' },
      { id: 5, name: 'Д-р Новикова С.А.', specialty: 'Онколог', avatar_url: '' },
      { id: 6, name: 'Д-р Морозов Д.В.', specialty: 'Хирург', avatar_url: '' },
    ];
    setUsers(mockUsers);

    const mockChats: Chat[] = [
      {
        id: 1,
        otherUser: mockUsers[0],
        lastMessage: 'Спасибо за консультацию по пациенту',
        unread: 2,
      },
      {
        id: 2,
        otherUser: mockUsers[3],
        lastMessage: 'Отправил результаты ЭКГ',
        unread: 0,
      },
    ];
    setChats(mockChats);
  }, []);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    
    const mockMessages: Message[] = [
      {
        id: 1,
        sender_id: chat.otherUser.id,
        content: 'Здравствуйте, коллега! Нужна консультация по пациенту.',
        message_type: 'text',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 2,
        sender_id: currentUserId,
        content: 'Здравствуйте! Конечно, готов помочь. Опишите случай.',
        message_type: 'text',
        created_at: new Date(Date.now() - 3000000).toISOString(),
      },
      {
        id: 3,
        sender_id: chat.otherUser.id,
        content: 'Отправляю снимки рентгенографии',
        message_type: 'text',
        created_at: new Date(Date.now() - 2400000).toISOString(),
      },
    ];
    setMessages(mockMessages);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now(),
      sender_id: currentUserId,
      content: newMessage,
      message_type: 'text',
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChat) return;

    const message: Message = {
      id: Date.now(),
      sender_id: currentUserId,
      content: `Отправлен файл: ${file.name}`,
      message_type: file.type.startsWith('image/') ? 'image' : 'file',
      file_name: file.name,
      file_url: URL.createObjectURL(file),
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, message]);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon name="MessageCircle" className="h-5 w-5" />
            Сообщения
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-300px)]">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-accent transition-colors border-b ${
                  selectedChat?.id === chat.id ? 'bg-accent' : ''
                }`}
              >
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {chat.otherUser.name.split(' ')[0].charAt(0)}
                    {chat.otherUser.name.split(' ')[1]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm truncate">{chat.otherUser.name}</p>
                    {chat.unread! > 0 && (
                      <Badge variant="default" className="ml-2 h-5 min-w-5 rounded-full px-1.5 text-xs">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
            <div className="p-4 border-b border-t bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Все врачи</p>
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    const newChat: Chat = {
                      id: Date.now(),
                      otherUser: user,
                    };
                    setChats([newChat, ...chats]);
                    handleSelectChat(newChat);
                  }}
                  className="flex items-center gap-3 p-2 cursor-pointer hover:bg-accent rounded-md transition-colors mb-1"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {user.name.split(' ')[0].charAt(0)}
                      {user.name.split(' ')[1]?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 flex flex-col">
        {selectedChat ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedChat.otherUser.name.split(' ')[0].charAt(0)}
                    {selectedChat.otherUser.name.split(' ')[1]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{selectedChat.otherUser.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{selectedChat.otherUser.specialty}</p>
                </div>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isMine = message.sender_id === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isMine
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.message_type === 'image' && message.file_url && (
                          <img
                            src={message.file_url}
                            alt={message.file_name}
                            className="rounded-md mb-2 max-w-full"
                          />
                        )}
                        {message.message_type === 'file' && (
                          <div className="flex items-center gap-2 mb-2 p-2 bg-background/10 rounded">
                            <Icon name="FileText" className="h-4 w-4" />
                            <span className="text-sm">{message.file_name}</span>
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon name="Paperclip" className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    fileInputRef.current?.setAttribute('accept', 'image/*');
                    fileInputRef.current?.click();
                  }}
                >
                  <Icon name="Image" className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Напишите сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Icon name="Send" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <Icon name="MessageCircle" className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Выберите чат или начните новый диалог</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
