"use client";

import { animated, useTransition } from "@react-spring/web";
import { useEffect, useRef, useState, type FormEventHandler } from "react";
import { LuLoader2, LuSearch } from "react-icons/lu";
import { api } from "~/trpc/react";
import SongView from "./_components/song-view";

const DEFAULT_SONG_URL =
  "https://open.spotify.com/intl-tr/track/4PTG3Z6ehGkBFwjybzWkR8";

export default function Home() {
  const [initialized, setInitialized] = useState(false);
  const [songUrl, setSongUrl] = useState<string>();
  const {
    data: song,
    isLoading,
    isError,
  } = api.spotify.getSongData.useQuery(
    { url: songUrl ?? "" },
    { refetchOnWindowFocus: false, retry: false },
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const loadingTransitions = useTransition(isLoading || isError, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 300 },
    initial: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && !initialized) {
      const initialUrl = localStorage.getItem("last-url") ?? DEFAULT_SONG_URL;
      setSongUrl(initialUrl);
      inputRef.current!.value = initialUrl;
      setInitialized(true);
    }
  }, [initialized, songUrl]);

  const onSubmitUrl: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const url = inputRef.current?.value;
    if (!url) return;
    setSongUrl(url);
    localStorage.setItem("last-url", url);
  };

  return (
    <main onSubmit={onSubmitUrl} className="flex flex-col items-center">
      <div className="container flex flex-col items-center px-8 pt-2 lg:pt-32">
        <form className="relative w-3/4 text-center max-lg:w-full">
          <input
            type="text"
            placeholder="Enter the song's URL..."
            className="w-full rounded-full bg-black/20 px-4 py-4 pr-10 font-mono text-sm font-extralight text-green-300 outline-none transition placeholder:text-green-300 focus:bg-black/50 focus:ring-2 focus:ring-green-700"
            ref={inputRef}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 px-3 text-green-300 transition hover:text-green-500"
          >
            <LuSearch size={20} />
          </button>
        </form>

        <div className="relative w-full">
          {loadingTransitions((style, isLoadingOrError) =>
            isLoadingOrError
              ? songUrl && (
                  <animated.div
                    style={style}
                    className="absolute inset-x-0 flex h-[400px] flex-col items-center justify-center text-green-300"
                  >
                    {!isError ? (
                      <div className="animate-spin">
                        <LuLoader2 size={50} />
                      </div>
                    ) : (
                      "Error! Most likely an invalid URL."
                    )}
                  </animated.div>
                )
              : song && (
                  <animated.div style={style} className="absolute inset-x-0">
                    <SongView song={song} />
                  </animated.div>
                ),
          )}
        </div>
      </div>
    </main>
  );
}
