import React, { Component } from 'react'
import MyPortal from './MyPortal'
import Modal from './Modal'
import { closeModal } from '../../redux/actions'

class Modals extends Component {
  render() {
    const modals = this.props.modals.map(
      (item,i) => <MyPortal key={i} >
                    <Modal item={item} onClose={(item) => 
                        this.props.dispatch(closeModal(item))}/>
                  </MyPortal>
    ) 
    return (
      <div className="modals">
        {modals}
      </div>
    )
  }
}
export default Modals