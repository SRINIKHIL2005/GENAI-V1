import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Heart, Music } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  category: 'calm' | 'upbeat' | 'focus' | 'sleep' | 'nature' | 'asmr';
  mood: string[];
  image?: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  category: string;
  gradient: string;
  icon: string;
}

interface MusicPlayerProps {
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMood, setCurrentMood] = useState('calm');

  const audioRef = useRef<HTMLAudioElement>(null);

  const backgroundImage = theme === 'light' 
    ? "url('/Videos/Gemini_Generated_Image_o3tfm6o3tfm6o3tf.png')"
    : "url('/Videos/Gemini_Generated_Image_5mb6o5mb6o5mb6o5.png')";

  const tracks: Track[] = [
    {
      id: '1',
      title: 'Peaceful Rain',
      artist: 'Nature Sounds',
      duration: 300,
      url: '/audio/peaceful-rain.mp3',
      category: 'nature',
      mood: ['calm', 'sleep', 'focus']
    },
    {
      id: '2',
      title: 'Morning Meditation',
      artist: 'Mindful Beats',
      duration: 480,
      url: '/audio/morning-meditation.mp3',
      category: 'calm',
      mood: ['calm', 'focus']
    },
    {
      id: '3',
      title: 'Ocean Waves ASMR',
      artist: 'ASMR Collective',
      duration: 720,
      url: '/audio/ocean-waves.mp3',
      category: 'asmr',
      mood: ['calm', 'sleep']
    },
    {
      id: '4',
      title: 'Focus Flow',
      artist: 'Study Vibes',
      duration: 240,
      url: '/audio/focus-flow.mp3',
      category: 'focus',
      mood: ['focus', 'productive']
    },
    {
      id: '5',
      title: 'Gentle Whispers',
      artist: 'ASMR Studio',
      duration: 900,
      url: '/audio/gentle-whispers.mp3',
      category: 'asmr',
      mood: ['calm', 'sleep', 'anxiety-relief']
    },
    {
      id: '6',
      title: 'Forest Ambience',
      artist: 'Nature Sounds',
      duration: 600,
      url: '/audio/forest-ambience.mp3',
      category: 'nature',
      mood: ['calm', 'focus', 'stress-relief']
    }
  ];

  const playlists: Playlist[] = [
    {
      id: 'calm',
      name: 'Calm & Peaceful',
      description: 'Soothing sounds for relaxation',
      tracks: tracks.filter(t => t.mood.includes('calm')),
      category: 'mood',
      gradient: 'from-blue-400 to-cyan-500',
      icon: '🌊'
    },
    {
      id: 'sleep',
      name: 'Sleep Stories',
      description: 'Gentle sounds for better sleep',
      tracks: tracks.filter(t => t.mood.includes('sleep')),
      category: 'mood',
      gradient: 'from-indigo-500 to-purple-600',
      icon: '🌙'
    },
    {
      id: 'focus',
      name: 'Focus Flow',
      description: 'Background music for concentration',
      tracks: tracks.filter(t => t.mood.includes('focus')),
      category: 'mood',
      gradient: 'from-green-400 to-emerald-500',
      icon: '🎯'
    },
    {
      id: 'nature',
      name: 'Nature Sounds',
      description: 'Pure nature for mindfulness',
      tracks: tracks.filter(t => t.category === 'nature'),
      category: 'type',
      gradient: 'from-green-500 to-teal-600',
      icon: '🌿'
    },
    {
      id: 'asmr',
      name: 'ASMR Collection',
      description: 'Tingles and relaxation',
      tracks: tracks.filter(t => t.category === 'asmr'),
      category: 'type',
      gradient: 'from-pink-400 to-purple-500',
      icon: '🎧'
    }
  ];

  const moodCategories = [
    { id: 'recommended', name: 'For You', icon: '✨', gradient: 'from-yellow-400 to-orange-500' },
    { id: 'calm', name: 'Calm', icon: '😌', gradient: 'from-blue-400 to-cyan-500' },
    { id: 'focus', name: 'Focus', icon: '🎯', gradient: 'from-green-400 to-emerald-500' },
    { id: 'sleep', name: 'Sleep', icon: '🌙', gradient: 'from-indigo-500 to-purple-600' },
    { id: 'energy', name: 'Energy', icon: '⚡', gradient: 'from-red-400 to-pink-500' }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnd = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [isRepeating]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play();
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentTrack) return;
    
    const currentPlaylist = playlists.find(p => p.tracks.some(t => t.id === currentTrack.id));
    if (!currentPlaylist) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentTrack) return;
    
    const currentPlaylist = playlists.find(p => p.tracks.some(t => t.id === currentTrack.id));
    if (!currentPlaylist) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? currentPlaylist.tracks.length - 1 : currentIndex - 1;
    playTrack(currentPlaylist.tracks[prevIndex]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecommendedTracks = () => {
    // AI-powered mood-based recommendations
    const moodTracks = tracks.filter(t => t.mood.includes(currentMood));
    return moodTracks.slice(0, 6);
  };

  const filteredPlaylists = selectedCategory === 'recommended' 
    ? [{ 
        id: 'recommended', 
        name: 'Recommended for You', 
        description: 'AI-curated based on your mood',
        tracks: getRecommendedTracks(),
        category: 'ai',
        gradient: 'from-yellow-400 to-orange-500',
        icon: '🤖'
      }]
    : playlists.filter(p => 
        selectedCategory === 'all' || 
        p.id === selectedCategory ||
        p.category === selectedCategory
      );

  return (
    <div 
      className={`min-h-screen flex flex-col ${className}`}
      style={{
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Global glassmorphism overlay - reduced opacity for better background visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-blue-500/3 to-purple-500/5 pointer-events-none"></div>
      
      <audio ref={audioRef} />
      
      {/* Audio volume management happens in useEffect */}
      {audioRef.current && (audioRef.current.volume = isMuted ? 0 : volume)}
      
      {/* Header */}
      <div className="relative p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/20 via-blue-200/15 to-purple-200/20 backdrop-blur-2xl"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
              <Music className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Music & ASMR</h1>
              <p className="text-white/70 text-sm">Find your perfect sound</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracks..."
              className="w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 outline-none focus:border-white/40"
            />
          </div>
        </div>
      </div>

      {/* Mood Categories */}
      <div className="px-4 mb-6">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {moodCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg scale-105`
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span>{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Track Player */}
      {currentTrack && (
        <div className="mx-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-400/20 to-purple-500/30 blur-xl rounded-2xl"></div>
            
            <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-6 shadow-xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                  <Music className="h-8 w-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{currentTrack.title}</h3>
                  <p className="text-white/70">{currentTrack.artist}</p>
                </div>
                
                <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all">
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-white/70 text-sm mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentTrack.duration)}</span>
                </div>
                
                <div className="h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300"
                    style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsShuffled(!isShuffled)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isShuffled ? 'bg-purple-500/30 text-purple-300' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Shuffle className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={playPrevious}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                  >
                    <SkipBack className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={togglePlayPause}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/40 to-pink-500/40 flex items-center justify-center text-white hover:from-purple-500/50 hover:to-pink-500/50 transition-all shadow-lg"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </button>
                  
                  <button
                    onClick={playNext}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                  >
                    <SkipForward className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={() => setIsRepeating(!isRepeating)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isRepeating ? 'bg-purple-500/30 text-purple-300' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Repeat className="h-4 w-4" />
                  </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  
                  <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300"
                      style={{ width: `${volume * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Playlists */}
      <div className="flex-1 px-4 pb-4">
        {filteredPlaylists.map((playlist) => (
          <div key={playlist.id} className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{playlist.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{playlist.name}</h2>
                <p className="text-white/70 text-sm">{playlist.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlist.tracks.map((track) => (
                <div 
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div className="relative bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-2xl rounded-2xl border border-white/30 p-4 shadow-xl group-hover:scale-105 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${playlist.gradient} flex items-center justify-center shadow-lg`}>
                        {track.category === 'asmr' ? '🎧' : 
                         track.category === 'nature' ? '🌿' : '🎵'}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{track.title}</h3>
                        <p className="text-white/70 text-sm">{track.artist}</p>
                        <p className="text-white/50 text-xs">{formatTime(track.duration)}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {currentTrack?.id === track.id && isPlaying && (
                          <div className="flex space-x-0.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-1 bg-purple-400 rounded-full animate-pulse"
                                style={{ 
                                  height: `${Math.random() * 16 + 8}px`,
                                  animationDelay: `${i * 0.2}s`
                                }}
                              ></div>
                            ))}
                          </div>
                        )}
                        
                        <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                          <Play className="h-4 w-4 ml-0.5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Mood Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {track.mood.slice(0, 2).map((mood) => (
                        <span 
                          key={mood}
                          className="text-xs bg-white/20 px-2 py-1 rounded-full text-white/70"
                        >
                          {mood}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer;
