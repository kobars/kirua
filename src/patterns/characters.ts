/**
 * Character artwork used by the hero pattern.
 *
 * LICENSING — read before shipping anything built on this.
 * Killua Zoldyck is a character from *Hunter x Hunter*, created by Yoshihiro
 * Togashi and published by Shueisha. These renders are fan-distributed cut-outs
 * downloaded from NicePNG. They are used here for a personal, non-commercial
 * portfolio piece only.
 *
 * They are NOT licensed for a commercial product, a client deliverable, or
 * anything sold. If this system is taken further than a portfolio POC, replace
 * every entry below with commissioned or licensed artwork. Nothing else has to
 * change — the layout only needs a tall figure on a transparent background.
 *
 * Both files were post-processed before being committed: the source
 * watermarks were cleared and the transparent border trimmed so each image's
 * alpha bounding box hugs the character. That matters for the layout — the
 * SpotlightPanel anchors artwork to its bottom edge, so stray transparent
 * padding would push the figure out of position.
 */
export interface CharacterAsset {
  src: string;
  source: string;
  /** Intrinsic size, so the browser can reserve space and avoid layout shift. */
  width: number;
  height: number;
}

export const CHARACTERS = {
  yoyo: {
    src: '/characters/killua-1.png',
    source: 'NicePNG — Killua render (Hunter x Hunter)',
    width: 988,
    height: 1263,
  },
  splatter: {
    src: '/characters/killua-2.png',
    source: 'NicePNG — Killua Zoldyck render',
    width: 970,
    height: 1323,
  },
} satisfies Record<string, CharacterAsset>;
