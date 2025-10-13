import { useEffect } from 'react';
import axios from 'axios';

export default function Index() {
  useEffect(() => {
    axios.get("https://api.spotify.com/", {
      params: {
        appid: "cbe2849b7ac1d55771a363b935e306a3",
      }
    }).then(res => {
      console.log(res.data);
    }).catch(e => {
      console.log(e);
    });
  }, []);

  return (
    <>
      <body style={{ maxWidth: '400px' }}>
        <div id="loginwithspotify">
          <h1>Spotify Jam Saver</h1>
          <p>
            Instructions
          </p>
          <p>
            Log in with Spotify by clicking the button below.
          </p>
          <a href="https://accounts.spotify.com/authorize?response_type=token&client_id=3f9128cd0932495a9980c37bde2023fc&scope=user-top-read&redirect_uri=https://roulette.walzr.com/play">
            <button className="login" id="spotifylogin">
              Log in with Spotify
            </button>
          </a>
        </div>
      </body>
    </>
  );
}
