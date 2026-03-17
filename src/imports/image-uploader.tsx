import { useState, useRef, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ──────────────────────────────────────────────
   타입
   ────────────────────────────────────────────── */
// imageItem: { id, file?, previewUrl, existingUrl? }
// - 새 이미지: file + previewUrl
// - 기존 이미지: existingUrl + previewUrl(=existingUrl)

/* ──────────────────────────────────────────────
   SortableImageCard
   ────────────────────────────────────────────── */
function SortableImageCard({ item, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease, opacity 200ms ease",
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-card">
      {/* 드래그 핸들 — 카드 전체 */}
      <div className="drag-handle" {...attributes} {...listeners}>
        <img
          src={item.previewUrl}
          alt="uploaded"
          className="preview-image"
          draggable={false}
        />
        <div className="drag-overlay">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M7 4h2v2H7zm4 0h2v2h-2zM7 9h2v2H7zm4 0h2v2h-2zM7 14h2v2H7zm4 0h2v2h-2z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* 삭제 버튼 */}
      <button
        type="button"
        className="remove-btn"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 3l8 8M11 3l-8 8"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* 순서 뱃지 */}
      <div className="order-badge">{item.order}</div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   ImageUploader (메인 컴포넌트)
   ────────────────────────────────────────────── */
const MAX_IMAGES = 4;

export default function ImageUploader({ initialImages = [], onChange }) {
  // initialImages: [{ id, url }] — 수정 모드에서 기존 이미지
  const [items, setItems] = useState(() =>
    initialImages.map((img, i) => ({
      id: img.id || `existing-${i}`,
      previewUrl: img.url,
      existingUrl: img.url,
      file: null,
      order: i + 1,
    }))
  );
  const [removingId, setRemovingId] = useState(null);
  const fileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // 부모에게 변경사항 알림
  const notifyChange = useCallback(
    (newItems) => {
      if (onChange) {
        onChange(
          newItems.map((item) => ({
            id: item.id,
            file: item.file,
            existingUrl: item.existingUrl,
          }))
        );
      }
    },
    [onChange]
  );

  // 파일 추가
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const slotsLeft = MAX_IMAGES - items.length;
    const filesToAdd = files.slice(0, slotsLeft);

    const newItems = filesToAdd.map((file, i) => ({
      id: `new-${Date.now()}-${i}`,
      file,
      previewUrl: URL.createObjectURL(file),
      existingUrl: null,
      order: items.length + i + 1,
    }));

    const updated = [...items, ...newItems].map((item, i) => ({
      ...item,
      order: i + 1,
    }));
    setItems(updated);
    notifyChange(updated);

    // input 초기화
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 삭제 (애니메이션 포함)
  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      setItems((prev) => {
        const updated = prev
          .filter((item) => item.id !== id)
          .map((item, i) => ({ ...item, order: i + 1 }));
        notifyChange(updated);
        return updated;
      });
      setRemovingId(null);
    }, 250);
  };

  // 드래그 끝
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      const updated = arrayMove(prev, oldIndex, newIndex).map((item, i) => ({
        ...item,
        order: i + 1,
      }));
      notifyChange(updated);
      return updated;
    });
  };

  const canAdd = items.length < MAX_IMAGES;

  return (
    <div className="image-uploader">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className={`image-grid count-${items.length + (canAdd ? 1 : 0)}`}>
            {items.map((item) => (
              <div
                key={item.id}
                className={`card-wrapper ${
                  removingId === item.id ? "removing" : ""
                }`}
              >
                <SortableImageCard item={item} onRemove={handleRemove} />
              </div>
            ))}

            {/* 추가 버튼 */}
            {canAdd && (
              <button
                type="button"
                className="add-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 8v16M8 16h16"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{items.length}/4</span>
              </button>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <style>{`
        .image-uploader {
          width: 100%;
          max-width: 500px;
        }

        .image-grid {
          display: grid;
          gap: 8px;
          border-radius: 12px;
          overflow: hidden;
        }

        /* 사진 개수별 그리드 레이아웃 */
        .image-grid.count-1 {
          grid-template-columns: 1fr;
        }
        .image-grid.count-2 {
          grid-template-columns: 1fr 1fr;
        }
        .image-grid.count-3 {
          grid-template-columns: 1fr 1fr;
        }
        .image-grid.count-3 > :first-child {
          grid-column: 1 / -1;
        }
        .image-grid.count-4 {
          grid-template-columns: 1fr 1fr;
        }

        .card-wrapper {
          animation: fadeIn 200ms ease;
        }
        .card-wrapper.removing {
          animation: fadeOut 250ms ease forwards;
        }

        .sortable-card {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background: #f3f4f6;
          cursor: grab;
        }
        .sortable-card:active {
          cursor: grabbing;
        }

        .drag-handle {
          width: 100%;
          height: 100%;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          user-select: none;
          pointer-events: none;
        }

        .drag-overlay {
          position: absolute;
          bottom: 6px;
          left: 6px;
          width: 28px;
          height: 28px;
          background: rgba(0, 0, 0, 0.45);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 150ms ease;
        }
        .sortable-card:hover .drag-overlay {
          opacity: 1;
        }

        .remove-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.55);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 150ms ease, background 150ms ease;
          z-index: 10;
        }
        .sortable-card:hover .remove-btn {
          opacity: 1;
        }
        .remove-btn:hover {
          background: rgba(220, 38, 38, 0.85);
        }

        .order-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.55);
          color: white;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-btn {
          aspect-ratio: 1;
          border-radius: 8px;
          border: 2px dashed #d1d5db;
          background: #fafafa;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: #9ca3af;
          transition: border-color 200ms ease, color 200ms ease,
            background 200ms ease;
        }
        .add-btn:hover {
          border-color: #f472b6;
          color: #f472b6;
          background: #fdf2f8;
        }
        .add-btn span {
          font-size: 12px;
          font-weight: 500;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.85);
          }
        }
      `}</style>
    </div>
  );
}