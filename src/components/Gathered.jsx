import React, { useState, useEffect, useCallback } from "react";
import Vimeo from "@u-wave/react-vimeo";
import {
  TikTokEmbed,
  TwitterEmbed,
  InstagramEmbed,
} from "react-social-media-embed";

function Gathered({ allBlocks }) {
  const [lastVisibleIndex, setLastVisibleIndex] = useState(-1);
  const [positionedBlocks, setPositionedBlocks] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const [textBlockOverflow, setTextBlockOverflow] = useState({});
  const [isInitialized, setIsInitialized] = useState(false); // New state for tracking initialization

  const toggleTextBlockOverflow = useCallback((id) => {
    setTextBlockOverflow((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  useEffect(() => {
    // Placeholder for any initialization logic
    // For example, you can wait for allBlocks to be fully fetched or any other asynchronous setup
    // Here, I'm just using a simple timeout to simulate a delay for initialization
    const timer = setTimeout(() => {
      setIsInitialized(true); // Set initialization complete after a delay
    }, 750); // Wait for 1 second (adjust this based on your actual initialization logic)

    return () => clearTimeout(timer); // Cleanup timer
  }, []); // This effect runs only once, similar to componentDidMount

  useEffect(() => {
    if (isInitialized) {
      // Ensure blocks are positioned only after initialization
      const blocksWithPosition = allBlocks.map((block) => ({
        ...block,
        top: `${Math.random() * 80 - 20}%`,
        left: `${Math.random() * 90 - 10}%`,
        width: "200px",
        visible: false,
      }));
      setPositionedBlocks(blocksWithPosition);
      setLoaded(true);
    }
  }, [allBlocks, isInitialized]);

  useEffect(() => {
    if (loaded) {
      const timer = setInterval(() => {
        setLastVisibleIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          if (newIndex < positionedBlocks.length) {
            setPositionedBlocks((prevBlocks) =>
              prevBlocks.map((block, index) => ({
                ...block,
                visible: index <= newIndex,
              }))
            );
            return newIndex;
          } else {
            clearInterval(timer); // Clear interval once all blocks are visible
            return prevIndex;
          }
        });
      }, 350); // Interval set to 250ms between each block reveal

      return () => clearInterval(timer); // Cleanup interval on unmount
    }
  }, [loaded, positionedBlocks.length]);

  const onMouseDown = (e, block) => {
    const elem = e.currentTarget.getBoundingClientRect();
    setOffset({
      x: e.clientX - elem.left,
      y: e.clientY - elem.top,
    });
    setCurrentBlock(block);
    setIsDragging(true);
  };

  const onMouseMove = useCallback(
    (e) => {
      if (isDragging && currentBlock) {
        setPositionedBlocks((prevBlocks) =>
          prevBlocks.map((block) =>
            block.id === currentBlock.id
              ? {
                  ...block,
                  left: `${e.clientX - offset.x}px`,
                  top: `${e.clientY - offset.y}px`,
                }
              : block
          )
        );
      }
    },
    [isDragging, currentBlock, offset]
  );

  const onMouseUp = () => {
    setIsDragging(false);
    setCurrentBlock(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, onMouseMove]);

  return (
    <>
      <div id="hero-text">
        <p
          style={{
            width: "100%",
            lineHeight: "0em",
            fontSize: "32px",
          }}
        >
          src-txt is...
        </p>
        A new way of reading and writing that embraces the multimedia nature of
        information on the internet.
      </div>
      {positionedBlocks.map((block) => (
        <div
          key={block.id}
          className={`headerBlock ${block.visible ? "heroFadeIn" : ""}`}
          style={{
            top: block.top,
            left: block.left,
            width: block.width,
            position: "absolute",
          }}
          onMouseDown={(e) => onMouseDown(e, block)}
        >
          {renderBlock(block)}
        </div>
      ))}
    </>
  );
}

const renderBlock = (block) => {
  switch (block.class) {
    case "Media":
      return renderMediaBlock(block);
    case "Image":
      return (
        <div className="gatheredBlock">
          <img
            src={block.image.original.url}
            alt={block.generated_title}
            className="websiteImage"
          />
        </div>
      );
    case "Link":
      return renderLinkBlock(block);
    case "Text":
      return renderTextBlock(block);
    case "Attachment":
      return renderAttachmentBlock(block);
    default:
      return null;
  }
};

const renderMediaBlock = (block, header) => (
  <div className="gatheredBlock">
    {header}
    {block.source.provider.name === "YouTube" && (
      <iframe
        src={`https://www.youtube.com/embed/${
          block.source.url.split("v=")[1].split("&")[0]
        }?autoplay=1&mute=1`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="block youtubeWidget"
        title={block.generated_title}
      ></iframe>
    )}
    {block.source.provider.name === "Vimeo" && (
      <Vimeo
        video={block.source.url}
        autoplay
        controls
        muted
        className="block vimeoWidget"
        width={250}
      />
    )}
    {block.source.provider.name === "tiktok" && (
      <TikTokEmbed url={block.source.url} width={250} id={block.id} />
    )}
  </div>
);

const renderLinkBlock = (block, header) => (
  <div className="gatheredBlock">
    {block.source.provider.name === "Twitter" && (
      <TwitterEmbed
        style={{ PointerEvent: "none" }}
        url={block.source.url}
        width={250}
      />
    )}
    {block.source.provider.name === "Instagram" && (
      <InstagramEmbed url={block.source.url} width={300} />
    )}
    {block.source.provider.name !== "Instagram" &&
      block.source.provider.name !== "Twitter" && (
        <div className="websiteWidget" id="gatheredWebsite">
          <div className="websiteWidgetHeader" id="gatheredWebsiteTitleText">
            <div className="websiteLinkIcon" id="gatheredLinkIcon">
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
  </div>
);

const renderTextBlock = (block) => (
  <div className="gatheredBlock">
    <div className="textBlock">
      <p className="textBlockContent">
        <i>{block.content}</i>
      </p>
    </div>
  </div>
);

const renderAttachmentBlock = (block, header) => (
  <div className="gatheredBlock">
    {header}
    {block.attachment.content_type === "video/quicktime" && (
      <video
        className="videoBlock"
        src={block.attachment.url}
        autoPlay
        muted
        loop
      ></video>
    )}
    {block.attachment.content_type === "video/mp4" && (
      <video
        className="videoBlock"
        src={block.attachment.url}
        autoPlay
        muted
        loop
      ></video>
    )}
  </div>
);

export default Gathered;
