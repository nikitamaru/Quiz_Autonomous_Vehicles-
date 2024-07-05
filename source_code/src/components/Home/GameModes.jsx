import React from 'react';
import { ImInfinite } from 'react-icons/im'
import { BiTimeFive } from 'react-icons/bi'
import { TbDeviceGamepad2 } from 'react-icons/tb'
import { useState } from 'react';

const gameModes = [
	{
		icon: <TbDeviceGamepad2 className='text-3xl' />,
		title: 'Cooperative',
		description: ' Players collaborate to optimize data models, sharing insights and coordinating adjustments to safely navigate through scenarios like heavy weather and unexpected obstacles.'
	},
	{
		icon: <BiTimeFive className='text-3xl' />,
		title: 'Competitive',
		description: 'Players compete against each other to achieve the highest scores or complete objectives in the fastest time by making strategic data model adjustments in response to dynamic driving conditions.'
	},
	// {
	// 	icon: <ImInfinite className='text-3xl' />,
	// 	title: 'Infinite',
	// 	description: 'Break your record by completing as many questions as you can! You can use wildcards'
	// }
]

const scoreTable = [
	{
		"id": 0,
		"name": "Aswathy",
		"score": [10]
	},
	{
		"id": 0,
		"name": "Nikita",
		"score": [4, 0, 1]
	},
	{
		"id": 0,
		"name": "Mehak",
		"score": [9,2]
	},
	{
		"id": 0,
		"name": "Sonia",
		"score": [4,5,2]
	},
	{
		"id": 0,
		"name": "Krina",
		"score": [3, 7, 4]
	},
	{
		"id": 0,
		"name": "Dev",
		"score": [4,10]
	}
]

export default function GameModes ({ setIsButtonEnabled }) {
	const [selectedMode, setSelectedMode] = useState(null);
	const handleListItemClick = (modeTitle) => {
	 console.log(`${modeTitle} clicked!`);
	 localStorage.setItem('selectedMode', JSON.stringify(modeTitle));
	 setSelectedMode(modeTitle)
	 localStorage.setItem('scoreTable',JSON.stringify(scoreTable))
	 setIsButtonEnabled(true); // Enable the button on the home page
 };
	return (
		<section className='lg:max-w-6xl mx-auto lg:col-start-1 lg:col-end-2 px-8 py-6 flex flex-col justify-center bg-[url("/bg-gamemodes.svg")] text-slate-900 w-full'>
			<h2 className='text-2xl mb-4 font-medium '>Game modes </h2>
			<nav>
				<ul className='flex flex-col sm:flex-row justify-center gap-5'>
					{gameModes.map((mode, index) => (
						<li key={index + mode.title} className={`bg-neutral-300 max-w-sm md:max-w-none bg-opacity-30 backdrop-blur-[2px] rounded p-5 hover:scale-[1.03] transition-all hover:backdrop-blur-0 hover:bg-opacity-100 hover:bg-white shadow-sm mx-auto cursor-pointer ${
						                          selectedMode === mode.title ? 'bg-white border-2 border-blue-500' : ''
						                        }`}
						onClick={() => handleListItemClick(mode.title)}>
							{mode.icon}
							<h3 className='text-xl font-medium my-1'>{mode.title}</h3>
							<p className='text-sm'>{mode.description}</p>
						</li>
					))}
				</ul>
			</nav>
		</section>
	)
}

