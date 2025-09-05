import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Loader2, Play, RotateCcw, MessageSquare } from 'lucide-react';
import VideoUpload from '@/components/VideoUpload';

interface SidebarProps {
  activeTab: string;
  // Video Analysis Props
  campaign?: string;
  setCampaign?: (value: string) => void;
  locality?: string;
  setLocality?: (value: string) => void;
  selectedVideo?: File | null;
  setSelectedVideo?: (file: File | null) => void;
  analysisOptions?: string[];
  setAnalysisOptions?: (options: string[]) => void;
  
  // Marketing Analysis Props
  demographics?: string[];
  setDemographics?: (demographics: string[]) => void;
  descriptors?: string[];
  setDescriptors?: (descriptors: string[]) => void;
  
  // Comment Analysis Props
  videoUrl?: string;
  setVideoUrl?: (url: string) => void;
  
  // Common Props
  isAnalyzing?: boolean;
  canAnalyze?: boolean;
  onAnalyze?: () => void;
  onReset?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  campaign,
  setCampaign,
  locality,
  setLocality,
  selectedVideo,
  setSelectedVideo,
  analysisOptions = [],
  setAnalysisOptions,
  demographics = [],
  setDemographics,
  descriptors = [],
  setDescriptors,
  videoUrl,
  setVideoUrl,
  isAnalyzing = false,
  canAnalyze = false,
  onAnalyze,
  onReset
}) => {
  const campaigns = ['Facebook', 'YouTube', 'Instagram', 'TikTok', 'LinkedIn'];
  const localities = ['US', 'UK', 'Canada', 'Australia', 'India'];
  const analysisOptionsList = [
    'Video Description',
    'Audio-Text Mining',
    'Product Theme',
    'Ingredients',
    'Consumer Review',
    'Packaging'
  ];
  const demographicsList = ['Male', 'Female', 'Kids', 'Teens', 'Adults', 'Seniors'];
  const descriptorsList = [
    'Consumer Impact & Engagement',
    'Brand & Creative Quality',
    'Regulatory & Claims Compliance (U.S.)'
  ];

  const handleAnalysisOptionChange = (option: string, checked: boolean) => {
    if (!setAnalysisOptions) return;
    if (checked) {
      setAnalysisOptions([...analysisOptions, option]);
    } else {
      setAnalysisOptions(analysisOptions.filter(opt => opt !== option));
    }
  };

  const handleDemographicChange = (demographic: string, checked: boolean) => {
    if (!setDemographics) return;
    if (checked) {
      setDemographics([...demographics, demographic]);
    } else {
      setDemographics(demographics.filter(demo => demo !== demographic));
    }
  };

  const handleDescriptorChange = (descriptor: string, checked: boolean) => {
    if (!setDescriptors) return;
    if (checked) {
      setDescriptors([...descriptors, descriptor]);
    } else {
      setDescriptors(descriptors.filter(desc => desc !== descriptor));
    }
  };

  const isValidYouTubeUrl = (url: string) => {
    if (!url) return false;
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
  };

  return (
    <div className="w-80 bg-card border-r border-border p-6 space-y-6 overflow-y-auto">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Configuration</h2>
        <p className="text-sm text-muted-foreground">Setup your analysis parameters</p>
      </div>

      {/* Video Analysis Configuration */}
      {activeTab === 'video-analysis' && (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Campaign Platform</label>
              <Select value={campaign} onValueChange={setCampaign}>
                <SelectTrigger>
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
                <SelectTrigger>
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

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">Video Upload</h3>
              <p className="text-xs text-muted-foreground">Upload your MP4 video file</p>
            </div>
            <VideoUpload 
              onVideoSelect={setSelectedVideo}
              selectedVideo={selectedVideo}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">Analysis Options</h3>
              <p className="text-xs text-muted-foreground">Select analysis types</p>
            </div>
            
            <div className="space-y-3">
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
        </>
      )}

      {/* Marketing Analysis Configuration */}
      {activeTab === 'marketing-analysis' && (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Campaign Platform</label>
              <Select value={campaign} onValueChange={setCampaign}>
                <SelectTrigger>
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
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">Target Demographics</h3>
              <p className="text-xs text-muted-foreground">Select target audience</p>
            </div>
            
            <div className="space-y-3">
              {demographicsList.map(demographic => (
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

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">Analysis Descriptors</h3>
              <p className="text-xs text-muted-foreground">Select analysis types</p>
            </div>
            
            <div className="space-y-3">
              {descriptorsList.map(descriptor => (
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

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">Video Upload</h3>
              <p className="text-xs text-muted-foreground">Upload your MP4 video file</p>
            </div>
            <VideoUpload 
              onVideoSelect={setSelectedVideo}
              selectedVideo={selectedVideo}
            />
          </div>
        </>
      )}

      {/* Comment Analysis Configuration */}
      {activeTab === 'comment-analysis' && (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">YouTube Video URL</label>
              <div className="relative">
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl?.(e.target.value)}
                  className={`pr-10 ${!videoUrl || isValidYouTubeUrl(videoUrl) ? '' : 'border-destructive focus:border-destructive'}`}
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
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="pt-6 border-t border-border space-y-3">
        <Button
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : activeTab === 'comment-analysis' ? (
            <MessageSquare className="w-4 h-4 mr-2" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {isAnalyzing ? 'Analyzing...' : 
           activeTab === 'comment-analysis' ? 'Analyze Comments' : 'Run Analysis'}
        </Button>
        
        <Button
          variant="outline"
          onClick={onReset}
          disabled={isAnalyzing}
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;