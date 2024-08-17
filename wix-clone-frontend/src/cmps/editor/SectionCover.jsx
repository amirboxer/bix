
import { useState, useEffect } from "react"

function SectionCover({ isSectionFocus }) {

    const [sectionFocused, setSectionFocused] = useState(false)

    useEffect(() => {
        isSectionFocus(setSectionFocused);
        return () => {
            isSectionFocus(null);
        }
    }, [])

    return (
        <div className={`section-cover ${sectionFocused ? 'focused' : 'blur-hover'}`}>
        </div>
    )
}

export default SectionCover