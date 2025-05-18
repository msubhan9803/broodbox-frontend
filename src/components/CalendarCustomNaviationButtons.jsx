import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function CustomButton({ direction, handleClick, disabled }) {
  return (
    <i
      onClick={handleClick}
      style={{
        padding: "0 10px",
        fontWeight: "bold",
        color: disabled ? "gray" : "green",
      }}
      className={disabled ? "cursor-default" : "cursor-pointer"}
    >
      {direction === "right" ? <FaChevronRight /> : <FaChevronLeft />}
    </i>
  );
}
