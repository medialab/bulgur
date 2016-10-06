import React from 'react';

const MainViewLayout = (props) => (
	<figure className="bulgur-main-view">
		<section className="visualization-container">
			Visualization
		</section>
		<figcaption className="caption-container">
			<div className="view-operations">
				<button>Reset</button>
				<button>Record</button>
			</div>
			<div className="caption-editor">
				<div className="editor-helpers-container">
					<ul className="editor-helpers">
						<li><button>title</button></li>
						<li><button>bold</button></li>
						<li><button>italic</button></li>
						<li><button>underline</button></li>
						<li><button>list</button></li>
					</ul>
				</div>
				<div className="editor-areas-container">
					<input placeholder="slide title" className="editor-title-input"/>
					<textarea placeholder="slide content" className="editor-content-input"/>
				</div>
			</div>
		</figcaption>
	</figure>
);

export default MainViewLayout;