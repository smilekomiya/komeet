import React from 'react'
import { v1 as uuid } from 'uuid'

const CreateRoom = (props) => {
    function create() {
        const id = uuid()
        props.history.push(`/room/${id}`)
    }

    return (<button onClick={create}>今すぐ参加</button>)
}

export default CreateRoom