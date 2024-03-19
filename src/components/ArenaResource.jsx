import React, { useState, useEffect, useCallback } from "react";
import {
  FacebookEmbed,
  InstagramEmbed,
  LinkedInEmbed,
  PinterestEmbed,
  TikTokEmbed,
  TwitterEmbed,
  YouTubeEmbed,
} from "react-social-media-embed";
import Vimeo from "@u-wave/react-vimeo";

function ArenaResource({ allBlocks, column }) {
  const [blocks, setBlocks] = useState([]);
  const [visibleBlocks, setVisibleBlocks] = useState({});

  const filterAndPositionBlocks = (blocks, visibleBlocks) => {
    const presentBlocks = blocks.filter((block) =>
      document.getElementById(block.id)
    );

    const sortedBlocks = presentBlocks
      .map((block) => {
        const span = document.getElementById(block.id);
        console.log(span);
        const yPos = span.getBoundingClientRect().top + window.scrollY;
        return { ...block, yPos };
      })
      .sort((a, b) => a.yPos - b.yPos);

    const positionedBlocks = sortedBlocks.map((block, index) => ({
      ...block,
      column: index % 2 === 0 ? "left" : "right",
      visible: visibleBlocks[block.id] || false,
    }));

    return positionedBlocks;
  };

  useEffect(() => {
    if (allBlocks.length > 0) {
      const positionedBlocks = filterAndPositionBlocks(
        allBlocks,
        visibleBlocks
      );
      setBlocks(positionedBlocks);
    }
  }, [allBlocks, visibleBlocks]);

  const handleScroll = useCallback(() => {
    const newVisibleBlocks = { ...visibleBlocks };
    allBlocks.forEach((block) => {
      const span = document.getElementById(block.id);
      if (span) {
        const yPos = span.getBoundingClientRect().top;
        if (yPos < window.innerHeight) {
          newVisibleBlocks[block.id] = true;
        }
      }
    });
    setVisibleBlocks(newVisibleBlocks);
  }, [allBlocks, visibleBlocks]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const filteredBlocks = blocks.filter((block) => block.column === column);

  return (
    <>
      {filteredBlocks.map((block) => (
        <div
          key={block.id}
          className="side-block-container"
          id={"num" + block.id}
          style={{
            position: "absolute",
            top: block.yPos,
            opacity: block.visible ? 1 : 0,
            transition: "opacity 500ms ease-in-out",
            transform: "translateY(-50%)",
          }}
        >
          {block.class === "Media" && (
            <>
              {block.source.provider.name === "YouTube" ? (
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
              ) : block.source.provider.name === "tiktok" ? (
                <TikTokEmbed url={block.source.url} width={250} />
              ) : block.source.provider.name === "Vimeo" ? (
                <Vimeo video={block.source.url} autoplay muted width={250} />
              ) : (
                <iframe src={block.source.url} controls autoPlay muted></iframe>
              )}
            </>
          )}
          {block.class === "Image" && (
            <img src={block.image.original.url} alt={block.title}></img>
          )}
          {block.class === "Link" && (
            <>
              {block.source.provider.name === "Twitter" ? (
                <TwitterEmbed url={block.source.url} width={250} />
              ) : block.source.provider.name === "Instagram" ? (
                <InstagramEmbed url={block.source.url} width={250} />
              ) : (
                <div className="websiteWidget">
                  <div className="websiteWidgetHeader">
                    <div className="websiteLinkIcon">
                      <img
                        src="https://image-gosting.s3.amazonaws.com/misc/hyperlink.svg"
                        alt="Link Icon"
                      ></img>
                    </div>
                    <div>{block.generated_title}</div>
                  </div>
                  <img
                    className="websiteThumbnail"
                    src={block.image.original.url}
                    alt={block.title}
                    title={block.title}
                  ></img>
                </div>
              )}
            </>
          )}
          {block.class === "Attachment" && (
            <>
              {block.attachment.content_type === "video/mp4" ? (
                <video
                  className="videoResource"
                  src={block.attachment.url}
                  autoPlay
                  muted
                  loop
                ></video>
              ) : (
                <video
                  className="videoResource"
                  src={block.attachment.url}
                  autoPlay
                  muted
                  loop
                ></video>
              )}
            </>
          )}
        </div>
      ))}
    </>
  );
}

export default ArenaResource;
