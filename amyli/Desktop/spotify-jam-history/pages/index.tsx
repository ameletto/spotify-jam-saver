import { useState, useEffect } from 'react';
import { Music, Clock, Calendar } from 'lucide-react';

// Spotify API configuration
const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
const REDIRECT_URI = '0.0.0.0:3002'; // e.g., http://localhost:3000
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPES = 'user-read-recently-played user-read-private';

interface Track {
  played_at: string;
  track: {
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      images: Array<{ url: string }>;
    };
    duration_ms: number;
  };
}

export default function SpotifyListeningHistory() {
  const [token, setToken] = useState<string>('');
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get token from URL hash
    const hash = window.location.hash;
    let storedToken = token;

    if (!storedToken && hash) {
      const tokenParam = hash
        .substring(1)
        .split('&')
        .find(elem => elem.startsWith('access_token'));
      
      if (tokenParam) {
        storedToken = tokenParam.split('=')[1];
        setToken(storedToken);
        window.location.hash = '';
      }
    }

    if (storedToken) {
      fetchRecentlyPlayed(storedToken);
    }
  }, []);

  const handleLogin = () => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    setToken('');
    setRecentTracks([]);
    setError('');
  };

  const fetchRecentlyPlayed = async (accessToken: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'https://api.spotify.com/v1/me/player/recently-played?limit=20',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch listening history');
      }

      const data = await response.json();
      setRecentTracks(data.items);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      if (hours < 1) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      }
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Music className="w-10 h-10 text-green-400" />
            <h1 className="text-4xl font-bold">Spotify Listening History</h1>
          </div>
          {token && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Login Section */}
        {!token ? (
          <div className="text-center py-20">
            <Music className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-2xl mb-4">Connect to Spotify</h2>
            <p className="text-gray-400 mb-8">
              Log in to view your recently played tracks
            </p>
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full text-lg transition transform hover:scale-105"
            >
              Login with Spotify
            </button>
            <div className="mt-8 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg text-sm text-left max-w-xl mx-auto">
              <p className="font-semibold mb-2">⚠️ Setup Required:</p>
              <ol className="list-decimal ml-4 space-y-1 text-gray-300">
                <li>Create a Spotify app at <a href="https://developer.spotify.com/dashboard" className="text-green-400 underline" target="_blank" rel="noopener noreferrer">developer.spotify.com</a></li>
                <li>Add your redirect URI in the app settings</li>
                <li>Replace CLIENT_ID and REDIRECT_URI in the code</li>
              </ol>
            </div>
          </div>
        ) : (
          <>
            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-400 mx-auto"></div>
                <p className="mt-4 text-gray-400">Loading your tracks...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-6">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Tracks List */}
            {!loading && recentTracks.length > 0 && (
              <div className="space-y-4">
                {recentTracks.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 backdrop-blur rounded-lg p-4 flex gap-4 hover:bg-gray-700/50 transition"
                  >
                    {/* Album Cover */}
                    <img
                      src={item.track.album.images[0]?.url}
                      alt={item.track.album.name}
                      className="w-20 h-20 rounded object-cover"
                    />

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {item.track.name}
                      </h3>
                      <p className="text-gray-400 truncate">
                        {item.track.artists.map(a => a.name).join(', ')}
                      </p>
                      <p className="text-gray-500 text-sm truncate">
                        {item.track.album.name}
                      </p>
                      
                      {/* Metadata */}
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(item.track.duration_ms)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.played_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && recentTracks.length === 0 && !error && (
              <div className="text-center py-20 text-gray-400">
                <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No recently played tracks found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}