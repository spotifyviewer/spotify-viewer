import { load } from "cheerio";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const spotifyRouter = createTRPCRouter({
  getSongData: publicProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input: { url } }) => {
      if (!url) return null;
      const songPage = await (await fetch(url)).text();
      const $ = load(songPage);
      const head = $("head");
      const songUrl = head.find("meta[property='og:url']").attr()!.content!;
      const embedUrl = songUrl.replace("/track", "/embed/track");
      return {
        // meta: head
        //   .find("meta")
        //   .toArray()
        //   .map((e) => e.attribs),
        title: head.find("meta[property='og:title']").attr()!.content!,
        description: head.find("meta[property='og:description']").attr()!
          .content!,
        releaseDate: head.find("meta[name='music:release_date']").attr()!
          .content!,
        album: head.find("meta[name='music:album']").attr()!.content!,
        trackNo: head.find("meta[name='music:album:track']").attr()!.content!,
        duration: head.find("meta[name='music:duration']").attr()!.content!,
        musicians: head
          .find("meta[name='music:musician_description']")
          .attr()!
          .content!.split(", "),
        musicianUrls: head
          .find("meta[name='music:musician']")
          .map((i, e) => e.attribs.content!)
          .toArray(),
        url: songUrl,
        embedUrl,
        audioPreview: head.find("meta[property='og:audio']").attr()!.content!,
        audioType: head.find("meta[property='og:audio:type']").attr()!.content!,
        coverImage: head.find("meta[property='og:image']").attr()!.content!,
      };
    }),
});
