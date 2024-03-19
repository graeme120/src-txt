import React, { useEffect, useState } from "react";

function ArenaData({ children }) {
  const [allBlocks, setAllBlocks] = useState([]);
  const CHANNEL_ID = "src-txt-hero-page";
  const API_KEY = "lYrYVPXLwfC0k1WdWOXbqLrl8KlXw4ZEEBFkG5P1lH8";
  const ARENA_API_CHANNEL_URL = `https://api.are.na/v2/channels/${CHANNEL_ID}`;
  const ARENA_API_CONTENT_URL = `https://api.are.na/v2/channels/${CHANNEL_ID}/contents?&per=100&sort=position&direction=asc&page=`;

  async function fetchChannelData() {
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
  }

  async function fetchPage(page) {
    const response = await fetch(`${ARENA_API_CONTENT_URL}${page}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch page ${page}: ${response.statusText}`);
      return null;
    }
    return await response.json();
  }

  async function fetchAllBlocks() {
    const channelData = await fetchChannelData();

    if (!channelData || !Array.isArray(channelData.contents)) {
      console.error(
        "Failed to fetch the channel data or data format is incorrect"
      );
      return [];
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
    console.log(allBlocks);
    return allBlocks;
  }

  useEffect(() => {
    const fetchData = async () => {
      const fetchedBlocks = await fetchAllBlocks();
      setAllBlocks(fetchedBlocks);
    };

    fetchData();
  }, []);

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { allBlocks })
  );
}

export default ArenaData;
