import React from "react";
import { Disclosure } from "@headlessui/react";
import Switch from "components/common/controls/Switch";
import { HiChevronUp } from "react-icons/hi2";

export default function ScreenListAccordion({
  currentSelectedModule,
  _checkModuleExistence,
  _getAllScreensByModuleRef,
  _handleModuleStateUpdate,
  _handleActionRefExistCheck,
  _handleScreenStateUpdate,
  _handleScreenRefExistCheck,
}) {
  return (
    <>
      {_checkModuleExistence(currentSelectedModule._id) && (
        <div>
          <hr className="my-4" />
          <span className="text-md font-semibold my-4">Screen List</span>
          <div className="w-full">
            <div className="mx-auto w-full max-w-md rounded-2xl bg-white">
              {_getAllScreensByModuleRef(currentSelectedModule._id)?.map(
                (screen, index) => (
                  <Disclosure key={index} className="">
                    {({ open }) => {
                      return (
                        <div className="my-3 border border-gray-200 rounded-lg">
                          <Disclosure.Button
                            className={`flex w-full justify-between cursor-default ${
                              open ? "rounded-t-lg" : "rounded-lg"
                            } p-4 text-left text-sm font-medium bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{screen?.label}</span>

                              {/* <span class="inline-flex items-center justify-center w-5 h-5 ms-2 text-xs font-semibold text-blue-800 bg-primary-ultra-light rounded-full">
                                {screen.actionsList.length}
                              </span> */}
                            </div>

                            <div className="flex items-center gap-x-2">
                              <HiChevronUp
                                className={`${
                                  open ? "rotate-180 transform" : ""
                                } h-5 w-5`}
                              />
                              <Switch
                                id={`screen_switch-${screen._id}`}
                                checked={_handleScreenRefExistCheck(
                                  currentSelectedModule._id,
                                  screen._id
                                )}
                                onChange={() =>
                                  _handleScreenStateUpdate(
                                    currentSelectedModule._id,
                                    screen._id
                                  )
                                }
                              />
                            </div>
                          </Disclosure.Button>

                          {open && (
                            <div className="grid grid-cols-2 gap-x-2">
                              {(screen?.actionsList.length > 0 &&
                                screen?.actionsList?.map(
                                  (action, actionIndex) => (
                                    <Disclosure.Panel
                                      key={actionIndex}
                                      className="col-span-1 p-4 text-sm flex items-center gap-x-2"
                                    >
                                      <Switch
                                        checked={_handleActionRefExistCheck(
                                          currentSelectedModule._id,
                                          screen._id,
                                          action._id
                                        )}
                                        onChange={() =>
                                          _handleModuleStateUpdate(
                                            currentSelectedModule._id,
                                            screen._id,
                                            action._id
                                          )
                                        }
                                        id={`role_action-${index}-${actionIndex}`}
                                      />
                                      <span>{action?.actionName}</span>
                                    </Disclosure.Panel>
                                  )
                                )) || (
                                <div className="col-span-2 min-h-11 text-center my-2">
                                  No actions
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }}
                  </Disclosure>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
