import React, { useEffect, useRef, useState } from "react";
import { useSlateStatic } from "slate-react";
import { CustomEditor } from "./CustomEditor";

function InsertImageBlock({ setIsInsertBlockOpen }) {
	const editor = useSlateStatic();

	const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [url,setUrl] = useState("")

	const filePickerRef = useRef();

	useEffect(() => {
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
                setPreviewUrl(reader.result);
                console.log(reader.result);
			};

			reader.readAsDataURL(file);
		}
	}, [file]);

	function pickedHandler(event) {
		let pickedFile;

		if (event.target.files || event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            console.log(pickedFile);
			console.log("size", pickedFile.size);
			if (pickedFile.size / 1024 > 1024) {
				alert("select a  file of size less than 1MB");
				return;
			}
			setFile(pickedFile);
		}
	}

	function pickImageHandler() {
		filePickerRef.current.click();
	}

	function submitHandler() {
		CustomEditor.insertImage(editor, previewUrl);
		setIsInsertBlockOpen(false);
    }
    
    function submitURLHandler() {
        CustomEditor.insertImage(editor,url)
        setIsInsertBlockOpen(false)
    }

	return (
		<div style={{ width: "100%", backgroundColor: "white", padding: "1rem" }}>
			<div>
				<input
					type="file"
					ref={filePickerRef}
					style={{ display: "none" }}
					accept=".jpg,.png.jpeg"
					onChange={pickedHandler}
				/>
				<div>
					<div>
						{previewUrl && (
							<img
								src={previewUrl}
								alt="preview"
								style={{
									display: "inline-block",
									maxWidth: "100%",
									maxHeight: "20em",
								}}
							/>
						)}
					</div>
					<button type="button" onClick={pickImageHandler}>
						PICK IMAGE
					</button>
					<button disabled={!previewUrl} onClick={submitHandler}>
						SUBMIT
					</button>
				</div>
			</div>
            <div>
                <form onSubmit={submitURLHandler}>
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
                    <button disabled={url.length === 0} >SUBMIT URL</button>
                </form>
            </div>
		</div>
	);
}

export default InsertImageBlock;
