import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, Target, MessageSquare, Sparkles } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import { analyzeVideoBasic, analyzeAdMarketing, analyzeYouTubeComments } from '@/services/api';

const Index = () => {
  const [activeTab, setActiveTab] = useState('video-analysis');
  
  // Common state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  // Video Analysis state
  const [campaign, setCampaign] = useState<string>('');
  const [locality, setLocality] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [analysisOptions, setAnalysisOptions] = useState<string[]>([]);

  // Marketing Analysis state
  const [demographics, setDemographics] = useState<string[]>([]);
  const [descriptors, setDescriptors] = useState<string[]>([]);

  // Comment Analysis state
  const [videoUrl, setVideoUrl] = useState<string>('');

  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
  };

  const getCanAnalyze = () => {
    switch (activeTab) {
      case 'video-analysis':
        return campaign && locality && selectedVideo && analysisOptions.length > 0;
      case 'marketing-analysis':
        return campaign && demographics.length > 0 && descriptors.length > 0 && selectedVideo;
      case 'comment-analysis':
        return videoUrl && isValidYouTubeUrl(videoUrl);
      default:
        return false;
    }
  };

  const handleAnalyze = async () => {
    if (!getCanAnalyze()) return;

    setIsAnalyzing(true);
    
    try {
      let analysisResults;
      
      switch (activeTab) {
        case 'video-analysis':
          analysisResults = await analyzeVideoBasic({
            campaign: campaign!,
            locality: locality!,
            video: selectedVideo!,
            analysisOptions
          });
          break;
        case 'marketing-analysis':
          analysisResults = await analyzeAdMarketing({
            campaign: campaign!,
            demographics,
            descriptors,
            video: selectedVideo!
          });
          break;
        case 'comment-analysis':
          analysisResults = await analyzeYouTubeComments({
            videoUrl: videoUrl!,
            maxComments: 25
          });
          break;
        default:
          return;
      }
      
      setResults(analysisResults);
      
      // Auto-open first result card
      const firstKey = Object.keys(analysisResults)[0];
      if (firstKey) {
        setOpenCards({ [firstKey]: true });
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCampaign('');
    setLocality('');
    setSelectedVideo(null);
    setAnalysisOptions([]);
    setDemographics([]);
    setDescriptors([]);
    setVideoUrl('');
    setResults(null);
    setOpenCards({});
  };

  const toggleCard = (key: string) => {
    setOpenCards(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setResults(null);
    setOpenCards({});
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Film className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center space-x-2">
                  <span>🎬 Gemini Video Intelligence</span>
                  <Sparkles className="w-5 h-5 text-primary" />
                </h1>
                <p className="text-sm text-muted-foreground">AI-Powered Video Analysis Platform</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI Engine Ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="bg-transparent border-0 h-auto p-0">
              <TabsTrigger 
                value="video-analysis" 
                className="flex items-center space-x-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <Film className="w-4 h-4" />
                <span className="hidden sm:inline">Video Analysis</span>
                <span className="sm:hidden">Video</span>
              </TabsTrigger>
              <TabsTrigger 
                value="marketing-analysis" 
                className="flex items-center space-x-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Marketing Analysis</span>
                <span className="sm:hidden">Marketing</span>
              </TabsTrigger>
              <TabsTrigger 
                value="comment-analysis" 
                className="flex items-center space-x-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Comment Analysis</span>
                <span className="sm:hidden">Comments</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-140px)]">
        <Sidebar
          activeTab={activeTab}
          campaign={campaign}
          setCampaign={setCampaign}
          locality={locality}
          setLocality={setLocality}
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
          analysisOptions={analysisOptions}
          setAnalysisOptions={setAnalysisOptions}
          demographics={demographics}
          setDemographics={setDemographics}
          descriptors={descriptors}
          setDescriptors={setDescriptors}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          isAnalyzing={isAnalyzing}
          canAnalyze={!!getCanAnalyze()}
          onAnalyze={handleAnalyze}
          onReset={handleReset}
        />
        
        <MainContent
          activeTab={activeTab}
          results={results}
          openCards={openCards}
          onToggleCard={toggleCard}
          selectedVideo={selectedVideo}
          videoUrl={videoUrl}
          campaign={campaign}
          locality={locality}
        />
      </div>
    </div>
  );
};

export default Index;
