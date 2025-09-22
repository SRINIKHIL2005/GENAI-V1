import React, { useState, useRef, useEffect } from "react";
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WellnessHeader from "@/components/WellnessHeader";
import { useTheme } from "@/hooks/useTheme";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  category: "meditation" | "nature" | "ambient" | "binaural" | "guided";
  url: string;
  description: string;
}

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  description: string;
}

const MusicRelaxation: React.FC = () => {
  const { theme } = useTheme();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const backgroundImage = theme === 'light' 
    ? "url('/Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png')"
    : "url('/Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png')";

  const audioRef = useRef<HTMLAudioElement>(null);

  const musicLibrary: Track[] = [
    {
      id: "1",
      title: "Ocean Waves",
      artist: "Nature Sounds",
      duration: 600,
      category: "nature",
      url: "https://www.soundjay.com/misc/sounds/ocean-wave-1.wav",
      description: "Calming ocean waves for deep relaxation"
    },
    {
      id: "2",
      title: "Forest Rain",
      artist: "Nature Sounds",
      duration: 720,
      category: "nature", 
      url: "https://www.soundjay.com/misc/sounds/rain-1.wav",
      description: "Gentle rain in a peaceful forest"
    },
    {
      id: "3",
      title: "Mindful Breathing",
      artist: "Wellness Guide",
      duration: 480,
      category: "guided",
      url: "https://example.com/guided-breathing.mp3",
      description: "Guided breathing meditation for stress relief"
    },
    {
      id: "4",
      title: "Ambient Dreams",
      artist: "Relaxation Music",
      duration: 900,
      category: "ambient",
      url: "https://example.com/ambient-dreams.mp3", 
      description: "Soft ambient tones for deep relaxation"
    },
    {
      id: "5",
      title: "Alpha Waves",
      artist: "Binaural Beats",
      duration: 1800,
      category: "binaural",
      url: "https://example.com/alpha-waves.mp3",
      description: "Alpha wave frequencies for focus and calm"
    },
    {
      id: "6",
      title: "Zen Garden",
      artist: "Meditation Music",
      duration: 1200,
      category: "meditation",
      url: "https://example.com/zen-garden.mp3",
      description: "Peaceful melodies inspired by zen gardens"
    }
  ];

  const playlists: Playlist[] = [
    {
      id: "stress-relief",
      name: "Stress Relief",
      tracks: [musicLibrary[0], musicLibrary[3], musicLibrary[5]],
      description: "Calm your mind and reduce stress"
    },
    {
      id: "sleep",
      name: "Sleep & Dreams",
      tracks: [musicLibrary[1], musicLibrary[3], musicLibrary[4]],
      description: "Drift into peaceful sleep"
    },
    {
      id: "focus",
      name: "Focus & Study",
      tracks: [musicLibrary[4], musicLibrary[3], musicLibrary[5]],
      description: "Enhance concentration and focus"
    },
    {
      id: "nature",
      name: "Nature Sounds",
      tracks: [musicLibrary[0], musicLibrary[1]],
      description: "Pure nature sounds for relaxation"
    }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isRepeating]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    // Note: In a real app, you would set the audio source here
    // audioRef.current.src = track.url;
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      // audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    if (!activePlaylist) return;
    
    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * activePlaylist.tracks.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % activePlaylist.tracks.length;
    }
    
    setCurrentTrackIndex(nextIndex);
    playTrack(activePlaylist.tracks[nextIndex]);
  };

  const previousTrack = () => {
    if (!activePlaylist) return;
    
    const prevIndex = currentTrackIndex === 0 
      ? activePlaylist.tracks.length - 1 
      : currentTrackIndex - 1;
    
    setCurrentTrackIndex(prevIndex);
    playTrack(activePlaylist.tracks[prevIndex]);
  };

  const seekTo = (percentage: number) => {
    if (!currentTrack) return;
    const newTime = (percentage / 100) * currentTrack.duration;
    setCurrentTime(newTime);
    // audioRef.current.currentTime = newTime;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "meditation": return "text-purple-600 bg-purple-100 dark:bg-purple-900/20";
      case "nature": return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "ambient": return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      case "binaural": return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
      case "guided": return "text-pink-600 bg-pink-100 dark:bg-pink-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const playPlaylist = (playlist: Playlist) => {
    setActivePlaylist(playlist);
    setCurrentTrackIndex(0);
    playTrack(playlist.tracks[0]);
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Global glassmorphism overlay - reduced opacity for better background visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-blue-500/3 to-purple-500/5 pointer-events-none"></div>
      
      <WellnessHeader title="Music & Relaxation" />
      
      <div className="relative max-w-4xl mx-auto p-6 space-y-6">
        {/* Music Player */}
        {currentTrack && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Music className="h-6 w-6 text-blue-500" />
                <span>Now Playing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Track Info */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentTrack.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentTrack.artist}
                </p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentTrack.category)}`}>
                  {currentTrack.category}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div 
                  className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
                    seekTo(percentage);
                  }}
                >
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentTrack.duration)}</span>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={() => setIsShuffled(!isShuffled)}
                  variant={isShuffled ? "default" : "outline"}
                  size="icon"
                >
                  <Shuffle className="h-5 w-5" />
                </Button>
                
                <Button
                  onClick={previousTrack}
                  variant="outline"
                  size="icon"
                  disabled={!activePlaylist}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button
                  onClick={togglePlayPause}
                  className="h-16 w-16 rounded-full bg-blue-500 hover:bg-blue-600"
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
                
                <Button
                  onClick={nextTrack}
                  variant="outline"
                  size="icon"
                  disabled={!activePlaylist}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
                
                <Button
                  onClick={() => setIsRepeating(!isRepeating)}
                  variant={isRepeating ? "default" : "outline"}
                  size="icon"
                >
                  <Repeat className="h-5 w-5" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-3">
                <Volume2 className="h-5 w-5 text-gray-600" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Playlists */}
        <Card>
          <CardHeader>
            <CardTitle>Relaxation Playlists</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Curated playlists for different wellness needs
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {playlist.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {playlist.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {playlist.tracks.length} tracks
                  </p>
                  
                  <Button 
                    onClick={() => playPlaylist(playlist)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Play Playlist
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Music Library */}
        <Card>
          <CardHeader>
            <CardTitle>Music Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {musicLibrary.map((track) => (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    currentTrack?.id === track.id 
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700" 
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => playTrack(track)}
                >
                  <div className="flex items-center space-x-3">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentTrack?.id === track.id) {
                          togglePlayPause();
                        } else {
                          playTrack(track);
                        }
                      }}
                    >
                      {currentTrack?.id === track.id && isPlaying ? 
                        <Pause className="h-4 w-4" /> : 
                        <Play className="h-4 w-4" />
                      }
                    </Button>
                    
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {track.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {track.artist} • {formatTime(track.duration)}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(track.category)}`}>
                    {track.category}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits Info */}
        <Card>
          <CardHeader>
            <CardTitle>Music Therapy Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">How Music Helps:</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Reduces stress and anxiety</li>
                  <li>• Improves sleep quality</li>
                  <li>• Enhances focus and concentration</li>
                  <li>• Promotes emotional well-being</li>
                  <li>• Lowers blood pressure</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Best Practices:</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Use headphones for better experience</li>
                  <li>• Find a comfortable, quiet space</li>
                  <li>• Start with 10-15 minute sessions</li>
                  <li>• Choose music that resonates with you</li>
                  <li>• Regular practice increases benefits</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} preload="metadata" />
      </div>
    </div>
  );
};

export default MusicRelaxation;
