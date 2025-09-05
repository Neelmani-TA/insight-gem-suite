import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import { analyzeAdMarketing, MarketingAnalysisRequest } from '@/services/api';
import { toast } from 'sonner';

const MarketingAnalysisPage = () => {
  const [campaign, setCampaign] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [demographics, setDemographics] = useState<string[]>([]);
  const [descriptors, setDescriptors] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  const handleAnalyze = async () => {
    if (!campaign || !selectedVideo || demographics.length === 0 || descriptors.length === 0) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const request: MarketingAnalysisRequest = {
        campaign,
        demographics,
        descriptors,
        video: selectedVideo
      };
      
      const analysisResults = await analyzeAdMarketing(request);
      setResults(analysisResults);
      
      // Auto-open first result card
      const firstKey = Object.keys(analysisResults)[0];
      if (firstKey) {
        setOpenCards({ [firstKey]: true });
      }
      
      toast.success('Marketing analysis completed successfully!');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCampaign('');
    setSelectedVideo(null);
    setDemographics([]);
    setDescriptors([]);
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

  const canAnalyze = campaign && selectedVideo && demographics.length > 0 && descriptors.length > 0;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeTab="marketing-analysis"
        campaign={campaign}
        setCampaign={setCampaign}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
        demographics={demographics}
        setDemographics={setDemographics}
        descriptors={descriptors}
        setDescriptors={setDescriptors}
        isAnalyzing={isAnalyzing}
        canAnalyze={canAnalyze}
        onAnalyze={handleAnalyze}
        onReset={handleReset}
      />
      <MainContent
        activeTab="marketing-analysis"
        results={results}
        openCards={openCards}
        onToggleCard={toggleCard}
        selectedVideo={selectedVideo}
        campaign={campaign}
      />
    </div>
  );
};

export default MarketingAnalysisPage;