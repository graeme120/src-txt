import React, { useState, useEffect, useCallback } from "react";
import {
  FacebookEmbed,
  InstagramEmbed,
  LinkedInEmbed,
  PinterestEmbed,
  TikTokEmbed,
  YouTubeEmbed,
} from "react-social-media-embed";
import Vimeo from "@u-wave/react-vimeo";

function Citations({ allBlocks }) {
  const [selectedText, setSelectedText] = useState("");
  const [selectedRange, setSelectedRange] = useState(null);
  // Effect to add and remove event listeners
  useEffect(() => {
    const draftElement = document.querySelector(".draft");
    const citationsElement = document.querySelector(".citations");
    const handleMouseUp = () => {
      const selection = window.getSelection();

      if (selection && selection.toString().length > 0) {
        // Move the 'draft' element to the right by 250px
        setSelectedText(selection.toString());
        setSelectedRange(selection.getRangeAt(0));
        if (draftElement) {
          draftElement.classList.remove("draftMoveLeft");
          draftElement.classList.add("draftMoveRight");
          console.log("it worked!");
        }

        // Move the 'citations' element to the right by 50%
        if (citationsElement) {
          citationsElement.classList.remove("citationsMoveLeft");
          citationsElement.classList.add("citationsMoveRight");
        }
      } else {
        setSelectedText("");
        setSelectedRange(null);

        // Reset the position of 'draft' and 'citations' elements
        if (draftElement) {
          draftElement.classList.add("draftMoveLeft");
          draftElement.classList.remove("draftMoveRight");
        }
        if (citationsElement) {
          citationsElement.classList.add("citationsMoveLeft");
          citationsElement.classList.remove("citationsMoveRight");
        }
      }
    };

    // Add event listener for mouseup
    document.addEventListener("mouseup", handleMouseUp);
    // Cleanup
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const handleCitationClick = (blockId) => {
    if (selectedText && selectedRange) {
      const span = document.createElement("span");
      span.className = "linked-citation";
      span.classList.add("linkedCitationAnimation");
      span.id = `${blockId}`;
      span.textContent = selectedText;

      const range = selectedRange.cloneRange();
      range.deleteContents();
      range.insertNode(span);

      setSelectedText("");
      setSelectedRange(null);

      const blockInQuestion = document.getElementById(blockId);
      blockInQuestion.classList.add("citation-that-has-been-linked");
    }
  };

  return (
    <div className="citations">
      <input
        type="text"
        name="search"
        placeholder="Search references"
        className="citations-search-bar"
        autofocus
      ></input>
      {allBlocks.map((block) => (
        <div
          key={block.id}
          className="citation-block"
          id={block.id}
          onClick={() => handleCitationClick(block.id)}
          style={{
            width: "100%",
          }}
        >
          {block.class === "Media" && (
            <>
              {block.source.provider.name === "YouTube" ? (
                <div className="citationWidget">
                  <div className="websiteCitationHeader">
                    <div className="websiteLinkIcon">
                      <img
                        src="https://image-gosting.s3.amazonaws.com/misc/hyperlink.svg"
                        alt="Link Icon"
                      ></img>
                    </div>
                    <div>{block.generated_title}</div>
                  </div>
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      block.source.url.split("v=")[1].split("&")[0]
                    }?autoplay=1&mute=1`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="block youtubeWidget"
                    autoPlay
                    muted
                  ></iframe>
                </div>
              ) : block.source.provider.name === "tiktok" ? (
                <TikTokEmbed url={block.source.url} width="100%" height={550} />
              ) : block.source.provider.name === "Vimeo" ? (
                <div className="citationWidget">
                  <div className="websiteCitationHeader">
                    <div className="websiteLinkIcon">
                      <img
                        src="https://image-gosting.s3.amazonaws.com/misc/hyperlink.svg"
                        alt="Link Icon"
                      ></img>
                    </div>
                    <div>{block.generated_title}</div>
                  </div>
                  <Vimeo video={block.source.url} autoplay muted width={450} />
                </div>
              ) : (
                <iframe src={block.source.url} controls autoPlay muted></iframe>
              )}
            </>
          )}
          {block.class === "Image" && (
            <div className="citationWidget">
              <div className="websiteCitationHeader">
                <div className="websiteLinkIcon">
                  <img
                    src="https://image-gosting.s3.amazonaws.com/misc/hyperlink.svg"
                    alt="Link Icon"
                  ></img>
                </div>
                <div>{block.generated_title}</div>
              </div>
              <img
                src={block.image.original.url}
                alt={block.title}
                style={{ width: 100 + "%" }}
              ></img>
            </div>
          )}
          {block.class === "Link" && (
            <>
              {
                // block.source.provider.name === "Twitter" ? (
                //   <TwitterEmbed url={block.source.url} width="100%" />
                // )
                // :
                block.source.provider.name === "Instagram" ? (
                  <div className="citationWidget">
                    <div className="websiteCitationHeader">
                      <div className="websiteLinkIcon">
                        <img
                          src="https://image-gosting.s3.amazonaws.com/misc/hyperlink.svg"
                          alt="Link Icon"
                        ></img>
                      </div>
                      <div>{block.generated_title}</div>
                    </div>
                    <InstagramEmbed url={block.source.url} width="100%" />
                  </div>
                ) : (
                  <div className="citationWidget">
                    <div className="websiteCitationHeader">
                      <div className="websiteLinkIcon">
                        <img
                          src="https://image-gosting.s3.amazonaws.com/misc/hyperlink.svg"
                          alt="Link Icon"
                        ></img>
                      </div>
                      <div>{block.generated_title}</div>
                    </div>
                    <img
                      className="citationThumbnail"
                      src={block.image.original.url}
                      alt={block.title}
                      title={block.title}
                    ></img>
                  </div>
                )
              }
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Citations;
