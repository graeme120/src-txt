import React, { useState, useEffect } from "react";

function ToolFeatures() {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const handleScroll = () => {
    const triggerHeight = window.innerHeight * 0.75;
    const textSections = document.querySelectorAll(".text-section");

    textSections.forEach((section, index) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < triggerHeight) {
        setActiveMediaIndex(index);
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="split-screen-container">
      <div className="media-container">
        <video
          className={`media-section ${activeMediaIndex === 0 ? "visible" : ""}`}
          autoPlay
          loop
          muted
        >
          <source
            src="https://image-gosting.s3.amazonaws.com/thesis2024/mockup-presenting.mp4"
            type="video/mp4"
          />
        </video>
        <video
          className={`media-section ${activeMediaIndex === 1 ? "visible" : ""}`}
          autoPlay
          loop
          muted
        >
          <source
            src="https://image-gosting.s3.amazonaws.com/thesis2024/thesis-mockup-linking.mp4"
            type="video/mp4"
          />
        </video>
        <video
          className={`media-section ${activeMediaIndex === 2 ? "visible" : ""}`}
          autoPlay
          loop
          muted
        >
          <source
            src="https://image-gosting.s3.amazonaws.com/thesis2024/mockup-presenting.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div className="text-container">
        <div className="text-section">
          <h3 className="tool-feature-header">Gather Sources of any Kind</h3>
          In <i>Gather,</i> resources of all kinds (links, text, images, videos,
          files, etc.) can be aggregated and annotated in a bulletin-board-like
          environment. Gather uses Are.na as a CMS, given that this tool makes
          gathering a broad range of media types simple and accessible.
        </div>
        <div className="text-section">
          <h3 className="tool-feature-header">
            Connect Sources to a Primary Text
          </h3>
          In <i>Draft,</i> compositions can be written and edited, and resources
          from the Gather environment can be dynamically linked to pieces of
          text.
        </div>
        <div className="text-section">
          <h3 className="tool-feature-header">Enhance Writing as a Src-txt</h3>
          Finally, in Present, an interactive article is dynamically generated,
          which acts as a preview of a public webpage that can be shared online.
          The interactive article brings these citations into the same space as
          the article, while preserving their unique context of each information
          source. As you read, citations appear in the margins, and can be
          explored by simply hovering over their related text string.
        </div>
      </div>
    </div>
  );
}

export default ToolFeatures;
n;
