import React, { useState, useEffect } from 'react';
import { 
  Video, 
  FileText, 
  Search, 
  Plus, 
  Trash2, 
  LogOut, 
  Lock, 
  X, 
  MonitorPlay,
  LayoutGrid,
  Database,
  CheckCircle2,
  PlayCircle,
  Hash,
  Pencil,
  ShieldCheck
} from 'lucide-react';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// --- CONFIGURAÇÃO DO SERVIDOR (PHP/LARAVEL/NODE) ---
// Futuramente, você irá conectar com seu endpoint PHP aqui.
const API_URL = "https://seu-servidor-php.com/api"; 

// Limites de Caracteres
const LIMITS = {
  TITLE: 60,
  DESCRIPTION: 140
};

export default function App() {
  // Simulação de Usuário (Já que removemos o Auth do Firebase)
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Estado local para armazenar os tutoriais (In-Memory Database)
  // Ao recarregar a página, isso volta a ser vazio até integrar com o PHP.
  const [tutorials, setTutorials] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false); // Carregamento instantâneo por ser local
  
  // Estado para controlar Edição
  const [editingId, setEditingId] = useState(null);

  // Estado local para o input de tags
  const [tagInput, setTagInput] = useState('');

  // Estado para Feedback Visual (Toast)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Cores da Marca
  const BRAND = {
    greenLight: '#76b240',
    greenDark: '#083602',
    navy: '#141d38',
    amber: '#f59e0b'
  };

  const categories = [
    'Todos', 
    'Primeiros Passos', 
    'Gestão da Plataforma', 
    'Vendas & Marketing', 
    'Financeiro', 
    'Operacional'
  ];

  const initialFormState = {
    title: '',
    description: '',
    category: 'Primeiros Passos',
    videoUrl: '',
    pdfUrl: '',
    imageUrl: '',
    tags: []
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- EFEITO PARA CARREGAR DADOS (SIMULAÇÃO DE GET) ---
  useEffect(() => {
    // AQUI VOCÊ FARIA A CHAMADA PARA O PHP
    // Exemplo:
    // fetch(`${API_URL}/tutoriais`)
    //   .then(res => res.json())
    //   .then(data => setTutorials(data));
    
    // Por enquanto, inicia vazio ou carrega modelos se quiser
    setLoading(false);
  }, []);

  // --- TOAST HELPER ---
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // --- ADMIN LOGIC ---
  const handleLogin = (e) => {
    e.preventDefault();
    // Simulação de Login simples
    if (e.target.password.value === 'admin123') {
      setIsAdminMode(true);
      setShowLoginModal(false);
      showToast('Acesso de Gestor concedido com sucesso!');
    } else {
      alert('Senha incorreta.');
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleEdit = (tutorial) => {
    setEditingId(tutorial.id);
    setFormData({
      title: tutorial.title,
      description: tutorial.description,
      category: tutorial.category,
      videoUrl: tutorial.videoUrl || '',
      pdfUrl: tutorial.pdfUrl || '',
      imageUrl: tutorial.imageUrl || '',
      tags: Array.isArray(tutorial.tags) ? tutorial.tags : []
    });
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag]
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSaveTutorial = async (e) => {
    e.preventDefault();
    
    let finalTags = [...formData.tags];
    if (tagInput.trim()) {
      const pendingTag = tagInput.trim().toLowerCase();
      if (!finalTags.includes(pendingTag)) {
        finalTags.push(pendingTag);
      }
    }

    // --- INTEGRAÇÃO COM PHP SERIA AQUI ---
    /*
    const payload = { ...formData, tags: finalTags };
    if (editingId) {
       await fetch(`${API_URL}/tutoriais/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
       await fetch(`${API_URL}/tutoriais`, { method: 'POST', body: JSON.stringify(payload) });
    }
    */

    // --- SIMULAÇÃO LOCAL (FRONTEND APENAS) ---
    if (editingId) {
      setTutorials(prev => prev.map(t => 
        t.id === editingId 
        ? { ...t, ...formData, tags: finalTags, updatedAt: Date.now() } 
        : t
      ));
      showToast('Conteúdo atualizado com sucesso!');
    } else {
      const newTutorial = {
        id: Date.now().toString(), // ID temporário
        ...formData,
        tags: finalTags,
        createdAt: Date.now()
      };
      setTutorials(prev => [newTutorial, ...prev]);
      showToast('Novo conteúdo publicado!');
    }

    setIsModalOpen(false);
    setFormData(initialFormState);
    setTagInput('');
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('ATENÇÃO: Isso apagará o tutorial permanentemente.\n\nDeseja continuar?')) return;
    
    // --- INTEGRAÇÃO COM PHP SERIA AQUI ---
    // await fetch(`${API_URL}/tutoriais/${id}`, { method: 'DELETE' });

    // --- SIMULAÇÃO LOCAL ---
    setTutorials(prev => prev.filter(t => t.id !== id));
    showToast('Conteúdo removido da base.', 'error');
  };

  const seedDatabase = () => {
    if (!confirm('Carregar modelos padrão da Franquia?')) return;
    
    // Dados mocados para demonstração
    const exampleTutorials = [
      {
        id: '1',
        title: 'Manual do Franqueado (PDF)',
        description: 'Documento completo com as diretrizes operacionais, jurídicas e comerciais da sua unidade.',
        category: 'Primeiros Passos',
        videoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tags: ['regras', 'contrato', 'leis', 'jurídico'],
        createdAt: Date.now()
      },
      {
        id: '2',
        title: 'Primeiros Passos na Plataforma',
        description: 'Aula inaugural ensinando as configurações básicas iniciais para sua franquia digital.',
        category: 'Primeiros Passos',
        videoUrl: 'https://www.youtube.com/watch?v=NKhuyvpw2NA',
        imageUrl: '',
        pdfUrl: '',
        tags: ['início', 'configuração', 'setup', 'bem-vindo'],
        createdAt: Date.now() - 1000
      },
      {
        id: '3',
        title: 'Estratégias de Vendas de Cursos',
        description: 'Como utilizar o marketing digital para alavancar a venda das matrículas.',
        category: 'Vendas & Marketing',
        videoUrl: 'https://www.youtube.com/watch?v=eDZlg9hhoyk',
        imageUrl: '',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        tags: ['leads', 'conversão', 'instagram', 'facebook ads'],
        createdAt: Date.now() - 2000
      }
    ];

    // Adiciona ao estado local
    setTutorials(prev => [...exampleTutorials, ...prev]);
    showToast('Modelos importados com sucesso!');
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getDisplayImage = (tutorial) => {
    if (tutorial.imageUrl) return tutorial.imageUrl;
    const videoId = getYouTubeId(tutorial.videoUrl);
    if (videoId) return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    return null;
  };

  const filteredTutorials = tutorials.filter(t => {
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      return t.title.toLowerCase().includes(term) || 
             t.description.toLowerCase().includes(term) ||
             (t.tags && Array.isArray(t.tags) && t.tags.some(tag => tag.includes(term)));
    }
    return selectedCategory === 'Todos' || t.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative">
      
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right fade-in duration-300">
          <div className="bg-white border-l-4 shadow-2xl rounded-lg p-4 flex items-center gap-3 min-w-[300px]"
               style={{ borderColor: toast.type === 'success' ? BRAND.greenLight : 'red' }}>
            <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#141d38]">Sistema de Gestão</h4>
              <p className="text-xs text-slate-500 font-medium">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-4">
              <img 
                src="https://franquiaead.com.br/wp-content/uploads/2024/12/logo_3.png" 
                alt="Franquia Digital EAD" 
                className="h-10 md:h-12 object-contain"
              />
              <div className="hidden md:flex flex-col justify-center h-full border-l border-slate-200 pl-4">
                <span className="font-bold text-sm tracking-widest uppercase text-[#141d38]">
                  Universidade
                </span>
                <span className="text-[10px] font-bold text-[#76b240] tracking-wider uppercase">
                  Corporativa
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isAdminMode ? (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                  <span className="hidden md:inline-flex text-xs font-bold bg-[#76b240]/10 text-[#083602] px-3 py-1.5 rounded-full border border-[#76b240]/30 items-center gap-1.5 uppercase tracking-wide">
                    <CheckCircle2 size={12} /> Admin
                  </span>
                  
                  {tutorials.length === 0 && (
                    <button 
                      onClick={seedDatabase}
                      className="flex items-center gap-2 bg-[#141d38]/5 text-[#141d38] hover:bg-[#141d38]/10 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-transparent"
                    >
                      <Database size={16} /> <span className="hidden sm:inline">Carregar Modelos</span>
                    </button>
                  )}

                  <button 
                    onClick={openNewModal}
                    className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md transform hover:-translate-y-0.5"
                    style={{ backgroundColor: BRAND.greenLight }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = BRAND.greenDark}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = BRAND.greenLight}
                  >
                    <Plus size={18} /> Novo Conteúdo
                  </button>
                  <button 
                    onClick={() => {
                      setIsAdminMode(false);
                      showToast('Sessão de gestor encerrada.', 'success');
                    }} 
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Sair do modo Admin"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="text-sm font-bold text-slate-500 hover:text-[#141d38] transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  <Lock size={14} /> Área do Gestor
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: BRAND.navy }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#083602]/30 to-[#141d38] z-0"></div>
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Central de Treinamento & <span style={{ color: BRAND.greenLight }}>Excelência</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed font-light border-l-4 pl-6" style={{ borderColor: BRAND.greenLight }}>
              Acesse tutoriais, baixe documentos e domine a gestão da sua franquia. 
              A padronização é o segredo da escala.
            </p>
            
            {/* Barra de Busca */}
            <div className="bg-white p-2.5 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl transform transition-all focus-within:ring-4" style={{ '--tw-ring-color': BRAND.greenLight + '40' }}>
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input 
                  type="text"
                  placeholder="Busque por título, descrição ou tags (ex: vendas, boleto)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-lg border-none focus:ring-0 outline-none text-slate-700 placeholder:text-slate-400 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação de Categorias */}
      <div className="border-b border-slate-200 bg-white sticky top-20 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-5 gap-3 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSearchTerm('');
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat && !searchTerm 
                    ? 'text-white shadow-lg' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                }`}
                style={
                  selectedCategory === cat && !searchTerm
                    ? { backgroundColor: BRAND.greenLight, borderColor: BRAND.greenLight, color: '#fff' }
                    : { }
                }
              >
                {cat}
              </button>
            ))}
          </div>
          {searchTerm && (
            <div className="pb-2 text-xs font-semibold text-slate-500 animate-in fade-in">
              *Exibindo resultados globais para "{searchTerm}". Limpe a busca para navegar por categorias.
            </div>
          )}
        </div>
      </div>

      {/* Grid de Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200" style={{ borderTopColor: BRAND.greenLight }}></div>
          </div>
        ) : filteredTutorials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
              <MonitorPlay className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-[#141d38] mb-2">Base de conhecimento vazia ou não encontrada</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {isAdminMode 
                ? "Sua oportunidade de liderar pelo exemplo. Clique em 'Carregar Modelos' no topo para começar." 
                : `Nenhum resultado para "${searchTerm}". Tente usar palavras-chave mais gerais.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutorials.map((tutorial) => {
              const displayImage = getDisplayImage(tutorial);
              const hasVideo = !!tutorial.videoUrl;
              
              const ImageWrapper = hasVideo ? 'a' : 'div';
              const imageWrapperProps = hasVideo ? {
                href: tutorial.videoUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "block aspect-video relative overflow-hidden rounded-t-2xl group bg-[#141d38] cursor-pointer"
              } : {
                className: "block aspect-video relative overflow-hidden rounded-t-2xl group bg-[#141d38]"
              };

              return (
                <div key={tutorial.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full hover:border-[#76b240]/30">
                  
                  {/* Área Visual */}
                  <ImageWrapper {...imageWrapperProps}>
                    {displayImage ? (
                      <>
                        <img 
                          src={displayImage} 
                          alt={tutorial.title} 
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" 
                        />
                        {hasVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <PlayCircle className="text-white opacity-80 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 drop-shadow-xl" size={64} />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <LayoutGrid size={48} />
                      </div>
                    )}
                  </ImageWrapper>

                  {/* Corpo do Card */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-[#141d38] mb-3 leading-snug group-hover:text-[#76b240] transition-colors">
                      {tutorial.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {tutorial.description}
                    </p>

                    {/* Exibição de Tags */}
                    {tutorial.tags && tutorial.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {tutorial.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {tutorial.videoUrl ? (
                          <a 
                            href={tutorial.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-xs font-bold text-white py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md"
                            style={{ backgroundColor: BRAND.greenLight }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = BRAND.greenDark}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = BRAND.greenLight}
                          >
                            <Video size={16} /> ASSISTIR
                          </a>
                        ) : (
                           <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 py-2.5 rounded-lg cursor-not-allowed">
                             <Video size={16} /> SEM VÍDEO
                           </div>
                        )}

                        {tutorial.pdfUrl ? (
                          <a 
                            href={tutorial.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-xs font-bold bg-white border py-2.5 rounded-lg transition-colors hover:bg-slate-50"
                            style={{ color: BRAND.navy, borderColor: BRAND.navy }}
                          >
                            <FileText size={16} /> LER PDF
                          </a>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 py-2.5 rounded-lg cursor-not-allowed">
                            <FileText size={16} /> SEM PDF
                          </div>
                        )}
                      </div>

                      {/* Controles Admin */}
                      {isAdminMode && (
                        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(tutorial)}
                            className="text-amber-500 hover:text-amber-700 text-xs flex items-center gap-1 transition-colors hover:bg-amber-50 px-2 py-1 rounded"
                          >
                            <Pencil size={14} /> Editar
                          </button>
                          <button 
                            onClick={() => handleDelete(tutorial.id)}
                            className="text-slate-400 hover:text-red-600 text-xs flex items-center gap-1 transition-colors hover:bg-red-50 px-2 py-1 rounded"
                          >
                            <Trash2 size={14} /> Apagar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal Adicionar/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#141d38]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-0 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div 
              className="p-6 flex justify-between items-center transition-colors" 
              style={{ backgroundColor: editingId ? BRAND.amber : BRAND.navy }}
            >
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingId ? 'Editar Conteúdo' : 'Novo Material'}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {editingId ? 'Atualizando informações existentes.' : 'Padronização gera escala.'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-lg hover:bg-white/20">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveTutorial} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-[#141d38] uppercase">Título do Material</label>
                    <span className={`text-[10px] font-semibold ${formData.title.length === LIMITS.TITLE ? 'text-red-500' : 'text-slate-400'}`}>
                      {formData.title.length}/{LIMITS.TITLE}
                    </span>
                  </div>
                  <input 
                    required
                    type="text" 
                    maxLength={LIMITS.TITLE}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 outline-none transition-all bg-slate-50 focus:bg-white placeholder:text-slate-400"
                    style={{ '--tw-ring-color': BRAND.greenLight }}
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Contrato de Prestação de Serviços"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#141d38] uppercase mb-1.5">Categoria</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 outline-none bg-slate-50 focus:bg-white cursor-pointer"
                    style={{ '--tw-ring-color': BRAND.greenLight }}
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.filter(c => c !== 'Todos').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-[#141d38] uppercase">Descrição Curta</label>
                  <span className={`text-[10px] font-semibold ${formData.description.length === LIMITS.DESCRIPTION ? 'text-red-500' : 'text-slate-400'}`}>
                    {formData.description.length}/{LIMITS.DESCRIPTION}
                  </span>
                </div>
                <textarea 
                  required
                  rows="3"
                  maxLength={LIMITS.DESCRIPTION}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 outline-none transition-all resize-none bg-slate-50 focus:bg-white placeholder:text-slate-400"
                  style={{ '--tw-ring-color': BRAND.greenLight }}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Resumo do que se trata..."
                />
              </div>

              {/* Input de Tags com "Chips" (Estilo YouTube) */}
              <div>
                <label className="block text-xs font-bold text-[#141d38] uppercase mb-1.5">Tags (Palavras-chave)</label>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                    {formData.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-[#141d38] shadow-sm">
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500 transition-colors p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <div className="absolute left-3 top-3 text-slate-400">
                    <Hash size={14} />
                  </div>
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 outline-none transition-all bg-slate-50 focus:bg-white placeholder:text-slate-400"
                    style={{ '--tw-ring-color': BRAND.greenLight }}
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Digite a tag e aperte ENTER ou VÍRGULA para adicionar"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Ex: vendas [Enter], financeiro [Vírgula]...</p>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center border-b border-slate-100 pb-2 mb-4">Anexos & Mídia</p>
                
                <div className="group relative">
                  <div className="absolute left-3 top-3 bg-red-100 text-red-600 p-1 rounded">
                    <Video size={14} />
                  </div>
                  <input 
                    type="url" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    value={formData.videoUrl}
                    onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                    placeholder="URL do Vídeo (YouTube)"
                  />
                </div>

                <div className="group relative">
                  <div className="absolute left-3 top-3 bg-orange-100 text-orange-600 p-1 rounded">
                    <FileText size={14} />
                  </div>
                  <input 
                    type="url" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    value={formData.pdfUrl}
                    onChange={e => setFormData({...formData, pdfUrl: e.target.value})}
                    placeholder="URL do PDF (Drive/Dropbox/Link Direto)"
                  />
                </div>

                <div className="group relative">
                  <div className="absolute left-3 top-3 bg-blue-100 text-blue-600 p-1 rounded">
                    <LayoutGrid size={14} />
                  </div>
                  <input 
                    type="url" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 outline-none transition-all"
                    style={{ '--tw-ring-color': BRAND.greenLight }}
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="URL da Imagem de Capa (Opcional - Se vazio, tenta pegar do YouTube)"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-lg transform hover:-translate-y-0.5 uppercase tracking-wide text-sm"
                style={{ backgroundColor: editingId ? BRAND.amber : BRAND.greenLight }}
              >
                {editingId ? 'Salvar Alterações' : 'Publicar Conteúdo'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-[#141d38]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-slate-100">
              <Lock className="text-[#141d38]" size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-[#141d38] mb-2">Acesso Restrito</h2>
            <p className="text-slate-500 mb-8 text-sm">Apenas gestores autorizados podem editar a base.</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                name="password"
                type="password" 
                autoFocus
                placeholder="Senha de Acesso"
                className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:ring-2 outline-none text-center text-lg tracking-widest bg-slate-50"
                style={{ '--tw-ring-color': BRAND.greenLight }}
              />
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold transition-colors text-sm"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 text-white rounded-xl font-bold transition-colors text-sm shadow-lg"
                  style={{ backgroundColor: BRAND.greenLight }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = BRAND.greenDark}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = BRAND.greenLight}
                >
                  ENTRAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}