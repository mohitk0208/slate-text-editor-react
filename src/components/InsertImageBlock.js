import React, { useEffect, useRef, useState } from "react";
import { useSlateStatic } from "slate-react";
import { CustomEditor } from "./CustomEditor";
import Compress from "compress.js"
import imageCompression from "browser-image-compression"

async function compressWithCompressJs(file) {

    const resizedImage = await new Compress().compress([file],{
        size:1,
        maxWidth:1080,
        maxHeight:1080,
        quality:.75,
        resize:false
    })

    const img = resizedImage[0];
    const base64str = img.data
    const imgExt = img.ext
    const resizedFile = Compress.convertBase64ToFile(base64str,imgExt)
    return resizedFile;
}

async function compressWithBrowserImageCompression(file) {

  console.log('originalFile instanceof Blob', file instanceof Blob); // true
  console.log(`originalFile size ${file.size / 1024 } KB`);

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
    file
  }
  try {
    const compressedFile = await imageCompression(file, options);
    console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
    console.log(`compressedFile size ${compressedFile.size / 1024 } KB`); // smaller than maxSizeMB

    // await uploadToServer(compressedFile); // write your own logic

    return compressedFile
  } catch (error) {
    console.log(error);
  }
}

function InsertImageBlock({ setIsInsertBlockOpen }) {
	const editor = useSlateStatic();

	const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [url,setUrl] = useState("")
    const [isCompressing,setIsCompressing] = useState(false)

	const filePickerRef = useRef();

	useEffect(() => {
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
                setPreviewUrl(reader.result);
                // console.log(reader.result);
			};

			reader.readAsDataURL(file);
		}
	}, [file]);

	async function pickedHandler(event) {
		let pickedFile;

		if (event.target.files || event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            console.log(pickedFile);
			console.log("picked size", pickedFile.size/1024);

            setIsCompressing(true)
            const compressedImage = await compressWithCompressJs(pickedFile)

            setIsCompressing(false)
            // const compressedImage = await compressWithBrowserImageCompression(pickedFile)

            console.log(new File([compressedImage],pickedFile.name,{type:compressedImage.type}));
            // console.log(compressedImage);
			console.log("compressed size", compressedImage.size/1024);

			// if (pickedFile.size / 1024 > 1024) {
			// 	alert("select a  file of size less than 1MB");
			// 	return;
            // }

            if (compressedImage.size / 1024 > 1024) {
				alert("select a  file of size less than 1MB");
				return;
            }
            

            // setFile(pickedFile);
            setFile(compressedImage)
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
                    {isCompressing && <p>Compressing ...</p>}
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
