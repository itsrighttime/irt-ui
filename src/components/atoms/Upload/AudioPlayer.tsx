"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { cssVars } from "../../../utils/cssVars";
import { IconButton } from "../Button/IconButton";
import { Slider } from "../Slider/Slider";
import style from "./AudioPlayer.module.css";

export interface AudioPlayerProps {
  audioSrc: string;
  onRemove?: (() => void) | null;
  color?: string;
  onReupload?: (() => void) | null;
  /** @default "500px" */
  width?: string;
}

/** "m:ss" for a number of seconds. */
export const formatTime = (time: number | null): string => {
  if (!time || !Number.isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

/** Custom audio player: play/pause, seek (mouse + arrow keys), volume, replace/remove. */
export function AudioPlayer({ audioSrc, onRemove = null, color, onReupload = null, width = "500px" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const isMuted = volume === 0;
  const accent = color ?? "var(--irt-color-primary)";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioSrc]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const setAudioVolume = (next: number) => {
    setVolume(next);
    if (audioRef.current) audioRef.current.volume = next;
  };

  const seekTo = (time: number) => {
    const clamped = Math.min(Math.max(time, 0), duration || 0);
    if (audioRef.current) audioRef.current.currentTime = clamped;
    setCurrentTime(clamped);
  };

  const timeAt = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return rect.width ? ((event.clientX - rect.left) / rect.width) * duration : 0;
  };

  const onSeekKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") seekTo(currentTime + 5);
    else if (event.key === "ArrowLeft") seekTo(currentTime - 5);
    else if (event.key === "Home") seekTo(0);
    else if (event.key === "End") seekTo(duration);
    else return;
    event.preventDefault();
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={style.audioPreview} style={cssVars({ "--irt-c-color": accent, "--irt-c-width": width })}>
      <audio ref={audioRef} src={audioSrc} />

      <div className={style.customControls}>
        <div className={style.player}>
          <IconButton
            icon={isPlaying ? "pause" : "play"}
            label={isPlaying ? "Pause" : "Play"}
            onClick={togglePlay}
            color={isPlaying ? accent : "var(--irt-color-danger)"}
            size={1.2}
            style={{ border: "none" }}
          />

          <div className={style.timeInfo}>
            {formatTime(currentTime)}
            {hoverTime !== null && <div className={style.hoverTime}>{formatTime(hoverTime)}</div>}
          </div>

          <div
            className={style.trackContainer}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            onClick={(event) => seekTo(timeAt(event))}
            onMouseMove={(event) => setHoverTime(timeAt(event))}
            onMouseLeave={() => setHoverTime(null)}
            onKeyDown={onSeekKey}
          >
            <div className={style.track} style={{ width: `${progress}%` }} />
            <div className={style.progressCircle} style={{ left: `${progress}%` }} />
          </div>

          <div className={style.timeInfo}>{formatTime(duration)}</div>
        </div>

        <div className={style.controlers}>
          <div className={style.volumeControls}>
            <IconButton
              icon={isMuted ? "volumeOff" : "volume"}
              label={isMuted ? "Unmute" : "Mute"}
              onClick={() => setAudioVolume(isMuted ? 0.5 : 0)}
              color={accent}
            />
            <Slider
              setResult={(value) => setAudioVolume(value / 100)}
              value={Math.round(volume * 100)}
              showValueSide="left"
              color={color}
              showRange={false}
              width="auto"
            />
          </div>

          <div className={style.resetRemove}>
            {onReupload && <IconButton icon="refresh" onClick={onReupload} color={accent} label="Re-Upload" />}
            {onRemove && <IconButton icon="close" onClick={onRemove} color="var(--irt-color-danger)" label="Remove audio" />}
          </div>
        </div>
      </div>
    </div>
  );
}
