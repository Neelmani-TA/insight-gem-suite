import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, Target, MessageSquare, Sparkles } from 'lucide-react';
import VideoAnalysisTab from '@/components/tabs/VideoAnalysisTab';
import MarketingAnalysisTab from '@/components/tabs/MarketingAnalysisTab';
import CommentAnalysisTab from '@/components/tabs/CommentAnalysisTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState('video-analysis');

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Film className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center space-x-2">
                  <span>🎬 Gemini Video Intelligence</span>
                  <Sparkles className="w-5 h-5 text-primary animate-glow-pulse" />
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glass p-1">
            <TabsTrigger value="video-analysis" className="flex items-center space-x-2">
              <Film className="w-4 h-4" />
              <span className="hidden sm:inline">Video Analysis</span>
              <span className="sm:hidden">Video</span>
            </TabsTrigger>
            <TabsTrigger value="marketing-analysis" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Marketing Analysis</span>
              <span className="sm:hidden">Marketing</span>
            </TabsTrigger>
            <TabsTrigger value="comment-analysis" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Comment Analysis</span>
              <span className="sm:hidden">Comments</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video-analysis" className="mt-6">
            <VideoAnalysisTab />
          </TabsContent>

          <TabsContent value="marketing-analysis" className="mt-6">
            <MarketingAnalysisTab />
          </TabsContent>

          <TabsContent value="comment-analysis" className="mt-6">
            <CommentAnalysisTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
