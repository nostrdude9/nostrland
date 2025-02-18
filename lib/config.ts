export const CONFIG = {
  relays: [
    "wss://relay.damus.io",
    "wss://relay.nostr.band",
    "wss://nos.lol",
    "wss://relay.snort.social",
    "wss://nostr-pub.wellorder.net",
    "wss://relay.current.fyi",
    "wss://offchain.pub",
  ],
  defaultRelays: ["wss://relay.damus.io", "wss://relay.nostr.band"],
  ndk: {
    explicitRelayUrls: ["wss://relay.damus.io", "wss://relay.nostr.band"],
  },
  clientOptions: [
    { name: "Primal (Web)", getUrl: (npub: string) => `https://primal.net/p/${npub}` },
    { name: "Primal (iOS)", getUrl: () => "https://apps.apple.com/us/app/primal/id1673134518" },
    { name: "Primal (Android)", getUrl: () => "https://play.google.com/store/apps/details?id=net.primal.android" },
    { name: "Damus (iOS)", getUrl: () => "https://apps.apple.com/us/app/damus/id1628663131" },
    { name: "Amethyst (Android)", getUrl: () => "https://play.google.com/store/apps/details?id=com.vitorpamplona.amethyst&hl=en-US&pli=1" },
    { name: "Jumble (Web)", getUrl: (npub: string) => `https://jumble.social/users/${npub}` },
  ],
}
