import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [documents, setDocuments] = useState([]);
  const [folkSongs, setFolkSongs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [docsRes, songsRes] = await Promise.all([
        axios.get(`${API}/documents`),
        axios.get(`${API}/folk-songs`)
      ]);
      setDocuments(docsRes.data);
      setFolkSongs(songsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'upload':
        return <UploadPage />;
      case 'restoration':
        return <RestorationPage />;
      case 'translation':
        return <TranslationPage />;
      case 'storytelling':
        return <StorytellingPage documents={documents} />;
      case 'search':
        return <SearchPage searchResults={searchResults} setSearchResults={setSearchResults} />;
      case 'gamification':
        return <GamificationPage />;
      default:
        return <HomePage documents={documents} folkSongs={folkSongs} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

// Navigation Component
const Navigation = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { key: 'home', label: 'Home', icon: '🏛️' },
    { key: 'upload', label: 'Upload', icon: '📄' },
    { key: 'restoration', label: 'AI Restoration', icon: '🔧' },
    { key: 'translation', label: 'Translation', icon: '🌍' },
    { key: 'storytelling', label: 'Stories', icon: '📚' },
    { key: 'search', label: 'Search', icon: '🔍' },
    { key: 'gamification', label: 'Progress', icon: '🏆' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-orange-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🕉️</div>
            <h1 className="text-2xl font-bold text-orange-800">ParamparaSmritiAI</h1>
            <span className="text-sm text-orange-600">Cultural Heritage Preservation</span>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentPage(item.key)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                  currentPage === item.key
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-orange-700 hover:bg-orange-100'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Home Page
const HomePage = ({ documents, folkSongs }) => {
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await axios.get(`${API}/health`);
      setHealthStatus(response.data);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl text-white">
        <h2 className="text-5xl font-bold mb-4">परम्परा स्मृति AI</h2>
        <p className="text-xl mb-8">Preserving India's Cultural Heritage with Artificial Intelligence</p>
        <div className="flex justify-center space-x-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">{documents.length}</div>
            <div className="text-sm">Documents</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">{folkSongs.length}</div>
            <div className="text-sm">Folk Songs</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">5+</div>
            <div className="text-sm">Indian Scripts</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard 
          icon="🔤" 
          title="OCR for Indian Scripts" 
          description="Extract text from manuscripts in Devanagari, Tamil, Bengali, and more"
          color="bg-blue-500"
        />
        <FeatureCard 
          icon="🤖" 
          title="AI Restoration" 
          description="Reconstruct damaged or incomplete texts using advanced AI"
          color="bg-green-500"
        />
        <FeatureCard 
          icon="🌐" 
          title="Multilingual Translation" 
          description="Culturally-aware translations between Indian languages"
          color="bg-purple-500"
        />
        <FeatureCard 
          icon="🎵" 
          title="Folk Song Transcription" 
          description="Convert traditional songs to text for preservation"
          color="bg-pink-500"
        />
        <FeatureCard 
          icon="📖" 
          title="Interactive Stories" 
          description="Transform manuscripts into engaging learning experiences"
          color="bg-indigo-500"
        />
        <FeatureCard 
          icon="🔍" 
          title="Semantic Search" 
          description="Find content by meaning, not just keywords"
          color="bg-orange-500"
        />
      </div>

      {/* System Status */}
      {healthStatus && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">System Status</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(healthStatus.services).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="font-medium capitalize">{service}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  status === 'connected' || status === 'ready' || status === 'loaded' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Documents */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Cultural Documents</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {documents.slice(0, 4).map((doc, index) => (
            <div key={doc.id || index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
              <h4 className="font-semibold text-orange-700">{doc.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{doc.language} • {doc.script_type}</p>
              <p className="text-xs text-gray-500 mt-2">{doc.region}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white text-2xl mb-4`}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

// Upload Page
const UploadPage = () => {
  const [uploadType, setUploadType] = useState('document');
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    scriptType: 'devanagari',
    language: 'hindi',
    performer: '',
    region: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    if (uploadType === 'document') {
      uploadData.append('script_type', formData.scriptType);
      uploadData.append('language', formData.language);
      
      try {
        const response = await axios.post(`${API}/ocr/upload`, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setResult(response.data);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed: ' + error.message);
      }
    } else {
      uploadData.append('performer', formData.performer);
      uploadData.append('region', formData.region);
      uploadData.append('language', formData.language);
      
      try {
        const response = await axios.post(`${API}/speech/upload`, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setResult(response.data);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed: ' + error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Upload Cultural Content</h2>
      
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="mb-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setUploadType('document')}
              className={`px-6 py-3 rounded-lg transition-all ${
                uploadType === 'document' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📄 Document/Manuscript
            </button>
            <button
              onClick={() => setUploadType('audio')}
              className={`px-6 py-3 rounded-lg transition-all ${
                uploadType === 'audio' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎵 Folk Song Audio
            </button>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <input
              type="file"
              accept={uploadType === 'document' ? 'image/*,application/pdf' : 'audio/*'}
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          {uploadType === 'document' ? (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Script Type</label>
                  <select
                    value={formData.scriptType}
                    onChange={(e) => setFormData({...formData, scriptType: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="devanagari">Devanagari</option>
                    <option value="tamil">Tamil</option>
                    <option value="bengali">Bengali</option>
                    <option value="telugu">Telugu</option>
                    <option value="kannada">Kannada</option>
                    <option value="gujarati">Gujarati</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="hindi">Hindi</option>
                    <option value="sanskrit">Sanskrit</option>
                    <option value="tamil">Tamil</option>
                    <option value="bengali">Bengali</option>
                    <option value="telugu">Telugu</option>
                    <option value="kannada">Kannada</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Performer (Optional)</label>
                  <input
                    type="text"
                    value={formData.performer}
                    onChange={(e) => setFormData({...formData, performer: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Singer or artist name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Rajasthan, Gujarat, Bengal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="hindi">Hindi</option>
                  <option value="gujarati">Gujarati</option>
                  <option value="rajasthani">Rajasthani</option>
                  <option value="punjabi">Punjabi</option>
                  <option value="bengali">Bengali</option>
                  <option value="tamil">Tamil</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Processing...' : `Upload ${uploadType === 'document' ? 'Document' : 'Audio'}`}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Upload Successful!</h3>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {result.document_id || result.song_id}</p>
              {result.extracted_text && (
                <div>
                  <strong>Extracted Text:</strong>
                  <div className="mt-2 p-3 bg-white rounded border text-gray-700">
                    {result.extracted_text}
                  </div>
                </div>
              )}
              {result.transcription && (
                <div>
                  <strong>Transcription:</strong>
                  <div className="mt-2 p-3 bg-white rounded border text-gray-700">
                    {result.transcription}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// AI Restoration Page
const RestorationPage = () => {
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('hindi');
  const [context, setContext] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRestore = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}/restore`, {
        text: inputText,
        language: language,
        context: context
      });
      setResult(response.data);
    } catch (error) {
      console.error('Restoration failed:', error);
      alert('Restoration failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">AI-Powered Text Restoration</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Input Damaged Text</h3>
          <form onSubmit={handleRestore} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Damaged/Incomplete Text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder="Paste your damaged or incomplete cultural text here..."
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="hindi">Hindi</option>
                  <option value="sanskrit">Sanskrit</option>
                  <option value="tamil">Tamil</option>
                  <option value="bengali">Bengali</option>
                  <option value="telugu">Telugu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Context (Optional)</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Religious verse, Historical document"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Restoring...' : 'Restore Text with AI'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Restored Result</h3>
          {result ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Restored Text</h4>
                <p className="text-gray-700">{result.restored_text}</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Confidence Score</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(result.confidence || 0) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{((result.confidence || 0) * 100).toFixed(1)}%</span>
                </div>
              </div>

              {result.explanation && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">AI Explanation</h4>
                  <p className="text-sm text-gray-600">{result.explanation}</p>
                </div>
              )}

              {result.changes_made && result.changes_made.length > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Changes Made</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {result.changes_made.map((change, index) => (
                      <li key={index}>• {change}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400">
              <p>Restored text will appear here after processing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Translation Page
const TranslationPage = () => {
  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState('hindi');
  const [targetLang, setTargetLang] = useState('english');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: 'hindi', name: 'Hindi' },
    { code: 'sanskrit', name: 'Sanskrit' },
    { code: 'english', name: 'English' },
    { code: 'tamil', name: 'Tamil' },
    { code: 'bengali', name: 'Bengali' },
    { code: 'telugu', name: 'Telugu' },
    { code: 'kannada', name: 'Kannada' },
    { code: 'gujarati', name: 'Gujarati' },
  ];

  const handleTranslate = async (e) => {
    e.preventDefault();
    if (!sourceText.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}/translate`, {
        text: sourceText,
        source_language: sourceLang,
        target_language: targetLang
      });
      setResult(response.data);
    } catch (error) {
      console.error('Translation failed:', error);
      alert('Translation failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Culturally-Aware Translation</h2>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Source Text</h3>
            <div className="mb-4">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full h-60 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Enter text to translate..."
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Translation</h3>
            <div className="mb-4">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div className="h-60 p-3 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
              {result ? (
                <div className="space-y-3">
                  <div className="text-gray-700">{result.translated_text}</div>
                  {result.cultural_notes && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      <strong>Cultural Notes:</strong> {result.cultural_notes}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 flex items-center justify-center h-full">
                  Translation will appear here
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleTranslate}
            disabled={loading || !sourceText.trim()}
            className="bg-orange-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Storytelling Page
const StorytellingPage = ({ documents }) => {
  const [selectedDoc, setSelectedDoc] = useState('');
  const [storyType, setStoryType] = useState('summary');
  const [language, setLanguage] = useState('english');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedDoc) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}/story/generate`, {
        document_id: selectedDoc,
        story_type: storyType,
        target_language: language
      });
      setResult(response.data);
    } catch (error) {
      console.error('Story generation failed:', error);
      alert('Story generation failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Interactive Storytelling</h2>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Document</label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Choose a cultural document...</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.title}</option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Story Type</label>
              <select
                value={storyType}
                onChange={(e) => setStoryType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="summary">Summary</option>
                <option value="interactive">Interactive Story</option>
                <option value="quiz">Educational Quiz</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="tamil">Tamil</option>
                <option value="bengali">Bengali</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Generating...' : 'Generate Story'}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{result.story_type.toUpperCase()} Generated</h3>
          <div className="prose max-w-none">
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {result.content}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Based on: {result.source_document}
          </div>
        </div>
      )}
    </div>
  );
};

// Search Page
const SearchPage = ({ searchResults, setSearchResults }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('semantic');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}/search`, {
        query: query,
        search_type: searchType,
        language: language || undefined,
        limit: 20
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Semantic Discovery</h2>
      
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Search for cultural concepts, themes, or content..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Type</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="semantic">Semantic (Meaning-based)</option>
                <option value="keyword">Keyword (Exact match)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language Filter (Optional)</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Languages</option>
                <option value="hindi">Hindi</option>
                <option value="sanskrit">Sanskrit</option>
                <option value="tamil">Tamil</option>
                <option value="bengali">Bengali</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {searchResults && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Search Results ({searchResults.total_found || 0} found)
          </h3>
          
          {(!searchResults.results || searchResults.results.length === 0) ? (
            <div className="text-center py-8 text-gray-500">
              No results found for "{searchResults.query}"
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.results.map((result, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-orange-700">{result.title || 'Untitled'}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {result.type || 'document'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{result.content || 'No content preview'}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{result.language || 'Unknown'}</span>
                    <span>{result.region || result.performer || ''}</span>
                    {result.score && <span>Score: {(result.score * 100).toFixed(1)}%</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Gamification Page
const GamificationPage = () => {
  const [userProgress, setUserProgress] = useState(null);
  const [userId] = useState('demo-user'); // In real app, get from auth

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const response = await axios.get(`${API}/user/${userId}/progress`);
      setUserProgress(response.data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const awardBadge = async (badgeName) => {
    try {
      const response = await axios.post(`${API}/user/${userId}/badge/${badgeName}`);
      alert(response.data.message);
      loadUserProgress(); // Refresh data
    } catch (error) {
      console.error('Failed to award badge:', error);
    }
  };

  const availableBadges = [
    { name: 'Explorer', description: 'Explore 5 cultural documents', icon: '🗺️' },
    { name: 'Translator', description: 'Complete 10 translations', icon: '🌐' },
    { name: 'Storyteller', description: 'Generate 5 interactive stories', icon: '📚' },
    { name: 'Preservationist', description: 'Upload cultural content', icon: '🛡️' },
    { name: 'Scholar', description: 'Complete educational quizzes', icon: '🎓' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Learning Progress</h2>
      
      {userProgress && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{userProgress.points}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{userProgress.badges.length}</div>
                  <div className="text-sm text-gray-600">Badges Earned</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{userProgress.documents_explored.length}</div>
                  <div className="text-sm text-gray-600">Documents Explored</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{userProgress.translations_contributed}</div>
                  <div className="text-sm text-gray-600">Translations</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Available Badges</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {availableBadges.map((badge) => (
                  <div key={badge.name} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{badge.icon}</span>
                        <span className="font-semibold">{badge.name}</span>
                      </div>
                      {userProgress.badges.includes(badge.name) ? (
                        <span className="text-green-500 text-xl">✓</span>
                      ) : (
                        <button
                          onClick={() => awardBadge(badge.name)}
                          className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
                        >
                          Earn
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Earned Badges</h3>
              {userProgress.badges.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No badges earned yet</p>
              ) : (
                <div className="space-y-2">
                  {userProgress.badges.map((badgeName, index) => {
                    const badge = availableBadges.find(b => b.name === badgeName);
                    return badge ? (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                        <span className="text-xl">{badge.icon}</span>
                        <span className="font-medium text-green-800">{badge.name}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;