const CardBody = ({ className, children }) => {
  return (
    <div
      className={`${className} pl-[25px] pr-[25px] py-[25px] relative flex flex-col justify-center items-center gap-3 rounded-md bg-white `}
    >
      {children}
    </div>
  );
};

export default CardBody;
