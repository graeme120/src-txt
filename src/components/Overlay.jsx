import React, { useEffect, useState } from "react";
import {
  FacebookEmbed,
  InstagramEmbed,
  LinkedInEmbed,
  PinterestEmbed,
  TikTokEmbed,
  EmbedToggler,
  YouTubeEmbed,
  PlaceholderEmbed,
} from "react-social-media-embed";
import Vimeo from "@u-wave/react-vimeo";

function Overlay() {
  const [blocks, setBlocks] = useState([]);
  const [overlayVisibility, setOverlayVisibility] = useState({});
  const [loading, setLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState({}); // New state for tracking content load

  // Constants for API
  const CHANNEL_ID = "src-txt-hero-page";
  const API_KEY = "lYrYVPXLwfC0k1WdWOXbqLrl8KlXw4ZEEBFkG5P1lH8";
  const ARENA_API_CHANNEL_URL = `https://api.are.na/v2/channels/${CHANNEL_ID}`;
  const ARENA_API_CONTENT_URL = `https://api.are.na/v2/channels/${CHANNEL_ID}/contents?&per=100&sort=position&direction=asc&page=`;

  // Function to fetch channel data
  async function fetchChannelData() {
    try {
      const response = await fetch(ARENA_API_CHANNEL_URL, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch channel data: ${response.statusText}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching channel data: ${error}`);
      return null;
    }
  }

  // Function to fetch page data
  async function fetchPage(page) {
    try {
      const response = await fetch(`${ARENA_API_CONTENT_URL}${page}`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      if (!response.ok) {
        console.error(`Failed to fetch page ${page}: ${response.statusText}`);
        return null;
      }
      const pageData = await response.json();

      // Load content for each block
      if (pageData && Array.isArray(pageData.contents)) {
        await Promise.all(
          pageData.contents.map(async (block) => {
            // Logic to load content for each block (e.g., fetch images, media)
            // ...

            // Mark block content as loaded
            setContentLoaded((prevState) => ({
              ...prevState,
              [block.id]: true,
            }));
          })
        );
      }
      return pageData;
    } catch (error) {
      console.error(`Error fetching page ${page}: ${error}`);
      return null;
    }
  }

  // Function to fetch all blocks
  async function fetchAllBlocks() {
    setLoading(true);
    const channelData = await fetchChannelData();

    if (!channelData || !Array.isArray(channelData.contents)) {
      console.error(
        "Failed to fetch the channel data or data format is incorrect"
      );
      setLoading(false);
      return;
    }

    const totalPages = Math.ceil(channelData.contents.length / 100);
    let allBlocks = [];

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const pageData = await fetchPage(currentPage);
      if (pageData && Array.isArray(pageData.contents)) {
        allBlocks = allBlocks.concat(pageData.contents);
      } else {
        console.error(`Failed to fetch page ${currentPage}`);
      }
    }

    setBlocks(allBlocks);
    setLoading(false);
  }

  // useEffect to fetch blocks
  useEffect(() => {
    fetchAllBlocks();
  }, []);

  // Function to show overlay
  const showOverlay = (blockId) => {
    setOverlayVisibility({ ...overlayVisibility, [blockId]: true });
  };

  // Function to hide overlay
  const hideOverlay = (blockId) => {
    setOverlayVisibility({ ...overlayVisibility, [blockId]: false });
  };

  // useEffect to add event listeners to blocks and spans
  useEffect(() => {
    // Define a map to hold timers for each block
    const timers = {};

    const handleMouseEnter = (blockId) => () => {
      // Set a timer to show the overlay after 200ms
      timers[blockId] = setTimeout(() => showOverlay(blockId), 450);
    };

    const handleMouseLeave = (blockId) => () => {
      // If the mouse leaves before 200ms, clear the timer and don't show the overlay
      if (timers[blockId]) {
        clearTimeout(timers[blockId]);
      }
    };

    blocks.forEach((block) => {
      const spanElement = document.querySelector(
        ".resource-link#" + CSS.escape(block.id)
      );

      if (spanElement) {
        spanElement.addEventListener("mouseenter", handleMouseEnter(block.id));
        // Add a mouseleave event listener to clear the timer
        spanElement.addEventListener("mouseleave", handleMouseLeave(block.id));
      }
    });

    // Cleanup event listeners and timers
    return () => {
      blocks.forEach((block) => {
        const spanElement = document.querySelector(
          ".resource-link#" + CSS.escape(block.id)
        );
        if (spanElement) {
          spanElement.removeEventListener(
            "mouseenter",
            handleMouseEnter(block.id)
          );
          spanElement.removeEventListener(
            "mouseleave",
            handleMouseLeave(block.id)
          );
        }
        // Clear any remaining timers to prevent memory leaks
        if (timers[block.id]) {
          clearTimeout(timers[block.id]);
        }
      });
    };
  }, [blocks, overlayVisibility]);

  //set z index to -1 then change
  //have opacity be 0 to 1
  //no conditional loading , just load at the beginning

  //lazy loading (?)

  return (
    <>
      {blocks.map((block) => (
        <div
          key={block.id}
          style={{
            position: "absolute",
            zIndex:
              overlayVisibility[block.id] && contentLoaded[block.id] ? 1 : -1,
            opacity:
              overlayVisibility[block.id] && contentLoaded[block.id] ? 1 : 0,
            display:
              overlayVisibility[block.id] && contentLoaded[block.id]
                ? "block"
                : "none",
            transition: "opacity 300ms ease-in-out",
          }}
        >
          {/* Render your block content here, e.g., Media, Image, Link, etc. */}

          {/* Overlay */}
          <div
            className="overlay"
            style={{
              visibility: "visible",
              opacity: 1,
            }}
            onClick={() => hideOverlay(block.id)}
          >
            <div className="boundary">
              <div
                className="block-container"
                onMouseLeave={() => hideOverlay(block.id)}
                style={{
                  display: "flex",
                  opacity: 1,
                }}
              >
                {block.class === "Media" && (
                  <>
                    {block.source.provider.name === "YouTube" ? (
                      <YouTubeEmbed
                        url={block.source.url}
                        width="100%"
                        height={500}
                      />
                    ) : block.source.provider.name === "tiktok" ? (
                      <TikTokEmbed url={block.source.url} width={325} />
                    ) : block.source.provider.name === "Vimeo" ? (
                      <Vimeo
                        video={block.source.url}
                        autoplay
                        controls
                        muted
                        width={1200}
                        height={600}
                      />
                    ) : (
                      <iframe
                        src={block.source.url}
                        className="block"
                        controls
                        autoPlay
                        muted
                      ></iframe>
                    )}
                  </>
                )}
                {block.class === "Image" && (
                  <img
                    src={block.image.original.url}
                    className="block"
                    alt=""
                  ></img>
                )}
                {block.class === "Attachment" && (
                  <>
                    {block.attachment.content_type === "video/mp4" ? (
                      <video
                        className="videoBlock"
                        src={block.attachment.url}
                        loop
                        controls
                      ></video>
                    ) : (
                      <video
                        className="videoBlock"
                        src={block.attachment.url}
                        autoPlay
                        loop
                        controls
                      ></video>
                    )}
                  </>
                )}
                {block.class === "Link" && (
                  <>
                    {block.source.provider.name === "Twitter" ? (
                      <TwitterEmbed
                        url={block.source.url}
                        className="block"
                        width="100%"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          borderRadius: "20px",
                        }}
                      />
                    ) : block.source.provider.name === "Instagram" ? (
                      <InstagramEmbed
                        url={block.source.url}
                        className="block"
                        width="100%"
                      />
                    ) : (
                      <div className="block overlay-websiteWidget">
                        <a
                          href={block.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="overlay-websiteWidgetHeader">
                            <div className="overlay-websiteLinkIcon">
                              <img src="https://image-gosting.s3.amazonaws.com/misc/hyperlink.svg"></img>
                            </div>
                            <div>{block.generated_title}</div>
                          </div>
                          <iframe
                            className="overlay-websiteThumbnail"
                            src={block.source.url}
                            alt=""
                            title={block.title}
                          ></iframe>
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Overlay;
