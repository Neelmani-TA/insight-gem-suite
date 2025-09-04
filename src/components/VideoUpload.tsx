import React, { useCallback, useState } from 'react';
import { Upload, Video, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoUploadProps {
  onVideoSelect: (file: File | null) => void;
  selectedVideo: File | null;
  className?: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoSelect, selectedVideo, className }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (!file.type.startsWith('video/mp4')) {
      setUploadError('Please upload an MP4 video file only.');
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      setUploadError('File size must be less than 100MB.');
      return;
    }

    onVideoSelect(file);
  };

  const removeVideo = () => {
    onVideoSelect(null);
    setUploadError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const duration = video.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {!selectedVideo ? (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
            "glass hover:border-primary/50 hover:bg-card-glass/50",
            dragActive ? "border-primary bg-primary/10" : "border-border"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="video/mp4"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
              "bg-primary/10 text-primary",
              dragActive && "scale-110 bg-primary/20"
            )}>
              <Upload className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload Video File</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your MP4 file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 100MB
              </p>
            </div>
            
            <Button variant="outline" size="sm" className="pointer-events-none">
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass rounded-lg p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Video className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">
                  {selectedVideo.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedVideo.size)} • MP4
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={removeVideo}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Video uploaded successfully</span>
          </div>
        </div>
      )}
      
      {uploadError && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {uploadError}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;