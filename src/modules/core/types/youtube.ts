export interface Player {
  playVideo(): void
  pauseVideo(): void
  mute(): void
  unMute(): void
  isMuted(): boolean
  seekTo(seconds: number, allowSeekAhead: boolean): void
  getCurrentTime(): number
  getDuration(): number
  getVolume(): number
  setVolume(volume: number): void
  getPlayerState(): number
  destroy(): void
}

export interface PlayerOptions {
  videoId: string
  width?: string | number
  height?: string | number
  playerVars?: YouTubePlayerVars
  events?: {
    onReady?: (event: YouTubeReadyEvent) => void
    onStateChange?: (event: YouTubeStateChangeEvent) => void
  }
}

export interface PlayerState {
  UNSTARTED: number
  ENDED: number
  PLAYING: number
  PAUSED: number
  BUFFERING: number
  CUED: number
}

export interface YouTubePlayerVars {
  autoplay?: 0 | 1
  controls?: 0 | 1
  disablekb?: 0 | 1
  fs?: 0 | 1
  iv_load_policy?: 1 | 3
  modestbranding?: 0 | 1
  rel?: 0 | 1
  showinfo?: 0 | 1
  enablejsapi?: 0 | 1
}

export interface YouTubeReadyEvent {
  target: Player
}

export interface YouTubeStateChangeEvent {
  target: Player
  data: number
}

export interface YouTubeAPI {
  Player: new (element: HTMLElement | string, options: PlayerOptions) => Player
  PlayerState: PlayerState
}

declare global {
  interface Window {
    YT?: YouTubeAPI
    onYouTubeIframeAPIReady?: () => void
  }
}
