import { createSignal, For, Show, onMount } from "solid-js";
import { downloadImages } from "~/lib/download";

interface DownloadModalProps {
  urls: string[];
  blogName: string;
  postId: number;
  onClose: () => void;
}

export function DownloadModal(props: DownloadModalProps) {
  const [preserveOrder, setPreserveOrder] = createSignal(true);
  let modalRef: HTMLDivElement | undefined;

  onMount(() => {
    modalRef?.focus();
  });

  const handleDownload = async () => {
    await downloadImages({
      urls: props.urls,
      blogName: props.blogName,
      postId: props.postId,
      preserveOrder: preserveOrder(),
    });
    props.onClose();
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleDownload();
    }
    if (e.key === "Escape") {
      props.onClose();
    }
  };

  return (
    <div class="download-modal-backdrop" onClick={handleBackdropClick}>
      <div
        class="download-modal"
        ref={modalRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <button
          type="button"
          class="download-modal-close"
          onClick={props.onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h3>Download {props.urls.length} images</h3>
        <div class="download-modal-previews">
          <For each={props.urls}>
            {(url) => (
              <div class="download-modal-preview-item">
                <img src={url} alt="" />
              </div>
            )}
          </For>
        </div>
        <label class="download-modal-option">
          <input
            type="checkbox"
            checked={preserveOrder()}
            onChange={(e) => setPreserveOrder(e.currentTarget.checked)}
          />
          Preserve order
        </label>
        <button
          type="button"
          class="download-modal-submit"
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
    </div>
  );
}
