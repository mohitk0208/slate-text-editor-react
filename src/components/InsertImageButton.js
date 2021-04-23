import React from 'react'
import { useSlateStatic } from 'slate-react'
import { CustomEditor } from './CustomEditor'

function InsertImageButton() {

    const editor = useSlateStatic()

    return (
        <button 
        onMouseDown={event=>{
            event.preventDefault()
            const url = window.prompt('Enter the image url')

            if(!url) {
                alert("no url entered")
                return
            }
            CustomEditor.insertImage(editor,url)
        }}
        >
            IMG
        </button>
    )
}

export default InsertImageButton
