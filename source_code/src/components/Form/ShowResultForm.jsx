import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import JsxForm from './JsxForm'
import { IoCloseSharp } from 'react-icons/io5'
import playSound from '@/helpers/playSound'
import queryValidator from '@/helpers/gameConfig'
import categoriesJSON from '@/assets/categories.json'
import { useBoundStore } from '@/store/useBoundStore'

export default function ShowResultForm () {
	const { getQuestions, cleanQuestions, queries, setQueries, cleanWildCards } = useBoundStore(state => state)
	const [nowQueries, setNowQueries] = useState(queries)
	const router = useRouter()
	const dialog = useRef(null)
	const [userName, setUserName] = useState('');
	const [mode, setMode] = useState(null);
	const [data, setData] = useState(null);
	let scoreTable,currentUserScore
	console.log("modeee",mode)

	useEffect(() =>{
		if (typeof window !== 'undefined') {
			setMode(localStorage.getItem('selectedMode'))
			scoreTable = localStorage && localStorage.getItem('scoreTable')
			setUserName(localStorage.getItem('userName'))
			
			console.log("scoretable",scoreTable,userName,mode)
			setData(JSON.parse(scoreTable))
			
	
	
		}

	},[])
	

	


	useEffect(() => setNowQueries(queries), [queries])

	useEffect(() => {
		if (router.isReady && router.pathname === '/play') {
			setQueries(queryValidator(router.query))
		}

	}, [router.isReady])

	const getBestScore = (scores) => Math.max(...scores);
	const sortedData = data && [...data].sort((a, b) => getBestScore(b.score) - getBestScore(a.score));

	console.log("sorteddata",sortedData)

	currentUserScore = data && data.find((user) => user.name === userName)?.score || [];

	// currentUserScore = data &&  data.map((user) => user.name === userName ? user.score : [])
	console.log("currentUserScore",currentUserScore)
	const isImproving = (scores) => { if (scores.length < 2) return 'Not enough data'; return scores[scores.length - 1] > scores[scores.length - 2] ? 'Yes' : 'No'; };


	function currenUser(data,userName){
		const user = data.find(user => user.name === userName);
		if (user) {
			currentUserScore = user.score;
		}
		else {

		 currentUserScore = [];
	 }
		return user
	}
	function handleInputs (e) {
		if (e.target.name === 'infinitymode' || e.target.name === 'timemode') {
			e.target.checked ? playSound('pop-up-on') : playSound('pop-up-off')
			return setNowQueries({ ...nowQueries, [e.target.name]: e.target.name === 'infinitymode' ? !e.target.checked : e.target.checked })
		}

		if (e.target.name === 'categories') {
			e.target.checked ? playSound('pop-up-on') : playSound('pop-up-off')
			return setNowQueries({ ...nowQueries, [e.target.name]: e.target.checked ? [...nowQueries.categories, e.target.value] : nowQueries.categories.filter(cat => cat !== e.target.value) })
		}
		if (e.target.name == 'username') {
			// console.log("entered usernae", e.target.value)
			localStorage.setItem('userName', e.target.value);
			setUserName(e.target.value)
		}

		playSound('pop')
		setNowQueries({ ...nowQueries, [e.target.name]: e.target.value })
	}

	function handleSubmit (e) {
		e.preventDefault()
		cleanQuestions()
		cleanWildCards()

		const query = Object.keys(nowQueries).map(key => `${key}=${nowQueries[key]}`).join('&')
		setQueries(queryValidator(nowQueries))
		router.push({ pathname: '/play', query })

		const cate = nowQueries.categories.map(cat => categoriesJSON.find(c => c.id === cat).name)
		if (router.pathname === '/play') getQuestions(cate, nowQueries.infinitymode ? 5 : nowQueries.questions)

		closeDialog()
	}

	function clickOutsideDialog (e) {
		const rect = dialog.current.getBoundingClientRect()
		if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
			closeDialog()
		}
	}

	function closeDialog () {
		playSound('pop-down')
		dialog.current.classList.add('hide')
		function handleAnimationEnd () {
			dialog.current.classList.remove('hide')
			dialog.current.close()
			dialog.current.removeEventListener('animationend', handleAnimationEnd)
		}
		dialog.current.addEventListener('animationend', handleAnimationEnd)
	}
	console.log("mode just bfr",mode)
	return (
		<dialog ref={dialog} onClick={(e) => clickOutsideDialog(e)} id="ShowResultDialog" className='fixed top-1/2 w-5/6 sm:w-fit left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-slate-900 m-0 backdrop-blur-lg rounded-md py-9 px-8 md:px-11'>
			<button className='absolute top-2 right-2 text-3xl hover:scale-110 transition-all' onClick={closeDialog} >
				<IoCloseSharp />
			</button>
			<h2>Score Table</h2>
			{ mode === null ?
				(<div>Loading...</div>) :
			mode === '"Competitive"' ?
			(
			<div>
				<table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
					<thead>
						<tr>
							<th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
							<th style={{ border: '1px solid black', padding: '8px' }}>Best Score</th>
						</tr>
					</thead>
					<tbody>
					{sortedData.map((user) => (
						<tr key={user.name}>
							<td style={{ border: '1px solid black', padding: '8px' }}>{user.name}</td>
							<td style={{ border: '1px solid black', padding: '8px' }}>{getBestScore(user.score)}</td>
						</tr> ))}
					</tbody>
				</table>
			</div>
			)
			: (
			<div>
			{(currentUserScore.length != 0 )&&
							( <>
								<table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
									<thead>
									<tr>
									<th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
									<th style={{ border: '1px solid black', padding: '8px' }}>Scores</th>
									<th style={{ border: '1px solid black', padding: '8px' }}>Best Score</th>
									<th style={{ border: '1px solid black', padding: '8px' }}>Improving</th>
								</tr>
							 </thead>
						 <tbody>
						 <tr>
							 <td style={{ border: '1px solid black', padding: '8px' }}>{userName}</td>
							 <td style={{ border: '1px solid black', padding: '8px' }}>{currentUserScore.join(', ')}</td>
							 <td style={{ border: '1px solid black', padding: '8px' }}>{getBestScore(currentUserScore)}</td>
							 <td style={{ border: '1px solid black', padding: '8px' }}>{isImproving(currentUserScore)}</td>
					 	</tr>
					</tbody>
				</table> </> )
			}
			</div>)
			}
		</dialog >
	)
}
