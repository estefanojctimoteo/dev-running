import React, { Component } from 'react'

const AddPropsToComponent = (WrappedComponent, passedProps) => {
  return (
    class Route extends Component {
      render() {        
        return <WrappedComponent {...this.props} />
      }
    }
  )
}
export default AddPropsToComponent