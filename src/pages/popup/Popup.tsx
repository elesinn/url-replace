import React from "react";
import { useChromeStorageLocal } from "use-chrome-storage";

const Popup = () => {
  const [url, setUrl] = React.useState<string | undefined>(undefined);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue, isPersistent, error] = useChromeStorageLocal(
    "settings",
    []
  );
  async function getCurrentTabUrl() {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab?.url;
  }

  async function updateUrl(newOrigin: string) {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    const newUrlOr = new URL(newOrigin || "");
    const url = new URL(tab?.url || "");
    const newUrl = newUrlOr.origin + url.pathname + url.search;
    chrome.tabs.update(tab.id || 0, { url: newUrl });
  }

  React.useEffect(() => {
    getCurrentTabUrl().then((res) =>
      setUrl(() => {
        const url = res ? new URL(res) : undefined;
        return url?.origin;
      })
    );
  }, []);
  return (
    <div className="App flex flex-col justify-between h-screen p-2">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold p-2">Env switcher </h2>
          <button
            className="btn btn-error btn-xs"
            onClick={() => {
              setValue([]);
            }}
          >
            clear
          </button>
        </div>

        {value?.length
          ? value.map((url: any, index: number) => (
              <button
                key={index}
                className="btn btn-primary btn-xs"
                onClick={() => updateUrl(url)}
              >
                {url}
              </button>
            ))
          : `Add new envs, then click on them to switch`}
      </div>

      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>

          <p className="py-1">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Env hostname</span>
              </label>
              <input
                ref={inputRef}
                type="text"
                placeholder="https://my.best.app/"
                className="input input-bordered w-full max-w-xs inpu"
              />
            </div>
          </p>
          <div className="modal-action">
            <label
              htmlFor="my-modal"
              className="btn btn-sm"
              onClick={() => {
                if (inputRef.current) {
                  setValue((prev: string[]) => [
                    ...prev,
                    inputRef.current?.value,
                  ]);
                }
              }}
            >
              Add
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="my-modal" className="btn w-full btn-success btn-xs">
          add new env
        </label>
      </div>
    </div>
  );
};

export default Popup;
