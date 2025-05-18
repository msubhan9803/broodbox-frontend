import React, { useRef, useEffect } from "react";

export default function Tabs({ tabs, currentTab, setCurrentTab }) {
  const tabRefs = useRef([]);
  tabRefs.current = tabs.map((_, i) => tabRefs.current[i] ?? React.createRef());

  useEffect(() => {
    if (tabRefs.current[currentTab]) {
      setTimeout(() => {
        tabRefs.current[currentTab].current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }, 0);
    }
  }, [currentTab]);

  return (
    <>
      <div className="w-full border-b border-gray-200 dark:border-gray-700 my-4">
        <div className="flex overflow-x-auto">
          <nav
            className="flex space-x-2 whitespace-nowrap"
            aria-label="Tabs"
            role="tablist"
          >
            {tabs.map((tab, index) => (
              <button
                key={index}
                ref={tabRefs.current[index]}
                type="button"
                className={`hs-tab-active:font-bold min-w-20 w-auto hs-tab-active:border-black hs-tab-active:text-black py-2 px-1 inline-flex items-center justify-center gap-x-2 border-b-2 border-transparent text-md text-gray-500 hover:text-black disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${
                  index === currentTab ? "active" : ""
                }`}
                id={`basic-tabs-item-${index}`}
                data-hs-tab={`#basic-tabs-${index}`}
                aria-controls={`basic-tabs-${index}`}
                role="tab"
                onClick={() => setCurrentTab(index)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
