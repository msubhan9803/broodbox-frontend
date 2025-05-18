const CardHeading = ({ children, className }) => {
	return (
		<header
			className={`${className} pl-[18px] pr-[28px] pt-[28px] pb-[44px] flex justify-between items-center rounded-[17px] bg-[#230051] shadow-default`}
		>
			<h3 className='text-white text-[34px] leading-[125%] tracking-[-0.68px] font-bold'>
				{children}
			</h3>
			<svg
				viewBox='0 0 61 20'
				className='w-[59px] fill-none stroke-white stroke-2'
			>
				<path
					d='M1 8.2C1.70238 11.8 4.5 18.5 11 18C17.5 17.5 18.2786 1 29.6571 1C41.0357 1 41.0357 20.0286 60 3.57143'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</svg>
		</header>
	);
};

export default CardHeading;
