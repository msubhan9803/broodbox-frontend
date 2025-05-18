const FormPagination = ({ current, max, onPreviousClick, onNextClick }) => {
	return (
		<span className='m-[8px] flex items-center fill-none stroke-[#4B5563] text-[#6B7280] text-[16px] leading-[150%] font-medium tracking-[0.08px] text-center'>
			<button type='button' onClick={onPreviousClick}>
				<svg viewBox='0 0 16 16' className='w-[16px] mx-[12px]'>
					<path
						d='M10 12L6 8L10 4'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</button>
			<p className='w-[32px] h-[32px] flex justify-center items-center border border-meta-9 rounded-[6px]'>
				{current}
			</p>
			<p className='w-[32px] h-[32px] flex justify-center items-center'>of</p>
			<p className='h-[32px] flex justify-center items-center'>{max}</p>
			<button type='button' onClick={onNextClick}>
				<svg viewBox='0 0 16 16' className='w-[16px] mx-[12px]'>
					<path
						d='M6 12L10 8L6 4'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</button>
		</span>
	);
};

export default FormPagination;
