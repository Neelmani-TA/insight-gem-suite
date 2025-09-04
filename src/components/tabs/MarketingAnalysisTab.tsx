import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Target, RotateCcw } from 'lucide-react';
import VideoUpload from '@/components/VideoUpload';
import ResultCard from '@/components/ResultCard';
import { analyzeAdMarketing, MarketingAnalysisRequest } from '@/services/api';

const MarketingAnalysisTab = () => {
  const [campaign, setCampaign] = useState<string>('');
  const [demographics, setDemographics] = useState<string[]>([]);
  const [descriptors, setDescriptors] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
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

  const demographicOptions = [
    'Male',
    'Female',
    'Kids',
    'Teens',
    'Adults',
    'Seniors'
  ];

  const descriptorOptions = [
    'Consumer Impact & Engagement',
    'Brand & Creative Quality',
    'Regulatory & Claims Compliance (U.S.)'
  ];

  const handleDemographicChange = (demographic: string, checked: boolean) => {
    if (checked) {
      setDemographics(prev => [...prev, demographic]);
    } else {
      setDemographics(prev => prev.filter(demo => demo !== demographic));
    }
  };

  const handleDescriptorChange = (descriptor: string, checked: boolean) => {
    if (checked) {
      setDescriptors(prev => [...prev, descriptor]);
    } else {
      setDescriptors(prev => prev.filter(desc => desc !== descriptor));
    }
  };

  const handleAnalyze = async () => {
    if (!campaign || demographics.length === 0 || descriptors.length === 0 || !selectedVideo) {
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
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCampaign('');
    setDemographics([]);
    setDescriptors([]);
    setSelectedVideo(null);
    setResults(null);
    setOpenCards({});
  };

  const toggleCard = (key: string) => {
    setOpenCards(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const canAnalyze = campaign && demographics.length > 0 && descriptors.length > 0 && selectedVideo;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left Panel - Inputs */}
      <div className="space-y-6">
        <div className="glass rounded-lg p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Campaign Platform</h3>
            <p className="text-sm text-muted-foreground">Select your advertising platform</p>
          </div>

          <Select value={campaign} onValueChange={setCampaign}>
            <SelectTrigger className="glass">
              <SelectValue placeholder="Select campaign platform" />
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

        <div className="glass rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Target Demographics</h3>
            <p className="text-sm text-muted-foreground">Select your target audience segments</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {demographicOptions.map(demographic => (
              <div key={demographic} className="flex items-center space-x-2">
                <Checkbox
                  id={demographic}
                  checked={demographics.includes(demographic)}
                  onCheckedChange={(checked) => handleDemographicChange(demographic, !!checked)}
                />
                <label 
                  htmlFor={demographic} 
                  className="text-sm text-foreground cursor-pointer"
                >
                  {demographic}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Analysis Descriptors</h3>
            <p className="text-sm text-muted-foreground">Choose analysis focus areas</p>
          </div>

          <div className="space-y-3">
            {descriptorOptions.map(descriptor => (
              <div key={descriptor} className="flex items-center space-x-2">
                <Checkbox
                  id={descriptor}
                  checked={descriptors.includes(descriptor)}
                  onCheckedChange={(checked) => handleDescriptorChange(descriptor, !!checked)}
                />
                <label 
                  htmlFor={descriptor} 
                  className="text-sm text-foreground cursor-pointer"
                >
                  {descriptor}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Advertisement Video</h3>
            <p className="text-sm text-muted-foreground">Upload your marketing video for analysis</p>
          </div>
          
          <VideoUpload 
            onVideoSelect={setSelectedVideo}
            selectedVideo={selectedVideo}
          />
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
              <Target className="w-4 h-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
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
              <h3 className="text-lg font-semibold text-foreground mb-2">Marketing Analysis Results</h3>
              <p className="text-sm text-muted-foreground">
                Analysis complete for {campaign} targeting {demographics.join(', ')}
              </p>
            </div>
            
            <div className="space-y-3">
              {Object.entries(results).map(([key, content]) => (
                <ResultCard
                  key={key}
                  title={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
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
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Marketing Intelligence Ready</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Select your platform, demographics, analysis type, and upload your ad video to begin.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingAnalysisTab;