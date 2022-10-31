import React from "react";
import styles from "./TypeWriter.module.css";
import Typewriter from "typewriter-effect";

export function WriteName({ steps }) {
  console.log(steps);
  return (
    <div className={styles.container}>
      <span id="txt-type">
        {steps.stepOne ? "How shall I cal you?" : ""}
        {!steps.stepOne && (
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString("How shall I cal y")
                .pauseFor(200)
                .deleteChars(2)
                .typeString("l you?")
                .start();
            }}
            options={{
              delay: 100,
            }}
          />
        )}
      </span>
    </div>
  );
}
export function WriteEmail({ steps }) {
  if (steps.stepTwo) {
    return <>What is your email?</>;
  } else {
    return (
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString("What is your email")
            .pauseFor(500)
            .typeString("?")
            .start();
        }}
        options={{
          delay: 100,
        }}
      />
    );
  }
}
export function WritePassword({ steps }) {
  if (steps.stepThree) {
    return <>Create a password</>;
  } else {
    return (
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString("Create  a pass")
            .deleteChars(6)
            .pauseFor(200)
            .typeString(" a password")
            .start();
        }}
        options={{
          delay: 100,
        }}
      />
    );
  }
}

export function WhatIsBeatific({ steps }) {
  console.log(steps);
  return (
    <Typewriter
      onInit={(typewriter) => {
        typewriter
          .typeString("What is Beatific")
          .pauseFor(600)
          .typeString("...")
          .start();
      }}
      options={{
        delay: 100,
      }}
    />
  );
}
