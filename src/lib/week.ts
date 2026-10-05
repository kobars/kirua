interface WeekInfo {
  firstDay: number;
}

/**
 * Both accessors are newer than the ES2023 lib this project compiles against.
 * `weekInfo` is the getter engines shipped first, and some browsers in the
 * support matrix have only that one.
 */
type LocaleWithWeekInfo = Intl.Locale & {
  getWeekInfo?: () => WeekInfo;
  weekInfo?: WeekInfo;
};

/**
 * The regions whose week starts on Sunday in CLDR, for an engine with neither
 * accessor. Everywhere else falls back to Monday, which leaves only the
 * handful of Saturday-first regions wrong, and only on those engines.
 */
const SUNDAY_FIRST = new Set(
  (
    'AG AS BD BR BS BT BW BZ CA CO DM DO ET GT GU HK HN ID IL IN IS JM JP KE KH KR LA ' +
    'MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW'
  ).split(' '),
);

/**
 * The first day of the week for a BCP 47 tag, as `Date.getDay` numbers it:
 * 0 for Sunday through 6 for Saturday. `Intl` numbers Monday 1 through Sunday
 * 7, so the modulo converts between them.
 *
 * The server and the browser must agree, or every cell of a server-rendered
 * month moves on hydration, so the fallback is a region table rather than one
 * day for every locale.
 */
export function firstWeekday(tag: string): number {
  try {
    const locale = new Intl.Locale(tag) as LocaleWithWeekInfo;
    const info = locale.getWeekInfo?.() ?? locale.weekInfo;
    if (info !== undefined) return info.firstDay % 7;
    const region = locale.maximize().region;
    return region !== undefined && SUNDAY_FIRST.has(region) ? 0 : 1;
  } catch {
    return 1;
  }
}
