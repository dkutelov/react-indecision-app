import React, { Fragment } from "react"
import { API, graphqlOperation } from "aws-amplify"
import { createMarket } from "../graphql/mutations"
// prettier-ignore
import { Form, Button, Dialog, Input, Select, Notification } from 'element-react'

import { UserContext } from "../App"

class NewMarket extends React.Component {
  state = {
    addMarketDialog: false,
    name: "",
    tags: ["Arts", "Technology", "Web dev", "Crafts", "Entertainment"],
    selectedTags: [],
    options: []
  }

  handleAddMarket = async ({ username }) => {
    try {
      this.setState({ addMarketDialog: false })
      const input = {
        name: this.state.name,
        owner: username,
        tags: this.state.selectedTags
      }

      const result = await API.graphql(
        graphqlOperation(createMarket, { input })
      )
      console.info(`Created market: id ${result.data.createMarket.id}.`)
      this.setState({ name: "", selectedTags: [] })
    } catch (err) {
      console.error("Error in creating market:", err)
      Notification.error({
        title: "Error",
        message: `${err.message} || "Error adding market"`
      })
    }
  }

  handleFilterTags = query => {
    const options = this.state.tags
      .map(tag => ({ value: tag, label: tag }))
      .filter(tag => tag.label.toLowerCase().includes(query.toLowerCase()))
    this.setState({ options })
  }

  render() {
    return (
      <UserContext.Consumer>
        {({ user }) => (
          <Fragment>
            <div className="market-header">
              <h1 className="market-title">
                Create Your Marketplace
                <Button
                  type="text"
                  icon="edit"
                  className="market-title-button"
                  onClick={() => this.setState({ addMarketDialog: true })}
                />
              </h1>
            </div>
            <Dialog
              title="Create New Market"
              visible={this.state.addMarketDialog}
              onCancel={() => this.setState({ addMarketDialog: false })}
              size="large"
              customClass="dialog">
              <Dialog.Body>
                <Form labelPosition="top">
                  <Form.Item label="Add Market Name">
                    <Input
                      placeholder="Market name"
                      trim={true}
                      onChange={name => this.setState({ name })}
                      value={this.state.name}
                    />
                  </Form.Item>
                  <Form.Item label="Add Tags">
                    <Select
                      multiple={true}
                      filterable={true}
                      placeholder="Market tags"
                      onChange={selectedTags => this.setState({ selectedTags })}
                      remoteMethod={this.handleFilterTags}
                      remote={true}>
                      {this.state.options.map(option => (
                        <Select.Option
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </Select>
                  </Form.Item>
                </Form>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  onClick={() => this.setState({ addMarketDialog: false })}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  disabled={!this.state.name}
                  onClick={() => this.handleAddMarket(user)}>
                  Add
                </Button>
              </Dialog.Footer>
            </Dialog>
          </Fragment>
        )}
      </UserContext.Consumer>
    )
  }
}

export default NewMarket
