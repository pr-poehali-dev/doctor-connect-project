import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import ChatInterface from '@/components/ChatInterface';

interface Comment {
  id: number;
  author: {
    name: string;
    specialty: string;
  };
  content: string;
  time: string;
  likes: number;
}

interface MedicalCase {
  id: number;
  title: string;
  specialty: string;
  author: {
    name: string;
    specialty: string;
    avatar: string;
  };
  description: string;
  fullDescription?: string;
  tags: string[];
  comments: number;
  likes: number;
  time: string;
  commentsList?: Comment[];
}

const mockCases: MedicalCase[] = [
  {
    id: 1,
    title: 'Сложный случай диагностики аутоиммунного заболевания',
    specialty: 'Ревматология',
    author: {
      name: 'Д-р Иванова А.С.',
      specialty: 'Ревматолог',
      avatar: '',
    },
    description: 'Пациентка 42 года, жалобы на боли в суставах, утреннюю скованность более 2 месяцев. АНФ положительный, РФ отрицательный...',
    fullDescription: 'Пациентка 42 года, жалобы на боли в суставах, утреннюю скованность более 2 месяцев. АНФ положительный, РФ отрицательный. При осмотре: симметричное поражение мелких суставов кистей, утренняя скованность до 3 часов. Лабораторно: СОЭ 45 мм/ч, СРБ 28 мг/л, АНФ 1:320, anti-CCP отрицательный. На рентгенограммах кистей - околосуставной остеопороз.',
    tags: ['Аутоиммунные', 'Диагностика', 'Ревматология'],
    comments: 12,
    likes: 24,
    time: '2 часа назад',
    commentsList: [
      {
        id: 1,
        author: { name: 'Д-р Козлов И.П.', specialty: 'Ревматолог' },
        content: 'Похоже на раннюю стадию РА. Рекомендую повторить anti-CCP через 3 месяца и рассмотреть назначение метотрексата.',
        time: '1 час назад',
        likes: 8
      },
      {
        id: 2,
        author: { name: 'Д-р Новикова С.А.', specialty: 'Терапевт' },
        content: 'Согласна с коллегой. Также стоит исключить другие коллагенозы - провести расширенную иммунологическую панель.',
        time: '30 мин назад',
        likes: 5
      }
    ]
  },
  {
    id: 2,
    title: 'Нестандартная клиническая картина при пневмонии',
    specialty: 'Пульмонология',
    author: {
      name: 'Д-р Смирнов П.В.',
      specialty: 'Пульмонолог',
      avatar: '',
    },
    description: 'Мужчина 65 лет, поступил с одышкой. Рентгенография показала двустороннее поражение, но без типичных признаков...',
    tags: ['Пульмонология', 'Инфекции', 'КТ'],
    comments: 8,
    likes: 19,
    time: '5 часов назад',
  },
  {
    id: 3,
    title: 'Редкий случай лекарственного взаимодействия',
    specialty: 'Клиническая фармакология',
    author: {
      name: 'Д-р Петрова Е.М.',
      specialty: 'Клинический фармаколог',
      avatar: '',
    },
    description: 'Пациент принимал комбинацию препаратов, что привело к необычной побочной реакции. Опыт коррекции терапии...',
    tags: ['Фармакология', 'Побочные эффекты', 'Безопасность'],
    comments: 15,
    likes: 31,
    time: '1 день назад',
  },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedCase, setSelectedCase] = useState<MedicalCase | null>(null);
  const [newComment, setNewComment] = useState('');
  const [caseLikes, setCaseLikes] = useState<Record<number, number>>({});
  const [commentLikes, setCommentLikes] = useState<Record<number, number>>({});
  const [caseComments, setCaseComments] = useState<Record<number, Comment[]>>({});

  const handleLikeCase = (caseId: number, currentLikes: number) => {
    setCaseLikes(prev => ({
      ...prev,
      [caseId]: (prev[caseId] || currentLikes) + 1
    }));
  };

  const handleLikeComment = (commentId: number, currentLikes: number) => {
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: (prev[commentId] || currentLikes) + 1
    }));
  };

  const handleAddComment = () => {
    if (!selectedCase || !newComment.trim()) return;
    
    const newCommentObj: Comment = {
      id: Date.now(),
      author: { name: 'Ваше имя', specialty: 'Ваша специальность' },
      content: newComment,
      time: 'только что',
      likes: 0
    };

    setCaseComments(prev => ({
      ...prev,
      [selectedCase.id]: [...(prev[selectedCase.id] || selectedCase.commentsList || []), newCommentObj]
    }));

    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Icon name="Stethoscope" className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">MedConnect</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <Button 
                variant="ghost" 
                className="text-sm"
                onClick={() => setActiveTab('feed')}
              >
                <Icon name="Home" className="mr-2 h-4 w-4" />
                Главная
              </Button>
              <Button 
                variant="ghost" 
                className="text-sm"
                onClick={() => setActiveTab('messages')}
              >
                <Icon name="MessageCircle" className="mr-2 h-4 w-4" />
                Сообщения
              </Button>
              <Button variant="ghost" className="text-sm">
                <Icon name="BookOpen" className="mr-2 h-4 w-4" />
                База знаний
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Icon name="Bell" className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">ВИ</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="feed">Лента</TabsTrigger>
                <TabsTrigger value="messages">Сообщения</TabsTrigger>
                <TabsTrigger value="cases">Кейсы</TabsTrigger>
                <TabsTrigger value="consultations">Консультации</TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="space-y-4">
                {mockCases.map((medCase) => (
                  <Card key={medCase.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {medCase.author.name.split(' ')[0].charAt(0)}
                              {medCase.author.name.split(' ')[1]?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">{medCase.author.name}</p>
                            <p className="text-xs text-muted-foreground">{medCase.author.specialty}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{medCase.specialty}</Badge>
                      </div>
                      <CardTitle className="mt-4 text-xl">{medCase.title}</CardTitle>
                      <CardDescription className="text-sm">{medCase.time}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/80 mb-4">{medCase.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {medCase.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 pt-4 border-t">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => setSelectedCase(medCase)}
                        >
                          <Icon name="MessageSquare" className="h-4 w-4" />
                          {(caseComments[medCase.id]?.length || medCase.commentsList?.length || medCase.comments)}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleLikeCase(medCase.id, medCase.likes)}
                        >
                          <Icon name="ThumbsUp" className="h-4 w-4" />
                          {caseLikes[medCase.id] || medCase.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Icon name="Share2" className="h-4 w-4" />
                          Поделиться
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="messages" className="mt-0">
                <ChatInterface />
              </TabsContent>

              <TabsContent value="cases">
                <Card>
                  <CardHeader>
                    <CardTitle>Клинические кейсы</CardTitle>
                    <CardDescription>Архив медицинских случаев от коллег</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Здесь будут отображаться все клинические кейсы...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="consultations">
                <Card>
                  <CardHeader>
                    <CardTitle>Консультации</CardTitle>
                    <CardDescription>Запросы на профессиональную помощь</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Здесь будут отображаться запросы на консультации...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Icon name="Plus" className="mr-2 h-4 w-4" />
                  Создать кейс
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Icon name="HelpCircle" className="mr-2 h-4 w-4" />
                  Запросить консультацию
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Icon name="FileText" className="mr-2 h-4 w-4" />
                  Добавить материал
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Активные специалисты</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Д-р Козлов И.П.', spec: 'Кардиолог', cases: 142 },
                  { name: 'Д-р Новикова С.А.', spec: 'Онколог', cases: 98 },
                  { name: 'Д-р Морозов Д.В.', spec: 'Хирург', cases: 176 },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {doc.name.split(' ')[0].charAt(0)}
                          {doc.name.split(' ')[1]?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.spec}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {doc.cases}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ваши кейсы</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Консультации</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Помогли коллегам</span>
                  <span className="font-semibold">34</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedCase?.author.name.split(' ')[0].charAt(0)}
                    {selectedCase?.author.name.split(' ')[1]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{selectedCase?.author.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedCase?.author.specialty}</p>
                </div>
              </div>
              <Badge variant="secondary">{selectedCase?.specialty}</Badge>
            </div>
            <DialogTitle className="mt-4">{selectedCase?.title}</DialogTitle>
            <DialogDescription>{selectedCase?.time}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-foreground/90">{selectedCase?.fullDescription || selectedCase?.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedCase?.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Icon name="MessageSquare" className="h-4 w-4" />
                  Комментарии ({(caseComments[selectedCase?.id || 0]?.length || selectedCase?.commentsList?.length || 0)})
                </h3>

                <div className="space-y-4">
                  {(caseComments[selectedCase?.id || 0] || selectedCase?.commentsList || []).map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {comment.author.name.split(' ')[0].charAt(0)}
                              {comment.author.name.split(' ')[1]?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-sm">{comment.author.name}</p>
                                <p className="text-xs text-muted-foreground">{comment.author.specialty}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">{comment.time}</span>
                            </div>
                            <p className="text-sm mt-2">{comment.content}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2 mt-2 h-8"
                              onClick={() => handleLikeComment(comment.id, comment.likes)}
                            >
                              <Icon name="ThumbsUp" className="h-3 w-3" />
                              {commentLikes[comment.id] || comment.likes}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <Textarea 
                    placeholder="Поделитесь своим мнением или опытом..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setNewComment('')}>Отмена</Button>
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Icon name="Send" className="h-4 w-4 mr-2" />
                      Отправить
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}