const FormStats = ({ stats }) => {
	return (
		<span className='mx-[18px] py-[12px] flex justify-between items-center gap-[18px]'>
			<p className='text-black text-[13px] leading-[150%] font-normal'>
				Rows: <span className='font-bold'>{stats.rows}</span>
			</p>
			<span className='flex gap-[18px]'>
				{Object.entries(stats)
					.filter(([key]) => key !== 'rows')
					.map(([key, value]) => (
						<p
							key={key}
							className='text-black text-[13px] leading-[150%] font-normal'
						>
							{key.charAt(0).toUpperCase() + key.toLowerCase().slice(1)}:{' '}
							<span className='font-bold'>{value}</span>
						</p>
					))}
			</span>
		</span>
	);
};

export default FormStats;
