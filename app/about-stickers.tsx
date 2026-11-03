"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

const stickers = [
  { color: "#d4d4d4", rotation: "-7deg", label: "Light gray landscape sticker" },
  { color: "#999999", rotation: "5deg", label: "Medium gray landscape sticker" },
  { color: "#5c5c5c", rotation: "-3deg", label: "Dark gray landscape sticker" },
];
type Position = { x: number; y: number; z: number };
type Drag = { index: number; pointer: number; x: number; y: number; left: number; top: number };

// Leave room for the rotated corners so every sticker remains reachable.
function stickerWidth() {
  if (window.innerWidth <= 600) return Math.min(130, (document.documentElement.clientWidth - 64) / 3);
  return Math.min(190, Math.max(64, (document.documentElement.clientWidth - 920) / 2 - 32));
}

function constrain(position: Position) {
  const width = stickerWidth();
  const height = width / 1.6;
  return {
    ...position,
    x: Math.max(12, Math.min(document.documentElement.clientWidth - width - 12, position.x)),
    y: Math.max(16, Math.min(document.documentElement.scrollHeight - height - 16, position.y)),
  };
}

export function AboutStickers() {
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const stacking = useRef(3);
  const moved = useRef(new Set<number>());
  const suppressClick = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const origin = useRef<DOMRect | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [positions, setPositions] = useState<Position[] | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (selected === null || !dialog.current) return;
    const modal = dialog.current;
    modal.showModal();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const image = preview.current;
    if (image && origin.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const from = origin.current;
      const to = image.getBoundingClientRect();
      image.animate([
        { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}) rotate(${stickers[selected].rotation})` },
        { transform: "translate(0, 0) scale(1) rotate(0deg)" },
      ], { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
    return () => {
      modal.close();
      document.documentElement.style.overflow = previousOverflow;
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
    };
  }, [selected]);

  useEffect(() => {
    function initialPositions() {
      const bounds = stage.current!.getBoundingClientRect();
      const bio = stage.current!.closest("article")!.querySelector(".prose")!.getBoundingClientRect();
      const width = stickerWidth();
      const left = Math.max(12, (bounds.left - width) / 2);
      const right = document.documentElement.clientWidth - left - width;
      return stickers.map((_, index) => constrain({
        x: window.innerWidth <= 600 ? bounds.left + (bounds.width - width) * index / 2 : index === 1 ? right : left,
        y: window.scrollY + (window.innerWidth <= 600 ? bounds.top + 16 + (index === 1 ? 10 : 0) : bio.bottom + [-200, -90, 140][index]),
        z: index + 1,
      }));
    }
    setPositions(initialPositions());
    let mobile = window.innerWidth <= 600;
    const resize = () => {
      const nextMobile = window.innerWidth <= 600;
      if (mobile !== nextMobile) moved.current.clear();
      mobile = nextMobile;
      const defaults = initialPositions();
      setPositions((current) => current?.map((position, index) => moved.current.has(index) ? constrain(position) : { ...defaults[index], z: position.z }) ?? defaults);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const cards = stickers.map((sticker, index) => (
    <button
      key={sticker.color}
      type="button"
      className="photo-sticker"
      aria-label={sticker.label}
      aria-describedby="sticker-instructions"
      aria-haspopup="dialog"
      data-dragging={dragging === index}
      style={{
        "--sticker-color": sticker.color,
        "--sticker-rotation": sticker.rotation,
        left: positions ? positions[index].x : `${index * 33}%`,
        top: positions ? positions[index].y : index === 1 ? 12 : 0,
        zIndex: positions?.[index].z,
        visibility: selected === index ? "hidden" : undefined,
      } as CSSProperties}
      onClick={(event) => {
        if (suppressClick.current && event.detail !== 0) {
          suppressClick.current = false;
          return;
        }
        origin.current = event.currentTarget.getBoundingClientRect();
        opener.current = event.currentTarget;
        setSelected(index);
      }}
      onPointerDown={(event) => {
        if (!positions || !event.isPrimary || event.button !== 0 || drag.current) return;
        event.preventDefault();
        suppressClick.current = false;
        event.currentTarget.focus({ preventScroll: true });
        event.currentTarget.setPointerCapture(event.pointerId);
        const position = positions[index];
        drag.current = { index, pointer: event.pointerId, x: event.pageX, y: event.pageY, left: position.x, top: position.y };
        setDragging(index);
        const z = ++stacking.current;
        setPositions((current) => current!.map((item, i) => i === index ? { ...item, z } : item));
      }}
      onPointerMove={(event) => {
        const currentDrag = drag.current;
        if (!currentDrag || currentDrag.index !== index || currentDrag.pointer !== event.pointerId) return;
        if (!suppressClick.current && Math.hypot(event.pageX - currentDrag.x, event.pageY - currentDrag.y) < 6) return;
        suppressClick.current = true;
        moved.current.add(index);
        const x = currentDrag.left + event.pageX - currentDrag.x;
        const y = currentDrag.top + event.pageY - currentDrag.y;
        setPositions((current) => current!.map((item, i) => i === index ? constrain({ ...item, x, y }) : item));
      }}
      onLostPointerCapture={() => {
        drag.current = null;
        setDragging(null);
      }}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onKeyDown={(event) => {
        if (!positions || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
        event.preventDefault();
        moved.current.add(index);
        const step = event.shiftKey ? 30 : 10;
        const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
        const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
        const z = ++stacking.current;
        setPositions((current) => current!.map((item, i) => i === index ? constrain({ x: item.x + dx, y: item.y + dy, z }) : item));
      }}
    >
      <span aria-hidden="true" />
    </button>
  ));

  return (
    <>
      <div className="photo-sticker-stage" ref={stage} aria-hidden="true" />
      {positions && createPortal(
        <div className="photo-sticker-layer" role="group" aria-label="Draggable photo stickers">
          <p className="sr-only" id="sticker-instructions">Click or tap to enlarge and read about this photo. Drag to place this sticker anywhere on the page. You can also use the arrow keys, or Shift and arrow keys for larger steps. Stickers scroll with the page.</p>
          {cards}
          <dialog ref={dialog} className="sticker-dialog" aria-labelledby="sticker-title" aria-describedby="sticker-description" onCancel={() => setSelected(null)} onClose={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
            {selected !== null && (
              <div className="sticker-detail">
                <button className="sticker-close" type="button" aria-label="Close photo" onClick={() => setSelected(null)} autoFocus>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
                </button>
                <div ref={preview} className="sticker-preview" style={{ backgroundColor: stickers[selected].color }} role="img" aria-label={stickers[selected].label} />
                <div className="sticker-caption">
                  <h2 id="sticker-title">A little moment {selected + 1}</h2>
                  <p id="sticker-description">A photo and a short story will live here. For now, this is a placeholder for a favorite place, a small adventure, or something worth remembering.</p>
                </div>
              </div>
            )}
          </dialog>
        </div>, document.body,
      )}
    </>
  );
}
