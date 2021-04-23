import React from "react";
import {  } from "slate-react";

const CodeElement = (props) => {
	return (
		<pre
			{...props.attributes}
			style={{
				backgroundColor: "rgba(0,0,0,0.1)",
				width: "100%",
				minHeight: "2rem",
				margin:0
			}}
		>
			<code>{props.children}</code>
		</pre>
	);
};

const DefaultElement = (props) => {
	return <p {...props.attributes}>{props.children}</p>;
};

const ImageElement = (props) => {
	// const selected = useSelected();


	return (
		<div {...props.attributes}>
			<div contentEditable="false" style={{width:"100%"}}>
				<img
					src={props.element.url}
					alt=""
					style={{display:"block",maxHeight:"20em",maxWidth:"100%",margin:"auto"}}
				/>
			</div>
			{props.children}
		</div>
	);
};

function Element(props) {
	switch (props.element.type) {
		case "code":
			return <CodeElement {...props.attributes}>{props.children}</CodeElement>;
		case "img":
			return <ImageElement {...props} />;
		default:
			return (
				<DefaultElement {...props.attributes}>{props.children}</DefaultElement>
			);
	}
}

export default Element;
