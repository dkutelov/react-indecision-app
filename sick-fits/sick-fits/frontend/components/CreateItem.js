import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'

import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import ErrorMessage from './ErrorMessage'

const CREATE_ITEM_MUTATION = gql`
	mutation CREATE_ITEM_MUTATION(
		$title: String!
		$description: String!
		$price: Int!
		$image: String
		$largeImage: String
	) {
		createItem(title: $title, description: $description, price: $price, image: $image, largeImage: $largeImage) {
			id
		}
	}
`

class CreateItem extends Component {
	state = {
		title       : 'Крем против подсичане Dove',
		description : 'Супер крем ядем!',
		image       : '',
		largeImage  : '',
		price       : 100
	}

	handleChange = (e) => {
		const { name, type, value } = e.target
		const val = type === 'number' ? parseFloat(value) : value
		this.setState({ [name]: val })
	}

	uploadFile = async (e) => {
		const files = e.target.files
		const data = new FormData()
		data.append('file', files[0])
		data.append('upload_preset', 'sickfits')
		const res = await fetch('https://api.cloudinary.com/v1_1/dariku/image/upload', {
			method : 'POST',
			body   : data
		})
		const file = await res.json()
		this.setState({
			image      : file.secure_url,
			largeImage : file.eager[0].secure_url
		})
	}

	render () {
		return (
			<Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
				{(createItem, { loading, error }) => (
					<Form
						onSubmit={async (e) => {
							e.preventDefault()
							const res = await createItem()
							Router.push({
								pathname : '/item',
								query    : { id: res.data.createItem.id }
							})
						}}>
						<ErrorMessage error={error} />
						<fieldset disabled={loading} aria-busy={loading}>
							<label htmlFor="file">
								Image
								<input
									type="file"
									id="file"
									name="file"
									placeholder="Upload an image"
									onChange={this.uploadFile}
								/>
								{this.state.image && <img src={this.state.image} width="200" alt="Upload Preview" />}
							</label>
							<label htmlFor="title">
								Title
								<input
									type="text"
									id="title"
									name="title"
									placeholder="Title"
									required
									value={this.state.title}
									onChange={this.handleChange}
								/>
							</label>
							<label htmlFor="price">
								Price
								<input
									type="number"
									id="price"
									name="price"
									required
									value={this.state.price}
									onChange={this.handleChange}
								/>
							</label>
							<label htmlFor="title">
								Description
								<textarea
									id="description"
									name="description"
									placeholder="Please, enter a description."
									required
									value={this.state.description}
									onChange={this.handleChange}
								/>
							</label>
							<button type="Submit">Submit</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		)
	}
}

export { CREATE_ITEM_MUTATION, CreateItem as default }
