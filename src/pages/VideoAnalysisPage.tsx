import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import { analyzeVideoBasic, VideoAnalysisRequest } from '@/services/api';
import { toast } from 'sonner';

const VideoAnalysisPage = () => {
  const [campaign, setCampaign] = useState<string>('');
  const [locality, setLocality] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [analysisOptions, setAnalysisOptions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  const handleAnalyze = async () => {
    if (!campaign || !locality || !selectedVideo || analysisOptions.length === 0) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const request: VideoAnalysisRequest = {
        campaign,
        locality,
        video: selectedVideo,
        analysisOptions
      };
      
      const analysisResults = await analyzeVideoBasic(request);
      setResults(analysisResults);
      
      // Auto-open first result card
      const firstKey = Object.keys(analysisResults)[0];
      if (firstKey) {
        setOpenCards({ [firstKey]: true });
      }
      
      toast.success('Analysis completed successfully!');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCampaign('');
    setLocality('');
    setSelectedVideo(null);
    setAnalysisOptions([]);
    setResults(null);
    setOpenCards({});
    toast.success('Form reset successfully');
  };

  const toggleCard = (key: string) => {
    setOpenCards(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const canAnalyze = campaign && locality && selectedVideo && analysisOptions.length > 0;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeTab="video-analysis"
        campaign={campaign}
        setCampaign={setCampaign}
        locality={locality}
        setLocality={setLocality}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
        analysisOptions={analysisOptions}
        setAnalysisOptions={setAnalysisOptions}
        isAnalyzing={isAnalyzing}
        canAnalyze={canAnalyze}
        onAnalyze={handleAnalyze}
        onReset={handleReset}
      />
      <MainContent
        activeTab="video-analysis"
        results={results}
        openCards={openCards}
        onToggleCard={toggleCard}
        selectedVideo={selectedVideo}
        campaign={campaign}
        locality={locality}
      />
    </div>
  );
};

export default VideoAnalysisPage;