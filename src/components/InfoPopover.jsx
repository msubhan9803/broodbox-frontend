import { Popover } from "@headlessui/react";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";

const InfoPopover = ({ text }) => (
  <Popover className="relative">
    <Popover.Button className="flex items-center outline-none ring-0">
      <HiOutlineQuestionMarkCircle className="text-lg cursor-pointer" />
    </Popover.Button>
    <Popover.Panel className="absolute z-10 w-64 p-2 mt-2 bg-white border rounded shadow-lg text-md normal-case	 text-gray-900 font-medium">
      {text}
    </Popover.Panel>
  </Popover>
);

export default InfoPopover;
