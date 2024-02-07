/* eslint-disable @next/next/no-img-element */

import { animated, useTransition } from "@react-spring/web";
import Link from "next/link";
import React, { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa6";
import { type RouterOutputs } from "~/trpc/shared";

export default function SongView({
  song,
}: {
  song: RouterOutputs["spotify"]["getSongData"];
}) {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const transitions = useTransition(copiedTitle, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    exitBeforeEnter: true,
    config: {
      duration: 100,
    },
  });

  if (!song) return null;

  return (
    <div className="grid place-items-center gap-2 pt-5">
      <h2 className="text-lg text-green-200">
        {song.musicians.map((musician, musicianIndex) => (
          <React.Fragment key={musician}>
            <Link
              href={song.musicianUrls[musicianIndex]!}
              target="_blank"
              title={`Go to ${musician}'s page`}
            >
              {musician}
            </Link>
            {musicianIndex + 1 !== song.musicians.length && ", "}
          </React.Fragment>
        ))}
      </h2>
      <h1 className="max-w-[75%] text-center text-xl font-bold">
        <button
          className="relative flex items-center gap-2 text-green-400 opacity-75 transition hover:opacity-100"
          onClick={() =>
            navigator.clipboard
              .writeText(`${song.musicians.join(", ")} - ${song.title}`)
              .then(() => setCopiedTitle(true))
          }
          title='Copy "Artist(s) - Title" to clipboard'
        >
          {song.title}
          {transitions((style, item) =>
            item ? (
              <animated.div style={style}>
                <FaCheck />
              </animated.div>
            ) : (
              <animated.div style={style}>
                <FaCopy />
              </animated.div>
            ),
          )}
        </button>
      </h1>

      <div className="aspect-square w-[20vw] max-w-[320px] overflow-hidden rounded-3xl ring-1 ring-green-600 transition hover:ring-4">
        <Link href={song.album} target="_blank" title="Go to album page">
          <img src={song.coverImage} alt="Cover" width="100%" />
        </Link>
      </div>

      <h3 className="text-xs font-light text-green-400" title="Release date">
        {new Date(song.releaseDate).toLocaleDateString("en-US")}
      </h3>

      <iframe
        className="box-content h-40 w-1/2 min-w-[300px] rounded-lg pt-10"
        src={song.embedUrl}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
}
