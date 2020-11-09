import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import AdminLayout from '../../../Hoc/AdminLayout'
import { databaseMatches } from '../../../firebase'
import { firebaseLooper, reverseArray } from '../../utils/Misc'

class AdminMatches extends Component {
	state = {
		isLoading : true,
		matches   : []
	}

	async componentDidMount () {
		try {
			const snapshot = await databaseMatches.once('value')
			const matches = reverseArray(firebaseLooper(snapshot))

			this.setState({
				isLoading : false,
				matches
			})
		} catch (e) {
			console.log(e)
		}
	}

	render () {
		const { matches } = this.state

		return (
			<AdminLayout>
				<div>
					<Paper>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Date</TableCell>
									<TableCell>Match</TableCell>
									<TableCell>Result</TableCell>
									<TableCell>Final</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{matches.length > 0 ? (
									matches.map((match, i) => (
										<TableRow key={i}>
											<TableCell>{match.date}</TableCell>
											<TableCell>
												<Link to={`/admin_matches/edit_match/${match.id}`}>
													{match.away} <strong>-</strong> {match.local}
												</Link>
											</TableCell>
											<TableCell>
												{match.resultAway} <strong>-</strong> {match.resultLocal}
											</TableCell>
											<TableCell>
												{match.final === 'Yes' ? (
													<span className="matches_tag_red">Final</span>
												) : (
													<span className="matches_tag_green">Not played yet</span>
												)}
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow />
								)}
							</TableBody>
						</Table>
					</Paper>
					<div className="admin_progress">
						{this.state.isLoading ? <CircularProgress tickness={7} style={{ color: '#98c5e9' }} /> : null}
					</div>
				</div>
			</AdminLayout>
		)
	}
}

export default AdminMatches
