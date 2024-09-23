// store
import { upadteElementConfing } from "../../../store/actions/pageSections.actions";


function ContentEdit({ elId, secId, element }) {

    return (
        <div
            className="content-edit"
            contentEditable="plaintext-only"
            suppressContentEditableWarning={true}
            onInput={e => upadteElementConfing(secId, elId, { ...element.elConfig, children: e.currentTarget.textContent })}
        >
            <span
                style={element.elConfig.props.style}
                className="text-content"
            >

                {element.elConfig.children}
            </span>
        </div>
    )
}


export default ContentEdit