import React from 'react';
import { Play, MessageSquare, Target, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResultsAccordion from '@/components/ResultsAccordion';

interface MainContentProps {
  activeTab: string;
  results: Record<string, string> | null;
  openCards: Record<string, boolean>;
  onToggleCard: (key: string) => void;
  // Video preview props
  selectedVideo?: File | null;
  videoUrl?: string;
  campaign?: string;
  locality?: string;
}

const MainContent: React.FC<MainContentProps> = ({
  activeTab,
  results,
  openCards,
  onToggleCard,
  selectedVideo,
  videoUrl,
  campaign,
  locality
}) => {
  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getThumbnailUrl = (url: string) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'video-analysis':
        return 'Video Analysis';
      case 'marketing-analysis':
        return 'Marketing Analysis';
      case 'comment-analysis':
        return 'Comment Analysis';
      default:
        return 'Analysis';
    }
  };

  const getTabIcon = () => {
    switch (activeTab) {
      case 'video-analysis':
        return <Play className="w-6 h-6 text-primary" />;
      case 'marketing-analysis':
        return <Target className="w-6 h-6 text-primary" />;
      case 'comment-analysis':
        return <MessageSquare className="w-6 h-6 text-primary" />;
      default:
        return <Play className="w-6 h-6 text-primary" />;
    }
  };

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case 'video-analysis':
        return 'Configure your campaign settings, upload a video, and select analysis options to get started.';
      case 'marketing-analysis':
        return 'Select your campaign platform, target demographics, and upload a video to analyze marketing effectiveness.';
      case 'comment-analysis':
        return 'Enter a YouTube video URL to analyze viewer comments, sentiment, and engagement patterns.';
      default:
        return 'Configure your settings to begin analysis.';
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">{getTabTitle()}</h1>
        <p className="text-muted-foreground">
          {activeTab === 'video-analysis' && 'Analyze video content across different platforms and markets'}
          {activeTab === 'marketing-analysis' && 'Evaluate marketing effectiveness and audience targeting'}
          {activeTab === 'comment-analysis' && 'Extract insights from YouTube video comments and engagement'}
        </p>
      </div>

      {/* Video Preview Section */}
      {((activeTab === 'video-analysis' || activeTab === 'marketing-analysis') && selectedVideo) && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Video Preview</h3>
          
          <div className="flex items-start space-x-4">
            <div className="w-32 h-24 bg-muted rounded-lg flex items-center justify-center">
              <Play className="w-8 h-8 text-muted-foreground" />
            </div>
            
            <div className="flex-1 space-y-2">
              <h4 className="font-medium text-foreground">{selectedVideo.name}</h4>
              <p className="text-sm text-muted-foreground">
                Size: {(selectedVideo.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-sm text-muted-foreground">
                Type: {selectedVideo.type}
              </p>
              {campaign && locality && activeTab === 'video-analysis' && (
                <p className="text-sm text-muted-foreground">
                  Target: {campaign} campaign in {locality}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* YouTube Video Preview */}
      {activeTab === 'comment-analysis' && videoUrl && isValidYouTubeUrl(videoUrl) && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Video Preview</h3>
          
          <div className="flex items-start space-x-4">
            {getThumbnailUrl(videoUrl) && (
              <img 
                src={getThumbnailUrl(videoUrl)!} 
                alt="Video thumbnail"
                className="w-32 h-24 object-cover rounded-lg border border-border"
              />
            )}
            
            <div className="flex-1 space-y-2">
              <p className="text-sm text-muted-foreground">
                Video ID: {extractVideoId(videoUrl)}
              </p>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-xs"
              >
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open Video
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {results ? (
        <div className="space-y-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Analysis Results</h3>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'video-analysis' && campaign && locality && 
                `Completed analysis for ${campaign} campaign targeting ${locality}`}
              {activeTab === 'marketing-analysis' && campaign && 
                `Marketing analysis completed for ${campaign} platform`}
              {activeTab === 'comment-analysis' && 
                'Comment analysis completed successfully'}
            </p>
          </div>
          
          <ResultsAccordion 
            results={results}
            openCards={openCards}
            onToggleCard={onToggleCard}
          />
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              {getTabIcon()}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Ready to Analyze</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {getEmptyStateMessage()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;