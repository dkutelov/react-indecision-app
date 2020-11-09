import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { withRouter } from 'react-router-dom'

const handleSignOut = (client, history) => {
	localStorage.setItem('token', '')
	client.resetStore()
	history.push('/')
}

const Signout = ({ history }) => {
	return (
		<ApolloConsumer>
			{(client) => {
				return <button onClick={() => handleSignOut(client, history)}>Sign out</button>
			}}
		</ApolloConsumer>
	)
}

export default withRouter(Signout)
