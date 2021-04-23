import React, { useCallback, useEffect, useMemo, useState } from "react";

import { createEditor } from "slate";
import { withHistory } from "slate-history";

import { Slate, Editable, withReact } from "slate-react";
import Element from "./Element";
import Leaf from "./Leaf";
import { CustomEditor } from "./CustomEditor";
import InsertImageButton from "./InsertImageButton";
import InsertImageBlock from "./InsertImageBlock";

function TextEditor() {
	const editor = useMemo(
		() => withImages(withHistory(withReact(createEditor()))),
		[]
	);

	const [value, setValue] = useState([
		{
			type: "paragraph",
			children: [{ text: "A paragraph" }],
		},
	]);

	useEffect(() => {
		if (value.length > 0 && value[value.length - 1].type === "img") {
			// value.push({type:'paragraph',children:[{text:""}]})
			setValue((prev) => [
				...prev,
				{ type: "paragraph", children: [{ text: "" }] },
			]);
		}
	}, [value]);

	const [isInsertBloackOpen, setIsInsertBlockOpen] = useState(false);

	const renderElement = useCallback((props) => <Element {...props} />, []);

	const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

	console.log(value);
	return (
		<div
			style={{
				width: "50%",
				margin: "auto",
				padding: ".5rem",
				backgroundColor: "rgba(0,0,0,0.1)",
			}}
		>
			<Slate
				editor={editor}
				value={value}
				onChange={(newValue) => setValue(newValue)}
			>
				<div>
					<button onClick={() => CustomEditor.toggleBoldMark(editor)}>
						BOLD
					</button>
					<button onClick={() => CustomEditor.toggleCodeBlock(editor)}>
						Code
					</button>
					{/* <InsertImageButton /> */}
					<button onClick={() => setIsInsertBlockOpen(true)}>IMG</button>
				</div>
				<Editable
					renderElement={renderElement}
					renderLeaf={renderLeaf}
					onKeyDown={(event) => {
						if (event.key === "(") {
							event.preventDefault();
							editor.insertText("()");
							return;
						}
						if (event.key === "{") {
							event.preventDefault();
							editor.insertText("{}");
							return;
						}
						if (event.key === "Tab") {
							event.preventDefault();
							editor.insertText("    ");
							return;
						}

						if (!event.ctrlKey) return;

						switch (event.key) {
							case "`":
								event.preventDefault();
								CustomEditor.toggleCodeBlock(editor);
								break;

							case "b":
								event.preventDefault();
								CustomEditor.toggleBoldMark(editor);
								break;

							default:
								return;
						}

						// if (event.key === "`" && event.ctrlKey) {
						// 	event.preventDefault();
						// 	// editor.insertText("and");

						// 	const [match] = Editor.nodes(editor, {
						// 		match: (n) => n.type === "code",
						// 	});

						// 	Transforms.setNodes(
						// 		editor,
						// 		{ type: match ? "paragraph" : "code" },
						// 		{ match: (n) => Editor.isBlock(editor, n) }
						// 	);
						// }
					}}
				/>
				<div>{isInsertBloackOpen && <InsertImageBlock setIsInsertBlockOpen={setIsInsertBlockOpen} />}</div>
			</Slate>
		</div>
	);
}

const withImages = (editor) => {
	const { insertData, isVoid } = editor;

	editor.isVoid = (element) => {
		return element.type === "img" ? true : isVoid(element);
	}; // to insert a void when we insert an image , so that same image is not inserted on enter

	editor.insertData = (data) => {
		const text = data.getData("text/plain");
		const { files } = data;

		if (files && files.length > 0) {
			for (const file of files) {
				const reader = new FileReader();
				const [mime] = file.type.split("/");

				if (mime === "image") {
					reader.addEventListener("load", () => {
						const url = reader.result;
						CustomEditor.insertImage(editor, url);
					});

					reader.readAsDataURL(file);
				}
			}
		} else {
			insertData(data);
		}
	};

	return editor;
};

export default TextEditor;
