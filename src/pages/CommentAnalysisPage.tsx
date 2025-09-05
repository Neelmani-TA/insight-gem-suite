import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import { analyzeYouTubeComments, YouTubeCommentsRequest } from '@/services/api';
import { toast } from 'sonner';

const CommentAnalysisPage = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
  };

  const handleAnalyze = async () => {
    if (!videoUrl || !isValidYouTubeUrl(videoUrl)) {
      toast.error('Please enter a valid YouTube video URL');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const request: YouTubeCommentsRequest = {
        videoUrl,
        maxComments: 50
      };
      
      const insights = await analyzeYouTubeComments(request);
      
      // Convert the insights string to a results object format
      const analysisResults = {
        'Comment Analysis': insights
      };
      
      setResults(analysisResults);
      
      // Auto-open the result card
      setOpenCards({ 'Comment Analysis': true });
      
      toast.success('Comment analysis completed successfully!');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setVideoUrl('');
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

  const canAnalyze = videoUrl && isValidYouTubeUrl(videoUrl);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeTab="comment-analysis"
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        isAnalyzing={isAnalyzing}
        canAnalyze={canAnalyze}
        onAnalyze={handleAnalyze}
        onReset={handleReset}
      />
      <MainContent
        activeTab="comment-analysis"
        results={results}
        openCards={openCards}
        onToggleCard={toggleCard}
        videoUrl={videoUrl}
      />
    </div>
  );
};

export default CommentAnalysisPage;