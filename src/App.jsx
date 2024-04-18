import React, { useState } from "react";

import "./styles/App.css";
import "./styles/ArenaResource.css";
import "./styles/Citations.css";
import "./styles/Gathered.css";
import "./styles/Overlay.css";
import "./styles/ToolFeatures.css";
import "./styles/FeedbackForm.css";

import ArenaData from "./components/ArenaData";
import ArenaResource from "./components/ArenaResource";
import Article from "./components/Article";
import Citations from "./components/Citations";
import Gathered from "./components/Gathered";
import Overlay from "./components/Overlay";
import ZoomPanComponent from "./components/ZoomPan";
import ToolFeatures from "./components/ToolFeatures";
import FeedbackForm from "./components/FeedbackForm";

function App() {
  return (
    <>
      <section>
        <ArenaData>
          <Overlay />
        </ArenaData>

        <section id="hero-page">
          <ArenaData>
            <Gathered />
          </ArenaData>
        </section>
        <section id="small-intro">
          <p>
            Src-txt is a tool that allows writers to gather resources of any
            media type, link these references to a piece of writing, and publish
            a new kind of interactive web article... also called a src-txt.
          </p>
          <p>
            {" "}
            In a src-txt, citations live within the article itself, allowing you
            to engage with the text and it's external references simultaneously.
          </p>
          <p>
            The tool is comprised of three modes; <i>Gather,</i> <i>Draft</i>{" "}
            and <i>Publish.</i>
          </p>
        </section>

        <section id="how-it-works">
          <ToolFeatures />
        </section>
        <section id="try-it">
          <h2> Try it for Yourself</h2>
          <div id="examples-container">
            <div className="src-txt-link">
              <video
                className="src-txt-link-cover"
                src="https://image-gosting.s3.amazonaws.com/misc/poetry-of-tools-header.mp4"
                autoPlay
                muted
                loop
              ></video>
              <div className="src-txt-title">Title 1</div>
            </div>
            <div className="src-txt-link">
              <video
                className="src-txt-link-cover"
                src="https://image-gosting.s3.amazonaws.com/misc/poetry-of-tools-header.mp4"
                autoPlay
                muted
                loop
              ></video>
              <div className="src-txt-title">
                The Poetry of Tools, <i>Mindy Seu</i>
              </div>
            </div>
            <div className="src-txt-link">
              <video
                className="src-txt-link-cover"
                src="https://image-gosting.s3.amazonaws.com/misc/poetry-of-tools-header.mp4"
                autoPlay
                muted
                loop
              ></video>
              <div className="src-txt-title">Title 1</div>
            </div>
            {/* <div className="src-txt-link">
              <video
                className="src-txt-link-cover"
                src="https://image-gosting.s3.amazonaws.com/misc/poetry-of-tools-header.mp4"
                autoPlay
                muted
                loop
              ></video>
              <div className="src-txt-title">Title 1</div>
            </div>
            <div className="src-txt-link">
              <video
                className="src-txt-link-cover"
                src="https://image-gosting.s3.amazonaws.com/misc/poetry-of-tools-header.mp4"
                autoPlay
                muted
                loop
              ></video>
              <div className="src-txt-title">Title 1</div>
            </div> */}
          </div>
        </section>
        <section id="essay">
          <div className="final-article">
            <div className="left-column">
              <ArenaData>
                <ArenaResource column="left" />
              </ArenaData>
            </div>
            <div className="middle-column">
              <Article />
            </div>
            <div className="right-column">
              <ArenaData>
                <ArenaResource column="right" />
              </ArenaData>
            </div>
          </div>
        </section>

        <section id="feedback">
          <FeedbackForm />
        </section>
      </section>
      ;
    </>
  );
}

export default App;
