import { Editor, Text, Transforms } from "slate";

export const CustomEditor = {
	isBoldMarkActive(editor) {
		const [match] = Editor.nodes(editor, {
			match: (n) => n.bold === true,
			universal: true,
		});

		return !!match;
	},

	isCodeBlockActive(editor) {
		const [match] = Editor.nodes(editor, {
			match: (n) => n.type === "code",
		});

		return !!match;
	},

	toggleBoldMark(editor) {
		const isActive = CustomEditor.isBoldMarkActive(editor);

		Transforms.setNodes(
			editor,
			{ bold: isActive ? null : true },
			{ match: (n) => Text.isText(n), split: true }
		);
	},

	toggleCodeBlock(editor) {
		const isActive = CustomEditor.isCodeBlockActive(editor);

		Transforms.setNodes(
			editor,
			{ type: isActive ? null : "code" },
			{ match: (n) => Editor.isBlock(editor, n) }
		);
	},

	isImageBlockActive(editor) {
		const [match] = Editor.nodes(editor,{
			match:(n) => n.type === "img"
		})

		return  !!match
	},

	insertImage(editor,url) {

		// const url="https://image.shutterstock.com/image-photo/large-beautiful-drops-transparent-rain-600w-668593321.jpg";
		const image = {type:"img",url,children:[{text:""}]}

		Transforms.insertNodes(editor,image)

	}

};
