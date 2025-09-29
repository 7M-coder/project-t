import React, { useState, useRef, useEffect, useCallback } from 'react'
import { PlayCircle, PauseCircle, Volume2, VolumeX, X } from 'lucide-react'
import type {
  Player,
  PlayerOptions,
  YouTubeReadyEvent,
  YouTubeStateChangeEvent,
  YouTubePlayerVars
} from '../types/youtube'

interface YouTubePlayerProps {
  videoId: string
  title?: string
  className?: string
}
/**
 * YouTubePlayer component for embedding and controlling a YouTube video.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.videoId - The YouTube video ID to be played.
 * @param {string} [props.title='YouTube Video'] - The title of the video for accessibility.
 * @param {string} [props.className=''] - Additional CSS classes for styling.
 * @returns {JSX.Element} The rendered YouTube player component.
 */
const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  title = 'YouTube Video',
  className = ''
}) => {
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [player, setPlayer] = useState<Player | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(100)
  const [showControllers, setShowControllers] = useState<boolean>(true)
  const [showEndOverlay, setShowEndOverlay] = useState<boolean>(false)

  const playerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const interactionOverlayRef = useRef<HTMLDivElement>(null)

  const getProgressWidth = (current: number, total: number): string => {
    if (total <= 0) return '0%'
    const percentage = (current / total) * 100
    return `${percentage.toString()}%`
  }

  const handleProgressKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!player || !progressRef.current) return

      const currentTime = player.getCurrentTime()

      switch (e.key) {
        case 'ArrowLeft': {
          e.preventDefault()
          const newTimeLeft = Math.max(currentTime - 5, 0)
          player.seekTo(newTimeLeft, true)
          setCurrentTime(newTimeLeft)
          break
        }
        case 'ArrowRight': {
          e.preventDefault()
          const newTimeRight = Math.min(currentTime + 5, duration)
          player.seekTo(newTimeRight, true)
          setCurrentTime(newTimeRight)
          break
        }
        case 'Home': {
          e.preventDefault()
          player.seekTo(0, true)
          setCurrentTime(0)
          break
        }
        case 'End': {
          e.preventDefault()
          player.seekTo(duration, true)
          setCurrentTime(duration)
          break
        }
        default:
          break
      }
    },
    [player, duration]
  )

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!player || !progressRef.current) return

      const rect = progressRef.current.getBoundingClientRect()
      const seekPos = (e.clientX - rect.left) / rect.width
      const seekTime = seekPos * duration
      player.seekTo(seekTime, true)
      setCurrentTime(seekTime)
    },
    [player, duration]
  )

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!player) return

      const newVolume = parseInt(e.target.value, 10)
      setVolume(newVolume)
      player.setVolume(newVolume)

      if (newVolume > 0 && isMuted) {
        player.unMute()
        setIsMuted(false)
      }
    },
    [player, isMuted]
  )

  const toggleMute = useCallback(() => {
    if (!player) return

    if (isMuted) {
      player.unMute()
    } else {
      player.mute()
    }
    setIsMuted(!isMuted)
  }, [player, isMuted])

  const togglePlayPause = useCallback(() => {
    if (!player) return

    if (isPlaying) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }, [player, isPlaying])

  useEffect(() => {
    if (!showPopup) return

    let cleanupRequired = false

    const initializeYouTubePlayer = (): void => {
      if (!window.YT || !playerRef.current) return

      const playerVars: YouTubePlayerVars = {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        enablejsapi: 1
      }

      const playerOptions: PlayerOptions = {
        videoId,
        width: '100%',
        height: '100%',
        playerVars,
        events: {
          onReady: (event: YouTubeReadyEvent) => {
            const player = event.target
            setPlayer(player)
            setDuration(player.getDuration())
            player.setVolume(volume)
            player.playVideo()
          },
          onStateChange: (event: YouTubeStateChangeEvent) => {
            if (window.YT) {
              setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
            }
          }
        }
      }

      new window.YT.Player(playerRef.current, playerOptions)
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)

    window.onYouTubeIframeAPIReady = initializeYouTubePlayer

    const timeUpdateInterval = setInterval(() => {
      if (!player) return

      const currentTime = player.getCurrentTime()
      setCurrentTime(currentTime)

      if (duration - currentTime <= 10) {
        setShowEndOverlay(true)
        setShowControllers(false)
        player.mute()
        setIsMuted(true)
      } else {
        setShowEndOverlay(false)
        setShowControllers(true)
        if (isMuted) {
          player.unMute()
          setIsMuted(false)
        }
      }
    }, 1000)

    return () => {
      if (cleanupRequired) {
        clearInterval(timeUpdateInterval)
        window.onYouTubeIframeAPIReady = undefined
        if (tag.parentNode) {
          tag.parentNode.removeChild(tag)
        }
        if (player) {
          player.destroy()
        }
      }
      cleanupRequired = true
    }
  }, [videoId, showPopup, player, duration, volume, isMuted])

  if (!showPopup) {
    return (
      <button
        type="button"
        onClick={(): void => {
          setShowPopup(true)
        }}
        aria-label={`Play ${title}`}
      >
        <PlayCircle className="w-16 h-16" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 z-50 p-4">
      <div className={`relative w-full max-w-3xl aspect-video ${className}`}>
        <button
          type="button"
          onClick={(): void => {
            setShowPopup(false)
          }}
          className="absolute top-2 right-2 p-2 z-30"
          aria-label="Close player"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        {showEndOverlay && <div ref={overlayRef} className="absolute inset-0 bg-black z-20" />}
        <div ref={interactionOverlayRef} className="absolute inset-0 bg-transparent z-10" />
        <div ref={playerRef} className="relative w-full h-full" />
      </div>
      {showControllers && (
        <div className="w-full max-w-3xl mt-4 p-4 bg-white z-20 rounded-lg shadow-lg">
          <div
            ref={progressRef}
            className="relative h-1 bg-gray-600 cursor-pointer"
            onClick={handleSeek}
            onKeyDown={handleProgressKeyDown}
            role="slider"
            tabIndex={0}
            aria-valuenow={currentTime}
            aria-valuemin={0}
            aria-valuemax={duration}
          >
            <div
              className="absolute h-full bg-red-600 left-0"
              style={{ width: getProgressWidth(currentTime, duration) }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={togglePlayPause}
                className="text-2xl"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <PauseCircle className="w-8 h-8" />
                ) : (
                  <PlayCircle className="w-8 h-8" />
                )}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="text-2xl"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24"
                aria-label="Volume control"
              />
              <span className="text-sm">
                {new Date(currentTime * 1000).toISOString().substring(14, 19)} /{' '}
                {new Date(duration * 1000).toISOString().substring(14, 19)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default YouTubePlayer
