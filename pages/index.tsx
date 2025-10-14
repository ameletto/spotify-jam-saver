import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import {signOut} from "next-auth/react";
import React from 'react';

export default function Index(props:{
    session:{
      user: {
        email:string,
        name:string,
        image: string,
      }
    }
}) {

  return (
    <>
        <p>name: {props.session.user.name}</p>
        <p>email: {props.session.user.email}</p>
        <img src={props.session.user.image} alt="Profile picture" />
        <button onClick={() => signOut()}>Sign out</button>
  </>
  )
}

export async function getServerSideProps(context:GetServerSidePropsContext) {
  const session = await getSession(context);
  
  if (!session) return {redirect: {permanent: false, destination: "/signin" }};

  return {props: {session: session}}
}






