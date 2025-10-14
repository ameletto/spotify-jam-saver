import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import {signOut} from "next-auth/react";
import React from 'react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Index(props:{
    session:{
      user: {
        email:string,
        name:string,
        image: string,
      }
    }
}) {

  const { data: session } = useSession();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchRecentTracks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://api.spotify.com/v1/me/player/recently_played?limit=20', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch tracks');
        
        const data = await res.json();
        setTracks(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTracks();
  }, [session?.accessToken]);

  if (!session) return <p>Please log in with Spotify</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
        <div style={{ maxWidth: '400px' }}>
      <h1>Your 20 Most Recently Played Songs</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tracks.map((item, idx) => (
          <li key={idx} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            <strong>{item.track.name}</strong> by {item.track.artists.map(a => a.name).join(', ')}
            <br />
            <small>Album: {item.track.album.name}</small>
          </li>
        ))}
      </ul>
        <button onClick={() => signOut()}>Sign out</button>
        </div>
  </>
  )
}

export async function getServerSideProps(context:GetServerSidePropsContext) {
  const session = await getSession(context);
  
  if (!session) return {redirect: {permanent: false, destination: "/signin" }};

  return {props: {session: session}}
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

//         <div id="getgamecode" className="hidden">
//           <h1>
//             <span className="offcolor">musical</span>
//             roulette
//           </h1>
//           <input id="createName" type="text" placeholder="Your name" />
//           <button id="gamecode">Get game code</button>
//         </div>

//         <div id="joingame" className="hidden">
//           <h1>
//             <span className="offcolor">musical</span>
//             roulette
//           </h1>
//           <p>Enter your game code below!</p>
//           <input id="gameCodeName" type="text" placeholder="Your name" />
//           <input
//             id="gameCodeNumber"
//             type="number"
//             placeholder="Game code"
//             style={{ marginTop: '1rem' }}
//           />
//           <button id="joingamebutton">Join game</button>
//         </div>

//         <div id="overlay">
//           <h1 id="whose">Riley&apos;s #1 song</h1>
//           <h2 id="what">Get Game</h2>
//           <h4 id="by">RJ Reinhold</h4>
//         </div>

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






