import { GetServerSidePropsContext } from "next";
import { getSession, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useState } from "react";
import axios from "axios";

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: { name: string };
}

interface SpotifyQueueResponse {
  currently_playing: SpotifyTrack;
  queue: SpotifyTrack[];
}

export default function Index({ session }: { session: Session }) {
  const [currentTrack, setCurrentTrack] = useState<string>("");
  const [queueTracks, setQueueTracks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

    const fetchQueue = async () => {
    setLoading(true);
    try {
      const response = await axios.get<SpotifyQueueResponse>(
        'https://api.spotify.com/v1/me/player/queue',
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        }
      );
      
      console.log("Queue data:", response.data);
      
      // Get currently playing track
      const current = response.data.currently_playing?.name || "Nothing playing";
      setCurrentTrack(current);
      
      // Get queue track names
      const queueNames = response.data.queue.map(track => track.name);
      setQueueTracks(queueNames);
      
      console.log("Current:", current);
      console.log("Queue:", queueNames);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ maxWidth: '400px' }}>
        <button onClick={() => signOut()}>Sign out</button>
        <button onClick={fetchQueue} disabled={loading}>{loading ? 'Loading...' : 'Get Recent Queue'}</button>
        {currentTrack && (
        <div style={{ marginTop: '20px' }}>
          <h3>Currently Playing:</h3>
          <p style={{ fontWeight: 'bold', color: 'green' }}>{currentTrack}</p>
        </div>
      )}
        {queueTracks.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Up Next ({queueTracks.length} songs):</h3>
          <ol>
            {queueTracks.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ol>
        </div>
      )}
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) return { redirect: { permanent: false, destination: "/signin" } };

  return { props: { session: session } };
}









// import Script from 'next/script';

// export default function MusicalRoulette() {
//   return (
//     <>
//         <div id="dash">
//           <h1>Spotify Jam Saver</h1>
//           <p>Currently Spotify's api doesn't provide a way to distinguish if you're in a jam or not. Thus, 
//             The game where a song plays and you guess whose song it is. Everyone enters a game code and plays on their own device.
//           </p>
//           <button id="join">Join a game</button>
//           <button id="create">Create a game</button>
//         </div>

//        
//         <div id="alldone" className="hidden">
//           <a href="/">
//             <button style={{ marginBottom: '5px' }}>Play again</button>
//           </a>
//           {/* <a id="playlistButton" href="https://accounts.spotify.com/authorize?response_type=token&client_id=6a07d379738c4e329ab09b8c4f5649d1&scope=playlist-modify-public,playlist-modify-private&redirect_uri=https://musicalroulette.com/playlist&state=">
//             <button style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Make playlist from game songs</button>
//           </a> */}
//           <div id="doneSongs"></div>
//         </div>
//       </div>






