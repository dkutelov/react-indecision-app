import React from "react"
import withRoot from "./withRoot"
import { Query } from "react-apollo"
import { gql } from "apollo-boost"

const GET_TRACKS_QUERY = gql`
  {
    tracks {
      id
      title
      description
      url
    }
  }
`

const Root = () => (
  <Query query={GET_TRACKS_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <div>Loading</div>
      if (error) return <div>Error</div>
      return <div>{JSON.stringify(data)}</div>
    }}
  </Query>
)

export default withRoot(Root)
