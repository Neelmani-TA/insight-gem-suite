import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MessageSquare, RotateCcw, ExternalLink } from 'lucide-react';
import ResultCard from '@/components/ResultCard';
import { analyzeYouTubeComments, YouTubeCommentsRequest } from '@/services/api';

const CommentAnalysisTab = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [maxComments, setMaxComments] = useState<number>(25);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  const commentLimits = [10, 25, 50];

  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
  };

  const handleAnalyze = async () => {
    if (!videoUrl || !isValidYouTubeUrl(videoUrl)) {
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const request: YouTubeCommentsRequest = {
        videoUrl,
        maxComments
      };
      
      const analysisResults = await analyzeYouTubeComments(request);
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
    setVideoUrl('');
    setMaxComments(25);
    setResults(null);
    setOpenCards({});
  };

  const toggleCard = (key: string) => {
    setOpenCards(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const canAnalyze = videoUrl && isValidYouTubeUrl(videoUrl);

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getThumbnailUrl = (url: string) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left Panel - Inputs */}
      <div className="space-y-6">
        <div className="glass rounded-lg p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">YouTube Video Analysis</h3>
            <p className="text-sm text-muted-foreground">Analyze comments and engagement for any YouTube video</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">YouTube Video URL</label>
              <div className="relative">
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className={`glass pr-10 ${!videoUrl || isValidYouTubeUrl(videoUrl) ? '' : 'border-destructive focus:border-destructive'}`}
                />
                {videoUrl && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isValidYouTubeUrl(videoUrl) ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
              {videoUrl && !isValidYouTubeUrl(videoUrl) && (
                <p className="text-xs text-destructive">Please enter a valid YouTube URL</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Max Comments to Analyze</label>
              <Select value={maxComments.toString()} onValueChange={(value) => setMaxComments(parseInt(value))}>
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {commentLimits.map(limit => (
                    <SelectItem key={limit} value={limit.toString()}>
                      {limit} comments
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {videoUrl && isValidYouTubeUrl(videoUrl) && (
          <div className="glass rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Video Preview</h3>
            
            <div className="flex items-start space-x-4">
              {getThumbnailUrl(videoUrl) && (
                <img 
                  src={getThumbnailUrl(videoUrl)!} 
                  alt="Video thumbnail"
                  className="w-24 h-18 object-cover rounded-lg border border-border"
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
              <MessageSquare className="w-4 h-4" />
            )}
            {isAnalyzing ? 'Analyzing Comments...' : 'Analyze Comments'}
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
              <h3 className="text-lg font-semibold text-foreground mb-2">Comment Analysis Results</h3>
              <p className="text-sm text-muted-foreground">
                Analyzed {maxComments} most recent comments from the video
              </p>
            </div>
            
            <div className="space-y-3">
              {Object.entries(results).map(([key, content]) => (
                <ResultCard
                  key={key}
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
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
              <div className="w-16 h-16 rounded-full bg-gradient-accent/10 flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Comment Intelligence</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Enter a YouTube video URL to analyze viewer comments, sentiment, and engagement patterns.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentAnalysisTab;