import { GetServerSidePropsContext } from "next";
import { getSession, signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <>
      <div style={{ maxWidth: '400px' }} id="loginwithspotify">
          <h1>Spotify Jam Saver</h1>
          <p>A webapp that allows you to view and save songs played during a Spotify jam.</p>
          <p>Log in with Spotify by clicking the button below.</p>
          <button className="login" id="spotifylogin" onClick={() => signIn("spotify")}>Log in with Spotify</button>
      </div>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) return { props: {} };

  return { redirect: { permanent: false, destination: "/" } }
}