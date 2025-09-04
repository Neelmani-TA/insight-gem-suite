import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Play, RotateCcw } from 'lucide-react';
import VideoUpload from '@/components/VideoUpload';
import ResultCard from '@/components/ResultCard';
import { analyzeVideoBasic, VideoAnalysisRequest } from '@/services/api';

const VideoAnalysisTab = () => {
  const [campaign, setCampaign] = useState<string>('');
  const [locality, setLocality] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [analysisOptions, setAnalysisOptions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  const campaigns = [
    'Facebook',
    'YouTube', 
    'Instagram',
    'TikTok',
    'LinkedIn'
  ];

  const localities = [
    'US',
    'UK', 
    'Canada',
    'Australia',
    'India'
  ];

  const analysisOptionsList = [
    'Video Description',
    'Audio-Text Mining',
    'Product Theme',
    'Ingredients',
    'Consumer Review',
    'Packaging'
  ];

  const handleAnalysisOptionChange = (option: string, checked: boolean) => {
    if (checked) {
      setAnalysisOptions(prev => [...prev, option]);
    } else {
      setAnalysisOptions(prev => prev.filter(opt => opt !== option));
    }
  };

  const handleAnalyze = async () => {
    if (!campaign || !locality || !selectedVideo || analysisOptions.length === 0) {
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
    setResults(null);
    setOpenCards({});
  };

  const toggleCard = (key: string) => {
    setOpenCards(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const canAnalyze = campaign && locality && selectedVideo && analysisOptions.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left Panel - Inputs */}
      <div className="space-y-6">
        <div className="glass rounded-lg p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Campaign Configuration</h3>
            <p className="text-sm text-muted-foreground">Select your campaign platform and target market</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Campaign Platform</label>
              <Select value={campaign} onValueChange={setCampaign}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map(platform => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target Locality</label>
              <Select value={locality} onValueChange={setLocality}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Select locality" />
                </SelectTrigger>
                <SelectContent>
                  {localities.map(loc => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Video Upload</h3>
            <p className="text-sm text-muted-foreground">Upload your MP4 video file for analysis</p>
          </div>
          
          <VideoUpload 
            onVideoSelect={setSelectedVideo}
            selectedVideo={selectedVideo}
          />
        </div>

        <div className="glass rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Analysis Options</h3>
            <p className="text-sm text-muted-foreground">Select the types of analysis to perform</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysisOptionsList.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={analysisOptions.includes(option)}
                  onCheckedChange={(checked) => handleAnalysisOptionChange(option, !!checked)}
                />
                <label 
                  htmlFor={option} 
                  className="text-sm text-foreground cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="ai"
            onClick={handleAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            className="flex-1"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={isAnalyzing}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Right Panel - Results */}
      <div className="space-y-4">
        {results ? (
          <>
            <div className="glass rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">Analysis Results</h3>
              <p className="text-sm text-muted-foreground">
                Completed analysis for {campaign} campaign targeting {locality}
              </p>
            </div>
            
            <div className="space-y-3">
              {Object.entries(results).map(([key, content]) => (
                <ResultCard
                  key={key}
                  title={key}
                  content={content}
                  isOpen={openCards[key]}
                  onToggle={() => toggleCard(key)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="glass rounded-lg p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Ready to Analyze</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Configure your campaign settings, upload a video, and select analysis options to get started.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnalysisTab;