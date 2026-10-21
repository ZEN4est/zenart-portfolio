"use client";
import React from "react";
import { getAssetUrl } from "@/utils/paths";

interface ProjectVideoPlayerProps {
  url: string;
}

export default function ProjectVideoPlayer({ url }: ProjectVideoPlayerProps) {
  if (!url) return null;

  // Sprawdzanie czy URL to YouTube (w tym formaty watch?v=, youtu.be, embed, shorts)
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return (
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0`}
          title="YouTube video player"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // Sprawdzanie czy URL to Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return (
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
          title="Vimeo video player"
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Standardowy plik MP4 / WebM / wideo z dysku lub CDN
  const videoSrc = getAssetUrl(url);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10 flex justify-center">
      <video
        controls
        playsInline
        preload="metadata"
        className="w-full max-h-[75vh] object-contain rounded-3xl"
      >
        <source src={videoSrc} type="video/mp4" />
        Twoja przeglądarka nie obsługuje odtwarzania wideo.
      </video>
    </div>
  );
}

