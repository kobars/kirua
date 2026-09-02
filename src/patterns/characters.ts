/**
 * Character artwork used by the hero pattern.
 *
 * LICENSING — read before shipping anything built on this.
 * These are fan-distributed renders of Killua Zoldyck, a character from
 * *Hunter x Hunter* created by Yoshihiro Togashi and published by Shueisha.
 * They are included only to demonstrate the hero pattern.
 *
 * They are NOT licensed for commercial use of any kind. Replace every entry
 * below with commissioned or licensed artwork before shipping. Nothing else
 * has to change — the layout only needs a tall figure on a transparent
 * background.
 *
 * Both files are post-processed: source watermarks cleared and the transparent
 * border trimmed, so each image's
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
